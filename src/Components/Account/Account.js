import React, {Component} from 'react';
import { Alert , Badge, Toast,CardDeck,Card} from 'react-bootstrap';

let x = 5
class Account extends Component {
	render() {
		return (
			<div>
				<h1>
					This is where account settings would be, we can manage the user password, their email etc.
					basically features that our auth service allows can be managed directly here

					));
				</h1>

				<Alert  variant={'info'}>
					This is a alert—check it out! <Badge variant="secondary">{x}</Badge>
				</Alert>

				<div
					aria-live="polite"
					aria-atomic="true"
					style={{
						position: 'relative',
						minHeight: '100px',
					}}
				>
					<Toast
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
						}}
					>
						<Toast.Header>
							<img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
							<strong className="mr-auto">Bootstrap</strong>
							<small>just now</small>
						</Toast.Header>
						<Toast.Body>See? Just like this.</Toast.Body>
					</Toast>
				</div>



			</div>
		);
	}
}

export default Account;