const generateLoadingStateByStatus = (status, payload) =>{
    switch(status){
        case 'REQUEST':
            return {
                isLoading: true,
                error: null,
                status
            };
        case 'SUCCESS':
            return {
                isLoading: false,
                error: null,
                status
            };
        case 'ERROR':
            return {
                isLoading: false,
                error: payload,
                status
            };
        default:
            return;
    }
}

export const name = 'Loading'

export default (state = {}, action) =>{
    const {type} = action;
    const matches = /(.*)_(REQUEST|SUCCESS|ERROR)/.exec(type);

    if (!matches) return state;

    const [, requestName, requestStatus] = matches;

    return {
        ...state,
        [requestName]: generateLoadingStateByStatus(requestStatus, action.payload)
    };
};
