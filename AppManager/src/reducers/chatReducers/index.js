import { handleActions } from 'redux-actions'
import { chatActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'Chat'

const initialState = {
    chat: []
};

export default handleActions(
    {
        [actions.createChatSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.createChatError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchChatByIdSuccess]: (state, action)=> {
            return {
                ...state
            }
        },
        [actions.fetchChatByIdError]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.deleteChatByidSuccess]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.deleteChatByidError]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.fetchChatWithCustomerSuccess]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.fetchChatWithCustomerError]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.fetchChatByStoresSuccess]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.fetchChatByStoresError]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.fetchChatByStoreidSuccess]: (state, action) => {
            return{
                ...state
            }
        },
        [actions.fetchChatByStoreidError]: (state, action) => {
            return{
                ...state
            }
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)