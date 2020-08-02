let newAccount = '';
let newAccounts = [];

for (let i = 0; i < 100; i++) {
    newAccount = web3.eth.accounts.create();
    newAccounts.push('\n' + newAccount.address);
}

const fs = require('fs');

fs.writeFile('newAccounts.txt', newAccounts, (err) => {
    if (err) throw err;
    console.log('Saved!');
});
