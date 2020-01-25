import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Badge, Card} from "react-bootstrap";

class TrayItem extends Component {
	constructor(props) {
		super(props);
		console.log(props)

	}

	componentWillMount() {

	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	shouldComponentUpdate(nextProps, nextState) {

	}

	componentWillUpdate(nextProps, nextState) {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentWillUnmount() {

	}

	render() {
		return (

			<Card>

				<Card.Body>
					<Card.Title>{this.props.i.title}</Card.Title>
					<Card.Text>
						<div> <Badge variant="light"> Weight:{this.props.i.weight == null ? 'N/A':this.props.i.weight}</Badge></div>
						<div> <Badge variant={this.props.y<(this.props.i.expiry - 1900) ? "warning":"danger"}> Expires:{this.props.i.expiry}</Badge></div>

					</Card.Text>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">Last Counted: 1 week ago</small>
				</Card.Footer>
			</Card>

		);
	}
}

TrayItem.propTypes = {};

export default TrayItem;