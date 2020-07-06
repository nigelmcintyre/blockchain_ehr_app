// import React, { Component } from 'react';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import IpfsClient from 'ipfs-http-client';
// import Web3 from 'web3';

// const ipfs = IpfsClient({
//     host: 'ipfs.infura.io',
//     port: 5001,
//     protocol: 'https',
// });

// class AddDoctor extends Component {
//     async componentWillMount() {
//         await this.loadWeb3();
//     }
//     constructor(props) {
//         super(props);
//         this.state = {
//             doctorName: '',
//             doctorEmail: '',
//             password: '',
//             displayName: '',
//         };
//     }

//     async loadWeb3() {
//         if (window.ethereum) {
//             window.web3 = new Web3(window.ethereum);
//             await window.ethereum.enable();
//         } else if (window.web3) {
//             window.web3 = new Web3(window.web3.currentProvider);
//         } else {
//             window.alert('Please use metamask');
//         }
//     }

//     handleInputChange = (event) => {
//         event.preventDefault();

//         this.setState({
//             [event.target.name]: event.target.value,
//         });
//     };
//     // https://ipfs.infura.io/ipfs/QmWRyEzzHEf4sRbUniSsoRKo59n25peXta8pSGYZrFqbu7
//     onSubmit = async (event) => {
//         event.preventDefault();
//         let file = '';
//         let patientData = '';
//         console.log('submitting file to IPFS');
//         const data = JSON.stringify({
//             patientName: this.state.patientName,
//             patientEmail: this.state.patientEmail,
//             password: this.state.password,
//         });
//         for await (file of ipfs.add(data)) {
//             patientData = file.path;
//             console.log('Patient uploaded to IPFS');
//             console.log(patientData);
//         }
//         console.log(patientData);
//         const patient = await fetch(
//             `https://ipfs.infura.io/ipfs/${patientData}`,
//         ).then((res) => res.json());
//         await console.log(patient);
//         this.setState({
//             displayName: patient.patientName,
//             patientEmail: patient.patientEmail,
//         });
//     };

//     componentDidMount = async () => {};
//     render() {
//         return (
//             <div>
//                 <div className="container-fluid mt-5">
//                     <main role="main" className="col-lg-12 d-flex text-center">
//                         <div className="content mr-auto ml-auto">
//                             <Form onSubmit={this.onSubmit}>
//                                 <Form.Group controlId="patientName">
//                                     <Form.Label>Patient Name</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         name="patientName"
//                                         //value={patientName}
//                                         onChange={this.handleInputChange}
//                                         placeholder="Enter patient's name"
//                                     />
//                                 </Form.Group>

//                                 <Form.Group controlId="patientEmail">
//                                     <Form.Label>
//                                         Patient email address
//                                     </Form.Label>
//                                     <Form.Control
//                                         type="email"
//                                         name="patientEmail"
//                                         //value={patientEmail}
//                                         onChange={this.handleInputChange}
//                                         placeholder="Enter patient's email"
//                                     />
//                                 </Form.Group>

//                                 <Form.Group controlId="password">
//                                     <Form.Label>Password</Form.Label>
//                                     <Form.Control
//                                         type="password"
//                                         name="password"
//                                         onChange={this.handleInputChange}
//                                         placeholder="Password"
//                                     />
//                                 </Form.Group>
//                                 <Form.Group controlId="formBasicCheckbox">
//                                     <Form.Check
//                                         type="checkbox"
//                                         label="Check me out"
//                                     />
//                                 </Form.Group>
//                                 <Button variant="primary" type="submit">
//                                     Submit
//                                 </Button>
//                             </Form>
//                             <p>Patient {this.state.displayName} added</p>
//                         </div>
//                     </main>
//                 </div>
//             </div>
//         );
//     }
// }

// export default AddPatient;
