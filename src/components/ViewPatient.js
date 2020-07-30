import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { set_address, get_address } from '../actions';
import { connect } from 'react-redux';
import {
    loadBlockchainData,
    deletePatient,
    getPatientFromBlockchain,
    getDoctorFromBlockchain,
} from '../BlockchainAccess.js';
import Web3 from 'web3';

class ViewPatient extends Component {
    async componentWillMount() {
        const web3 = new Web3('http://127.0.0.1:7545');
        this.state.blockchainData = await loadBlockchainData(web3);
    }

    constructor(props) {
        super(props);
        this.state = {
            patientAddress: '',
            patient: '',
            retrievedAddress: '',
            age: '',
            gender: '',
            totalBilirubin: '',
            directBilirubin: '',
            alkalinePhosphotase: '',
            alamineAminotransferase: '',
            totalProteins: '',
            albumin: '',
            albuminGlobulinRatio: '',
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
                        this.state.blockchainData.web3,
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
                this.state.blockchainData.web3,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
            this.setState({
                patient: '',
            });
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
                    `https://ipfs.infura.io/ipfs/${this.state.patient[1]}`,
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
                        <tbody>
                            <tr>
                                <td>Address</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.patientAddress
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Age</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.age
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.gender
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Total Bilirubin</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.totalBilirubin
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Direct Bilirubin</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.directBilirubin
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Alkaline Phosphotase</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.alkalinePhosphotase
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Alamine Aminotransferase</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient
                                              .alamineAminotransferase
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Total Proteins</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.totalProteins
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Albumin</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient.albumin
                                        : ''}
                                </td>
                            </tr>
                            <tr>
                                <td>Albumin Globulin Ratio</td>
                                <td>
                                    {this.state.isPatient
                                        ? this.state.patient
                                              .albuminGlobulinRatio
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
