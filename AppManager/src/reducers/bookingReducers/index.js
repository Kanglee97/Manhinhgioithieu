import { handleActions } from 'redux-actions'
import { bookingActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Booking'

const initialState = {
    bookingId: '',
    detail: {},
    listBooking: []
};

export default handleActions(
    {
        [actions.createBookingSuccess]: (state, action) => {
            const { booking } = action.payload
            console.log('createBookingSuccess: ', booking)
            return {
                ...state,
                detail: booking
            }
        },
        [actions.createBookingError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getDetailBookingSuccess]: (state, action) => {
            const { bookingId, booking } = action.payload
            console.log('createBookingSuccess: ', booking)
            return {
                ...state,
                bookingId: bookingId,
                detail: booking
            }
        },
        [actions.getDetailBookingError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.updateBookingSuccess]: (state, action) => {
            const { booking } = action.payload
            return {
                ...state,
                detail: booking
            }
        },
        [actions.updateBookingError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteBookingSuccess]: (state, action) => {
            return {
                ...state,
            }
        },
        [actions.deleteBookingError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getStoreBookingSuccess]: (state, action) => {
            const { listBooking } = action.payload

            let listbookingTmp = state.listBooking
            _.forEach(listBooking, function (item, index) {
                if (_.findIndex(listbookingTmp, function (findingItem) { return findingItem.title === item.bookDate }) === -1) {
                    listbookingTmp = _.concat(listbookingTmp, { 'title': item.bookDate, data: [item] })
                    console.log(listbookingTmp, item, )
                }
                else
                    listbookingTmp = _.map(listbookingTmp, function (mappingItem) {
                        if (mappingItem.title === item.bookDate)
                            return { ...mappingItem, data: [item, ...mappingItem.data] }
                        else
                            return { ...mappingItem }
                    })
            })
            return {
                ...state,
                listBooking: [...listbookingTmp]
            }
        },
        [actions.getStoreBookingError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getEmployeesBookingSuccess]: (state, action) => {
            const { listBooking } = action.payload
            let listbookingTmp = state.listBooking
            _.forEach(listBooking, function (item, index) {
                if (_.findIndex(listbookingTmp, function (findingItem) { return findingItem.title === item.bookDate }) === -1) {
                    listbookingTmp = _.concat(listbookingTmp, { 'title': item.bookDate, data: [item] })
                    console.log(listbookingTmp, item, )
                }
                else
                    listbookingTmp = _.map(listbookingTmp, function (mappingItem) {
                        if (mappingItem.title === item.bookDate)
                            return { ...mappingItem, data: [item, ...mappingItem.data] }
                        else
                            return { ...mappingItem }
                    })
            })
            return {
                ...state,
                listBooking: [...listbookingTmp]
            }
        },
        [actions.getEmployeesBookingError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.clearListBooking]: (state, action) => {
            return {
                ...state,
                listBooking: []
            }
        },
    },
    initialState
)