import { handleActions } from 'redux-actions'
import { discountActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Discount'

const initialState = {
    storeId: '',
    listDiscount: {}
};

export default handleActions(
    {
        [actions.fetchDiscountSuccess]: (state, action) => {
            const { storeId, listDiscount } = action.payload
            return {
                ...state,
                storeId,
                listDiscount: [
                    ...listDiscount
                ]
            }
        },
        [actions.fetchDiscountError]: (state, action) => {
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