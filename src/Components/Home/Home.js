import React, { Component } from 'react';
class Home extends Component {

	render() {
		return(
			<div>
				<h1>This is my home... i live here</h1>
				<li>
					here we will have a list of alerts (see https://react-bootstrap.github.io/components/alerts/)
					these will be generated daily on the server side if and when we get to this stage,
				</li>
				<li>the user will also see a list of orders for the upcoming delivery cycle</li>
				<li>There will also be a date shown in the rop left hand corner showing the date of the last stock take</li>
				<li>Lastly progress circle that will show the percentage of available tray spaces in the warehouse </li>
			</div>

		)
	}

}

export default Home;