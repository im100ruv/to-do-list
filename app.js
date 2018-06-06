const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema

mongoose.connect('mongodb://localhost:27017/tododb');
let db = mongoose.connection;

const DataJsonSchema = new Schema({
  "u1": [{
    "sn": Number,
    "task": String,
    "checked": Number
  }]
});

const DataJson = mongoose.model('tododata', DataJsonSchema);

//check connection
db.once('open', function () {
  console.log('Connected to mongodb');
}).on('error', function () {
  console.log('Error in connection')
});

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/demotest', function (req, res) {
  if (Object.keys(req.query).length === 0) {
    // fetch from database
    DataJson.find(function (err, result) {
      if(result[0].u1.length === 0) {
        res.send(req.query)
      } else {
        res.send(result);
      }
    });
  } else {
    DataJson.remove({}, function () {
      let jsonData;
      if(req.query.data == "remove"){
        jsonData = new DataJson({"u1":[]});
      } else {
        jsonData = new DataJson(req.query);
      }
      jsonData.save(function (err, result) {
        if (err) {
          console.log("error while inserting!");
          res.send(err);
        } else {
          DataJson.find(function (err, result) {
            res.send(result);
          });
        }
      });
      // res.send(req.query);
    });
  }
});

app.listen(8081);