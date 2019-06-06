import { handleActions } from 'redux-actions'
import { discountActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'DetailDiscount'

const initialState = {
    storeId: '',
    id: '',
    displayName: '',
    description: '',
    startDate: '',
    endDate: '',
    thumbnail: '',
    price: '',
    promotion: '',
    services: []
};

export default handleActions(
    {
        [actions.addService]: (state, action) => {
            try {
                const { service } = action.payload
                console.log(service, state.services)
                if (_.isEmpty(state.services) || _.findIndex(state.services, ['id', service.id]) == -1)
                    return {
                        ...state,
                        services: _.concat(state.services, { 'id': service.id, 'displayName': service.displayName, 'lowestPrice': service.lowestPrice, 'highestPrice': service.highestPrice})
                    }
                else return {
                    ...state
                }
            }
            catch {
                return {
                    ...state
                }
            }
        },
        [actions.removeService]: (state, action) => {
            const { service } = action.payload
            return {
                ...state,
                services: _.filter(state.services, function (item) { return (item.id != service.id) })
            }
        },
        [actions.setDiscountDetail]: (state, action) => {
            const {
                discount
            } = action.payload
            return {
                ...state,
                ...discount
            }
        },
        [actions.createDiscountSuccess]: (state, action) => {
            return {
                initialState
            }
        },
        [actions.createDiscountError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchDetailDiscountSuccess]: (state, action) => {
            const {
                discount
            } = action.payload
            return {
                ...state,
                ...discount
            }
        },
        [actions.fetchDetailDiscountError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.updateDetailDiscountSuccess]: (state, action) => {
            const {
                discount
            } = action.payload
            return {
                ...state,
                ...discount
            }
        },
        [actions.updateDetailDiscountError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteDetailDiscountSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.deleteDetailDiscountError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.clearDetailDiscount]: (state, action) => {
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