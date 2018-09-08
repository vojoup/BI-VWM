const MongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb+srv://wiedzmin:6ysaz7dt@vwmdatabase-6odga.mongodb.net/test";

const documents = "Documents";
const invertedList = 'Lemmatized';
const stemmed = "Stemmed";

MongoClient.connect(dbUrl, (err, db) => {
    if (err) {
        console.log("There were some issues connecting to the database.");
        throw err;
    }

    let DB = db.db("mydb");

    try {
        DB.collection(documents).drop((documentsErr, documentsOK) => {
            if (documentsErr) {
                console.log("There was an issue dropping the collection.");
                console.log(documentsErr);
                throw documentsErr;
            }
            if (documentsOK) console.log("Collection " + documents + " deleted");
            DB.collection(invertedList).drop((invertedErr, invertedOK) => {
                if (invertedErr) {
                    console.log("There was an issue dropping the collection.");
                    console.log(invertedErr);
                    throw invertedErr;
                }
                if (invertedOK) console.log("Collection " + invertedList + " deleted");
                DB.collection(stemmed).drop((stemmedErr, stemmedOK) => {
                    if (stemmedErr) {
                        console.log("There was an issue dropping the collection.");
                        console.log(stemmedErr);
                        throw stemmedErr;
                    }
                    if (stemmedOK) console.log("Collection Stemmed deleted");
                    db.close();
                });
            });
        });
    } catch (e) {
        console.log(e);
        console.log('Something went wrong...');
    }

});
