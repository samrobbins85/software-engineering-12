const STOCK_API_URL = "/stockTake/"

// TODO: Parameter checking in functions. EG. all attributes, etc.
// TODO: Return values from fetch

// API call to add tray
/*
	Inputs:
		tray: JSON Object of tray and all attributes
*/
function addTray(tray) {
	fetch(STOCK_API_URL + "addTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(tray)
	});
}

// API call to remove tray
/*
	Inputs:
		pos: JSON Object containing target zone, bay and tray
*/
function removeTray(pos) {
	fetch(STOCK_API_URL + "removeTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(pos)
	});
}

// API call to get all trays in the bay
/*
	Inputs:
		pos: JSON Object containing target zone, bay
*/
function getTraysInBay(pos) {

	fetch(STOCK_API_URL + "getTraysInBay", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(pos)
	});
}

// TODO: Implement this endpoint
// API call to get all bays in the zone
/*
	Inputs:
		pos: JSON Object containing target zone
*/
function getBaysInZone(pos) {
	console.log("Endpoint getBays not implemented yet!");
	return;

	fetch(STOCK_API_URL + "getZone", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify()
	});
}

// API call to move a tray
/*
	Inputs:
		start: JSON Object containing start position
		target: JSON Object containing target position
*/
function moveTray(start, target) {

	fetch(STOCK_API_URL + "moveTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({posStart: start, posTarget: target})
	});
}

// TODO: Implement this end point
// API call to swap two trays
/*
	Inputs:
		first: JSON Object containing first tray position
		second: JSON Object containing second tray position
*/
function swapTray(firstTray, secondTray) {
	console.log("Endpoint switchTray not implemented yet!");
	return;

	fetch(STOCK_API_URL + "switchTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({first: firstTray, second: secondTray})
	});
}

// API call to add a new zone
/*
	Inputs:
		zone: JSON Object containing name, height and width
*/
function addZone(zone) {
	fetch(STOCK_API_URL + "addZone", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(zone)
	});
}

// TODO: Implement this call
// API call to add a new bay
/*
	Inputs:
		
*/
function addBay() {
	console.log("This call has not been implemented yet!");
	return;
}

// API call to edit an exisiting tray
/*
	Inputs:
		tray: A JSON Object representing a tray. Position must match existing tray
*/
function editTray(tray) {
	fetch(STOCK_API_URL + "editTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(tray)
	});
}

// TODO: Implement this call
// API call to edit an existing bay
/*
	Inputs:
		
*/
function editBay() {
	console.log("This call has not been implemented yet!");
	return;
}

// TODO: Implement this call
// API call to edit an exisiting zone
/*
	Inputs:
		
*/
function editZone() {
	console.log("This call has not been implemented yet!");
	return;
}

// API call to get all zones
/*
	Inputs:
		None
*/
function getZones() {
	fetch(STOCK_API_URL + "getZones", {
		method: 'GET',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}