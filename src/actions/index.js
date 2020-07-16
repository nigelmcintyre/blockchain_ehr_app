export const get_address = (address) => {
    return {
        type: 'GET_ADDRESS',
        payload: address,
    };
};

export const set_address = (address) => {
    return {
        type: 'SET_ADDRESS',
        payload: address,
    };
};
