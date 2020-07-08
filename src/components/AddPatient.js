import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';

class AddPatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        //await this.loadBlockchainData();
    }
    constructor(props) {
        super(props);
        this.state = {
            patientAddress: '',
            patientName: '',
            patientEmail: '',
            password: '',
            displayName: '',
            account: null,
            contract: null,
            web3: null,
        };
    }
    // Extract function to it's own file
    // async loadWeb3() {
    //     if (window.ethereum) {
    //         window.web3 = new Web3(window.ethereum);
    //         await window.ethereum.enable();
    //     } else if (window.web3) {
    //         window.web3 = new Web3(window.web3.currentProvider);
    //     } else {
    //         window.alert('Please use metamask');
    //     }
    // }
    // Extract function to it's onw file
    async addPatientToBlockchain(account, name, email, password, hash) {
        // Setting up connection to blockchain
        const web3 = window.web3;
        this.setState({ account: account });
        const networkId = await web3.eth.net.getId();
        const networkData = Ehr.networks[networkId];
        let accounts = [];
        await web3.eth.getAccounts().then((_accounts) => {
            accounts = _accounts;
        });

        // If blockchin connection is successful
        if (networkData) {
            // Connect to smart contract
            const contract = web3.eth.Contract(Ehr.abi, networkData.address);
            this.setState({ contract });

            const patientDetails = await contract.methods
                .getPatient(account)
                .call();
            if (patientDetails[0].includes('0x00000000000000000')) {
                const newPatient = await contract.methods
                    .newPatient(account, name, email, password, hash)
                    .send({ from: accounts[0] });
                console.log('Patient added to the blockchain');
                this.setState({ displayName: name });
            } else {
                this.setState({ displayName: 'already' });
            }
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
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
        let patientResult = '';
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

        const result = await fetch(
            `https://ipfs.infura.io/ipfs/${patientHash}`,
        );

        const patient = await result.json();
        const addedPatient = await this.addPatientToBlockchain(
            patient.patientAddress,
            patient.patientName,
            patient.patientEmail,
            patient.password,
            patientHash,
        );
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
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        onChange={this.handleInputChange}
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBasicCheckbox">
                                    <Form.Check
                                        type="checkbox"
                                        label="Check me out"
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                            <p>Patient {this.state.displayName} added</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default AddPatient;
