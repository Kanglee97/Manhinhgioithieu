import { handleActions } from 'redux-actions'
import { connectionActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Connection'

const initialState = {
    isConnected: true
};

export default handleActions(
    {
        [actions.changeConnectionOn]: (state, action) => {
            return {
                ...state,
                isConnected: true
            }
        },
        [actions.changeConnectionOff]: (state, action) => {
            return {
                ...state,
                isConnected: false
            }
        },
    },
    initialState
)