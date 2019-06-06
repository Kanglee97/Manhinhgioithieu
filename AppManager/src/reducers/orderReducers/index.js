import { handleActions } from 'redux-actions'
import { orderActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Order'

const initialState = {
    storeId: '',
    listOrder: [],
    listDoneOrder: []
};

export default handleActions(
    {
        [actions.setOrderDetail]: (state, action) => {
            const { storeId, order } = action.payload
            let newList = []
            if (_.isEmpty(state.listOrder)) {
                newList = _.concat(state.listOrder, order)
            }
            return {
                ...state,
                listOrder: newList
            }
        },
        [actions.updateService]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.removeService]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.putInQuereDetailOrder]: (state, action) => {
            let { order } = action.payload
            var listOrder = []
            if (order.id == '') {
                let max = 0
                state.listOrder.forEach((item) => {
                    max = (max > item.id) ? max : item.id
                })
                order.id = Number(max) + 1
            }
            if (!_.isEmpty(state.listOrder))
                listOrder = state.listOrder.filter(sc => sc.id !== order.id)
            console.log('listOrder', listOrder)
            return {
                ...state,
                listOrder: [order, ...listOrder]
            }
        },
        [actions.removeOrder]: (state, action) => {
            const { id } = action.payload
            return {
                ...state,
                listOrder: state.listOrder.filter(sc => sc.id !== id)
            }
        },
        [actions.fetchOrderByEmployeeSuccess]: (state, action) => {
            const { listOrder } = action.payload
            return {
                ...state,
                listDoneOrder: [
                    ...listOrder
                ]
            }
        },
        [actions.fetchOrderByEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchOrderByStoreSuccess]: (state, action) => {
            const { listOrder } = action.payload
            return {
                ...state,
                listDoneOrder: [...listOrder]
            }
        },
        [actions.fetchOrderByStoreError]: (state, action) => {
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