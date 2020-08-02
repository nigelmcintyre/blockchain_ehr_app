import Ehr from './abis/Ehr.json';
export const contractAddress = '0xCF23C0d60D280F449510f1f5D45Ee09783815c40';

export async function loadBlockchainData(web3) {
    const blockchainData = {
        web3: '',
        networkId: '',
        networkData: '',
        accounts: '',
        contract: '',
    };
    // Setting up connection to blockchain
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
            .catch(() => {
                console.log('Patient does not exist');
            });
        if (patientBlockchainRecord) {
            if (patientBlockchainRecord[0].includes('0x0000')) {
                // Patient does not exist return undefined
                return undefined;
            } else {
                // Return patient if exists
                return patientBlockchainRecord;
            }
        } else {
            return undefined;
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
            .catch(() => {
                console.log('Doctor does not exist');
            });
        return doctorBlockchainRecord;
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function addPatientToBlockchain(
    accountAddress,
    hash,
    doctorAddress,
    doctorKey,
    web3,
    networkData,
    contract,
) {
    if (networkData) {
        // Getting Tx nonce value of transaction sender
        let nonce = 1;
        try {
            nonce = await web3.eth.getTransactionCount(doctorAddress);
        } catch {
            console.log('nonce undefined');
        }

        // Contract method ABI
        const txBuilder = await contract.methods.newPatient(
            accountAddress,
            hash,
        );
        const encodedTx = txBuilder.encodeABI();

        const transactionObject = {
            nonce: nonce,
            from: doctorAddress,
            to: contractAddress,
            gas: '300000',
            data: encodedTx,
        };

        await web3.eth.accounts
            .signTransaction(transactionObject, doctorKey)
            .then((signedTx) => {
                const sentTx = web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction,
                );
                console.log(signedTx);
                console.log(sentTx);
                sentTx.on('confirmation', () => {
                    console.log(`Patient added to blockchain`);
                    window.alert(`Patient's record successfully created`);
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
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function addDoctorToBlockchain(
    account,
    name,
    email,
    web3,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        const nonce = await web3.eth.getTransactionCount(accounts[0]);
        console.log(nonce);
        // Contract method ABI
        const txBuilder = await contract.methods.newDoctor(
            account,
            name,
            email,
        );
        const encodedTx = txBuilder.encodeABI();

        const transactionObject = {
            nonce: nonce,
            from: accounts[0],
            to: contractAddress,
            gas: '300000',
            data: encodedTx,
        };

        web3.eth.accounts
            .signTransaction(
                transactionObject,
                '38134c48d5fcaf5f71777a054013d4d3579f78f6f2d3f48b7fbb539317ecada0',
            )
            .then((signedTx) => {
                const sentTx = web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction,
                );
                sentTx.on('confirmation', () => {
                    console.log(`Doctor added to blockchain`);
                    window.alert(`Doctor ${name}, successfully created`);
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
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}

export async function deletePatient(
    patientAddress,
    web3,
    networkData,
    contract,
    accounts,
) {
    if (networkData) {
        const nonce = await web3.eth.getTransactionCount(accounts[0]);

        // Contract method ABI
        const txBuilder = await contract.methods.destroyPatient(patientAddress);
        const encodedTx = txBuilder.encodeABI();

        const transactionObject = {
            nonce: nonce,
            from: accounts[0],
            to: contractAddress,
            gas: '300000',
            data: encodedTx,
        };

        web3.eth.accounts
            .signTransaction(
                transactionObject,
                '38134c48d5fcaf5f71777a054013d4d3579f78f6f2d3f48b7fbb539317ecada0',
            )
            .then((signedTx) => {
                const sentTx = web3.eth.sendSignedTransaction(
                    signedTx.raw || signedTx.rawTransaction,
                );
                sentTx.on('confirmation', () => {
                    console.log(`Patient record deleted from blockchain`);
                    window.alert(`Patient record successfully deleted`);
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
    } else {
        window.alert('Smart contract not deployed to detected network.');
    }
}
