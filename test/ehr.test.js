const Ehr = artifacts.require('Ehr');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Ehr', (accounts) => {
    let ehr;
    before(async () => {
        ehr = await Ehr.deployed();
    });
    describe('deployment', async () => {
        it('Should deploy correctly', async () => {
            const address = ehr.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });

    describe('store', async () => {
        it('adds new patient', async () => {
            await ehr.newPatient(
                accounts[0],
                'Nigel',
                'email',
                'password',
                'hash',
            );
            const result = await ehr.getPatient(accounts[0]);
            console.log(result);
            assert.equal(result[0], accounts[0]);
            assert.equal(result[1], 'Nigel');
            assert.equal(result[2], 'email');
            assert.equal(result[3], 'password');
            assert.equal(result[4], 'hash');
        });
    });
});
