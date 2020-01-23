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

// API call to swap two trays
/*
	Inputs:
		start: JSON Object containing first tray position
		target: JSON Object containing target position
*/
export function swapTray(start, target) {

	fetch(STOCK_API_URL + "moveTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({posStart: start, posTarget: target})
	});
}

export function addZone() {

}

export function addBay() {

}

export function editTray() {

}

export function editBay() {

}

export function editZone() {

}
