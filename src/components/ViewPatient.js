import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';
import { set_address, get_address } from '../actions';
import { connect } from 'react-redux';
import {
    loadBlockchainData,
    deletePatient,
    getPatientFromBlockchain,
    getDoctorFromBlockchain,
} from '../BlockchainAccess.js';

class ViewPatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        this.state.blockchainData = await loadBlockchainData();
    }

    constructor(props) {
        super(props);
        this.state = {
            patientAddress: '',
            patient: '',
            retrievedAddress: '',
            patientName: '',
            patientEmail: '',
            isPatient: false,
            deletePatientAddress: '',

            blockchainData: {},
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();

        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    updateClick = async (event) => {
        event.preventDefault();
        // Add patient address to redux state object
        if (this.state.patient) {
            this.props.set_address(this.state.patient);
            // Open update patient page
            this.props.history.push('/updatePatient');
        } else {
            window.alert('Please search for a patient');
        }
    };

    deleteClick = async (event) => {
        event.preventDefault();
        if (this.state.patientAddress) {
            // Checking if address belongs to a doctor account
            const isDoctor = await getDoctorFromBlockchain(
                this.state.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
            // If address doesnt belong to a doctor
            if (!isDoctor) {
                // Getting patient details from blockchain
                const isPatient = await getPatientFromBlockchain(
                    this.state.patientAddress,
                    this.state.blockchainData.networkData,
                    this.state.blockchainData.contract,
                    this.state.blockchainData.accounts,
                );
                // If patient exists
                if (isPatient) {
                    // Clear input
                    this.setState({ patientAddress: '' });
                    // Delete patient from blockchain
                    await deletePatient(
                        isPatient[0],
                        this.state.blockchainData.networkData,
                        this.state.blockchainData.contract,
                        this.state.blockchainData.accounts,
                    );
                } else {
                    this.setState({ patientAddress: '' });
                    window.alert('Patient does not exist');
                }
            } else {
                window.alert('Address belongs to a Doctor account');
            }

            // Allows for patient to be deleted if submit has been clicked
        } else if (this.state.patient.patientAddress) {
            deletePatient(
                this.state.patient.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
        } else {
            window.alert('Please enter a patient account address');
        }
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            isPatient: false,
        });
        // If address input field is not empty
        if (this.state.patientAddress) {
            // Retrieving patient from blockchain
            this.state.patient = await getPatientFromBlockchain(
                this.state.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
            // Retrieving patient reccord from IPFS
            if (this.state.patient) {
                const result = await fetch(
                    `https://ipfs.infura.io/ipfs/${this.state.patient[4]}`,
                ).catch((error) => {
                    window.alert('Error retrieving patient reccord from IPFS');
                    console.log(error);
                });
                const IPFSpatient = await result.json();
                this.setState({
                    patient: IPFSpatient,
                    patientAddress: '',
                    isPatient: true,
                });
            } else {
                this.setState({ patientAddress: '' });
                window.alert('No patient account with that address');
            }
        } else {
            window.alert('Please enter a patient account address');
        }
    };

    render() {
        return (
            <div className="container-fluid mt-5">
                <Form>
                    <Form.Group>
                        <Form.Label>Please enter patient Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="patientAddress"
                            onChange={this.handleInputChange}
                            placeholder="Enter patient address"
                            value={this.state.patientAddress}
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        onClick={this.onSubmit}
                    >
                        Submit
                    </Button>
                    <Table className="my-3 py-md-3" striped bordered hover>
                        <thead>
                            <tr>
                                <th>Address</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.patientAddress
                                        : ''}
                                </td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.patientName
                                        : ''}
                                </td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.patientEmail
                                        : ''}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="secondary" onClick={this.updateClick}>
                        Update Patient
                    </Button>
                    <Button
                        className="mx-5"
                        variant="danger"
                        onClick={this.deleteClick}
                    >
                        Delete patient
                    </Button>
                </Form>
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
export default connect(mapStateToProps, mapDispatchToProps())(ViewPatient);
