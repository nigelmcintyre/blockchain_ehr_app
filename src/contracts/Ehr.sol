pragma solidity ^0.6.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Ehr is AccessControl{

    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR");
    address root = msg.sender;

    constructor () public {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
        _setRoleAdmin(DOCTOR_ROLE, DEFAULT_ADMIN_ROLE);
    }

    modifier onlyAdmin() {
      require(isAdmin(msg.sender), "Restricted to admins.");
      _;
    }

    modifier onlyDoctor() {
      require(isDoctor(msg.sender), "Restricted to Doctors.");
      _;
    }

    function isAdmin(address account) public virtual view returns (bool) {
      return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isDoctor(address account) public virtual view returns (bool) {
      return hasRole(DOCTOR_ROLE, account);
    }

    function addDoctorRole(address account) public virtual onlyAdmin {
      grantRole(DOCTOR_ROLE, account);
    }

    struct PatientDetails {
        address addr;
        string name;
        string email;
        string password;
        string patientHash;
    }

    struct DoctorDetails {
        address addr;
        string name;
        string email;
        string password;
    }

    mapping (address => PatientDetails) patients;
    mapping (address => DoctorDetails) doctors;

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

    function newDoctor(
        address _address,
        string calldata _name,
        string calldata _email,
        string calldata _password) external {
            doctors[_address] = DoctorDetails(_address,
                                            _name,
                                            _email,
                                            _password);
        grantRole(DOCTOR_ROLE, _address);
    }
    

    function getPatient(address _address) public view returns (address, string memory, string memory, string memory, string memory){
      if(patients[_address].addr == _address){
        return (patients[_address].addr,
                patients[_address].name,
                patients[_address].email,
                patients[_address].password,
                patients[_address].patientHash);
       } 
      revert('Patient does not exist');
    }

    function getDoctor(address _address) public view returns (address, string memory, string memory, string memory){
        if(doctors[_address].addr == _address){
          return (doctors[_address].addr,
                doctors[_address].name,
                doctors[_address].email,
                doctors[_address].password);
        }
        revert('Doctor does not exist');
            
    }

    function updatePatient(address _address, 
                          string memory _name,
                          string memory _email,
                          string memory _password,
                          string memory _patientHash) public {
      patients[_address].name = _name;
      patients[_address].email = _email;
      patients[_address].password = _password;
      patients[_address].patientHash = _patientHash;
    }

    function destroyPatient(address _address) public {
        delete patients[_address];
    }



}