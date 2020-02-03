import React, {Component} from 'react';
import {Badge, Card} from "react-bootstrap";

class TrayItem extends Component {
	constructor(props) {
		super(props);
		this.state = {selected:false};
		this.handleClick = this.handleClick.bind(this);
	}


	componentWillMount() {

	}

	componentDidMount() {

	}

	componentWillReceiveProps(nextProps) {

	}

	shouldComponentUpdate(nextProps, nextState) {

		return true
	}

	componentWillUpdate(nextProps, nextState) {



	}

	componentDidUpdate(prevProps, prevState) {

	}

	componentWillUnmount() {

	}
	handleClick = ()=>{
		if (this.state.selected === false) {
			this.setState({selected : true});
		}else{
			this.setState({selected : false});
		}
		this.sendData()
		// this.onChange(this.state.selected);

	};

	sendData = () => {
		this.props.parentCallback({id:this.props.i.id,selected:!this.state.selected});
	};

	render() {

		return (
			<div style={this.state.selected === true ? {borderRadius:'10px',borderStyle: 'solid', borderColor:'#2196f3'}:{}}>
			<Card onClick={this.handleClick} >
				<Card.Body >
					<Card.Title>{this.props.i.title}</Card.Title>
					<Card.Text>
						<div> <Badge variant="light"> Weight:{this.props.i.weight == null ? 'N/A':this.props.i.weight}</Badge></div>
						<div> <Badge variant={this.props.y< ((parseInt(this.props.i.expiry.slice((this.props.i.expiry.length -4),this.props.i.expiry.length))) - 1900) ? (this.props.y< ((parseInt(this.props.i.expiry.slice((this.props.i.expiry.length -4),this.props.i.expiry.length))) - 1901)  ? "success":"warning"):"danger"}> Expires: {this.props.i.expiry}</Badge></div>

					</Card.Text>
				</Card.Body>
				<Card.Footer>
					<small className="text-muted">Last Counted: 1 week ago</small>
				</Card.Footer>
			</Card>
			</div>

		);
	}
}

TrayItem.propTypes = {};

export default TrayItem;