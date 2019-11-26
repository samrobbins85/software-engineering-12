function addtray() {
	fetch("/stockTake/addTray", {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a1234", contents: "2kg", expiry: "Nov20"})
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
			body: JSON.stringify({zone: "ABC", bay: "ABCD", tray: "AAAA", contents: "3kg", expiry: "Nov20"})
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
			body: JSON.stringify({zone: "Blue", bay: "Blue12", tray: "1234"})
		}
	);
};

addtray();
editTray();
removeTray();