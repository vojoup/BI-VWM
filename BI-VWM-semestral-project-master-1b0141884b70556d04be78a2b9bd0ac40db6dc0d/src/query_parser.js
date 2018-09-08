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
            let termInx = this.getTermIndex();
            let docInx = this.getDocumentIndex(this.document.file_id, this.invertedList[termInx].files);
            //console.log("Weight of "+termInx+ " in "+docInx+": ", this.invertedList[termInx].files[docInx].weight);
            if(docInx !== -1)
                this.root = new WeightNode(this.invertedList[termInx].files[docInx].weight);
            else
                this.root = new WeightNode(0);
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

    getTermIndex(){
        for(let i = 0; i < this.invertedList.length; i++){
            if(this.invertedList[i].title === this.symbol)
                return i;
        }
        return -1;
    }

    getDocumentIndex(id, files){
        for(let i = 0; i < files.length; i++){
            if(files[i].id === id)
                return i;
        }
        return -1;
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

module.exports.parser = Parser;