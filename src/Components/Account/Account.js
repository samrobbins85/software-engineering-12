import React, {Component} from 'react';
// import { Alert , Badge, Toast,ProgressBar} from 'react-bootstrap';
import {  Box,   FormField,Form,grommet,Button, Grommet} from "grommet/es6";

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

				<Grommet full theme={grommet}>
					<Box fill align="center" justify="center">
						<Box width="medium">
							<Form
								validate="blur"
								onReset={event => console.log(event)}
								onSubmit={({ value }) => console.log("Submit", value)}
							>
								<FormField
									label="Name"
									name="name"
									required
									validate={[
										{ regexp: /^[a-z]/i },
										name => {
											if (name && name.length === 1) return "must be >1 character";
											return undefined;
										}
									]}
								/>
								<FormField label="Email" name="email" type="password" required />
								<Box direction="row" justify="between" margin={{ top: "medium" }}>
									<Button label="Cancel" />
									<Button type="reset" label="Reset" />
									<Button type="submit" label="Update" primary />
								</Box>
							</Form>
						</Box>
					</Box>
				</Grommet>
					{/*<Toast*/}
						{/*style={{*/}
							{/*position: 'absolute',*/}
							{/*top: 0,*/}
							{/*right: 0,*/}
						{/*}}*/}
					{/*>*/}
						{/*<Toast.Header>*/}
							{/*<img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />*/}
							{/*<div><div>*/}
							{/*<strong className="mr-auto">Bootstrap</strong>*/}
								{/*/!*<div><ProgressBar animated now={this.x.map(i=>{return i})} /></div>*!/*/}
							{/*</div>*/}
							{/*<small>just now</small>*/}
								{/*</div>*/}
						{/*</Toast.Header>*/}
						{/*<Toast.Body>See? Just like this.</Toast.Body>*/}
					{/*</Toast>*/}
				</div>



		);
	}
}

export default Account;