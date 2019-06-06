import { handleActions } from 'redux-actions'
import { profileActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'Profile'

const initialState = {
    user: {},
    storeList: []
};

export default handleActions(
    {
        [actions.fetchProfileWithTokenSuccess]: (state, action) => {
            const { user, storeList } = action.payload
            return {
                ...state,
                user,
                storeList
            };
        },
        [actions.fetchProfileWithTokenError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchProfileSuccess]: (state, action) => {
            const { user } = action.payload
            return {
                ...state,
                user,
            };
        },
        [actions.fetchProfileError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchStoreByProfleSuccess]: (state, action) => {
            const { storeList } = action.payload
            return {
                ...state,
                storeList: [
                    ...storeList
                ],
            };
        },
        [actions.fetchStoreByProfleError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.updateProfileUserSuccess]: (state, action) => {
            const { user } = action.payload
            return {
                ...state,
                user,
            }
        },
        [actions.updateProfileError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.createProfileStoreListSuccess]: (state, action) => {
            const { newStore } = action.payload
            const storeList = [...state.storeList, newStore]
            console.log('store ', storeList, newStore)
            return {
                ...state,
                storeList
            }
        },
        [actions.createProfileStoreListError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.setProfile]: (state, action) => {
            const {user} = action.payload
            return {
                ...state,
                user
            }
        },
        [actions.clearProfile]: (state, action) => {
            return initialState
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)