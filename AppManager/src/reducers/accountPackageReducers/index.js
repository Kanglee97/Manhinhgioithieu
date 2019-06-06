import { handleActions } from 'redux-actions'
import { accountPackageActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'AccountPackage'

const initialState = {
    packageId: '',
    detail: {},
    listPackages: [],
    payment: {},
    code: {},
    currentPackage: {},
    currentState: {}
};

export default handleActions(
    {
        [actions.getAccountPackageSuccess]: (state, action) => {
            const { listPackages } = action.payload
            return {
                ...state,
                listPackages: [...listPackages]
            }
        },
        [actions.getAccountPackageError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.addRegisterPaymentSuccess]: (state, action) => {
            const { payment } = action.payload
            return {
                ...state,
                payment: payment
            }
        },
        [actions.addRegisterPaymentError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.activeCodeSuccess]: (state, action) => {
            const { code } = action.payload
            return {
                ...state,
                code: code
            }
        },
        [actions.activeCodeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchCurrentAccountStateSuccess]: (state, action) => {
            const { currentState } = action.payload
            return {
                ...state,
                currentState,
            };
        },
        [actions.fetchCurrentAccountStateError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.setCurrentPackage]: (state, action) => {
            const { currentPackageName } = action.payload
            return {
                ...state,
                currentPackage: _.filter(state.listPackages, function (item) {
                    return (item.name === currentPackageName)
                })[0]
            }
        }
    },
    initialState
)