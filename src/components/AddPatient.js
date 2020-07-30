import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipfs } from '../ipfsConfig';
import Web3 from 'web3';
import {
    loadBlockchainData,
    addPatientToBlockchain,
    getPatientFromBlockchain,
    getDoctorFromBlockchain,
} from '../BlockchainAccess.js';

class AddPatient extends Component {
    async componentWillMount() {
        const web3 = new Web3('http://127.0.0.1:7545');
        this.state.blockchainData = await loadBlockchainData(web3);
    }
    constructor(props) {
        super(props);
        this.state = {
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

            doctorAddress: '',
            doctorKey: '',

            blockchainData: {},
        };
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

            doctorAddress: '',
            doctorKey: '',
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
        let file = '';
        let patientHash = '';
        // If input field is not empty
        if (this.state.patientAddress) {
            // Checking if address belongs to a patient account
            const isPatient = await getPatientFromBlockchain(
                this.state.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );
            console.log(isPatient);
            // Checking if address belongs to doctor account
            const isDoctor = await getDoctorFromBlockchain(
                this.state.patientAddress,
                this.state.blockchainData.networkData,
                this.state.blockchainData.contract,
                this.state.blockchainData.accounts,
            );

            // If address doesn't belong to an account
            if (!isPatient && !isDoctor) {
                console.log('submitting file to IPFS');
                let address = this.state.patientAddress;
                let doctorAddress = this.state.doctorAddress;
                let doctorKey = this.state.doctorKey;

                const data = JSON.stringify({
                    patientAddress: this.state.patientAddress,
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
                // Adding patient record to IPFS
                for await (file of ipfs.add(data)) {
                    patientHash = file.path;
                    console.log('Patient uploaded to IPFS');
                }
                this.clearInput();
                // Adding patient record to blockchain
                console.log('Adding patient to blockchain');
                await addPatientToBlockchain(
                    address,
                    patientHash,
                    doctorAddress,
                    doctorKey,
                    this.state.blockchainData.web3,
                    this.state.blockchainData.networkData,
                    this.state.blockchainData.contract,
                );
            } else {
                window.alert('This address already belongs to an account');
                this.clearInput();
            }
        } else {
            window.alert('Please enter patient details');
            this.clearInput();
        }
        this.clearInput();
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
                                    <Form.Control
                                        type="text"
                                        name="patientAddress"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter patient's address"
                                        value={this.state.patientAddress}
                                    />
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

export default AddPatient;
