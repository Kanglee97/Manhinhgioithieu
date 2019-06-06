import { handleActions } from 'redux-actions'
import { customerActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Customer'

const initialState = {
    detail: {
        info: {},
        transaction: []
    },
    customers: []
};

export default handleActions(
    {
        [actions.getAllCustomerSuccess]: (state, action) => {
            const { customers } = action.payload

            return {
                ...state,
                customers: [
                    ...customers
                ]
            };
        },
        [actions.getAllCustomerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getCustomerSuccess]: (state, action) => {
            const { customer } = action.payload

            return {
                ...state,
                detail: {
                    ...state.detail,
                    info: {
                        ...state.detail.info,
                        ...customer
                    }
                }
            };
        },
        [actions.getCustomerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.createCustomerSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.createCustomerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.findCustomerSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.findCustomerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getDetailTransactionCustomerSuccess]: (state, action) => {
            const { transaction } = action.payload
            let point = 0
            _.forEach(transaction, function (item, index) {
                point = point + item.totalPrice
            })
            return {
                ...state,
                detail: {
                    ...state.detail,
                    info: {
                        ...state.detail.info,
                        point: point
                    },
                    transaction: [
                        ...transaction
                    ]
                }
            }
        },
        [actions.getDetailTransactionCustomerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.clearDetailCustomer]: (state, action) => {
            return {
                ...state,
                detail: {
                    info: {},
                    transaction: []
                }
            }
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)