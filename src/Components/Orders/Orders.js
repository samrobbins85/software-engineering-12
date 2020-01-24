import React, {Component} from 'react';

class Orders extends Component {
	render() {
		return (
			<div>
				<h1> This is orders </h1>
				<li>there will be a list of alerts stating the order location, the date placed and a pdf button to download the order sheet (all rendered on the client side)</li>
				<li>there will be a pdf button that allows the user to download all placed orders for the current order cycle</li>
				<li>And a drop down icon to show the previous order cycles and view those ones instead in the same format.</li>

			</div>
		);
	}
}

export default Orders;