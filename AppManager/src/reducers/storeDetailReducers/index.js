import { handleActions } from 'redux-actions'
import { storeDetailActions as actions } from '../../actions'
import * as storeService from '../../sagas/storeService'
import { PURGE } from 'redux-persist'

export const name = 'StoreDetail'

const initialState = {
    storeId: '',
    data: {},
};

export default handleActions(
    {
        [actions.saveStoreDetail]: (state,action) => {
            const {storeId, displayName = '', address = '' } = action.payload
            return {
                ...state,
                storeId,
                data: {
                    'displayName': displayName,
                    'address': address,
                }
            }
        },  
        [actions.fetchStoreDetailSuccess]: (state, action) => {
            const { storeId, data } = action.payload
            return {
                ...state,
                storeId,
                data
            };
        },
        [actions.fetchStoreDetailError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.updateStoreDetailSuccess]: (state, action) => {
            const { storeId, data } = action.payload
            return {
                ...state,
                storeId,
                data
            };
        },
        [actions.updateStoreDetailError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.deleteStoreDetailSuccess]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.deleteStoreDetailError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.clearStore]: (state, action) =>{
            return {
                ...initialState
            }
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)