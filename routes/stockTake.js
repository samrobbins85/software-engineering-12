var express = require('express');
var router = express.Router();

async function getZones(dbo) {
  const zones = await dbo.collection("zones").find({}).toArray();
	return zones;
}

function addZone(zone, dbo){
  if (!(zone.hasOwnProperty('zone') && zone.hasOwnProperty('height') && zone.hasOwnProperty('width'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  var myobj = { name: zone["zone"], height: zone["height"], width: zone["width"],bays:[]};
  try {
    dbo.collection("zones").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
  } catch (ex) {
    console.log(ex);
    return "FAIL"
  }
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to add tray
function addTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray.hasOwnProperty('weight'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  var pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  try {
    dbo.collection("food").updateOne(pos, {"$set": tray}, {"upsert": true}, function(err, res) { // Use upsert to add if it does not already exist.
      if (err) throw err;
      console.log(res["upsertedCount"] + " document inserted");
    });
  } catch (ex) {
		console.log(ex);
    return "FAIL"
  }
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit tray
function editTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray,hasOwnProperty('weight'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  let newValues = {"contents": tray["contents"], "weight": tray["weight"], "expiry": tray["expiry"]};
  try {
    dbo.collection("food").updateOne(pos, {"$set": newValues}, function(err, res) {
      if (err) throw err;
      console.log(res["modifiedCount"] + " document edited");
    });
  } catch (ex) {
		console.log(ex);
    return "FAIL"
  }
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to remove tray
function removeTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  try {
    dbo.collection("food").remove(pos, function(err, res) {
      if (err) throw err;
      console.log("Deleted tray at Zone: " + pos["zone"] + ", Bay: " + pos["bay"] + ", Tray: " + pos["tray"]);
    });
  } catch (ex) {
		console.log(ex);
    return "FAIL";
  }
  return "SUCCESS";
}

// called by mongoUpdate to build request to mongoDB to switch tray
async function switchTray(body, dbo) {
  if (!(body.hasOwnProperty('first') && body.hasOwnProperty('second'))) {
    console.log("Malformed request!");
    return "FAIL"
  }

	let first = body.first;
	let second = body.second;

  if (!(first.hasOwnProperty('zone') && first.hasOwnProperty('bay') && first.hasOwnProperty('tray'))) {
    console.log("Malformed request");
    return "FAIL";
  }

  if (!(second.hasOwnProperty('zone') && second.hasOwnProperty('bay') && second.hasOwnProperty('tray'))) {
    console.log("Malformed request");
    return "FAIL";
  }

	try {
		const aPromise = dbo.collection("food").findOne(first);
		const bPromise = dbo.collection("food").findOne(second);
		const [a, b] = await Promise.all([aPromise, bPromise]);

		if (a === null || b === null) {
			console.log(e); // what is e?
			return "FAIL";	
		} else {
			const setA = dbo.collection("food").replaceOne(first, {$set: second});
			const setB = dbo.collection("food").replaceOne(second, {$set: first});

			await Promise.all([setA, setB]);
			
		}
	} catch (e) {
		console.log(e);
		return "FAIL";
	}
	return "SUCCESS";
}

async function getTraysInBay(bay, dbo) {
  if (!(bay.hasOwnProperty('zone') && bay.hasOwnProperty('bay'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

	// bay is json object containing zone and bay identifier. No need to specify tray
	let pos = {"zone": bay["zone"], "bay": bay["bay"]};

  let trays = await dbo.collection("food").find(pos).toArray();
	return trays;
}

// Move Tray, not working yet.
async function moveTray(body, dbo) {
  if (!(body.hasOwnProperty('posStart') && body.hasOwnProperty('posTarget'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

	let posStart = body.posStart;
	let posTarget = body.posTarget;

  if (!(posStart.hasOwnProperty('zone') && posStart.hasOwnProperty('bay') && posStart.hasOwnProperty('tray'))) {
    console.log("Malformed request");
    return "FAIL";
  }
  
  if (!(posTarget.hasOwnProperty('zone') && posTarget.hasOwnProperty('bay') && posTarget.hasOwnProperty('tray'))) {
    console.log("Malformed request");
    return "FAIL";
  }

	try {
		var occupied = true;
		occupied = (await dbo.collection("food").find(posTarget).limit(1).length) > 0;

		if (occupied) {
			console.log("Position already occupied!");
			return "FAIL_OCCUPIED";
		}
		await dbo.collection("food").updateOne(posStart, {$set: posTarget}, function(err, res) {
			if (err) throw err;

		});
	} catch (ex) {
		console.log(ex);
		return "FAIL";
	}
	return "SUCCESS"
}

// called by routes with request body and method string
async function mongoUpdate(tray, method) {
  // Initialise MongoClient and define some constants
  let MongoClient = require('mongodb').MongoClient;
  const URL = "mongodb+srv://new-user:s0ulDgUFcCS72lxR@cluster0-oxrvp.mongodb.net/test?retryWrites=true&w=majority";
  const DB_NAME = "foodbank";

  let db;
  let dbo;

  // Try to connect and then test server
  try {
    db = await MongoClient.connect(URL);
    dbo = db.db(DB_NAME);
  } catch (ex) {
    console.log("Failed to connect to MongoDB!");
    console.log(ex);
    return "FAIL";
  }

  try {
    //let db = await MongoClient.connect(URL);

    //let dbo = db.db(DB_NAME);
    let code = "NO_METHOD";

		switch (method) {
			case "add":
  	    code = await addTray(tray, dbo);
  	  	break;
  	  case "edit" :
  	    code = await editTray(tray, dbo);
  	  	break;
  	  case "remove":
  	    code = await removeTray(tray, dbo);
  	  	break;
  	  case "switch":
  	    code = await switchTray(tray, dbo);
  	  	break;
  	  case "getTraysInBay":
  	    code = await getTraysInBay(tray, dbo);
  	  	break;
  	  case "moveTray":
  	    code = await moveTray(tray, dbo);
  	  	break;
  	  case "getZones":
  	    code = await getZones(dbo);
  	  	break;
  	  case "addZone":
  	    code = await addZone(tray,dbo);
  	  	break;
			case "switchTray":
				code = await switchTray(tray, dbo);
				break;
		}
    if (code.constructor === Array || code.constructor === Object) {
      db.close();
      return code;
    }

    // TODO: Error handling
    if (code !== "SUCCESS") {
      console.log("An error occured.")
      db.close()
      return code;
    }
    db.close();
  } catch (ex) {
    db.close()
    console.log("An error occured..");
    console.log(ex);
    return "FAIL"
  }
  return "SUCCESS"
}

router.get('/', function(req, res, next) {
  res.send('This is stock taking');
});

router.get('/getZones', async function (req,res,next) {
  let zone_array = await mongoUpdate(req.body,"getZones")
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send({zones: zone_array});
});

router.post('/addZone', async function (req, res, next) {
	let code = await mongoUpdate(req.body, "addZone")
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

// Routes simply call mongoUpdate and send appropriate response
// Route to add tray.
router.post('/addTray', async function(req, res, next){
  let code = await mongoUpdate(req.body, "add");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
}); 

// Route to edit tray
router.post('/editTray', async function(req, res, next){
  let code = await mongoUpdate(req.body, "edit");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
}); 

// Route to remove tray
router.post('/removeTray', async function(req, res, next){
  let code = await mongoUpdate(req.body, "remove");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

router.post('/getTraysInBay', async function(req, res, next) {
	let _trays = await mongoUpdate(req.body, "getTraysInBay");
	res.setHeader('Content-Type', 'application/json');
  	res.status(200).send({trays: _trays});
});

router.post('/moveTray', async function(req, res, next) {
	let code = await mongoUpdate(req.body, "moveTray");
	if (code !== "SUCCESS") {
		res.sendStatus(400);
	} else {
		res.sendStatus(200);
	}
});

// Route to switch tray
router.post('/switchTray', async function (req, res, next) {
    /*
    To begin with just move tray within bay.
      Inputs:
        posStart : A tuple containing position of tray to move
        posTarget : A tuple containing position of target position to move to
      Returns:
        Whether this action completed successfully or not.
    */
	
		let code = await mongoUpdate(req.body, "switchTray");
		if (code !== "SUCCESS") {
			res.sendStatus(400);
		} else {
			res.sendStatus(200);
		}

});

module.exports = router;
