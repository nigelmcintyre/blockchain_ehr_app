import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';
import { get_address, set_address } from '../actions';
import { connect } from 'react-redux';
import store from '../index';
import { loadBlockchainData } from '../BlockchainAccess.js';

class UpdatePatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        this.state.blockchainData = await loadBlockchainData();
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
        await this.state.blockchainData.contract.methods
            .updatePatient(
                this.props.patientAddress.patientAddress,
                this.state.patientName,
                this.state.patientEmail,
                this.state.password,
                patientHash,
            )
            .send({ from: this.state.blockchainData.accounts[0] })
            .on('confirmation', () => {
                window.alert('Patient record successfully updated');
                this.props.history.push('/viewPatient');
            })
            .on('error', (error) => {
                console.log(error);
                window.alert('Error updating patient record please try again');
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
