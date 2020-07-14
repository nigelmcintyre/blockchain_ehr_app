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
        it('should add new doctor', async () => {
            await ehr.newDoctor(admin, 'Doc', 'doc@email', 'docword');
            const result = await ehr.getDoctor(admin);
            assert.equal(result[0], admin);
            assert.equal(result[1], 'Doc');
            assert.equal(result[2], 'doc@email');
            assert.equal(result[3], 'docword');
        });
    });

    describe('new patient', async () => {
        it('should add new patient', async () => {
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

    describe('update patient', async () => {
        it('should update patient', async () => {
            await ehr.updatPatient(accounts[2], 'Frank', 'frankMail', 'pass');
            const result = await ehr.getPatient(accounts[2]);
            assert.equal(result[0], accounts[2]);
            assert.equal(result[1], 'Frank');
            assert.equal(result[2], 'frankMail');
            assert.equal(result[3], 'pass');
        });
    });
    describe('get a non-existing patient', async () => {
        it('should throw error when trying to read non-existing patient', async () => {
            try {
                await ehr.getPatient(accounts[3]);
            } catch (e) {
                assert(e.message.includes('Patient does not exist'));
                return;
            }
            assert(false);
        });
    });
    describe('destroy patient', async () => {
        it('should destroy patient', async () => {
            await ehr.destroyPatient(accounts[2]);
            try {
                await ehr.getPatient(accounts[2]);
            } catch (e) {
                assert(e.message.includes('Patient does not exist'));
                return;
            }
        });
    });

    describe('not destroy patient', async () => {
        it('Should not destroy a non-existing patient', async () => {
            try {
                await ehr.destroyPatient(accounts[2]);
            } catch (e) {
                assert(e.message.includes('Patient does not exist'));
                return;
            }
        });
    });
});
