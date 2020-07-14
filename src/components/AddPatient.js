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
            error: '',
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
                    console.log(error.data.message);
                    this.setState({ error: error.data.message });
                });
            return patientBlockchainRecord;
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }
    async addPatientToBlockchain(accountAddress, name, email, password, hash) {
        // If blockchin connection is successful
        if (this.state.networkData) {
            // Invoke smart contract addPatient function
            await this.state.contract.methods
                .newPatient(accountAddress, name, email, password, hash)
                .send({ from: this.state.accounts[0] })
                .on('confirmation', () => {
                    console.log('Patient added to the blockchain');
                    this.setState({
                        displayName: `Patient ${this.patientName}'s record successfully created`,
                    });
                    this.clearInput();
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
    // https://ipfs.infura.io/ipfs/QmWRyEzzHEf4sRbUniSsoRKo59n25peXta8pSGYZrFqbu7
    onSubmit = async (event) => {
        event.preventDefault();
        let file = '';
        let patientHash = '';
        if (this.state.patientAddress) {
            this.state.patient = await this.getPatientFromBlockchain(
                this.state.patientAddress,
            );

            if (this.state.error.includes('Patient does not exist')) {
                console.log('submitting file to IPFS');
                const data = JSON.stringify({
                    patientAddress: this.state.patientAddress,
                    patientName: this.state.patientName,
                    patientEmail: this.state.patientEmail,
                    password: this.state.password,
                });
                for await (file of ipfs.add(data)) {
                    patientHash = file.path;
                    console.log('Patient uploaded to IPFS');
                }

                await this.addPatientToBlockchain(
                    this.state.patientAddress,
                    this.state.patientName,
                    this.state.patientEmail,
                    this.state.password,
                    patientHash,
                );
            } else {
                window.alert(
                    "This address already belongs to a patient's record",
                );
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
