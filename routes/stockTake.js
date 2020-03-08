var express = require('express');
var router = express.Router();

// The "Many" functions take a list of JSON objects
async function addTrayMany(body, dbo) {
  if (!body) {
    console.error("Input is not defined.");
    return "FAIL"
  }

  if (!Array.isArray(body)) {
    console.error("Input is not an array!");
    return "FAIL";
  }

  if (body.length === 0) {
    console.error("Input array is empty!");
    return "FAIL";
  }

  // TODO: type check all documents in array <07-03-20, alex> //
  try {
    // TODO: possible to change to updateMany with upsert? <07-03-20, alex> //
    let res = await dbo.collection("food").insertMany(body);
    if (! (res['insertedCount'] === body.length)) return "FAIL";
  } catch (ex) {
    /* handle error */
    console.error(ex);
    return "FAIL";
  }
  return "SUCCESS";
}

// Edit may trays simultaneously
// TODO: test this! <08-03-20, alex> //
async function editTrayMany(body, dbo) {
  if (!body) {
    console.error("Input is not defined.");
    return "FAIL"
  }

  if (!Array.isArray(body)) {
    console.error("Input is not an array!");
    return "FAIL";
  }

  if (body.length === 0) {
    console.error("Input array is empty!");
    return "FAIL";
  }

  // TODO: Validation of each individual item <08-03-20, alex> //
  try {
    let pos = []
    for (let i = 0; i < body.length; i++) {
      pos.push({"zone": body[i]["zone"], "bay": body[i]["zone"], "tray": body[i]["tray"]});
    }
    let res = await dbo.collection("food").updateMany({"$or": pos}, body)
    // TODO: should similar also be matchedCount? <08-03-20, alex> //
    if (! (res['matchedCount'] == body.length)) return "FAIL"
  } catch (ex) {
    /* handle error */
    console.error(ex);
    return "FAIL";
  }
  return "SUCCESS";
}

// List of tray positions
async function removeTrayMany(body, dbo) {
  if (!body) {
    console.error("Input is not defined.");
    return "FAIL"
  }

  if (!Array.isArray(body)) {
    console.error("Input is not an array!");
    return "FAIL";
  }

  if (body.length === 0) {
    console.error("Input array is empty!");
    return "FAIL";
  }

  // TODO: validation of each individual item <07-03-20, alex> //
  try {
    let res = await dbo.collection("food").deleteMany({"$or": body})
    if (! (res['deletedCount'] == body.length)) return "FAIL";
  } catch (ex) {
    console.error(ex);
    return "FAIL";
  }
  return "SUCCESS";
}

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

  // TODO: find next N in a category <07-03-20, alex> //
  const trays = await dbo.collection("food").find({}).toArray();
  if (trays.length <= body['n']) {
    console.log("Total trays is less than specified. Use all trays.");
    trays.sort((a,b) => a.expiry - b.expiry);
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
  return "SUCCESS";
}

// called by mongoUpdate to build request to mongoDB to add tray
async function addTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray.hasOwnProperty('weight') && tray.hasOwnProperty('xPos') && tray.hasOwnProperty('yPos'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(typeof(tray['zone']) === "string" && typeof(tray['bay']) === "string" && typeof(tray['tray']) === "string" && typeof(tray['contents']) === "string")) {
    console.log("Zone, bay, tray, contents and expiry must be strings!");
    return "FAIL";
  }

  if (!(Number.isInteger(tray['weight']) && Number.isInteger['expiry'])) {
    console.log("Weight, expiry must be integers!");
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

  // TODO: deprecated? should be unix time <08-03-20, alex> //
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
  return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit tray
async function editTray(tray, dbo) {
  if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray,hasOwnProperty('weight'))) {
    console.log("Malformed request!");
    return "FAIL";
  }

  if (!(typeof(tray['zone']) === "string" && typeof(tray['bay']) === "string" && typeof(tray['tray']) === "string" && typeof(tray['contents']) === "string")) {
    console.log("Zone, bay, tray, contents and expiry must be strings!");
    return "FAIL";
  }

  if (!(Number.isInteger(tray['weight']) && Number.isInteger['expiry'])) {
    console.log("Weight, expiry must be integers!");
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
  
  // TODO: may be able to use mongoDB $ operators to improve this <08-03-20, alex> //
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
async function mongoUpdate(body, method) {
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
    let code = "NO_METHOD";

		switch (method) {
			case "add":
  	    code = await addTray(body, dbo);
  	  	break;
  	  case "edit" :
  	    code = await editTray(body, dbo);
  	  	break;
  	  case "remove":
  	    code = await removeTray(body, dbo);
  	  	break;
  	  case "switch":
  	    code = await switchTray(body, dbo);
  	  	break;
  	  case "getTraysInBay":
  	    code = await getTraysInBay(body, dbo);
  	  	break;
      case "getBaysInZone":
        code = await getBaysInZone(body, dbo);
        break;
  	  case "moveTray":
  	    code = await moveTray(body, dbo);
  	  	break;
  	  case "getZones":
  	    code = await getZones(dbo);
  	  	break;
  	  case "addZone":
  	    code = await addZone(body,dbo);
  	  	break;
      case "editZone":
        code = await editZone(body,dbo);
        break;
  	  case "switchTray":
        code = await switchTray(body, dbo);
        break;
      case "addBay":
        code = await addBay(body, dbo);
        break;
      case "editBay":
        code = await editBay(body, dbo);
        break;
      case "removeBay":
        code = await removeBay(body,dbo);
        break;
      case "nextExpiring":
        code = await getNextNExpiring(body, dbo);
        break;
      case "addTrayMany":
        code = await addTrayMany(body, dbo);
        break;
      case "editTrayMany":
        code = await editTrayMany(body, dbo);
        break;
      case "removeTrayMany":
        code = await removeTrayMany(body, dbo);
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

router.post('/addTrayMany', async function (req, res, next) {
  let code = await mongoUpdate(req.body, "addTrayMany")
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
})

router.post('/editTrayMany', async function (req, res, next) {
  let code = await mongoUpdate(req.body, "editTrayMany")
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
})

router.post('/removeTrayMany', async function (req, res, next) {
  let code = await mongoUpdate(req.body, "removeTrayMany")
  if (code !== "SUCCESS") {
    res.sendStatus(400);
  } else {
    res.sendStatus(200);
  }
})

module.exports = router;
