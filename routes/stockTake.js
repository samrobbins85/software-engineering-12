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

    for (let i = 0; i < body.length; i++) {
        tray = body[i];
        if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray.hasOwnProperty('weight') && tray.hasOwnProperty('xPos') && tray.hasOwnProperty('yPos'))) {
            console.log("Malformed request!");
            return "FAIL";
        }

        if (!(typeof (tray['zone']) === "string" && typeof (tray['bay']) === "string" && typeof (tray['tray']) === "string" && typeof (tray['contents']) === "string")) {
            console.log("Zone, bay, tray, contents and expiry must be strings!");
            return "FAIL";
        }

        if (!(Number.isInteger(tray['weight']) && Number.isInteger['expiry'])) {
            console.log("Weight, expiry must be integers!");
            return "FAIL";
        }

        if (!(Number.isInteger(tray['xPos']) && Number.isInteger(tray['yPos']))) {
            console.log("Position attributes must be integers");
            return "FAIL";
        }

        if (tray['xPos'] < 0 || tray['yPos'] < 0) {
            console.log("Position must be within the valid range! (Positive Integer)");
            return "FAIL";
        }
    }

    try {
        let res = await dbo.collection("food").insertMany(body);
        if (!(res['insertedCount'] === body.length)) return "FAIL";
    } catch (ex) {
        /* handle error */
        console.error(ex);
        return "FAIL";
    }
    return "SUCCESS";
}

// Edit may trays simultaneously
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

    for (let i = 0; i < body.length; i++) {
        tray = body[i];
        if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray') && tray.hasOwnProperty('contents') && tray.hasOwnProperty('expiry') && tray.hasOwnProperty('weight') && tray.hasOwnProperty('xPos') && tray.hasOwnProperty('yPos'))) {
            console.log("Malformed request!");
            return "FAIL";
        }

        if (!(typeof (tray['zone']) === "string" && typeof (tray['bay']) === "string" && typeof (tray['tray']) === "string" && typeof (tray['contents']) === "string")) {
            console.log("Zone, bay, tray, contents and expiry must be strings!");
            return "FAIL";
        }

        if (!(Number.isInteger(tray['weight']) && Number.isInteger['expiry'])) {
            console.log("Weight, expiry must be integers!");
            return "FAIL";
        }

        if (!(Number.isInteger(tray['xPos']) && Number.isInteger(tray['yPos']))) {
            console.log("Position attributes must be integers");
            return "FAIL";
        }

        if (tray['xPos'] < 0 || tray['yPos'] < 0) {
            console.log("Position must be within the valid range! (Positive Integer)");
            return "FAIL";
        }
    }

    try {
        let pos = []
        for (let i = 0; i < body.length; i++) {
            pos.push({"zone": body[i]["zone"], "bay": body[i]["zone"], "tray": body[i]["tray"]});
        }
        let res = await dbo.collection("food").updateMany({"$or": pos}, body)
        // TODO: should similar also be matchedCount? <08-03-20, alex> //
        if (!(res['matchedCount'] == body.length)) return "FAIL"
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

    for (let i = 0; i < body.length; i++) {
        tray = body[i];
        if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray'))) {
            console.log("Malformed request!");
            return "FAIL";
        }

        if (!(typeof (tray['zone']) === "string" && typeof (tray['bay']) === "string" && typeof (tray['tray']) === "string")) {
            console.log("Position attributes must be strings!");
            return "FAIL";
        }
    }

    try {
        let res = await dbo.collection("food").deleteMany({"$or": body})
        if (!(res['deletedCount'] == body.length)) return "FAIL";
    } catch (ex) {
        console.error(ex);
        return "FAIL";
    }
    return "SUCCESS";
}

async function getAllCategory(body, dbo) {
    if (!body.hasOwnProperty('contents')) {
        console.log("Malformed request!");
        return "FAIL";
    }

    if (!(typeof (body['contents'] === "string"))) {
        console.log("'contents' must be a string");
        return "FAIL";
    }
    console.log(body['contents'].contents)
    const trays = await dbo.collection("food").find({"contents": body['contents'].contents}).toArray();
    return trays;
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

    if (body.hasOwnProperty('contents') && !typeof (body['contents'] === "string")) {
        console.log("'category must be a string'");
        return "FAIL";
    }

    let trays;
    if (body.hasOwnProperty('contents')) {
        trays = await dbo.collection("food").find({"contents": body['contents']}).toArray();
    } else {
        trays = await dbo.collection("food").find({}).toArray();
    }

    // Converts all stored times into UNIX times to find the next N expiring.
    // Dates need to be passed in MM/YYYY or YYYY format
    for (let count = 0; count < trays.length; count++) {
        if (trays[count]["expiry"].length == 4) {
            let x = new Date(parseInt(trays[count]["expiry"]), 11, 31, 23, 59, 59);
            trays[count]["UNIXexpiry"] = x.getTime();
        } else {
            let expiryArray = trays[count]["expiry"].split("/");
            let x = new Date(parseInt(expiryArray[1]), (parseInt(expiryArray[0]) - 1), 1, 0, 0, 0);
            trays[count]["UNIXexpiry"] = x.getTime();
        }
    }

    trays.sort((a, b) => a.UNIXexpiry - b.UNIXexpiry);

    // Deletes the UNIXexpiry key as the end user does not need to see this.
    for (count = 0; count < trays.length; count++) {
        delete trays["UNIXexpiry"]
    }

    if (trays.length <= body['n']) {
        console.log("Total trays is less than specified. Use all trays.");
        return trays;
    }

    return trays.slice(0, body['n']);
}

// called by mongoUpdate to get all zones in the mongoDB
async function getZones(dbo) {
    const zones = await dbo.collection("zones").find({}).toArray();
    return zones;
}

// called by mongoUpdate to add a new zone to the mongoDB
async function addZone(zone, dbo) {
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

    if (!(typeof (zone['zone'] === "string"))) {
        console.log("Zone identifier must be a string!");
        return "FAIL";
    }

    var myobj = {"zone": zone["zone"], "height": zone["height"], "width": zone["width"], "bays": []};

    try {
        let pos = {"zone": zone["zone"]}

        const oldZones = await dbo.collection("zones").find(pos).toArray();
        if (!(oldBays === [])) {
            return "FAIL";
        }

        let res = await dbo.collection("zones").insertOne(myobj);
        if (!(res['insertedCount'] == 1)) return "FAIL";
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }
    return "SUCCESS"
}

async function editZone(zone, dbo) {
    if (!(zone.hasOwnProperty('zone'))) {
        console.log("Malformed request!");
        return "FAIL";
    }

    if (!(typeof (zone['zone'] === "string"))) {
        console.log("Zone identifier must be a string!");
        return "FAIL";
    }

    let pos = {zone: zone["zone"]}
    let newValues = {}

    if (zone.hasOwnProperty('newname') && (!(zone["newname"] === zone["zone"]))) {
        if (!(typeof (zone['newname'] === "string"))) {
            console.log("New zone identifier must be a string!");
            return "FAIL";
        }
        newValues["zone"] = zone["newname"]
    }

    if (zone.hasOwnProperty('height')) {
        if (!(Number.isInteger(zone['height']))) {
            console.log("Height must be an integer!");
            return "FAIL";
        }

        if (!(zone['height'] > 0)) {
            console.log("Height must be more than zero!");
            return "FAIL";
        }
        newValues["height"] = zone["height"]
    }

    if (zone.hasOwnProperty('width')) {
        if (!(Number.isInteger(zone['width']))) {
            console.log("Width must be an integer!");
            return "FAIL";
        }

        if (!(zone['width'] > 0)) {
            console.log("Width must be more than zero!");
            return "FAIL";
        }
        newValues["width"] = zone["width"]
    }

    if (!(newValues.hasOwnProperty('width') || newValues.hasOwnProperty('height') || newValues.hasOwnProperty('zone'))) {
        return "SUCCESS";
    }

    try {
        let res = dbo.collection("zones").updateOne(pos, {"$set": newValues});
        dbo.collection("bays").updateMany(pos, {"$set": newValues});
        dbo.collection("food").updateMany(pos, {"$set": newValues});
        //if (! (res['modifiedCount'] == 1)) return "FAIL";
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }

    return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to remove zone
async function removeZone(zone, dbo) {
    if (!(zone.hasOwnProperty('zone'))) {
        console.log("Malformed request");
        return "FAIL";
    }

    if (!(typeof (zone['zone']) == "string")) {
        console.log("Zone identifier must be a string.");
        return "FAIL";
    }

    let pos = {"zone": zone["zone"]};

    try {
        let res = await dbo.collection("zones").remove(pos);
        if (!(res['result']['n'] == 1)) return "FAIL";
        await dbo.collection("bays").remove(pos);
        await dbo.collection("food").remove(pos);
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }

    return "SUCCESS";
}

async function addBay(bay, dbo) {
    if (!(bay.hasOwnProperty('bay') && bay.hasOwnProperty('zone') && bay.hasOwnProperty('xVal') && bay.hasOwnProperty('yVal') && bay.hasOwnProperty('xSize') && bay.hasOwnProperty('ySize'))) {
        console.log("Malformed request!");
        return "FAIL";
    }

    if (!(Number.isInteger(bay['xVal']) && Number.isInteger(bay['yVal']) && Number.isInteger(bay['xSize']) && Number.isInteger(bay['ySize']))) {
        console.log("Position and size must be integers!");
        return "FAIL";
    }

    if (bay['xVal'] < 0 || bay['yVal'] < 0 || bay['xSize'] < 1 || bay['ySize'] < 1) {
        console.log("Position and size must be within the valid range! (Positive Integer)");
        return "FAIL";
    }

    if (!(typeof (bay['bay']) == "string" && typeof (bay['zone'] == "string"))) {
        console.log("Bay and zone identifiers must be strings.");
        return "FAIL";
    }

    var myobj = {
        "bay": bay["bay"],
        "zone": bay["zone"],
        "xVal": bay["xVal"],
        "yVal": bay["yVal"],
        "xSize": bay["xSize"],
        "ySize": bay["ySize"]
    }
    try {
        let pos = {"zone": bay["zone"], "bay": bay["zone"]}

        const oldBays = await dbo.collection("bays").find(pos).toArray();
        if (!(oldBays === [])) {
            return "FAIL";
        }

        let res = await dbo.collection("bays").insertOne(myobj);
        if (!(res['insertedCount'] == 1)) return "FAIL";
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }

    let pos = {"zone": bay["zone"]};
    let newValues = bay["bay"];

    try {
        await dbo.collection("zones").updateOne(pos, {"$push": {bays: newValues}});
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }

    for (let count = 0; count < bay["ySize"]; count++) {
        for (let count2 = 0; count2 < bay["xSize"]; count2++) {
            let myobj = {
                "zone": bay["zone"],
                "bay": bay["bay"],
                "tray": "",
                "contents": "EMPTY",
                "expiry": "",
                "weight": 0,
                "xPos": count2,
                "yPos": count
            }

            let res = await dbo.collection("food").insertOne(myobj);
        }
    }

    return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit bay
async function editBay(bay, dbo) {
    if (!(bay.hasOwnProperty('bay') && bay.hasOwnProperty('zone'))) {
        console.log("Malformed request");
        return "FAIL";
    }

    if (!(typeof (bay['bay']) == "string")) {
        console.log("Bay and zone identifiers must be strings.");
        return "FAIL";
    }

    let pos = {"bay": bay["bay"], "zone": bay["zone"]};
    let newValues = {};


    if (bay.hasOwnProperty('xVal')) {
        if (!(Number.isInteger(bay['xVal']))) {
            console.log("Position and size must be integers!");
            return "FAIL";
        }
        if (bay['xVal'] < 0) {
            console.log("Position must be within the valid range! (Positive Integer)");
            return "FAIL";
        }
        newValues["xVal"] = bay["xVal"];
    }

    if (bay.hasOwnProperty('yVal')) {
        if (!(Number.isInteger(bay['yVal']))) {
            console.log("Position and size must be integers!");
            return "FAIL";
        }
        if (bay['yVal'] < 0) {
            console.log("Position must be within the valid range! (Positive Integer)");
            return "FAIL";
        }
        newValues["yVal"] = bay["yVal"];
    }

    if (bay.hasOwnProperty('xSize')) {
        if (!(Number.isInteger(bay['xSize']))) {
            console.log("Position and size must be integers!");
            return "FAIL";
        }
        if (bay['xSize'] < 0) {
            console.log("Position must be within the valid range! (Positive Integer)");
            return "FAIL";
        }
        newValues["xSize"] = bay["xSize"];
    }

    if (bay.hasOwnProperty('ySize')) {
        if (!(Number.isInteger(bay['ySize']))) {
            console.log("Position and size must be integers!");
            return "FAIL";
        }
        if (bay['ySize'] < 0) {
            console.log("Position must be within the valid range! (Positive Integer)");
            return "FAIL";
        }
        newValues["ySize"] = bay["ySize"];
    }

    try {
        let oldBay = await dbo.collection("bays").findOne(pos);
        oldBay["xSize"] = parseInt(oldBay["xSize"]);
        oldBay["ySize"] = parseInt(oldBay["ySize"]);

        let res = await dbo.collection("bays").updateOne(pos, {"$set": newValues});

        if (bay.hasOwnProperty('xSize')) {
            if (bay["xSize"] < oldBay["xSize"]) {
                pos = {"bay": bay["bay"], "zone": bay["zone"], "xPos": {$gt: (bay["xSize"] - 1)}};
                await dbo.collection("food").remove(pos);
            }
        }

        if (bay.hasOwnProperty('ySize')) {
            if (bay["ySize"] < oldBay["ySize"]) {
                pos = {"bay": bay["bay"], "zone": bay["zone"], "yPos": {$gt: (bay["ySize"] - 1)}};
                await dbo.collection("food").remove(pos);
            }
        }

        let myobj = {};

        if (bay.hasOwnProperty('xSize')) {
            if (bay["xSize"] > oldBay["xSize"]) {
                for (let newX = oldBay["xSize"]; newX < bay["xSize"]; newX++) {
                    for (let y = 0; y < oldBay["ySize"]; y++) {
                        myobj = {
                            "zone": bay["zone"],
                            "bay": bay["bay"],
                            "tray": "",
                            "contents": "EMPTY",
                            "expiry": "",
                            "weight": 0,
                            "xPos": newX,
                            "yPos": y
                        }
                        await dbo.collection("food").insertOne(myobj);
                    }
                }
            }
        }

        if (bay.hasOwnProperty('ySize')) {
            if (bay["ySize"] > oldBay["ySize"]) {
                for (let newY = oldBay["ySize"]; newY < bay["ySize"]; newY++) {
                    for (let x = 0; x < bay["xSize"]; x++) {
                        myobj = {
                            "zone": bay["zone"],
                            "bay": bay["bay"],
                            "tray": "",
                            "contents": "EMPTY",
                            "expiry": "",
                            "weight": 0,
                            "xPos": x,
                            "yPos": newY
                        }
                        await dbo.collection("food").insertOne(myobj);
                    }
                }
            }
        }

    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }
    return "SUCCESS";
}

// called by mongoUpdate to build request to mongoDB to remove bay
async function removeBay(bay, dbo) {
    if (!(bay.hasOwnProperty('zone') && bay.hasOwnProperty('bay'))) {
        console.log("Malformed request");
        return "FAIL";
    }

    if (!(typeof (bay['bay']) == "string")) {
        console.log("Bay and zone identifiers must be strings.");
        return "FAIL";
    }

    let pos = {"zone": bay["zone"], "bay": bay["bay"]};

    try {
        let res = await dbo.collection("bays").remove(pos);
        if (!(res['result']['n'] == 1)) return "FAIL";
        await dbo.collection("food").remove(pos);

        pos = {"zone": bay["zone"]};
        let toPull = {"bay": bay["bay"]}

        await dbo.collection("zones").updateOne(pos, {"$pull": {bays: bay["bay"]}});

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

    if (!(typeof (tray['zone']) === "string" && typeof (tray['bay']) === "string" && typeof (tray['tray']) === "string" && typeof (tray['contents']) === "string")) {
        console.log("Zone, bay, tray, contents and expiry must be strings!");
        return "FAIL";
    }

    if (!(Number.isInteger(tray['weight']))) {
        console.log("Weight must be an integer!");
        return "FAIL";
    }

    if (!(Number.isInteger(tray['xPos']) && Number.isInteger(tray['yPos']))) {
        console.log("Position attributes must be integers");
        return "FAIL";
    }

    if (tray['xPos'] < 0 || tray['yPos'] < 0) {
        console.log("Position must be within the valid range! (Positive Integer)");
        return "FAIL";
    }

    var pos = {
        "zone": tray["zone"],
        "bay": tray["bay"],
        "tray": tray["tray"],
        "contents": tray["contents"],
        "weight": tray["weight"],
        "expiry": tray["expiry"],
        "xPos": tray["xPos"],
        "yPos": tray["yPos"]
    };

    try {
        let res = await dbo.collection("food").updateOne(pos, {"$set": tray}, {"upsert": true});
        if (!(res['upsertedCount'] == 1)) return "FAIL";
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }
    return "SUCCESS"
}

// called by mongoUpdate to build request to mongoDB to edit tray
async function editTray(tray, dbo) {
    if (!(tray.hasOwnProperty('zone') && tray.hasOwnProperty('bay') && tray.hasOwnProperty('tray'))) {
        console.log("Malformed request!");
        return "FAIL";
    }

    if (!(typeof (tray['zone']) === "string" && typeof (tray['bay']) === "string" && typeof (tray['tray']) === "string")) {
        console.log("Zone, bay, tray must be strings!");
        return "FAIL";
    }

    let newValues = {}

    if (tray.hasOwnProperty('weight')) {
        if (!(Number.isInteger(tray['weight']))) {
            console.log("Weight must be an integer!");
            return "FAIL";
        }
        newValues["weight"] = tray['weight']
    }

    if (tray.hasOwnProperty('expiry')) {
        if (!(typeof (tray['expiry']) === "string")) {
            console.log("Expiry must be a string!");
            return "FAIL";
        }
        newValues["expiry"] = tray['expiry']
    }

    if (tray.hasOwnProperty('contents')) {
        if (!(typeof (tray['contents']) === "string")) {
            console.log("Contents must be a string!");
            return "FAIL";
        }
        newValues["contents"] = tray['contents']
    }

    if (tray.hasOwnProperty('weight')) {
        if (!(Number.isInteger(tray['weight']))) {
            console.log("Weight must be an integer!");
            return "FAIL";
        }
        newValues["weight"] = tray['weight']
    }

    let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};

    try {
        let res = await dbo.collection("food").updateOne(pos, {"$set": newValues});
        if (!(res['modifiedCount'] == 1)) return "FAIL";
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

    if (!(typeof (tray['zone']) === "string" && typeof (tray['bay']) === "string" && typeof (tray['tray']) === "string")) {
        console.log("Position attributes must be strings!");
        return "FAIL";
    }

    let pos = {"zone": tray["zone"], "bay": tray["bay"], "tray": tray["tray"]};
    try {
        let res = await dbo.collection("food").remove(pos);
        if (!(res['result']['n'] == 1)) return "FAIL";
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

    if (!(typeof (first['zone']) === "string" && typeof (first['bay']) === "string" && typeof (first['tray']) === "string")) {
        console.log("(First Tray) Position attributes must be strings!");
        return "FAIL";
    }

    if (!(typeof (second['zone']) === "string" && typeof (second['bay']) === "string" && typeof (second['tray']) === "string")) {
        console.log("(Second Tray) Position attributes must be strings!");
        return "FAIL";
    }

    try {
        let trayA = dbo.collection("food").findOne(first);
        let trayB = dbo.collection("food").findOne(second);

        let trayAJSON = {"zone": trayA["zone"], "bay": trayA["bay"], "tray": trayA["tray"], "contents": trayB["contents"], "weight": trayB["weight"], "expiry": trayB["expiry"], "xPos": trayB["xPos"], "yPos": trayB["yPos"]};
        let trayBJSON = {"zone": trayB["zone"], "bay": trayB["bay"], "tray": trayB["tray"], "contents": trayA["contents"], "weight": trayA["weight"], "expiry": trayA["expiry"], "xPos": trayA["xPos"], "yPos": trayA["yPos"]};
    } catch (e) {
        console.log(e);
        return "FAIL";
    }

    try {
        let res = dbo.collection("food").replaceOne(trayA, {$set: trayAJSON});
        if (!(res['result']['n'] == 1)) return "FAIL";
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

    if (!(typeof (bay['zone']) === "string" && typeof (bay['bay']) === "string")) {
        console.log("Position attributes must be strings!");
        return "FAIL";
    }

    // bay is json object containing zone and bay identifier. No need to specify tray
    let pos = {"zone": bay["zone"], "bay": bay["bay"]};

    let trays = await dbo.collection("food").find(pos).toArray();
    // console.log(trays);
    return trays;
}

async function getBaysInZone(zone, dbo) {
    if (!(zone.hasOwnProperty('zone'))) {
        console.log("Malformed request!");
        return "FAIL";
    }

    if (!(typeof (zone['zone']) === "string")) {
        console.log("Zone name must be a string");
        return "FAIL";
    }

    let pos = {"zone": zone["zone"]};

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

    if (!(typeof (posStart['zone']) === "string" && typeof (posStart['bay']) === "string" && typeof (posStart['tray']) === "string")) {
        console.log("(Start Tray) Position attributes must be strings!");
        return "FAIL";
    }

    if (!(typeof (posTarget['zone']) === "string" && typeof (posTarget['bay']) === "string" && typeof (posTarget['tray']) === "string")) {
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
        await dbo.collection("food").updateOne(posStart, {$set: posTarget}, function (err, res) {
            if (err) throw err;
            if (!(res['modifiedCount'] == 1)) throw "No Document was modified";
        });
    } catch (ex) {
        console.log(ex);
        return "FAIL";
    }
    return "SUCCESS"
}

async function getReports( dbo) {
  const zones = await dbo.collection("PublishedReports").find({}).toArray();
  return zones;
}

async function publishReport(report, dbo) {

  try {
    let res = await dbo.collection("PublishedReports").insertOne(report);
    if (!(res['insertedCount'] == 1)) return "FAIL";
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
            case "addTray":
                code = await addTray(body, dbo);
                break;
            case "getReports" :
                code = await getReports(dbo);
                break;
            case "publishReport" :
                code = await publishReport(body, dbo);
                break;
            case "editTray" :
                code = await editTray(body, dbo);
                break;
            case "removeTray":
                code = await removeTray(body, dbo);
                break;
            case "switchTray":
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
                code = await addZone(body, dbo);
                break;
            case "editZone":
                code = await editZone(body, dbo);
                break;
            case "removeZone":
                code = await removeZone(body, dbo);
                break;
            case "addBay":
                code = await addBay(body, dbo);
                break;
            case "editBay":
                code = await editBay(body, dbo);
                break;
            case "removeBay":
                code = await removeBay(body, dbo);
                break;
            case "getAllCategory":
                code = await getAllCategory(body, dbo);
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
router.get('/getZones', async function (req, res, next) {
    let zone_array = await mongoUpdate(req.body, "getZones")
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

router.post('/addTray', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "addTray");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
});

router.post('/editTray', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "editTray");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
});

router.post('/removeTray', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "removeTray");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
});

// Route to add bay.
router.post('/addBay', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "addBay");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
});

// Route to edit bay
router.post('/editBay', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "editBay");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
});

// Route to remove bay
router.post('/removeBay', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "removeBay");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
});

router.post('/getTraysInBay', async function (req, res, next) {
    let _trays = await mongoUpdate(req.body, "getTraysInBay");
    res.setHeader('Content-Type', 'application/json');
    if (_trays === "FAIL") {
        res.sendStatus(400);
    }
    res.status(200).send({trays: _trays});
});

router.post('/getBaysInZone', async function (req, res, next) {
    let _bays = await mongoUpdate(req.body, "getBaysInZone");
    res.setHeader('Content-Type', 'application/json');
    if (_bays === "FAIL") {
        res.sendStatus(400);
    }
    res.status(200).send({bays: _bays});
});

router.post('/moveTray', async function (req, res, next) {
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

router.post('/getAllCategory', async function (req, res, next) {
    let trays = await mongoUpdate(req.body, "getAllCategory");
    res.setHeader('Content-Type', 'application/json');
    if (trays === "FAIL") {
        res.sendStatus(400);
    }
    res.status(200).send({'trays': trays});
})

router.post('/nextExpiring', async function (req, res, next) {
    let trays = await mongoUpdate(req.body, "nextExpiring");
    res.setHeader('Content-Type', 'application/json');
    if (trays === "FAIL") {
        res.sendStatus(400);
    }
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

router.post('/editZone', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "editZone");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
})

router.post('/removeZone', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "removeZone");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
})

router.post('/publishReport', async function (req, res, next) {
    let code = await mongoUpdate(req.body, "publishReport");
    if (code !== "SUCCESS") {
        res.sendStatus(400);
    } else {
        res.sendStatus(200);
    }
})

router.post('/getReports', async function (req, res, next) {
  let reports_array = await mongoUpdate(req.body, "getReports")
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send({reports: reports_array});
})

module.exports = router;
