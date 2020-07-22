import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import LoadWeb3 from '../loadWeb3';
import {
    loadBlockchainData,
    addPatientToBlockchain,
    getPatientFromBlockchain,
    getDoctorFromBlockchain,
} from '../BlockchainAccess.js';

class AddPatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        this.state.blockchainData = await loadBlockchainData();
    }
    constructor(props) {
        super(props);
        this.state = {
            patientAddress: '',
            patientName: '',
            patientEmail: '',
            password: '',
            displayName: '',

            blockchainData: {},
        };
    }
    clearInput() {
        this.setState({
            patientAddress: '',
            patientName: '',
            patientEmail: '',
            password: '',
        });
    }

    handleInputChange = (event) => {
        event.preventDefault();

        this.setState({
            [event.target.name]: event.target.value,
        });
    };
    onSubmit = async (event) => {
        event.preventDefault();
        let file = '';
        let patientHash = '';
        // If input field is not empty
        if (this.state.patientAddress) {
            // Checking if address belongs to a patient account
            const isPatient = await getPatientFromBlockchain(
                this.state.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );

            console.log(isPatient);
            // Checking if address belongs to doctor account
            const isDoctor = await getDoctorFromBlockchain(
                this.state.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
            console.log(isDoctor);

            // If address doesn't belong to an account
            if (!isPatient && !isDoctor) {
                console.log('submitting file to IPFS');
                let address = this.state.patientAddress;
                let name = this.state.patientName;
                let email = this.state.patientEmail;
                let password = this.state.password;

                const data = JSON.stringify({
                    patientAddress: this.state.patientAddress,
                    patientName: this.state.patientName,
                    patientEmail: this.state.patientEmail,
                    password: this.state.password,
                });
                // Adding patient record to IPFS
                for await (file of ipfs.add(data)) {
                    patientHash = file.path;
                    console.log('Patient uploaded to IPFS');
                }
                this.clearInput();
                // Adding patient record to blockchain
                await addPatientToBlockchain(
                    address,
                    name,
                    email,
                    password,
                    patientHash,
                    this.state.blockchainData.networkData,
                    this.state.blockchainData.contract,
                    this.state.blockchainData.accounts,
                );
            } else {
                window.alert('This address already belongs to an account');
                this.clearInput();
            }
        } else {
            window.alert('Please enter patient details');
            this.clearInput();
        }
        this.clearInput();
    };

    componentDidMount = async () => {};
    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group controlId="patientAddress">
                                    <Form.Label>
                                        Patient Account Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="patientAddress"
                                        //value={patientName}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patient's address"
                                        value={this.state.patientAddress}
                                    />
                                </Form.Group>
                                <Form.Group controlId="patientName">
                                    <Form.Label>Patient Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="patientName"
                                        //value={patientName}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patient's name"
                                        value={this.state.patientName}
                                    />
                                </Form.Group>

                                <Form.Group controlId="patientEmail">
                                    <Form.Label>
                                        Patient email address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="patientEmail"
                                        //value={patientEmail}
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patient's email"
                                        value={this.state.patientEmail}
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        onChange={this.handleInputChange}
                                        placeholder="Password"
                                        value={this.state.password}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                            <p>{this.state.displayName}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default AddPatient;
