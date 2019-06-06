import { handleActions } from 'redux-actions'
import { serviceActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'Service'

const initialState = {
    storeId: '',
    serviceData: [],
    sampleServiceData: [],
    yourServiceData: []
};

export default handleActions(
    {
        [actions.fetchServiceSuccess]: (state, action) => {
            console.log('fetchServiceSuccess: ', action.payload)
            const { storeId, serviceData } = action.payload
            console.log('fetchServiceSuccess: ', storeId, serviceData)
            return {
                ...state,
                storeId,
                serviceData: [...serviceData]
            };
        },
        [actions.fetchServiceError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchSampleServiceSuccess]: (state, action) => {
            const { storeId, serviceData } = action.payload
            return {
                ...state,
                storeId,
                sampleServiceData: [...serviceData]
            };
        },
        [actions.fetchSampleServiceError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.addServiceFromSampleServiceSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.addServiceFromSampleServiceError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchSampleYourServiceSuccess]: (state, action) => {
            const { storeId, serviceData } = action.payload
            return {
                ...state,
                storeId,
                yourServiceData: [...serviceData]
            };
        },
        [actions.fetchSampleYourServiceError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.addYourServiceSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.addYourServiceError]: (state, action) => {
            return {
                ...state
            };
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)