import { handleActions } from 'redux-actions'
import { detailOptionActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'DetailOption'

const initialState = {
    serviceId: '',
    optionId: '',
    displayName: '',
    data: [],
};

export default handleActions(
    {
        [actions.setOption]: (state, action) => {
            const {serviceId, optionId, displayName, data} = action.payload
            return {
                ...state,
                serviceId,
                optionId, 
                displayName,
                data
            }
        },
        [actions.createOptionServiceChildSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.createOptionServiceChildError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchOptionChildSuccess]: (state, action) => {
            const {optionId, data} = action.payload
            return {
                ...state,
                optionId,
                data
            };
        },
        [actions.fetchOptionChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.updateOptionServiceChildSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.updateOptionServiceChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteOptionServiceChildSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.deleteOptionServiceChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)