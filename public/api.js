const STOCK_API_URL = "/stockTake/"

// REMEMBER: When calling async function you must add await before

// TODO: Parameter checking in functions. EG. all attributes, etc.

// API call to add many trays
/*
 * Inputs:
 *  trays: Array of Tray JSON Objects
 * Returns:
 *  Code: Either "OK" or "FAIL"
 *
*/ 
async function addTrayMany(trays) {
  let res = await fetch(STOCK_API_URL + "addTrayMany", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trays)
  })

  if (res.ok) {
    return "OK";
  }
  return "FAIL";

}

// API call to edit many trays
/*
 * Inputs:
 *  trays: Array of Tray JSON Objects
 * Returns:
 *  Code: Either "OK" or "FAIL"
 *
*/ 
async function editTrayMany(trays) {
  let res = await fetch(STOCK_API_URL + "editTrayMany", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trays)
  })

  if (res.ok) {
    return "OK";
  }
  return "FAIL";
  
}

// API call to remove many trays
/*
 * Inputs:
 *  trayPositions: Array of JSON Objects containing fields zone, bay and tray
 * Returns:
 *  Code: Either "OK" or "FAIL"
 *
*/ 
async function removeTrayMany(trayPositions) {
  let res = await fetch(STOCK_API_URL + "removeTrayMany", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(trayPositions)
  })

  if (res.ok) {
    return "OK";
  }
  return "FAIL";
}

// API call to get all trays in a certain category
/*
 * Inputs:
 *  contents: Find trays containing this item
 * Returns:
 *  List of tray objects that matched the condition
*/  
async function getAllCategory(contents) {
  let res = await fetch(STOCK_API_URL + "getAllCategory", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'contents': contents})
  })
    .then(res => res.json());
  return res;
}

// API call to get the next N expiring trays
/*
 * Inputs:
 *  n: Number of trays to get
 *  contents: Optional, get next n with these contents
 * Returns:
 *  List of tray objects that matched conditions
*/

async function getNextNExpiring(n, contents=false) {
  let res = await fetch(STOCK_API_URL + "nextExpiring", {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: contents ? JSON.stringify({'n': n, 'contents': contents}) : JSON.stringify({'n': n})
  })
    .then(res => res.json());
  return res;
}


// API call to add tray
/*
	Inputs:
		tray: JSON Object of tray and all attributes
	Returns:
		code: Either "OK" or "FAIL" ("OK" on 2XX response code)
*/
async function addTray(tray) {
    let res = await fetch(STOCK_API_URL + "addTray", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tray)
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

// API call to remove tray
/*
	Inputs:
		pos: JSON Object containing target zone, bay and tray
	Returns:
		code: Either "OK" or "FAIL" ("OK" on 2XX response code)
*/
async function removeTray(pos) {
    let res = await fetch(STOCK_API_URL + "removeTray", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pos)
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

// API call to get all trays in the bay
/*
	Inputs:
		pos: JSON Object containing target zone, bay
	pos = {
	"zone":relevant zone,
	"bay":revenat bay,	
	}
*/
async function getTraysInBay(pos) {
    let res = await fetch(STOCK_API_URL + "getTraysInBay", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pos)
    })
        .then(res => res.json());
    return res;
}

// API call to get all bays in the zone
/*
	Inputs:
		pos: JSON Object containing target zone
*/
async function getBaysInZone(zone) {

    let res = await fetch(STOCK_API_URL + "getBaysInZone", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
      body: JSON.stringify({"zone":zone})
    })
    .then(res => res.json());
  return res
}

// API call to move a tray
/*
	Inputs:
		start: JSON Object containing start position
		target: JSON Object containing target position
	Returns:
		code: Either "OK" or "FAIL" ("OK" on 2XX response code)
*/
async function moveTray(start, target) {
		let res = await fetch(STOCK_API_URL + "moveTray", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({posStart: start, posTarget: target})
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

// API call to swap two trays
/*
	Inputs:
		first: JSON Object containing first tray position
		second: JSON Object containing second tray position
*/
async function switchTray(firstTray, secondTray) {

    const response = await fetch(STOCK_API_URL + "switchTray", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            first: firstTray,
            second: secondTray
        })
    });

    if (response.ok) {
        console.log("All good in the neighbourhood");
    } else {
        alert(`There was an error code: ${response.status}, ${response.statusText}`);
    }
}

// API call to add a new zone
/*
	Inputs:
		zone: JSON Object containing name, height and width
	Returns:
		code: Either "OK" or "FAIL" ("OK" on 2XX response code)
*/
async function addZone(zone) {
    let res = await fetch(STOCK_API_URL + "addZone", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(zone)
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

// API call to add a new bay
/*
	Inputs:
		bay: Bay Object
  Returns:
    code: as usual
*/
async function addBay(bay) {
    let res = await fetch(STOCK_API_URL + "addBay", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bay)
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

// API call to edit an exisiting tray
/*
	Inputs:
		tray: A JSON Object representing a tray. Position must match existing tray
	Returns:
		code: Either "OK" or "FAIL" ("OK" on 2XX response code)
*/
async function editTray(tray) {
    let res = await fetch(STOCK_API_URL + "editTray", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tray)
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

// API call to edit an existing bay
/*
	Inputs:
		
*/
async function editBay(bay) {
    let res = await fetch(STOCK_API_URL + "editBay", {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bay)
    });

    if (res.ok) {
        return "OK";
    }
    return "FAIL";
}

async function removeBay(bay) {
  let res = await fetch(STOCK_API_URL + "removeBay", {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(bay)
  });

  if (res.ok) {
      return "OK";
  }
  return "FAIL";

}

// API call to edit an exisiting zone
/*
	Inputs:
		
*/
async function editZone(zone) {
  let res = await fetch(STOCK_API_URL + "editZone", {
      method: 'POST',
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(zone)
  });

  if (res.ok) {
      return "OK";
  }
  return "FAIL";
}

// API call to get all zones
/*
	Inputs:
		None
	Outputs:
		zones: array of zone objects
*/
async function getZones() {
    let res = await fetch(STOCK_API_URL + "getZones", {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json());
    return res;
}

