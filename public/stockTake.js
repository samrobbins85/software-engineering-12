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
}

fetch("/stockTake/editTray", {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({zone: "Orange", bay: "orange23", tray: "a1234", contents: "3kg", expiry: "Nov20"})
	}
);



console.log("ooo JS is running");