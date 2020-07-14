import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { set_address } from '../actions';
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

            accounts: [],
            contract: null,
            web3: null,
            networkData: null,
            error: '',
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
                    console.log(error.data.message);
                    this.setState({ error: error.data.message });
                });

            return patientBlockchainRecord;
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

    updateClick = (event) => {
        event.preventDefault();

        this.props.set_address(this.state.retrievedAddress);
        console.log(this.props.patientAddress);
        //.then(() => {
        //     this.props.history.push('/updatePatient');
        // });
    };

    deleteClick = async (event) => {
        event.preventDefault();

        if (this.state.patientAddress) {
            this.state.patient = await this.getPatientFromBlockchain(
                this.state.patientAddress,
            );

            if (!this.state.error.includes('Patient does not exist')) {
                await this.state.contract.methods
                    .destroyPatient(this.state.patient[0])
                    .send({ from: this.state.accounts[0] })
                    .on('confirmation', () => {
                        console.log('Patient removed from blockchain');
                        window.alert('Patient successfully deleted');
                        this.setState({
                            patientAddress: '',
                        });
                    })
                    .on('error', console.error);
            } else {
                window.alert('Patient does not exist');
            }
        } else {
            window.alert('Please enter a patient account address');
        }
    };

    onSubmit = async (event) => {
        event.preventDefault();

        if (this.state.patientAddress) {
            this.state.patient = await this.getPatientFromBlockchain(
                this.state.patientAddress,
            );
            this.setState({ patientAddress: '' });

            if (!this.state.error.includes('Patient does not exist')) {
                const result = await fetch(
                    `https://ipfs.infura.io/ipfs/${this.state.patient[4]}`,
                ).catch((error) => {
                    window.alert('Error retrieving pataient reccord from IPFS');
                    console.log(error.message);
                });
                const patient = await result.json();

                this.setState({
                    retrievedAddress: patient.patientAddress,
                    patientName: patient.patientName,
                    patientEmail: patient.patientEmail,
                });
            } else {
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
                                <td>{this.state.retrievedAddress}</td>
                                <td>{this.state.patientName}</td>
                                <td>{this.state.patientEmail}</td>
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
    return { set_address };
};
export default connect(mapStateToProps, mapDispatchToProps())(ViewPatient);
