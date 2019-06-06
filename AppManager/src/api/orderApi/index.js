import callApi from '../helper'
import {Type, Modal} from '../../assets/styles/Constant'

export const createOrder = order => {
    return callApi(Type.CREATE, Modal.ORDER, `/transactions`, 'POST', JSON.stringify(order));
}

export const fetchDetailOrder = orderId => {
    return callApi(Type.GET_DETAIL, Modal.ORDER, `/transactions/${orderId}`)
}

export const fetchOrdersByStore = data => {
    return callApi(Type.GET, Modal.ORDER, `/transactions/store`, 'POST', JSON.stringify(data))
}

export const fetchOrdersByEmployee = employee => {
    return callApi(Type.GET, Modal.ORDER, `/transactions/employee`, 'POST', JSON.stringify(employee))
}

export const fetchOrdersByManager = managerId => {
    return callApi(Type.GET, Modal.ORDER, `/transactions/${orderId}`)
}