import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

import styled from 'styled-components';

const Styles = styled.div`
    .navbar {
        background-color: #222;
    }
    a,
    .navbar-brand,
    .navbar-nav .nav-link {
        color: #bbb;
        &:hover {
            color: white;
        }
    }
`;

export const NavigationBar = () => (
    <Styles>
        <Navbar expand="lg" variant="dark">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav ">
                <Nav className="mr-auto">
                    <Nav.Item>
                        <Nav.Link href="/">Home</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/addPatient">Add Patient</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/addDoctor">Add Doctor</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/viewPatient">View Patient</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </Styles>
);
