class WeightNode{
    constructor(val){
        this.val = val;
    }
    value(){
        return parseFloat(this.val);
    }
}

class AndNode{
    setLeft(left){
        this.left = left;
    }
    setRight(right){
        this.right = right;
    }
    value(){
        return ( 1 - Math.sqrt( (Math.pow(1 - this.left.value(), 2) + Math.pow(1 - this.right.value(), 2))/2) );
    }
}

class OrNode{
    setLeft(left){
        this.left = left;
    }
    setRight(right){
        this.right = right;
    }
    value(){
        return Math.sqrt( (Math.pow(this.left.value(), 2) + Math.pow(this.right.value(), 2)) / 2 );
    }
}

class NotNode{
    setChild(child){
        this.child = child;
    }
    value(){
        return ( 1 - parseFloat(this.child.value()) );
    }
}

class Parser{

    expression(){
        this.term();
        while(this.symbol === "|"){
            let or = new OrNode();
            or.setLeft(this.root);
            this.term();
            or.setRight(this.root);
            this.root = or;
        }
    }

    term(){
        this.factor();
        while(this.symbol === "&"){
            let and = new AndNode();
            and.setLeft(this.root);
            this.factor();
            and.setRight(this.root);
            this.root = and;
        }
    }

    factor(){
        this.symbol = this.lexemes[0];
        this.lexemes.shift();
        if(this.symbol !== '|' && this.symbol !== '&' && this.symbol !== '!' && this.symbol !== ')' && this.symbol !== '('){
            //console.log("Term: "+this.symbol);

            let termWeight = this.getWeight(this.symbol, this.document);
            //console.log("Weight of "+this.symbol+" in "+this.document.title+": ", termWeight);

            let maxWeight = 0;
            for(let i = 0; i < this.documents.length; i++){
                let tmpWeight = this.getWeight(this.symbol, this.documents[i]);
                //console.log("Weight of "+this.document.content[i]+": ", tmpWeight);
                if(tmpWeight > maxWeight){
                    maxWeight = tmpWeight;
                }
            }

            //console.log("The biggest weight in document: ", maxWeight);
            if(maxWeight !== 0)
                termWeight /= maxWeight;
            //console.log("Normalized weight of "+this.symbol+" it "+this.document.title+": ", termWeight);

            this.root = new WeightNode(termWeight);

            this.symbol = this.lexemes[0];
            this.lexemes.shift();
        }
        else if(this.symbol === '!'){
            let not = new NotNode();
            this.factor();
            not.setChild(this.root);
            this.root = not;
        }
        else if(this.symbol === '('){
            this.expression();
            this.symbol = this.lexemes[0];
            this.lexemes.shift();
        }
    }

    getWeight(term, file){
        let termInDocFreq = 0;
        for(let i = 0; i < file.content.length; i++){
            if(file.content[i] === term){
                termInDocFreq++;
            }
        }

        let maxTermFreq = 0;
        for(let i = 0; i < this.documents.length; i++){
            let termDocFreq = 0;
            for(let j = 0; j < this.documents[i].content.length; j++){
                if(this.documents[i].content[j] === term){
                    termDocFreq++;
                }
            }
            if(termDocFreq > maxTermFreq){
                maxTermFreq = termDocFreq;
            }
        }

        let documentFreq = 0;
        for(let i = 0; i < this.documents.length; i++){
            for(let j = 0; j < this.documents[i].content.length; j++){
                if(this.documents[i].content[j] === term){
                    documentFreq++;
                    break;
                }
            }
        }

        let documentsCnt = this.documents.length;
        return (termInDocFreq / maxTermFreq) * Math.log2(documentsCnt / documentFreq);
    }

    evaluate(expression, invertedList, documents){

        //console.log("QUERY PARSER");
        //console.log("Expression: ", expression);

        this.invertedList = invertedList;
        this.documents = documents;

        this.result = [];

        for(let documentIndex = 0; documentIndex < this.documents.length; documentIndex++){
            this.lexemes = expression.split(" ");
            this.document = this.documents[documentIndex];
            //console.log("Expression lexemes: ", this.lexemes);
            this.expression();
            //console.log("Expression tree: ", this.root);
            let documentWeight = {
                'index': documentIndex,
                'title': this.documents[documentIndex].title,
                'weight': this.root.value()
            };

            this.result.push(documentWeight);
        }

        this.result.sort(function(a, b){ return b.weight - a.weight; });

        return this.result;

    }

}

module.exports.seqParser = Parser;