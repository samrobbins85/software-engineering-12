export const STOCK_API_URL = "/stockTake/"

// TODO: Parameter checking in functions. EG. all attributes, etc.

// API call to add tray
/*
	Inputs:
		tray: JSON Object of tray and all attributes
*/
export function addTray(tray) {
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
export function removeTray(pos) {
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
export function getTraysInBay(pos) {

	fetch(STOCK_API_URL + "getBay", {
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
export function getBaysInZone(pos) {
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
export function moveTray(start, target) {

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
export function swapTray(firstTray, secondTray) {
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

// TODO: Implement this call
// API call to add a new zone
/*
	Inputs:
		
*/
export function addZone() {
	console.log("This call has not been implemented yet!");
	return;
}

// TODO: Implement this call
// API call to add a new bay
/*
	Inputs:
		
*/
export function addBay() {
	console.log("This call has not been implemented yet!");
	return;
}

// API call to edit an exisiting tray
/*
	Inputs:
		tray: A JSON Object representing a tray. Position must match existing tray
*/
export function editTray(tray) {
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
export function editBay() {
	console.log("This call has not been implemented yet!");
	return;
}

// TODO: Implement this call
// API call to edit an exisiting zone
/*
	Inputs:
		
*/
export function editZone() {
	console.log("This call has not been implemented yet!");
	return;
}
