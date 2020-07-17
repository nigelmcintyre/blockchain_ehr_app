import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';

class AddPatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        await this.loadBlockchainData();
    }
    constructor(props) {
        super(props);
        this.state = {
            patient: '',
            patientAddress: '',
            patientName: '',
            patientEmail: '',
            password: '',
            displayName: '',

            accounts: [],
            contract: null,
            web3: null,
            networkData: null,
        };
    }

    async loadBlockchainData() {
        // Setting up connection to blockchain
        const web3 = window.web3;
        this.setState({ web3: web3 });

        // Getting blockchain network ID
        const networkId = await web3.eth.net.getId();

        // Getting the network where the contract is
        const networkData = Ehr.networks[networkId];
        this.setState({ networkData: networkData });
        if (networkData) {
            // Getting the account address of the current user
            await web3.eth.getAccounts().then((_accounts) => {
                this.setState({ accounts: _accounts });
            });
            const newAccount = await web3.eth.accounts.create();
            console.log(newAccount);

            // Getting the contract instance
            const contract = web3.eth.Contract(
                Ehr.abi,
                this.state.networkData.address,
            );
            this.setState({ contract });
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }

    async getPatientFromBlockchain(accountAddress) {
        if (this.state.networkData) {
            const patientBlockchainRecord = await this.state.contract.methods
                .getPatient(accountAddress)
                .call()
                .catch((error) => {
                    console.log(error);
                });
            return patientBlockchainRecord;
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }

    async getDoctorFromBlockchain(accountAddress) {
        if (this.state.networkData) {
            const doctorBlockchainRecord = await this.state.contract.methods
                .getDoctor(accountAddress)
                .call()
                .catch((error) => {
                    console.log(error);
                });
            return doctorBlockchainRecord;
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }
    async addPatientToBlockchain(accountAddress, name, email, password, hash) {
        if (this.state.networkData) {
            await this.state.contract.methods
                // Adding patient to blockchain
                .newPatient(accountAddress, name, email, password, hash)
                .send({ from: '0x9046F6D40ACCa1668Ac3047275a31252A6D1B711' })
                .on('confirmation', () => {
                    console.log('Patient added to the blockchain');
                    this.setState({
                        displayName: `Patient ${this.patientName}'s record successfully created`,
                    });
                    this.clearInput();
                })
                .on('error', (error) => {
                    console.log(error);
                    window.alert('Error adding patient record to bloclchain.');
                });
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
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
            this.state.patient = await this.getPatientFromBlockchain(
                this.state.patientAddress,
            );
            // Checking if address belongs to doctor account
            const isDoctor = await this.getDoctorFromBlockchain(
                this.state.patientAddress,
            );
            // If address doesn't belong to an account
            if (!this.state.patient && !isDoctor) {
                console.log('submitting file to IPFS');

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
                // Adding patient record to blockchain
                await this.addPatientToBlockchain(
                    this.state.patientAddress,
                    this.state.patientName,
                    this.state.patientEmail,
                    this.state.password,
                    patientHash,
                );
            } else {
                window.alert('This address already belongs to an account');
                this.clearInput();
            }
        } else {
            window.alert('Please enter patient details');
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
