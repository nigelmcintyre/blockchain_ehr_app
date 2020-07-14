import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AddPatient from './AddPatient';
import Home from './Home';
import { Layout } from './Layout';
import { NavigationBar } from './NavigationBar';
import AddDoctor from './AddDoctor';
import ViewPatient from './ViewPatient';
import UpdatePatient from './UpdatePatient';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <NavigationBar />
                <Layout>
                    <Router>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/addPatient" component={AddPatient} />
                            <Route path="/addDoctor" component={AddDoctor} />
                            <Route
                                path="/viewPatient"
                                component={ViewPatient}
                            />
                            <Route
                                path="/updatePatient"
                                component={UpdatePatient}
                            />
                        </Switch>
                    </Router>
                </Layout>
            </React.Fragment>
        );
    }
}

export default App;
