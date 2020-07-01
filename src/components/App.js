import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import IpfsClient from 'ipfs-http-client';

const ipfs = IpfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientName: '',
            patientEmail: '',
            password: '',
        };
    }

    handleInputChange = (event) => {
        event.preventDefault();

        // this.setState({
        //     [event.target.name]: event.target.value,
        // });
    };
    // https://ipfs.infura.io/ipfs/QmWRyEzzHEf4sRbUniSsoRKo59n25peXta8pSGYZrFqbu7
    onSubmit = async (event) => {
        event.preventDefault();
        let file = '';
        console.log('submitting file to IPFS');
        const data = JSON.stringify({
            patientName: this.state.patientName,
            patientEmail: this.state.patientEmail,
            password: this.state.password,
        });
        for await (file of ipfs.add(data)) {
            const patientHash = file.path;
            console.log(patientHash);
        }

        const patient = await fetch(
            `https://ipfs.infura.io/ipfs/QmQtMtwBRkWmcD1CxHEhWGiByqr6LZkQJB1ZSUJS1mLLpy`,
        ).then((res) => res.json());
        this.setState({
            patientName: patient.patientName,
            patientEmail: patient.patientEmail,
        });
    };

    componentDidMount = async () => {};
    render() {
        return (
            <div>
                <Nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        //TODO: Clicking navbar return home
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="index.html"
                    >
                        Blockchain EHR-application
                    </a>
                </Nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main
                            role="main"
                            className="col-lg-12 d-flex text-center"
                        >
                            <div className="content mr-auto ml-auto">
                                <Form onSubmit={this.onSubmit}>
                                    <Form.Group controlId="patientName">
                                        <Form.Label>Patient Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="patientName"
                                            //value={patientName}
                                            onChange={this.handleInputChange}
                                            placeholder="Enter patient's name"
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
                                            placeholder="Enter patient's email"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            onChange={this.handleInputChange}
                                            placeholder="Password"
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check
                                            type="checkbox"
                                            label="Check me out"
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                                <p>Patient {this.state.patientName} added</p>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
