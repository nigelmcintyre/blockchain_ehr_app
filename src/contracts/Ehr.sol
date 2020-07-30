pragma solidity ^0.6.0;
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Ehr is AccessControl{

    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT");
    address root = msg.sender;

    constructor () public {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
        _setRoleAdmin(PATIENT_ROLE, DEFAULT_ADMIN_ROLE);
       
    }

    modifier onlyAdmin() {
      require(isAdmin(msg.sender), "Restricted to admins.");
      _;
    }

    modifier onlyAdminPatient(){
      require(isUser(msg.sender), "Restricted to registered users");
     
      _;
    }
    // To allow doctors and the patient who owns the record access their data
    function isUser(address account) public virtual view returns (bool) {
      if(hasRole(PATIENT_ROLE, account)){
        return true;
      } else if(hasRole(DEFAULT_ADMIN_ROLE, account)) {
        return true;
      } else {
        return false;
      }
    }

    function isAdmin(address account) public virtual view returns (bool) {
      return hasRole(DEFAULT_ADMIN_ROLE, account);
    }

    function isPatient(address account) public virtual view returns (bool) {
      return hasRole(PATIENT_ROLE, account);
    }

    function addPatientRole(address account) public virtual onlyAdmin {
      grantRole(PATIENT_ROLE, account);
    }

    struct PatientDetails {
        address addr;
        string patientHash;
    }

    struct DoctorDetails {
        address addr;
        string name;
        string email;
    }

    mapping (address => PatientDetails) patients;
    mapping (address => DoctorDetails) doctors;

    function newPatient(
        address _address,
        string calldata _patientHash) external onlyAdmin {
        patients[_address] = PatientDetails(_address,
                                            _patientHash);
        addPatientRole(_address);
    }

    function newDoctor(
        address _address,
        string calldata _name,
        string calldata _email) external onlyAdmin {
            doctors[_address] = DoctorDetails(_address,
                                            _name,
                                            _email);
        grantRole(DEFAULT_ADMIN_ROLE, _address);
    }

    function getPatient(address _address) public view onlyAdminPatient returns (address, string memory){
      if(patients[_address].addr == msg.sender || isAdmin(msg.sender)){
        return (patients[_address].addr,
                patients[_address].patientHash);
       }
      revert('Patient does not exist or you do not have access to this record');
       

    }

    function getDoctor(address _address) public view onlyAdmin returns(address, string memory, string memory){
        if(doctors[_address].addr == _address){
          return (doctors[_address].addr,
                doctors[_address].name,
                doctors[_address].email);
        }
        revert('Doctor does not exist');
            
    }

    function updatePatient(address _address, string memory _patientHash) public onlyAdmin {
          patients[_address].patientHash = _patientHash;
    }

    function destroyPatient(address _address) public onlyAdmin {
        delete patients[_address];
    }



}