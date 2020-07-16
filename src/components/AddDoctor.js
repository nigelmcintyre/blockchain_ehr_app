import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Ehr from '../abis/Ehr.json';
import LoadWeb3 from '../loadWeb3';

class AddDoctor extends Component {
    async componentWillMount() {
        await LoadWeb3();
        await this.loadBlockchainData();
    }
    constructor(props) {
        super(props);
        this.state = {
            doctorAddress: '',
            doctorName: '',
            doctorEmail: '',
            password: '',
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

    // Extract function to it's onw file
    async addDoctorToBlockchain(account, name, email, password) {
        if (this.state.networkData) {
            // Check that address already belongs to a doctor account
            const doctorDetails = await this.state.contract.methods
                .getDoctor(account)
                .call()
                .catch((error) => {
                    console.log(error);
                });
            // Check that address already belongs to a patient account
            const patient = await this.state.contract.methods
                .getPatient(account)
                .call()
                .catch((error) => {
                    console.log(error);
                });
            // If address isnt't already assigned to an account
            if (!doctorDetails && !patient) {
                await this.state.contract.methods
                    .newDoctor(account, name, email, password)
                    .send({ from: this.state.accounts[0] })
                    .on('confirmation', () => {
                        console.log('Doctor added to the blockchain');
                        window.alert(`${name}'s record created`);
                        this.clearInput();
                    })
                    .on('error', (error) => {
                        console.log(error);
                        window.alert(
                            'Error adding doctor record to bloclchain.',
                        );
                    });
            } else {
                window.alert('This address already belongs to an account');
                this.clearInput();
            }
        } else {
            window.alert('Smart contract not deployed to detected network.');
        }
    }

    clearInput() {
        this.setState({
            doctorAddress: '',
            doctorName: '',
            doctorEmail: '',
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
        // Check that input field is not empty
        if (this.state.doctorAddress) {
            await this.addDoctorToBlockchain(
                this.state.doctorAddress,
                this.state.doctorName,
                this.state.doctorEmail,
                this.state.password,
            );
        } else {
            window.alert('Please enter doctor details');
            this.clearInput();
        }
    };

    componentDidMount = async () => {};
    render() {
        return (
            <div>
                <div className="container-fluid mt-5">
                    <main role="main" className="col-lg-12 d-flex text-center">
                        <div className="content mr-auto ml-auto">
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group controlId="doctorAddress">
                                    <Form.Label>
                                        Doctor Account Address
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorAddress"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's address"
                                        value={this.state.doctorAddress}
                                    />
                                </Form.Group>
                                <Form.Group controlId="doctorName">
                                    <Form.Label>Doctor Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="doctorName"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's name"
                                        value={this.state.doctorName}
                                    />
                                </Form.Group>

                                <Form.Group controlId="doctorEmail">
                                    <Form.Label>
                                        Doctor email address
                                    </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="doctorEmail"
                                        onChange={this.handleInputChange}
                                        placeholder="Enter doctor's email"
                                        value={this.state.doctorEmail}
                                    />
                                </Form.Group>

                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        onChange={this.handleInputChange}
                                        placeholder="Password"
                                        value={this.state.password}
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

export default AddDoctor;
