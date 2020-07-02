pragma solidity ^0.6.0;
//import "@openzeppelin/contracts/access/AccessControl.sol";

contract Ehr {
    struct PatientDetails {
        address addr;
        string name;
        string email;
        string password;
        string patientHash;

    }

    mapping (address => PatientDetails) patients;

    function newPatient(
        address _address,
        string calldata _name,
        string calldata _email,
        string calldata _password,
        string calldata _patientHash) external {
        patients[_address] = PatientDetails(_address,
                                            _name,
                                            _email,
                                            _password,
                                            _patientHash); 
    }

    function getPatient(address _address) public view returns (address, string memory, string memory, string memory, string memory){
        return (patients[_address].addr, patients[_address].name, patients[_address].email, patients[_address].password, patients[_address].patientHash);
    }


}