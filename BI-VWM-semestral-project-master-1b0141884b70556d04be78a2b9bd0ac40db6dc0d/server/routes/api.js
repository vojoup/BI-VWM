const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const Parser = require('../../src/query_parser.js').parser;
const SeqParser = require('../../src/query_parser_seq').seqParser;

let parser = new Parser();
let seqParser = new SeqParser();

// Password: 6ysaz7dt
const dbUrl = "mongodb+srv://wiedzmin:6ysaz7dt@vwmdatabase-6odga.mongodb.net/test";

// note: Response blueprint
let response = {
  status: 200,
  time: null,
  data: [],
  message: null
};

// note: Get all lemmatized data
router.get('/invertedList', (req, result) => {
  MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    let DB = db.db("mydb");
    DB.collection("Lemmatized").find({}).toArray((err, res) => {
      if (err) throw err;
      response.data = res;
      response.status = 201;
      response.message = "Inverted list";
      result.json(response);
      console.log("Inverted list retrieved");
      db.close();
    });
  })
});

// note: Get all data by ID
router.get('/allData/:id', (req, result) => {
  MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    let DB = db.db("mydb");
    const toFind = parseInt(req.params.id);
    DB.collection("Documents").find({file_id: toFind}).toArray((err, res) => {
      if (err) throw err;
      response.data = res;
      response.status = 201;
      response.message = "\'" + toFind + "\' article";
      result.json(response);
      if (res.length > 0) {
        console.log("Data for query - " + toFind + " - retrieved successfuly!");
      } else {
        console.log("No data retrieved!");
      }
      db.close();
    });
  })
});

// note: Get all stemmed data
router.get('/allStemmed', (req, result) => {
  MongoClient.connect(dbUrl, (err, db) => {
    if (err) throw err;
    let DB = db.db("mydb");
    const toFind = parseInt(req.params.id);
    DB.collection("Stemmed").find({}).toArray((err, res) => {
      if (err) throw err;
      response.data = res;
      response.status = 201;
      response.message = "\'" + toFind + "\' article";
      result.json(response);
      if (res.length > 0) {
        console.log("Data for query - " + toFind + " - retrieved successfuly!");
      } else {
        console.log("No data retrieved!");
      }
      db.close();
    });
  })
});

// note: Get inverted list for specific title
router.get('/invertedList/:title', (req, result) => {
  MongoClient.connect(dbUrl, (err, db) => {

    if (err) throw err;
    let DB = db.db("mydb");

    const toFind = req.params.title;

    DB.collection("Lemmatized").find({}).toArray((errInvertedList, InvertedList) => {

      DB.collection("Documents").find({}).project({_id: 0, content: 0}).toArray((errDocuments, Documents) => {
        let t1 = new Date().getTime();
        console.time('timer');
        try {
          const parserRes = parser.evaluate(toFind, InvertedList, Documents);
          response.data = parserRes.filter(f => f.weight);
          response.status = 201;
          response.message = 'Data for query ' + toFind;
        } catch (e) {
          response.data = [];
          response.status = 202;
          response.message = 'No records found.'
        }
        if (response.status === 201 || response.status === 202) {
          let t2 = new Date().getTime();
          response.time = +t2.valueOf() - t1.valueOf();
        }
        console.timeEnd('timer');
        result.json(response);
        db.close();
      });

    });

  });
});

// note: Sequentially search for a title
router.get('/sequentialSearch/:title', (req, result) => {
  MongoClient.connect(dbUrl, (err, db) => {

    if (err) throw err;
    let DB = db.db("mydb");

    const toFind = req.params.title;

    DB.collection("Lemmatized").find({}).toArray((errInvertedList, InvertedList) => {

      DB.collection("Stemmed").find({}).project({_id: 0}).toArray((errDocuments, Documents) => {
        console.time('timer');
        let t1 = new Date().getTime();
        try {
          const parserRes = seqParser.evaluate(toFind, InvertedList, Documents);
          //console.log("Result: ", parserRes);
          response.data = parserRes.filter(f => f.weight);
          response.status = 201;
          response.message = 'Data for query ' + toFind;
        } catch (e) {
          response.data = [];
          response.status = 202;
          response.message = 'No records found.'
        }
        if (response.status === 201 || response.status === 202) {
          let t2 = new Date().getTime();
          response.time = +t2.valueOf() - t1.valueOf();
        }
        result.json(response);
        db.close();
        console.timeEnd('timer');
      });

    });

  })
});

module.exports = router;
