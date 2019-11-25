var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("BEEEP");
  console.log(mongoClient);
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

  let tray = req.body.tray;

  mongoClient.connect(err => {
    const collection = mongoClient.db("test").collection("devices");
    // perform actions on the collection object

    let myobj = tray;

    // TODO: Check if position is already occupied
    collection.insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 tray inserted");
      db.close();
    });

    mongoClient.close();
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
  let tray = req.body.tray;
  let myobj = tray;

  let myQuery = {"zone": myobj["zone"], "bay": myobj["bay"], "tray": myobj["tray"]};
  let newValues = {$set: {"contents": myobj["contents"], "weight": myobj["weight"], "expiry": myobj["expiry"]}};

  collection.updateOne(myQuery, newValues, function(err, res) {
    if (err) throw err;
    console.log("1 tray edited!");
    db.close();
  });

  mongoClient.close();

  res.append("Edit Tray");
  res.sendStatus(200);
}); 

router.post('/removeTray', function(req, res, next){
  /*
    Inputs:
      pos : A tuple containing position of tray to delete.
    Returns:
      Whether this action completed successfully or not.
  */
  let pos = req.body.pos;
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
