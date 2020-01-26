import React, {Component} from 'react';
import {Alert, Col, Container, Jumbotron, Row, Table} from "react-bootstrap";
import {Accordion, AccordionPanel, Box, Select, Meter, Stack, Text, Grommet} from "grommet/es6";
import {DocumentExcel} from "grommet-icons";
import {grommet} from "grommet/themes";

class Reports extends Component {

	render() {
		return (
			<Container>
				<Row>
					<Col md={9}>
						<div>
							<li style={{color:'#ffffff'}}>there will be a list of alerts stating the order location, the date placed and a pdf button to download the order sheet (all rendered on the client side)</li>

							<Jumbotron >
								<Container>
									<h1>Reports</h1>
									<p>
										Here you will be able to download the stock take counts.
									</p>
								</Container>
							</Jumbotron>
							<Accordion>
								<AccordionPanel label="Zone A">
									<Alert  variant={'warning'} style={{alignContent:'left'}}>
										<Row>
											<Col>
												240 Trays
											</Col>

											2.3 T

										</Row>
									</Alert>
									<Accordion>

										<AccordionPanel label="Bay A1" pad={'medium'}  >
											<Alert  variant={'info'} style={{alignContent:'left'}}>
												<Row>
													<Col>
														12 Trays
													</Col>

													115 kg

												</Row>
											</Alert>
											<Box pad="large" background="light-2">
												<Text>4 Trays Pasta (6kg)</Text>
											</Box>
											<Box pad="large" background="light-2">
												<Text>3 Trays Biscuits (9kg)</Text>
											</Box>
											<Box pad="large" background="light-2">
												<Text>5 Trays Fruit Juice (100kg)</Text>
											</Box>
										</AccordionPanel>
										<AccordionPanel label="Bay A2" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay A3" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay A4" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay A5" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay B1" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay B2" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay B3" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay B4" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay B5" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay C1" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay C2" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay C3" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay C4" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay C5" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay D1" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay D2" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay D3" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay D4" pad={'medium'}></AccordionPanel>
										<AccordionPanel label="Bay D5" pad={'medium'}></AccordionPanel>


									</Accordion>

								</AccordionPanel>
								<AccordionPanel label="Zone B">
									<Box pad="medium" background="light-2">
										<Text>Two</Text>
									</Box>
								</AccordionPanel>
								<AccordionPanel label="Zone C">
									<Box pad="medium" background="light-2">
										<Text>One</Text>
									</Box>
								</AccordionPanel>
								<AccordionPanel label="Zone D">
									<Box pad="medium" background="light-2">
										<Text>One</Text>
									</Box>
								</AccordionPanel>
								<AccordionPanel label="Zone E">
									<Box pad="medium" background="light-2">
										<Text>One</Text>
									</Box>
								</AccordionPanel>
								<AccordionPanel label="Zone F">
									<Box pad="medium" background="light-2">
										<Text>One</Text>
									</Box>
								</AccordionPanel>

							</Accordion>

						</div>
					</Col>
					<Col md={3}>
						<li style={{color:'#ffffff'}}>Hello World </li>

						<li style={{color:'#ffffff'}}>Hello World </li>
						<Alert  variant={'success'} style={{alignContent:'left'}}>
							<Row>
								<Col>
									<DocumentExcel color = "#000066"/>
								</Col>

								Download Most recent stock take

							</Row>
						</Alert>
						<Alert  variant={'danger'} style={{alignContent:'left'}}>
							<Row>
								<Col>
									<DocumentExcel color = "#000066"/>
								</Col>

								Download Previous stock takes from
								<Select options={['3 Months', '6 Months', '12 Months','Historical']} value = '3 Months'/>

							</Row>
						</Alert>
						<Grommet theme={grommet}>
							<Box align="center" pad="large">
								<Stack anchor="center">
									<Meter
										type="circle"
										background="light-4"
										values={[{ value: 65 }]}
										size="small"
										thickness="medium"
									/>
									<Box direction="row" align="center" pad={{ bottom: "medium" }}>
										<Text size="xlarge" weight="bold">
											{65}
										</Text>
										<Text size="small">% </Text>
									</Box>
								</Stack>  <Text  weight="bold" size="small" style={{textAlign:'-webkit-center'}}> of Stock take completed </Text>
							</Box></Grommet>


					</Col>
					<Col>
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
						</Table>


					</Col>
				</Row>
			</Container>
		);
	}
}

export default Reports;