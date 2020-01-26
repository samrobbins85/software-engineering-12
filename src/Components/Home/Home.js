import React, { Component } from 'react';
import {Col, Row, Container, Alert,Table,Jumbotron} from "react-bootstrap";
import {Flag,MailOption,Deliver,Trash} from "grommet-icons";
import { Grommet, Box, Meter, Stack, Text,Calendar } from "grommet";
import { grommet } from "grommet/themes";

class Home extends Component {

	render() {
		return(
			<div>
				<h1></h1>

				<Jumbotron fluid>
					<Container>
						<h1>Dashboard</h1>
						<p>
							Find Useful tools and metrics at a glance, to help improve your workflow.
						</p>
					</Container>
				</Jumbotron>


				<div>
					<Container>
						<Row>
							<Col md={5}>
								<Alert  variant={'info'} style={{alignContent:'left'}}>
									<Row>
										<Col>
											<MailOption color = "#000066"/>
										</Col>

										Reports published 2 days ago

									</Row>
								</Alert>
								<Alert  variant={'success'}>
									<Row>
										<Col>
											<Deliver color = "#000066"/>
										</Col>

										100% of sites have placed their orders

									</Row>


								</Alert>
								<Alert  variant={'warning'}>
									<Row>
										<Col>
											<Flag color = "#000066"/>
										</Col>

										60 trays are expiring within 6 months

									</Row>


								</Alert>
								<Alert  variant={'danger'}>
									<Row>
										<Col>
											<Trash color = "#000066"/>
										</Col>

										10 Trays are expiring within 1 month

									</Row>

								</Alert>


							</Col>
							<Col md={{ span: 5, offset: 2 }}>
								<Grommet theme={grommet}>
								<h4> Next scheduled Stock Take:</h4>
								<h1> Thursday 30/01/2020 </h1>
								 <Box align="center" pad="large">
									<Stack anchor="center">
										<Meter
											type="circle"
											background="light-4"
											values={[{ value: 30 }]}
											size="small"
											thickness="medium"
										/>
										<Box direction="row" align="center" pad={{ bottom: "medium" }}>
											<Text size="xlarge" weight="bold">
												{30}
											</Text>
											<Text size="small">% </Text>
										</Box>
									</Stack>  <Text style = {{paddingTop:'20px'}} weight="bold" size="medium">Of shelf space is vacant. </Text>
								</Box></Grommet>
							</Col>
						</Row>
						<Row>


							<Col md={2}>
								<h6> Schedule Next Delivery date</h6>
								<Calendar
								size="small"
								date={(new Date()).toISOString()}
								onSelect={(date) => {}}
							/> </Col>
							<Col md={{ span: 2, offset: 1 }}>
								<h6> Schedule Next Stock Take</h6>
								<Calendar
									size="small"
									date={(new Date()).toISOString()}
									onSelect={(date) => {}}
								/> </Col>

							<Col md={{ span: 6, offset: 1 }}>
								<h2> Order Summary </h2>
								<Table responsive>
								<thead>
								<tr>
									<th>#</th>
									<th>Table heading</th>
									<th>Table heading</th>
									<th>Table heading</th>
									<th>Table heading</th>
									<th>Table heading</th>
									<th>Table heading</th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>1</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
								</tr>
								<tr>
									<td>2</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
								</tr>
								<tr>
									<td>3</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
									<td>Table cell</td>
								</tr>
								</tbody>
							</Table></Col>

					</Row>

					</Container>
				</div>
			</div>



		)
	}

}

export default Home;