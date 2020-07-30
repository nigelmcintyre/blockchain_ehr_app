const { assert } = require('chai');

const Ehr = artifacts.require('Ehr');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Ehr', (accounts) => {
    let ehr;
    let admin;
    let doctor;
    let patient;

    before(async () => {
        ehr = await Ehr.deployed();
        admin = accounts[0];
        doctor = accounts[1];
        patient = accounts[2];
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
            await ehr.newDoctor(doctor, 'Doc', 'doc@email', {
                from: admin,
            });
            const result = await ehr.getDoctor(doctor);
            assert.equal(result[0], doctor);
            assert.equal(result[1], 'Doc');
            assert.equal(result[2], 'doc@email');
        });
    });

    // describe('new patient', async () => {
    //     it('should add new patient', async () => {
    //         await ehr.newPatient(
    //             patient,
    //             'Nigel',
    //             'email',
    //             'password',
    //             'hash',
    //             { from: doctor },
    //         );
    //         const result = await ehr.getPatient(patient, { from: doctor });
    //         assert.equal(result[0], patient);
    //         assert.equal(result[1], 'Nigel');
    //         assert.equal(result[2], 'email');
    //         assert.equal(result[3], 'password');
    //         assert.equal(result[4], 'hash');
    //     });
    // });

    // describe('Read patient', async () => {
    //     it('Should return patient details', async () => {
    //         const result = await ehr.getPatient(patient, { from: patient });
    //         assert.equal(result[0], patient);
    //         assert.equal(result[1], 'Nigel');
    //         assert.equal(result[2], 'email');
    //         assert.equal(result[3], 'password');
    //         assert.equal(result[4], 'hash');
    //     });
    // });

    // describe('Not read patient', async () => {
    //     it('Should not return a patient record', async () => {
    //         await ehr.newPatient(
    //             accounts[4],
    //             'Bob',
    //             'bobmail',
    //             'bobword',
    //             'bobhash',
    //             { from: doctor },
    //         );
    //         try {
    //             await ehr.getPatient(patient, { from: accounts[4] });
    //         } catch (e) {
    //             assert(
    //                 e.message.includes(
    //                     'Patient does not exist or you do not have access to this record',
    //                 ),
    //             );
    //         }
    //     });
    // });

    describe('Not new doctor', async () => {
        it('should not add new doctor', async () => {
            try {
                await ehr.newDoctor(accounts[3], 'Doc', 'doc@email', {
                    from: patient,
                });
            } catch (e) {
                assert(e.message.includes('Restricted to admins.'));
            }
            return;
        });
    });

    // describe('Not new patient patient', async () => {
    //     it('should not add new patient from patient', async () => {
    //         try {
    //             await ehr.newPatient(
    //                 accounts[3],
    //                 'Nigel',
    //                 'email',
    //                 'password',
    //                 'hash',
    //                 {
    //                     from: patient,
    //                 },
    //             );
    //         } catch (e) {
    //             assert(e.message.includes('Restricted to doctors.'));
    //         }
    //         return;
    //     });
    // });

    // describe('Not new patient admin', async () => {
    //     it('should not add new patient from admin', async () => {
    //         try {
    //             await ehr.newPatient(
    //                 accounts[3],
    //                 'Nigel',
    //                 'email',
    //                 'password',
    //                 'hash',
    //                 {
    //                     from: admin,
    //                 },
    //             );
    //         } catch (e) {
    //             console.log(e.message);
    //             assert(e.message.includes('Restricted to doctors.'));
    //         }
    //         return;
    //     });
    // });

    // describe('update patient', async () => {
    //     it('should update patient', async () => {
    //         await ehr.updatePatient(
    //             patient,
    //             'Frank',
    //             'frankMail',
    //             'pass',
    //             'hashish',
    //             { from: doctor },
    //         );
    //         const result = await ehr.getPatient(accounts[2], { from: doctor });
    //         assert.equal(result[0], patient);
    //         assert.equal(result[1], 'Frank');
    //         assert.equal(result[2], 'frankMail');
    //         assert.equal(result[3], 'pass');
    //         assert.equal(result[4], 'hashish');
    //     });
    // });
    // describe('Not update patient', async () => {
    //     it('should not update patient', async () => {
    //         try {
    //             await ehr.updatePatient(
    //                 patient,
    //                 'Frank',
    //                 'frankMail',
    //                 'pass',
    //                 'hashish',
    //                 { from: patient },
    //             );
    //         } catch (e) {
    //             assert(e.message.includes('Restricted to doctors.'));
    //         }
    //         return;
    //     });
    // });

    // describe('get a non-existing patient', async () => {
    //     it('should throw error when trying to read non-existing patient', async () => {
    //         try {
    //             await ehr.getPatient(accounts[5], { from: doctor });
    //         } catch (e) {
    //             console.log(e);
    //             assert(
    //                 e.message.includes(
    //                     'Patient does not exist or you do not have access to this record',
    //                 ),
    //             );
    //             return;
    //         }
    //     });
    // });

    // describe('Not destroy patient', async () => {
    //     it('should not destroy patient', async () => {
    //         await ehr.newPatient(
    //             accounts[4],
    //             'Dan',
    //             'danmail',
    //             'danword',
    //             'danhash',
    //             { from: doctor },
    //         );
    //         try {
    //             await ehr.destroyPatient(patient, { from: accounts[4] });
    //         } catch (e) {
    //             assert(e.message.includes('Restricted to doctors.'));
    //             return;
    //         }
    //     });
    // });

    // describe('destroy patient', async () => {
    //     it('should destroy patient', async () => {
    //         await ehr.destroyPatient(patient, { from: doctor });
    //         try {
    //             await ehr.getPatient(patient, { from: doctor });
    //         } catch (e) {
    //             assert(
    //                 e.message.includes(
    //                     'Patient does not exist or you do not have access to this record',
    //                 ),
    //             );
    //             return;
    //         }
    //     });
    // });

    // describe('not destroy patient', async () => {
    //     it('Should not destroy a non-existing patient', async () => {
    //         try {
    //             await ehr.destroyPatient(patient, { from: doctor });
    //         } catch (e) {
    //             assert(e.message.includes('Patient does not exist'));
    //             return;
    //         }
    //     });
    // });
});
