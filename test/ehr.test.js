const { assert } = require('chai');

const Ehr = artifacts.require('Ehr');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Ehr', (accounts) => {
    let ehr;
    let admin;
    let doctor;

    before(async () => {
        ehr = await Ehr.deployed();
        admin = accounts[0];
        doctor = accounts[1];
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

    // describe('grant', async () => {
    //     it('Should add a doctor role', async () => {
    //         await ehr.addDoctorRole(admin);
    //         const result = await ehr.isDoctor(admin);
    //         assert.equal(result, true);
    //     });
    // });

    describe('new doctor', async () => {
        it('adds new doctor', async () => {
            await ehr.newDoctor(admin, 'Doc', 'doc@email', 'docword');
            const result = await ehr.getDoctor(admin);
            assert.equal(result[0], admin);
            assert.equal(result[1], 'Doc');
            assert.equal(result[2], 'doc@email');
            assert.equal(result[3], 'docword');
        });
    });

    describe('new patient', async () => {
        it('adds new patient', async () => {
            await ehr.newPatient(
                accounts[2],
                'Nigel',
                'email',
                'password',
                'hash',
            );
            const result = await ehr.getPatient(accounts[2]);
            console.log(result);
            assert.equal(result[0], accounts[2]);
            assert.equal(result[1], 'Nigel');
            assert.equal(result[2], 'email');
            assert.equal(result[3], 'password');
            assert.equal(result[4], 'hash');
        });
    });
});
