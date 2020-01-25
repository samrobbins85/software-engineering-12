import React, {Component} from 'react';
import {Badge, Card, CardDeck} from "react-bootstrap";
import TrayItem from "./trayItem";


class BayView extends Component {

	constructor(props) {
		super(props);
		this.x = [[{title:'Tinned Apples', expiry:'2020',weight:'2000kg'},{title:'Tinned Apples', expiry:'2021',weight:'2000kg'},{title:'Tinned Apples', expiry:'2020',weight:null}],[{title:'Tinned Apples', expiry:'2020',weight:'2000kg'},{title:'Tinned Apples', expiry:'2021',weight:'2000kg'},{title:'Tinned Apples', expiry:'2020',weight:null}],[{title:'Tinned Apples', expiry:'2020',weight:'2000kg'},{title:'Tinned Apples', expiry:'2020',weight:'2000kg'},{title:'Tinned Apples', expiry:'2021',weight:null}]];
		this.y = new Date();
		this.y = this.y.getYear();
	}


	render() {


		return (
			<div style={{background:'#f4f4f4',padding:'20px',borderRadius:'20px'}}>
				{this.x.map(z => {
					return <CardDeck>

						{z.map(i => {
							return <TrayItem i ={i} y ={this.y}/>

						})}
						</CardDeck>
				})}
			</div>
		);
	}
}

export default BayView;