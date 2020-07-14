import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';
import { get_address, set_address } from '../actions';
import { connect } from 'react-redux';
import store from '../index';

class UpdatePatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        await this.loadBlockchainData();
        await this.populateFields();
    }

    constructor(props) {
        super(props);
        this.state = {
            patient: '',
            patientAddress: '',
            patientName: '',
            patientEmail: '',
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

    async populateFields() {
        const patient = await store.getState();
        this.setState({
            patientName: patient.patientAddressReducer.patientName,
            patientEmail: patient.patientAddressReducer.patientEmail,
        });
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

    async onSubmit(event) {
        // event.preventDefault();
        // const patient = await store.getState();
        // console.log(patient.patientAddressReducer.patientName);
        // console.log(this.state.patientName);
        // console.log(patient.patientAddressReducer.patientEmail);
        // console.log(this.state.patientEmail);
        // console.log(patient.patientAddressReducer.patientAddress);
        // console.log(patient.patientAddressReducer.patientPassword);
        // if (
        //     this.props.patientAddress.patientName != this.state.patientName ||
        //     this.props.patientAddress.patientEmail != this.state.patientEmail
        // ) {
        // await this.state.contract.methods.UpdatePatient(
        //     this.props.patientAddress.patientAddress,
        //     this.state.patientName,
        //     this.state.patientEmail,
        //     this.props.patientAddress.password,
        // );
        // }
    }

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
                                    <p>
                                        {
                                            this.props.patientAddress
                                                .patientAddress
                                        }
                                    </p>
                                </Form.Group>

                                <Form.Group controlId="patientName">
                                    <Form.Label>Patient Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="patientName"
                                        //value={patientName}
                                        onChange={this.handleInputChange}
                                        placeholder={this.state.patientName}
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
                                        placeholder={this.state.patientEmail}
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

const mapStateToProps = (state) => {
    return {
        patientAddress: state.patientAddressReducer,
    };
};

const mapDispatchToProps = () => {
    return { set_address, get_address };
};
export default connect(mapStateToProps, mapDispatchToProps())(UpdatePatient);
