const MongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb+srv://wiedzmin:6ysaz7dt@vwmdatabase-6odga.mongodb.net/test";

const invertedListJSON = require("../data/invertedList.json");
const invertedList = "Lemmatized";
const allDataJSON = require("../data/data");
const allData = "Documents";
const stemmedDataJSON = require("../data/stemmedData");
const stemmedData = "Stemmed";

MongoClient.connect(dbUrl, (err, db) => {
  if (err) {
    console.log("There were some issues connecting to the database.");
    throw err;
  }

  let DB = db.db("mydb");

  console.log('Connection to database established!');

  DB.collection(allData).insertMany(allDataJSON, (err, res) => {
    if (err) {
      console.log("There were some issues connecting to the database.");
      throw err;
    }
    console.log("Number of documents inserted: " + res.insertedCount);
  });

  DB.collection(stemmedData).insertMany(stemmedDataJSON, (err, res) => {
    if (err) {
      console.log("There were some issues connecting to the database.");
      throw err;
    }
      console.log("Number of documents inserted: " + res.insertedCount);
  });

  // console.log(invertedListJSON);
  DB.collection(invertedList).insertMany(invertedListJSON, (err, res) => {
    if (err) {
      console.log("There were some issues connecting to the database.");
      throw err;
    }
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});
