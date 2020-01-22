function addtray() {
	fetch("/stockTake/addTray", {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
		body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a1234", contents: "Beans", weight:2, expiry: "Nov20"})
		}
	);
};

function addAnotherTray() {
	fetch("/stockTake/addTray", {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
		body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a6969", contents: "Soup", weight:8, expiry: "Feb20"})
		}
	);
};

function editTray() {
	fetch("/stockTake/editTray", {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a1234", contents: "3kg", expiry: "Nov20"})
		}
	);
};

function removeTray() {
	fetch("/stockTake/removeTray", {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a1337"})
		}
	);
};

function removeAnotherTray() {
	fetch("/stockTake/removeTray", {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a6969"})
		}
	);
};

function getBay() {
	fetch("/stockTake/getBay", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({zone: "Orange", bay: "orange23"})
	});
}

function moveTray() {
	fetch("/stockTake/moveTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			posStart: {
			zone: "Orange",
			bay: "orange23",
			tray: "a1234"
		},
			posTarget: {
			zone: "Orange",
			bay: "orange23",
			tray: "a1337"
		}})
	});
}

getBay();
moveTray();
getBay();
