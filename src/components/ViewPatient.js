import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';
import { set_address, get_address } from '../actions';
import { connect } from 'react-redux';

class ViewPatient extends Component {
    async componentWillMount() {
        await LoadWeb3();
        await this.loadBlockchainData();
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
            const contract = await web3.eth.Contract(
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
                    console.log(error);
                });

            return patientBlockchainRecord;
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }

    async getDoctorFromBlockchain(accountAddress) {
        if (this.state.networkData) {
            const doctorBlockchainRecord = await this.state.contract.methods
                .getDoctor(accountAddress)
                .call()
                .catch((error) => {
                    console.log(error);
                });
            return doctorBlockchainRecord;
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

    async deletePatient(patientAddress) {
        if (this.state.networkData) {
            const patientDeleted = await this.state.contract.methods
                .destroyPatient(patientAddress)
                .send({ from: this.state.accounts[0] })
                .on('confirmation', () => {
                    window.alert('Patient successfully deleted');
                    this.setState({ patient: '' });
                })
                .on('error', console.error);

            return patientDeleted;
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }

    deleteClick = async (event) => {
        event.preventDefault();
        if (this.state.patientAddress) {
            // Checking if address belongs to a doctor account
            const isDoctor = await this.getDoctorFromBlockchain(
                this.state.patientAddress,
            );
            // If address doesnt belong to a doctor
            console.log(isDoctor);
            if (!isDoctor) {
                // Getting patient details from blockchain
                this.state.patient = await this.getPatientFromBlockchain(
                    this.state.patientAddress,
                );
                // If patient exists
                if (this.state.patient) {
                    // Clear input
                    this.setState({ patientAddress: '' });
                    // Delete patient from blockchain
                    this.deletePatient(this.state.patient[0]);
                } else {
                    this.setState({ patientAddress: '' });
                    window.alert('Patient does not exist');
                }
            } else {
                window.alert('Address belongs to a Doctor account');
            }

            // Allows for patient to be deleted if submit has been clicked
        } else if (this.state.patient.patientAddress) {
            this.deletePatient(this.state.patient.patientAddress);
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
            this.state.patient = await this.getPatientFromBlockchain(
                this.state.patientAddress,
            );
            // Retrieving patient reccord from IPFS
            if (this.state.patient) {
                const result = await fetch(
                    `https://ipfs.infura.io/ipfs/${this.state.patient[4]}`,
                ).catch((error) => {
                    window.alert('Error retrieving pataient reccord from IPFS');
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
