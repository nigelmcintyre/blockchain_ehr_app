import Ehr from './abis/Ehr.json';

export async function loadBlockchainData() {
    const blockchainData = {
        web3: '',
        networkId: '',
        networkData: '',
        accounts: '',
        contract: '',
    };
    // Setting up connection to blockchain
    const web3 = window.web3;
    blockchainData.web3 = web3;

    // Getting blockchain network ID
    const networkId = await web3.eth.net.getId();
    blockchainData.networkId = networkId;
    // Getting the network where the contract is
    const networkData = Ehr.networks[networkId];
    blockchainData.networkData = networkData;
    if (networkData) {
        // Getting the account address of the current user
        const accounts = await web3.eth.getAccounts().then((_accounts) => {
            return _accounts;
        });
        blockchainData.accounts = accounts;

        // Getting the contract instance
        const contract = await web3.eth.Contract(Ehr.abi, networkData.address);
        blockchainData.contract = contract;
        return blockchainData;
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}
export async function getPatientFromBlockchain(
    accountAddress,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        const patientBlockchainRecord = await contract.methods
            .getPatient(accountAddress)
            .call({ from: accounts[0] })
            .catch((error) => {
                console.log(error);
            });

        if (patientBlockchainRecord[0].includes('0x0000')) {
            // Patient does not exist return undefined
            return undefined;
        } else {
            // Return patient if exists
            return patientBlockchainRecord;
        }
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function getDoctorFromBlockchain(
    accountAddress,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        const doctorBlockchainRecord = await contract.methods
            .getDoctor(accountAddress)
            .call({ from: accounts[0] })
            .catch((error) => {
                console.log(error);
            });
        return doctorBlockchainRecord;
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function addPatientToBlockchain(
    accountAddress,
    name,
    email,
    password,
    hash,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        await contract.methods
            // Adding patient to blockchain
            .newPatient(accountAddress, name, email, password, hash)
            .send({ from: accounts[0] })
            .on('confirmation', () => {
                console.log('Patient added to the blockchain');
                window.alert(`${name}'s record successfully created`);
            })
            .on('error', (error) => {
                console.log(error);
                window.alert('Error adding patient record to blockchain.');
            });
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function addDoctorToBlockchain(
    account,
    name,
    email,
    password,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        await contract.methods
            .newDoctor(account, name, email, password)
            .send({ from: accounts[0] })
            .on('confirmation', () => {
                console.log('Doctor added to the blockchain');
                window.alert(`Doctor ${name} successfully created`);
            })
            .on('error', (error) => {
                console.log(error);
                window.alert('Error adding doctor record to blockchain.');
            });
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function deletePatient(
    patientAddress,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        await contract.methods
            .destroyPatient(patientAddress)
            .send({ from: accounts[0] })
            .on('confirmation', () => {
                window.alert(`Patient successfully deleted`);
            })
            .on('error', (error) => {
                console.log(error);
                window.alert('Error deleting patient record please try again');
            });
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}
