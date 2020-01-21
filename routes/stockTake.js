var express = require('express');
var router = express.Router();

// called by mongoUpdate to build request to mongoDB to add tray
function addTray(tray, dbo) {
  var pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  try {
    dbo.collection("food").updateOne(pos, {"$set": tray}, {"upsert": true}, function(err, res) { // Use upsert to add if it does not already exist.
      if (err) throw err;
      console.log(res["upsertedCount"] + " document inserted");
    });
  } catch (ex) {
    return "FAIL"
  }
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit tray
function editTray(tray, dbo) {
  let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  let newValues = {"contents": tray["contents"], "weight": tray["weight"], "expiry": tray["expiry"]};
  try {
    dbo.collection("food").updateOne(pos, {"$set": newValues}, function(err, res) {
      if (err) throw err;
      console.log(res["modifiedCount"] + " document edited");
    });
  } catch (ex) {
    return "FAIL"
  }
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to remove tray
function removeTray(tray, dbo) {
  let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  try {
    dbo.collection("food").remove(pos, function(err, res) {
      if (err) throw err;
      console.log("Deleted tray at Zone: " + pos["zone"] + ", Bay: " + pos["bay"] + ", Tray: " + pos["tray"]);
    });
  } catch (ex) {
    return "FAIL";
  }
  return "SUCCESS";
}

// called by mongoUpdate to build request to mongoDB to switch tray
function switchTray(body, dbo) {
  let posStart = body.posStart;
  let posTarget = body.posTarget;

  let myQueryA = {"zone": postStart["zone"], "bay": posStart["bay"], "tray": posStart["tray"]};
  let myQueryB = {"zone": posTarget["zone"], "bay": posTarget["bay"], "tray": posTarget["tray"]};
	
  // Is this correct?
  /*
  dbo.collection("food").update(myQueryA, myQueryB, (function(err, res) {
    if (err) throw err;
    console.log("Switched trays at Zone: " + myQueryA["zone"] + ", Bay: " + myQueryA["bay"] + ", Tray: " + myQueryA["tray"] + "and Zone: " + myQueryA["zone"] + ", Bay: " + myQueryA["bay"] + ", Tray: " + myQueryA["tray"]);
  }));
  */
}

function getBay(bay, dbo) {
	// bay is json object containing zone and bay identifier. No need to specify tray
	let pos = {"zone": bay["zone"], "bay": bay["bay"]};
	
	try {
		dbo.collection("food").find(pos).toArray(function(err, res) {
			if (err) throw err;
			console.log(res);
		});
	} catch (ex) {
		console.log(ex);
		return "FAIL";
	}
	return "SUCCESS"
}

// called by routes with request body and method string
function mongoUpdate(tray, method) {
  // Initialise MongoClient and define some constants
  let MongoClient = require('mongodb').MongoClient;
  const URL = "mongodb+srv://new-user:s0ulDgUFcCS72lxR@cluster0-oxrvp.mongodb.net/test?retryWrites=true&w=majority";
  const DB_NAME = "foodbank";

  try {
    MongoClient.connect(URL, function(err, db) {
      if (err) throw err;
      let dbo = db.db(DB_NAME);
      let code = "NO_METHOD"

      if (method == "add") {
        code = addTray(tray, dbo);
      } else if (method == "edit") {
        code = editTray(tray, dbo);
      } else if (method == "remove") {
        code = removeTray(tray, dbo);
      } else if (method == "switch") {
        code = switchTray(tray, dbo);
      } else if (method == "getBay") {
				code = getBay(tray, dbo);
			}	
      // TODO: Error handling
      if (code != "SUCCESS") {
        console.log("An error occured.")
      }
      db.close()
    });
  } catch (ex) {
    return "FAIL"
  }
  return "SUCCESS"
}

router.get('/', function(req, res, next) {
  res.send('This is stock taking');
});

// Routes simply call mongoUpdate and send appropriate response
// Route to add tray.
router.post('/addTray', function(req, res, next){
  let code = mongoUpdate(req.body, "add");
  if (code != "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
}); 

// Route to edit tray
router.post('/editTray', function(req, res, next){
  let code = mongoUpdate(req.body, "edit")
  if (code != "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
}); 

// Route to remove tray
router.post('/removeTray', function(req, res, next){
  let code = mongoUpdate(req.body, "remove");
  if (code != "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

router.post('/getBay', function(req, res, next) {
	let code = mongoUpdate(req.body, "getBay");
	if (code != "SUCCESS") {
		res.sendStatus(400);
	}	else {
		res.sendStatus(200);
	}
});

// Route to switch tray
router.post('/switchTray', function(req, res, next){
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
  let MongoClient = require('mongodb').MongoClient;
  let url = "mongodb+srv://new-user:s0ulDgUFcCS72lxR@cluster0-oxrvp.mongodb.net/test?retryWrites=true&w=majority";
  let myQueryA = {"zone": postStart["zone"], "bay": posStart["bay"], "tray": posStart["tray"]};
  let myQueryB = {"zone": posTarget["zone"], "bay": posTarget["bay"], "tray": posTarget["tray"]};
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    let dbo = db.db("foodbank");
    dbo.collection("food").update(myQueryA, myQueryB, (function(err, res) {
      if (err) throw err;
      console.log("Switched trays at Zone: " + myQueryA["zone"] + ", Bay: " + myQueryA["bay"] + ", Tray: " + myQueryA["tray"] + "and Zone: " + myQueryA["zone"] + ", Bay: " + myQueryA["bay"] + ", Tray: " + myQueryA["tray"]);
      db.close();
    }));
    
  });
  
  res.sendStatus(200);
});  

module.exports = router;
