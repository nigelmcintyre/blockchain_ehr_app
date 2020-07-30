import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import LoadWeb3 from '../loadWeb3';
import { get_address, set_address } from '../actions';
import { connect } from 'react-redux';
import store from '../index';
import { loadBlockchainData } from '../BlockchainAccess.js';
import Web3 from 'web3';

class UpdatePatient extends Component {
    async componentWillMount() {
        const web3 = new Web3('http://127.0.0.1:7545');
        this.state.blockchainData = await loadBlockchainData(web3);
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

            blockchainData: {},
        };
    }

    async populateFields() {
        const patient = await store.getState();
        this.setState({
            patientName: patient.patientAddressReducer.patientName,
            patientEmail: patient.patientAddressReducer.patientEmail,
            password: patient.patientAddressReducer.password,
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

    onSubmit = async (event) => {
        event.preventDefault();
        let patientHash = '';
        let file = '';

        console.log('submitting file to IPFS');
        const data = JSON.stringify({
            patientAddress: this.props.patientAddress.patientAddress,
            patientName: this.state.patientName,
            patientEmail: this.state.patientEmail,
            password: this.state.password,
        });
        for await (file of ipfs.add(data)) {
            patientHash = file.path;
            console.log('Patient uploaded to IPFS');
        }

        // Getting Tx nonce value of transaction sender
        const nonce = await this.state.blockchainData.web3.eth.getTransactionCount(
            this.state.blockchainData.accounts[0],
        );

        // Contract method ABI
        const txBuilder = await this.state.blockchainData.contract.methods.newPatient(
            this.props.patientAddress.patientAddress,
            this.state.patientName,
            this.state.patientEmail,
            this.state.password,
            patientHash,
        );
        const encodedTx = txBuilder.encodeABI();

        const transactionObject = {
            nonce: nonce,
            from: this.state.blockchainData.accounts[0],
            to: '0x40c3fF782eAeAaA12BA7873e83095689d9F8a06C',
            gas: '300000',
            data: encodedTx,
        };

        this.state.blockchainData.web3.eth.accounts
            .signTransaction(
                transactionObject,
                '38134c48d5fcaf5f71777a054013d4d3579f78f6f2d3f48b7fbb539317ecada0',
            )
            .then((signedTx) => {
                const sentTx = this.state.blockchainData.web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction,
                );
                sentTx.on('confirmation', () => {
                    console.log(`Patient record updated on blockchain`);
                    window.alert(
                        `${this.state.patientName}'s record successfully updates`,
                    );
                    this.props.history.push('/viewPatient');
                });
                sentTx.on('error', (err) => {
                    console.log(err);
                    window.alert(
                        'Error sending signed transaction to blockchain.',
                    );
                });
            })
            .catch((err) => {
                console.log(err);
                window.alert('Error signing transaction.');
            });
    };

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
