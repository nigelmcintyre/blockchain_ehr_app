export const patientAddressReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_ADDRESS':
            return (state = action.payload);
        case 'GET_ADDRESS':
            return state;
        default:
            return state;
    }
};
