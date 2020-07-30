import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import LoadWeb3 from '../loadWeb3';
import {
    loadBlockchainData,
    addDoctorToBlockchain,
    getPatientFromBlockchain,
    getDoctorFromBlockchain,
} from '../BlockchainAccess.js';
import Web3 from 'web3';

class AddDoctor extends Component {
    async componentWillMount() {
        const web3 = new Web3('http://127.0.0.1:7545');
        this.state.blockchainData = await loadBlockchainData(web3);
    }
    constructor(props) {
        super(props);
        this.state = {
            doctorAddress: '',
            doctorName: '',
            doctorEmail: '',
            displayName: '',

            blockchainData: {},
        };
    }

    clearInput() {
        this.setState({
            doctorAddress: '',
            doctorName: '',
            doctorEmail: '',
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
        // Check that input field is not empty
        if (this.state.doctorAddress) {
            // Checking if address belongs to a patient account
            const isPatient = await getPatientFromBlockchain(
                this.state.doctorAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );

            // Checking if address belongs to doctor account
            const isDoctor = await getDoctorFromBlockchain(
                this.state.doctorAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
            if (!isPatient && !isDoctor) {
                let address = this.state.doctorAddress;
                let name = this.state.doctorName;
                let email = this.state.doctorEmail;
                this.clearInput();
                await addDoctorToBlockchain(
                    address,
                    name,
                    email,
                    this.state.blockchainData.web3,
                    this.state.blockchainData.networkData,
                    this.state.blockchainData.contract,
                    this.state.blockchainData.accounts,
                );
            } else {
                window.alert('This address already belongs to an account');
                this.clearInput();
            }
        } else {
            window.alert('Please enter doctor details');
            this.clearInput();
        }
    };

    componentDidMount = async () => {};
    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group controlId="doctorAddress">
                                    <Form.Label>
                                        Doctor Account Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorAddress"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's address"
                                        value={this.state.doctorAddress}
                                    />
                                </Form.Group>
                                <Form.Group controlId="doctorName">
                                    <Form.Label>Doctor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorName"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's name"
                                        value={this.state.doctorName}
                                    />
                                </Form.Group>

                                <Form.Group controlId="doctorEmail">
                                    <Form.Label>
                                        Doctor email address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="doctorEmail"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's email"
                                        value={this.state.doctorEmail}
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

export default AddDoctor;
