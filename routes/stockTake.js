var express = require('express');
var router = express.Router();

// Get all trays and return next n expiring
async function getNextNExpiring(body, dbo) {
  if (!(body.hasOwnProperty('n'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!Number.isInteger(body['n'])) {
    console.log("'n' must be an Integer");
    return "FAIL";
  }

  const trays = await dbo.collection("food").find({}).toArray();
  if (trays.length <= body['n']) {
    console.log("Total trays is less than specified. Use all trays.");
    return trays;
  }

  trays.sort((a,b) => a.expiry - b.expiry);
  return trays.slice(0, body['n']);
}

// called by mongoUpdate to get all zones in the mongoDB
async function getZones(dbo) {
  const zones = await dbo.collection("zones").find({}).toArray();
	return zones;
}

// called by mongoUpdate to add a new zone to the mongoDB
async function addZone(zone, dbo){
  if (!(zone.hasOwnProperty('zone') && zone.hasOwnProperty('height') && zone.hasOwnProperty('width'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(Number.isInteger(zone['height']) && Number.isInteger(zone['width']))) {
    console.log("Height and width must be integers!");
    return "FAIL";
  }

  if (!(zone['height'] > 0 && zone['width'] > 0)) {
    console.log("Height and width must be more than zero!");
    return "FAIL";
  }

  if (!(typeof(zone['name'] === "string"))) {
    console.log("Zone identifier must be a string!");
    return "FAIL";
  }

  var myobj = { name: zone["zone"], height: zone["height"], width: zone["width"]};

  try {
    let res = await dbo.collection("zones").insertOne(myobj);
    if (! (res['insertedCount'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }
  //try {
    //dbo.collection("zones").insertOne(myobj, function(err, res) {
      //if (err) throw err;
      //if (! (res['insertedCount'] == 1)) throw "Did not insert new zone";
    //});
  //} catch (ex) {
    //console.log(ex);
    //return "FAIL"
  //}
  return "SUCCESS"
}

async function editZone(zone, dbo) {
  if (!(zone.hasOwnProperty('zone') && zone.hasOwnProperty('height') && zone.hasOwnProperty('width'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(Number.isInteger(zone['height']) && Number.isInteger(zone['width']))) {
    console.log("Height and width must be integers!");
    return "FAIL";
  }

  if (!(zone['height'] > 0 && zone['width'] > 0)) {
    console.log("Height and width must be more than zero!");
    return "FAIL";
  }

  if (!(typeof(zone['zone'] === "string"))) {
    console.log("Zone identifier must be a string!");
    return "FAIL";
  }

  let pos = { name: zone["zone"] };
  let newValues = { height: zone["height"], width: zone["width"] };

  try {
    let res = dbo.collection("zones").updateOne(pos, {"$set": newValues});
    if (! (res['modifiedCount'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to remove zone
async function removeZone(zone, dbo) {
  if (! (bay.hasOwnProperty('zone'))) {
    console.log("Malformed request");
    return "FAIL";
  }

  if (! (typeof(zone['zone']) == "string")) {
    console.log("Zone identifier must be a string.");
    return "FAIL";
  }

  // TODO: Check if items still in zone

  let pos = {"zone": zone["zone"]};

  try {
    let res = await dbo.collection("zones").remove(pos);
    if (! (res['result']['n'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }

  return "SUCCESS";
}

async function addBay(bay,dbo){
  if (!(bay.hasOwnProperty('bay') && bay.hasOwnProperty('zone') && bay.hasOwnProperty('xVal') && bay.hasOwnProperty('yVal') && bay.hasOwnProperty('xSize') && bay.hasOwnProperty('ySize'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (! (Number.isInteger(bay['xVal']) && Number.isInteger(bay['yVal']) && Number.isInteger(bay['xSize']) && Number.isInteger(bay['ySize']))) {
    console.log("Position and size must be integers!");
    return "FAIL";
  }

  if (bay['xVal'] < 0 || bay['yVal'] < 0 || bay['xSize'] < 1 || bay['ySize'] < 1) {
    console.log("Position and size must be within the valid range! (Positive Integer)");
    return "FAIL";
  }

  if (! (typeof(bay['bay']) == "string" && typeof(bay['zone'] == "string"))) {
    console.log("Bay and zone identifiers must be strings.");
    return "FAIL";
  }

  var myobj = { "name": bay["bay"], "zone": bay["zone"], "position": [bay["xVal"], bay["yVal"]], "size": [bay["xSize"], bay["ySize"]]}
  try {
    let res = await dbo.collection("bays").insertOne(myobj);
    if (! (res['insertedCount'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }
  //try {
    //dbo.collection("bays").insertOne(myobj, function(err, res) {
      //if (err) throw err;
      //if (! (res['insertedCount'] == 1)) throw "Did not insert new bay";
    //});
  //} catch (ex) {
    //console.log(ex);
    //return "FAIL"
  //}
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit bay
async function editBay(bay, dbo) {
  if (! (bay.hasOwnProperty('zone') && bay.hasOwnProperty('xVal') && bay.hasOwnProperty('yVal') && bay.hasOwnProperty('xSize') && bay.hasOwnProperty('ySize'))) {
    console.log("Malformed request");
    return "FAIL";
  }

  if (! (Number.isInteger(bay['xVal']) && Number.isInteger(bay['yVal']) && Number.isInteger(bay['xSize']) && Number.isInteger(bay['ySize']))) {
    console.log("Position and size must be integers!");
    return "FAIL";
  }

  if (bay['xVal'] < 0 || bay['yVal'] < 0 || bay['xSize'] < 0 || bay['ySize'] < 0) {
    console.log("Position must be within the valid range! (Positive Integer)");
    return "FAIL";
  }

  if (! (typeof(bay['bay']) == "string")) {
    console.log("Bay and zone identifiers must be strings.");
    return "FAIL";
  }

  let pos = {"zone": bay["zone"], "position": [bay["xVal"], bay["yVal"]]};
  let newValues = {"size": [bay["xSize"], bay["ySize"]]};

  try {
    let res = dbo.collection("bays").updateOne(pos, {"$set": newValues});
    if (! (res['modifiedCount'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }

  //try {
    //dbo.collection("bays").updateOne(pos, {"$set": newValues}, function(err, res) {
      //if (err) throw err;
      //if (! (res['modifiedCount'] == 1)) throw "Document not modified";
      //console.log(res["modifiedCount"] + " document edited");
    //});
  //} catch (ex) {
		//console.log(ex);
    //return "FAIL";
  //}
  return "SUCCESS";
}

// called by mongoUpdate to build request to mongoDB to remove bay
async function removeBay(bay, dbo) {
  if (! (bay.hasOwnProperty('zone') && bay.hasOwnProperty('xVal') && bay.hasOwnProperty('yVal'))) {
    console.log("Malformed request");
    return "FAIL";
  }
  if (! (Number.isInteger(bay['xVal']) && Number.isInteger(bay['yVal']) )) {
    console.log("Position and size must be integers!");
    return "FAIL";
  }

  if (bay['xVal'] < 0 || bay['yVal'] < 0) {
    console.log("Position must be within the valid range! (Positive Integer)");
    return "FAIL";
  }

  if (! (typeof(bay['bay']) == "string")) {
    console.log("Bay and zone identifiers must be strings.");
    return "FAIL";
  }

  let pos = {"zone": bay["zone"], "position": [bay["xVal"], bay["yVal"]]};
  
  try {
    let res = await dbo.collection("bays").remove(pos);
    if (! (res['result']['n'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }
  //try {
    //dbo.collection("bays").remove(pos, function(err, res) {
      //if (err) throw err;
      //if (! (res['result']['n'] == 1)) throw "No Document was deleted";
    //});
  //} catch (ex) {
		//console.log(ex);
    //return "FAIL";
  //}
  return "SUCCESS";
}

// called by mongoUpdate to build request to mongoDB to add tray
async function addTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray.hasOwnProperty('weight') && tray.hasOwnProperty('xPos') && tray.hasOwnProperty('yPos'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(typeof(tray['zone']) === "string" && typeof(tray['bay']) === "string" && typeof(tray['tray']) === "string" && typeof(tray['contents']) === "string" && typeof(tray['expiry']) === "string")) {
    console.log("Zone, bay, tray, contents and expiry must be strings!");
    return "FAIL";
  }

  if (!(typeof(tray['weight']) === "number")) {
    console.log("Weight must be a number!");
    return "FAIL";
  }

  if (! (Number.isInteger(tray['xPos']) && Number.isInteger(tray['yPos']))) {
    console.log("Position attributes must be integers");
    return "FAIL";
  }

  if (tray['xPos'] < 0 || tray['yPos'] < 0) {
    console.log("Position must be within the valid range! (Positive Integer)");
    return "FAIL";
  }

  if (tray["expiry"].length == 4) {
    let x = new Date(parseInt(tray["expiry"]), 11, 31, 23, 59, 59);
    tray["expiry"] = x.getTime();
  }
  else {
    let expiryArray = tray["expiry"].split("/");
    let x = new Date(parseInt(expiryArray[1]), (parseInt(expiryArray[0])-1), 1, 0, 0, 0);
    tray["expiry"] = x.getTime();
  }

  var pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"], "contents": tray["contents"], "weight": tray["weight"], "expiry": tray["expiry"], "xPos": tray["xPos"], "yPos": tray["yPos"]};

  try {
    let res = await dbo.collection("food").updateOne(pos, {"$set": tray}, {"upsert": true});
    if (! (res['upsertedCount'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }

  //try {
    //dbo.collection("food").updateOne(pos, {"$set": tray}, {"upsert": true}, function(err, res) { // Use upsert to add if it does not already exist.
      //if (err) throw err;
      //if (! (res['upsertedCount'] == 1)) throw "No document was inserted";
    //});
  //} catch (ex) {
		//console.log(ex);
    //return "FAIL"
  //}
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit tray
async function editTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray,hasOwnProperty('weight'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(typeof(tray['zone']) === "string" && typeof(tray['bay']) === "string" && typeof(tray['tray']) === "string" && typeof(tray['contents']) === "string" && typeof(tray['expiry']) === "string")) {
    console.log("Zone, bay, tray, contents and expiry must be strings!");
    return "FAIL";
  }

  if (!(typeof(tray['weight']) === "number")) {
    console.log("Weight must be a number!");
    return "FAIL";
  }

  if (! (Number.isInteger(tray['xPos']) && Number.isInteger(tray['yPos']))) {
    console.log("Position attributes must be integers");
    return "FAIL";
  }

  if (tray['xPos'] < 0 || tray['yPos'] < 0) {
    console.log("Position must be within the valid range! (Positive Integer)");
    return "FAIL";
  }

  if (tray["expiry"].length == 4) {
    let x = new Date(parseInt(tray["expiry"]), 11, 31, 23, 59, 59);
    tray["expiry"] = x.getTime();
  }
  else {
    let expiryArray = tray["expiry"].split("/");
    let x = new Date(parseInt(expiryArray[1]), (parseInt(expiryArray[0])-1), 1, 0, 0, 0);
    tray["expiry"] = x.getTime();
  }

  try {
      collectionSize = dbo.collection("food").find({
          "zone": tray["zone"],
          "bay": tray["bay"],
          "xPos": {$gt: tray["xPos"]},
          "yPos": {$gt: tray["yPos"]}
      }).limit(1).length()

      if (collectionSize > 0) {
          console.log("Trays will be deleted if this action is performed - please delete trays first.")
          return "FAIL"
      }
  } catch (ex) {
      console.log(ex);
      return "FAIL"
  }

  let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  let newValues = {"contents": tray["contents"], "weight": tray["weight"], "expiry": tray["expiry"], "xPos": tray["xPos"], "yPos": tray["yPos"]};

  try {
    let res = await dbo.collection("food").updateOne(pos, {"$set": newValues});
    if (! (res['modifiedCount'] == 1)) return "FAIL";
  } catch (ex) {
    console.log(ex);
    return "FAIL";
  }

  //try {
    //dbo.collection("food").updateOne(pos, {"$set": newValues}, function(err, res) {
      //if (err) throw err;
      //if (! (res['modifiedCount'] == 1)) throw "No Document was modified";
    //});
  //} catch (ex) {
		//console.log(ex);
    //return "FAIL"
  //}
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to remove tray
async function removeTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(typeof(tray['zone']) === "string" && typeof(tray['bay']) === "string" && typeof(tray['tray']) === "string")) {
    console.log("Position attributes must be strings!");
    return "FAIL";
  }

  let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
  try {
    let res = await dbo.collection("food").remove(pos);
    if (! (res['result']['n'] == 1)) return "FAIL";
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

  if (!(typeof(first['zone']) === "string" && typeof(first['bay']) === "string" && typeof(first['tray']) === "string")) {
    console.log("(First Tray) Position attributes must be strings!");
    return "FAIL";
  }

  if (!(typeof(second['zone']) === "string" && typeof(second['bay']) === "string" && typeof(second['tray']) === "string")) {
    console.log("(Second Tray) Position attributes must be strings!");
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
      if (a.length != 1 || b.length != 1) {
        console.log("Tray does not exist!");
        return "FAIL";
      }
			const setA = dbo.collection("food").replaceOne(first, {$set: second});
			const setB = dbo.collection("food").replaceOne(second, {$set: first});

			const [sa, sb] = await Promise.all([setA, setB]);
      if (sa['modifiedCount'] != 1 || sb['modifiedCount'] != 1) {
        console.log("Failed to replace at specified locations!");
        return "FAIL";
      }
			
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

  if (!(typeof(bay['zone']) === "string" && typeof(bay['bay']) === "string")) {
    console.log("Position attributes must be strings!");
    return "FAIL";
  }

  // bay is json object containing zone and bay identifier. No need to specify tray
  let pos = {"zone": bay["zone"], "bay": bay["bay"]};

  let trays = await dbo.collection("food").find(pos).toArray();
  return trays;
}

async function getBaysInZone(zone, dbo) {
  if (!(zone.hasOwnProperty('name'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(typeof(zone['name']) === "string")) {
    console.log("Zone name must be a string");
    return "FAIL";
  }

  let pos = {"zone": zone["name"]};

  let trays = await dbo.collection("bays").find(pos).toArray();
  return trays;
}

// Moves a tray
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

  if (!(typeof(posStart['zone']) === "string" && typeof(posStart['bay']) === "string" && typeof(posStart['tray']) === "string")) {
    console.log("(Start Tray) Position attributes must be strings!");
    return "FAIL";
  }

  if (!(typeof(posTarget['zone']) === "string" && typeof(posTarget['bay']) === "string" && typeof(posTarget['tray']) === "string")) {
    console.log("(Target Tray) Position attributes must be strings!");
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
      if (! (res['modifiedCount'] == 1)) throw "No Document was modified";
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

  // TODO: passing body, zone. is this valid?? <27-02-20, alex> //
  try {
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
      case "getBaysInZone":
        code = await getBaysInZone(zone, dbo);
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
      case "editZone":
        code = await editZone(tray,dbo);
        break;
  	  case "switchTray":
        code = await switchTray(tray, dbo);
        break;
      case "addBay":
        code = await addBay(bay, dbo);
        break;
      case "editBay":
        code = await editBay(bay, dbo);
        break;
      case "removeBay":
        code = await removeBay(bay,dbo);
        break;
      case "nextExpiring":
        code = await getNextNExpiring(tray, dbo);
        console.log(code);
        break;
		}
    if (code.constructor === Array || code.constructor === Object) {
      db.close();
      console.log("is array or object");
      return code;
    }

    // TODO: Specific Error codes for different error types
    // TODO: Clean up some of these db.close()
    if (code !== "SUCCESS") {
      console.log("An error occured.")
      db.close()
      return code;
    }
    db.close();
  } catch (ex) {
    console.log("An error occured..");
    console.log(ex);
    db.close()
    return "FAIL"
  }
  return "SUCCESS"
}

// All routes pass the body to mongoUpdate with the correct method code.
// It then sends the response back to the client
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

router.post('/addTray', async function(req, res, next){
  let code = await mongoUpdate(req.body, "add");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
}); 

router.post('/editTray', async function(req, res, next){
  let code = await mongoUpdate(req.body, "edit");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
}); 

router.post('/removeTray', async function(req, res, next){
  let code = await mongoUpdate(req.body, "remove");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

// Route to add bay.
router.post('/addBay', async function(req, res, next){
  let code = await mongoUpdate(req.body, "add");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

// Route to edit bay
router.post('/editBay', async function(req, res, next){
  let code = await mongoUpdate(req.body, "edit");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

// Route to remove bay
router.post('/removeBay', async function(req, res, next){
  let code = await  mongoUpdate(req.body, "remove");
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

router.post('/getBaysInZone', async function(req, res, next) {
	let _bays = await mongoUpdate(req.body, "getTraysInBay");
	res.setHeader('Content-Type', 'application/json');
  	res.status(200).send({bays: _bays});
});

router.post('/moveTray', async function(req, res, next) {
	let code = await mongoUpdate(req.body, "moveTray");
	if (code !== "SUCCESS") {
		res.sendStatus(400);
	} else {
		res.sendStatus(200);
	}
});

router.post('/switchTray', async function (req, res, next) {
  let code = await mongoUpdate(req.body, "switchTray");
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
});

router.post('/nextExpiring', async function (req, res, next) {
  let trays = await mongoUpdate(req.body, "nextExpiring");
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send({'trays': trays});
})

module.exports = router;
