import { handleActions } from 'redux-actions'
import Moment from 'moment'
import { orderActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'
export const name = 'DetailOrder';
import { convertPriceToFloat } from '../../helper/validationHelper';

const initialState = {
    detail: {
        id: '',
        empId: '',
        phone: '',
        userId: '',
        isNewCustomer: false,
        phone: '',
        cusName: '',
        totalPrice: '',
        service: [],
        promotion: [],
        payment: ''
    }
};

export default handleActions(
    {
        [actions.getOrderDetail]: (state, action) => {
            const { order } = action.payload
            return {
                ...state,
                ...order
            }
        },
        [actions.updatePromotion]: (state, action) => {
            try {
                const { newPromotion } = action.payload
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        promotion: [
                            ...state.detail.promotion.filter(item => item.id !== newPromotion.id),
                            {
                                ...newPromotion,
                                processing: false,
                                done: false,
                            }
                        ]
                    }
                }
            } catch {
                return {
                    ...state
                }
            }
        },
        [actions.removePromotion]: (state, action) => {
            try {
                const { newPromotion } = action.payload
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        promotion: [
                            ...state.detail.promotion.filter(item => item.id !== newPromotion.id),
                        ]
                    }
                }
            } catch {
                return {
                    ...state
                }
            }
        },
        [actions.updateServiceChild]: (state, action) => {
            try {
                // serviceChild: {
                //     id: 'string',
                //     displayName: 'string',
                //     price: 'string',
                //     description: 'string'
                // }
                const { serviceParrent, serviceChild } = action.payload
                let { service } = state.detail
                if (_.findIndex(service, function (item) {
                    if (item.id == serviceChild.id) {
                        item.displayName = serviceChild.displayName
                        item.price = convertPriceToFloat(serviceChild.price)
                        return true
                    }
                    return false
                }) == -1) {
                    if (service == undefined) {
                        service = {
                            'id': serviceChild.id,
                            'displayName': serviceChild.displayName,
                            'price': convertPriceToFloat(serviceChild.price),
                            'processing': false,
                            'done': false,
                        }
                    }
                    else {
                        service = _.concat(service, {
                            'id': serviceChild.id,
                            'displayName': serviceChild.displayName,
                            'price': convertPriceToFloat(serviceChild.price),
                            'processing': false,
                            'done': false,
                            'thumbnail': serviceChild.thumbnail,
                        })
                    }
                }
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        service
                    }
                }
            } catch {
                return {
                    ...state
                }
            }
        },
        [actions.removeServiceChild]: (state, action) => {
            const { id } = action.payload
            let listData = state.detail.service
            listData = _.remove(listData, function (item) { return item.id != id })
            return {
                ...state,
                detail: {
                    ...state.detail,
                    service: listData
                }
            }
        },
        [actions.updateOption]: (state, action) => {
            try {
                // serviceChild: {
                //     id: 'string',
                //     displayName: 'string',
                //     price: 'string',
                //     description: 'string'
                // }
                // listOption: {
                //     id: 'optionId',
                //     displayName: 'string',
                //     data: {
                //         id: 'id',
                //         displayName: 'displayName',
                //         price: 'string'
                //     }
                // }
                const { serviceParrent, serviceChild, listOption } = action.payload
                let { service } = state.detail
                if (_.findIndex(service, function (item) {
                    if (item.id == serviceChild.id) {
                        item.displayName = serviceChild.displayName
                        item.price = convertPriceToFloat(serviceChild.price)
                        item.data = listOption
                        return true
                    }
                    return false
                }) == -1) {
                    if (service == undefined) {
                        service = {
                            'id': serviceChild.id,
                            'displayName': serviceChild.displayName,
                            'price': convertPriceToFloat(serviceChild.price),
                            'processing': false,
                            'done': false,
                            'data': listOption
                        }
                    }
                    else {
                        service = _.concat(service, {
                            'id': serviceChild.id,
                            'displayName': serviceChild.displayName,
                            'price': convertPriceToFloat(serviceChild.price),
                            'processing': false,
                            'done': false,
                            'thumbnail': serviceChild.thumbnail,
                            'data': listOption
                        })
                    }
                }
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        service
                    }
                }
            } catch {
                return {
                    ...state
                }
            }
        },
        [actions.removeOption]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.startProcessingService]: (state, action) => {
            try {
                const { serviceId } = action.payload
                let { service } = state.detail
                _.forEach(service, function (item) {
                    if (item.id == serviceId) {
                        item.processing = true
                    }
                })
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        service
                    }
                }
            } catch (error) {
                return {
                    ...state,
                }
            }
        },
        [actions.doneService]: (state, action) => {
            try {
                const { serviceId } = action.payload
                let { service, totalPrice } = state.detail
                console.log(service, totalPrice)
                _.forEach(service, function (item) {
                    console.log('serivceItem', item)
                    if (item.id == serviceId) {
                        if (item.processing == true) {
                            item.processing = false,
                                item.done = true,
                                _.forEach(item.data, function (orderItem) {
                                    totalPrice = Number(totalPrice) + Number(orderItem.data.price)

                                    console.log('orderItem', totalPrice, orderItem)
                                })
                            totalPrice = Number(totalPrice) + Number(item.price)
                            console.log(item)
                        }
                    }
                })
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        totalPrice,
                        service
                    }
                }
            } catch (error) {
                return {
                    ...state,
                }
            }
        },
        [actions.startProcessingPromotion]: (state, action) => {
            try {
                const { promotionId } = action.payload
                let { promotion } = state.detail
                _.forEach(promotion, function (item) {
                    if (item.id == promotionId) {
                        item.processing = true
                    }
                })
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        promotion
                    }
                }
            } catch (error) {
                return {
                    ...state,
                }
            }
        },
        [actions.donePromotion]: (state, action) => {
            try {
                const { promotionId } = action.payload
                let { promotion, totalPrice } = state.detail
                _.forEach(promotion, function (item) {
                    console.log('serivceItem', item)
                    if (item.id == promotionId) {
                        if (item.processing == true) {
                            item.processing = false,
                            item.done = true,
                            totalPrice = Number(totalPrice) + Number(item.price)
                            console.log(item)
                        }
                    }
                })
                return {
                    ...state,
                    detail: {
                        ...state.detail,
                        totalPrice,
                        promotion
                    }
                }
            } catch (error) {
                return {
                    ...state,
                }
            }
        },
        [actions.setCustomer]: (state, action) => {
            const { user, isNewCustomer = false } = action.payload
            const { id, firstName, phone } = user
            return {
                ...state,
                detail: {
                    ...state.detail,
                    userId: id,
                    cusName: firstName,
                    phone: phone,
                    isNewCustomer: isNewCustomer,
                    startTime: Moment().format(),
                }
            }
        },
        [actions.removeCustomer]: (state, action) => {
            return {
                ...state,
                detail: {
                    ...state.detail,
                    userId: '',
                    cusName: '',
                    phone: '',
                    isNewCustomer: false
                }
            }
        },
        [actions.fetchDetailOrderSuccess]: (state, action) => {
            const { order } = action.payload
            return {
                ...state,
                ...order
            }
        },
        [actions.fetchDetailOrderError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.createDetailOrderSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.createDetailOrderError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getFromQuereDetailOrder]: (state, action) => {
            const { detail } = action.payload
            return {
                ...state,
                detail
            }
        },
        [actions.clearDetailOrder]: (state, action) => {
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