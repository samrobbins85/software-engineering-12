import React, {Component} from 'react';

class Designer extends Component {
	render() {
		return (
			<div>
				<h1>Designer</h1>
					<li>We will have a list of zones, that will collapse into an accordion component (search grommet accordion to see what i mean)</li>
					<li>further accordions will expand to show the bays, each bay will have a gear icon</li>
					<li>the gear icon will yield a pop out (not sure which react framework will support this.)</li>
					<li>the pop out will allow user to increase the dimensions of the bay or decrease them if no bays will be lost.</li>
					<li>the popout we see here will be the same component visible in the gear icon in the stocktake component.</li>

			</div>
		);
	}
}

export default Designer;