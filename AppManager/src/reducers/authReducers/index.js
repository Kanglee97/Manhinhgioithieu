import { handleActions } from 'redux-actions'
import { authActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'Auth'

const initialState = {
    isAuthorized: false,
    isOwner: false,
    phoneToken: '',
    facebookToken: '',
    googleToken: ''
};

export default handleActions(
    {
        ////Reducer with login/logout phone account
        [actions.loginPhoneAccountSuccess]: (state, action) => {
            return {
                ...state,
                isAuthorized: true,
                isOwner: true,
                phoneToken: action.payload
            };
        },
        [actions.loginPhoneAccountError]: (state, action) => {
            return {
                ...initialState
            }
        },
        ////Reducer with logout phone account
        [actions.logoutPhoneAccountSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.logoutPhoneAccountError]: (state, action) => {
            return {
                ...state
            }
        },
        ////Reducer with login facebook account
        [actions.loginFacebookAccountSuccess]: (state, action) => {
            return {
                ...state,
                isAuthorized: true,
                isOwner: true,
                facebookToken: action.payload
            };
        },
        [actions.loginFacebookAccountError]: (state, action) => {
            return {
                ...initialState
            }
        },
        ////Reducer with logout facebook account
        [actions.logoutFacebookAccountSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.logoutFacebookAccountError]: (state, action) => {
            return {
                ...state
            }
        },
        ////Reducer with login google account
        [actions.loginGoogleAccountSuccess]: (state, action) => {
            return {
                ...state,
                isAuthorized: true,
                isOwner: true,
                googleToken: action.payload
            };
        },
        [actions.loginGoogleAccountError]: (state, action) => {
            return {
                ...initialState
            }
        },
        ////Reducer with logout google account
        [actions.logoutGoogleAccountSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.logoutGoogleAccountError]: (state, action) => {
            return {
                ...state
            }
        },
        ////Reducer with login employee account 
        [actions.loginEmployeeAccountSuccess]: (state, action) => {
            return {
                isAuthorized: true,
                isOwner: false,
            }
        },
        [actions.loginEmployeeAccountError]: (state, action) => {
            return {
                ...state
            }
        },
        ////Reducer with logout employee account
        [actions.logoutEmployeeAccountSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.logoutEmployeeAccountError] : (state, action) => {
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