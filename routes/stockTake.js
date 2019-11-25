var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is stock taking');
});

router.post('/addTray', function(req, res, next){
  /*
    Inputs:
      tray : A JSON object representing the tray. Contains its contents and desired position
    Returns:
      Whether this action completed successfully or not.
  */

  /*
    Tray Syntax:
      zone: string
      bay: string
      tray: string
      contents: string
      weight: string
      expiry: string
  */

  let tray = req.body;

  let MongoClient = require('mongodb').MongoClient;
  let url = "mongodb+srv://new-user:s0ulDgUFcCS72lxR@cluster0-oxrvp.mongodb.net/test?retryWrites=true&w=majority";

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("foodbank");
    var myobj = tray;
    let pos = {"zone": myobj["zone"], "bay": myobj["bay"], "tray": myobj["tray"]};
    dbo.collection("food").count(pos, function(err, mres) {
      if (err) throw err;
      if (mres["count"] > 0) {
        console.log("This location already contains a tray.");
        res.sendStatus(400);
        res.end();
      }
      db.close();
    });
  });

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("foodbank");
    var myobj = tray;
    dbo.collection("food").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("Add tray at Zone: " + myQuery["zone"] + ", Bay: " + myQuery["bay"] + ", Tray: " + myQuery["tray"]);
      db.close();
    });
  });

  res.append("Add Tray");
  res.sendStatus(200);
}); 

router.post('/editTray', function(req, res, next){
  /*
    Inputs:
      tray : A JSON object representing the tray. Contains its contents and position
    Returns:
      Whether this action completed successfully or not.
  */
  let myobj = req.body;
  let MongoClient = require('mongodb').MongoClient;
  let url = "mongodb+srv://new-user:s0ulDgUFcCS72lxR@cluster0-oxrvp.mongodb.net/test?retryWrites=true&w=majority";
  let myQuery = {"zone": myobj["zone"], "bay": myobj["bay"], "tray": myobj["tray"]};
  let newValues = {$set: {"contents": myobj["contents"], "weight": myobj["weight"], "expiry": myobj["expiry"]}};
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("foodbank");
    dbo.collection("food").updateOne(myQuery, newValues, function(err, res) {
      if (err) throw err;
      console.log("Edited tray at Zone: " + myQuery["zone"] + ", Bay: " + myQuery["bay"] + ", Tray: " + myQuery["tray"]);
      db.close();
    });
  });

  res.append("Edit Tray");
  res.sendStatus(200);
}); 

router.post('/removeTray', function(req, res, next){
  /*
    Inputs:
      pos : A tuple containing position of tray to delete (json object of zone, bay and tray).
    Returns:
      Whether this action completed successfully or not.
  */
  let pos = req.body;
  let MongoClient = require('mongodb').MongoClient;
  let url = "mongodb+srv://new-user:s0ulDgUFcCS72lxR@cluster0-oxrvp.mongodb.net/test?retryWrites=true&w=majority";
  let myQuery = {"zone": pos["zone"], "bay": pos["bay"], "tray": pos["tray"]};

  console.log("BEEP");

  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("foodbank");
    dbo.collection("food").remove(myQuery, function(err, res) {
      if (err) throw err;
      console.log("Deleted tray at Zone: " + myQuery["zone"] + ", Bay: " + myQuery["bay"] + ", Tray: " + myQuery["tray"]);
      db.close();
    });
  });

  res.append("Remove Tray");
  res.sendStatus(200);
});

router.post('/moveTray', function(req, res, next){
  /*
  To begin with just move tray within bay.
    Inputs:
      posStart : A tuple containing position of tray to move
      posTarget : A tuple containing position of target position to move to
    Returns:
      Whether this action completed successfully or not.
  */
  let posStart = req.body.posStart;
  let posTarget = req.body.posTarget;
  res.append("Move Tray");
  res.sendStatus(200);
});  

module.exports = router;
