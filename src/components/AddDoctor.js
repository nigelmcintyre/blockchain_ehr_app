import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Web3 from 'web3';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';

class AddDoctor extends Component {
    async componentWillMount() {
        await this.loadWeb3();
        //await this.loadBlockchainData();
    }
    constructor(props) {
        super(props);
        this.state = {
            doctorAddress: '',
            doctorName: '',
            doctorEmail: '',
            password: '',
            displayName: '',
            account: null,
            contract: null,
            web3: null,
        };
    }
    // Extract function to it's own file
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert('Please use metamask');
        }
    }
    // Extract function to it's onw file
    async addDoctorToBlockchain(account, name, email, password) {
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

            const doctorDetails = await contract.methods
                .getDoctor(account)
                .call();
            if (doctorDetails[0].includes('0x00000000000000000')) {
                const newDoctor = await contract.methods
                    .newDoctor(account, name, email, password)
                    .send({ from: accounts[0] })
                    .then(() => {
                        console.log('Doctor added to the blockchain');
                        this.setState({ displayName: name });
                    });
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
        let doctorHash = '';
        let doctorResult = '';

        // console.log('submitting file to IPFS');
        const data = JSON.stringify({});

        // for await (file of ipfs.add(data)) {
        //     doctorHash = file.path;
        //     console.log('Doctor uploaded to IPFS');
        // }

        // const result = await fetch(`https://ipfs.infura.io/ipfs/${doctorHash}`);

        // const doctor = await result.json();
        console.log(this.state.doctorAddress);
        const addedDoctor = await this.addDoctorToBlockchain(
            this.state.doctorAddress,
            this.state.doctorName,
            this.state.doctorEmail,
            this.state.password,
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
                                <Form.Group controlId="doctorAddress">
                                    <Form.Label>
                                        Doctor Account Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorAddress"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's address"
                                    />
                                </Form.Group>
                                <Form.Group controlId="doctorName">
                                    <Form.Label>Doctor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorName"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's name"
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
                            <p>Doctor {this.state.displayName} added</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default AddDoctor;
