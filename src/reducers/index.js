import { patientAddressReducer } from './patientAddress';
import { combineReducers } from 'redux';

const allReducers = combineReducers({
    patientAddressReducer,
});

export default allReducers;
