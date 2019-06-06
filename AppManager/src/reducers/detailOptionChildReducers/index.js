import { handleActions } from 'redux-actions'
import { detailOptionActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'DetailOptionChild'

const initialState = {
    optionChildId: '',
    displayNameOfOptionChild: '',
    description: '',
    price:'',
};

export default handleActions(
    {
        [actions.setOptionChild]: (state, action) => {
            const {optionChildId, displayName} = action.payload
            return {
                ...state,
                optionChildId,
                displayNameOfOptionChild: displayName 
            }
        },
        [actions.createOptionChildSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.createOptionChildError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.updateOptionChildSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.updateOptionChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteOptionChildSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.deleteOptionChildError]: (state, action) => {
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