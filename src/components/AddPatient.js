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

        // Getting the account address of the current user
        await web3.eth.getAccounts().then((_accounts) => {
            this.setState({ accounts: _accounts });
        });

        // Getting the contract instance
        const contract = this.state.web3.eth.Contract(
            Ehr.abi,
            this.state.networkData.address,
        );
        this.setState({ contract });
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
                    //window.location.reload(true);
                    this.setState({ displayName: `${name}'s record created` });
                });
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

        const patientDetails = await this.state.contract.methods
            .getPatient(this.state.patientAddress)
            .call();
        //if (patientDetails[0].includes('0x00000000000000000')) {
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
        console.log(patientHash);

        const addedPatient = await this.addPatientToBlockchain(
            this.state.patientAddress,
            this.state.patientName,
            this.state.patientEmail,
            this.state.password,
            patientHash,
        );
        // } else {
        //     this.setState({
        //         displayName: `${this.state.patientName}'s record already exists`,
        //     });
        // }
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
