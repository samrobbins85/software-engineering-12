import React, {Component} from 'react';
import { Alert , Badge, Toast,ProgressBar} from 'react-bootstrap';

let x = 5
class Account extends Component {
	constructor(props) {
		super(props);
		this.x = [1,2,3,4,5,6,7,8,9]
	}

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
					<ProgressBar now={60} />
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
							<div><div>
							<strong className="mr-auto">Bootstrap</strong>
								{/*<div><ProgressBar animated now={this.x.map(i=>{return i})} /></div>*/}
							</div>
							<small>just now</small>
								</div>
						</Toast.Header>
						<Toast.Body>See? Just like this.</Toast.Body>
					</Toast>
				</div>



			</div>
		);
	}
}

export default Account;