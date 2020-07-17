import React, { Component } from 'react';
import LoadWeb3 from '../loadWeb3';
import Ehr from '../abis/Ehr.json';

class Home extends Component {
    // async componentWillMount() {
    //     await LoadWeb3();
    //     await this.addExtraAccounts();
    // }
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         accounts: [],
    //         contract: null,
    //         web3: null,
    //         networkData: null,
    //     };
    // }
    // async addExtraAccounts() {
    //     // Setting up connection to blockchain
    //     const web3 = window.web3;
    //     this.setState({ web3: web3 });

    //     // Getting blockchain network ID
    //     const networkId = await web3.eth.net.getId();

    //     // Getting the network where the contract is
    //     const networkData = Ehr.networks[networkId];
    //     this.setState({ networkData: networkData });
    //     if (networkData) {
    //         let newAccount;

    //         // Getting the account address of the current user
    //         for (let i = 0; i < 500; i++) {
    //             newAccount = await web3.eth.accounts.create();
    //             console.log(newAccount);
    //             this.state.accounts.push(newAccount);
    //         }
    //         const accounts = await web3.eth.getAccounts().then((_accounts) => {
    //             this.setState({ accounts: _accounts });
    //             console.log(this.state.accounts);
    //         });

    //         // Getting the contract instance
    //         const contract = web3.eth.Contract(
    //             Ehr.abi,
    //             this.state.networkData.address,
    //         );
    //         this.setState({ contract });
    //     } else {
    //         window.alert('Smart contract not deployed to detected network.');
    //     }
    // }
    render() {
        return (
            <div>
                <h2>Blockcahin EHR app</h2>
            </div>
        );
    }
}

export default Home;
