import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';

class ViewPatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        await this.loadBlockchainData();
    }

    constructor(props) {
        super(props);
        this.state = {
            patient: '',
            patientAddress: '',

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

    async getPatientFromBlockchain(accountAddress) {
        if (this.state.networkData) {
            const patientBlockchainRecord = await this.state.contract.methods
                .getPatient(accountAddress)
                .call();
            return patientBlockchainRecord;
        }
    }

    handleInputChange = (event) => {
        event.preventDefault();

        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    onSubmit = async (event) => {
        event.preventDefault();
        let patientArray = [];

        this.state.patient = await this.getPatientFromBlockchain(
            this.state.patientAddress,
        );

        console.log(this.state.patient[4]);
        // 0xd1879bfdb41a3573d0e454c41f5d8d39c8ed794a;
        // QmaNbF1Doyb7WEgeRRYqWi5cYzRN76ZH4a4Gg24fxHCWKW;
        const result = await fetch(
            `https://ipfs.infura.io/ipfs/${this.state.patient[4]}`,
        );

        this.state.patient = await result.json();

        this.renderPatient(this.state.patient);
    };

    renderPatient(patient) {
        console.log(patient);
        return (
            <tr>
                <td>{patient.patientAddress}</td>
                <td>{patient.patientName}</td>
                <td>{patient.patientEmail}</td>
            </tr>
        );
    }
    render() {
        return (
            <div className="container-fluid mt-5">
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Please eneter patient Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="patientAddress"
                            onChange={this.handleInputChange}
                            placeholder="Enter patient address"
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </Table>
            </div>
        );
    }
}

export default ViewPatient;
