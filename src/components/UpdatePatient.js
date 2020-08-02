import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import { get_address, set_address } from '../actions';
import { connect } from 'react-redux';
import store from '../index';
import { loadBlockchainData, contractAddress } from '../BlockchainAccess.js';
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
            age: '',
            gender: '',
            totalBilirubin: '',
            directBilirubin: '',
            alkalinePhosphotase: '',
            alamineAminotransferase: '',
            totalProteins: '',
            albumin: '',
            albuminGlobulinRatio: '',

            doctorAddress: '',
            doctorKey: '',

            blockchainData: {},
        };
    }

    async populateFields() {
        const patient = await store.getState();
        this.setState({
            age: patient.patientAddressReducer.age,
            gender: patient.patientAddressReducer.gender,
            totalBilirubin: patient.patientAddressReducer.totalBilirubin,
            directBilirubin: patient.patientAddressReducer.directBilirubin,
            alkalinePhosphotase:
                patient.patientAddressReducer.alkalinePhosphotase,
            alamineAminotransferase:
                patient.patientAddressReducer.alamineAminotransferase,
            totalProteins: patient.patientAddressReducer.totalProteins,
            albumin: patient.patientAddressReducer.albumin,
            albuminGlobulinRatio:
                patient.patientAddressReducer.albuminGlobulinRatio,
        });
    }

    clearInput() {
        this.setState({
            patientAddress: '',
            age: '',
            gender: '',
            totalBilirubin: '',
            directBilirubin: '',
            alkalinePhosphotase: '',
            alamineAminotransferase: '',
            totalProteins: '',
            albumin: '',
            albuminGlobulinRatio: '',
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
            age: this.state.age,
            gender: this.state.gender,
            totalBilirubin: this.state.totalBilirubin,
            directBilirubin: this.state.directBilirubin,
            alkalinePhosphotase: this.state.alkalinePhosphotase,
            alamineAminotransferase: this.state.alamineAminotransferase,
            totalProteins: this.state.totalProteins,
            albumin: this.state.albumin,
            albuminGlobulinRatio: this.state.albuminGlobulinRatio,
        });
        for await (file of ipfs.add(data)) {
            patientHash = file.path;
            console.log('Patient uploaded to IPFS');
        }

        // Getting Tx nonce value of transaction sender
        let nonce = 1;
        try {
            nonce = await this.state.blockchainData.web3.eth.getTransactionCount(
                this.state.doctorAddress,
            );
        } catch {
            console.log('nonce undefined');
        }

        console.log(
            this.props.patientAddress.patientAddress + '\n' + patientHash,
        );
        // Contract method ABI
        const txBuilder = await this.state.blockchainData.contract.methods.updatePatient(
            this.props.patientAddress.patientAddress,
            patientHash,
        );
        const encodedTx = txBuilder.encodeABI();
        console.log(this.state.doctorAddress);
        const transactionObject = {
            nonce: nonce,
            from: this.state.doctorAddress,
            to: contractAddress,
            gas: '300000',
            data: encodedTx,
        };

        this.state.blockchainData.web3.eth.accounts
            .signTransaction(transactionObject, this.state.doctorKey)
            .then((signedTx) => {
                const sentTx = this.state.blockchainData.web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction,
                );
                console.log(signedTx);
                sentTx.on('confirmation', () => {
                    console.log(`Patient record updated on blockchain`);
                    window.alert(`Record successfully updated`);
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
                                <Form.Group controlId="age">
                                    <Form.Label>Patient Age</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="age"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patient's age"
                                        value={this.state.age}
                                    />
                                </Form.Group>

                                <Form.Group controlId="gender">
                                    <Form.Label>Patient gender</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gender"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patient's gender"
                                        value={this.state.gender}
                                    />
                                </Form.Group>

                                <Form.Group controlId="totalBilirubin">
                                    <Form.Label>Total Bilirubin</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="totalBilirubin"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients total bilirubin"
                                        value={this.state.totalBilirubin}
                                    />
                                </Form.Group>
                                <Form.Group controlId="directBilirubin">
                                    <Form.Label>Direct Bilirubin</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="directBilirubin"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients direct bilirubin"
                                        value={this.state.directBilirubin}
                                    />
                                </Form.Group>
                                <Form.Group controlId="alkalinePhosphotase">
                                    <Form.Label>
                                        Alkaline Phosphotase
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="alkalinePhosphotase"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients alkaline photophotase"
                                        value={this.state.alkalinePhosphotase}
                                    />
                                </Form.Group>
                                <Form.Group controlId="alamineAminotransferase">
                                    <Form.Label>
                                        Alamine Aminotransferase
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="alamineAminotransferase"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients alamine aminotransferase"
                                        value={
                                            this.state.alamineAminotransferase
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="totalProteins">
                                    <Form.Label>Total Proteins</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="totalProteins"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients total proteins"
                                        value={this.state.totalProteins}
                                    />
                                </Form.Group>
                                <Form.Group controlId="albumin">
                                    <Form.Label>Albumin</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="albumin"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients albumin"
                                        value={this.state.albumin}
                                    />
                                </Form.Group>
                                <Form.Group controlId="albuminGlobulinRatio">
                                    <Form.Label>
                                        Albumin Globulin Ratio
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="albuminGlobulinRatio"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patients total albumin globulin ratio"
                                        value={this.state.albuminGlobulinRatio}
                                    />
                                </Form.Group>
                                <Form.Group controlId="doctorAddress">
                                    <Form.Label>
                                        Doctor Account Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorAddress"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's account address"
                                        value={this.state.doctorAddress}
                                    />
                                </Form.Group>
                                <Form.Group controlId="doctorKey">
                                    <Form.Label>Doctor Private Key</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorKey"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's private key"
                                        value={this.state.doctorKey}
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
