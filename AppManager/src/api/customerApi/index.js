import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const createCustomer = user => {
    return callApi(Type.CREATE, Modal.CUSTOMER, `/customers`, 'POST',
        JSON.stringify(user)
    )
}

export const getCustomer = userId => {
    return callApi(Type.GET_DETAIL, Modal.CUSTOMER, `/customers/${userId}`)
}

export const getAllCustomer = userId => {
    return callApi(Type.SIGN_IN, Modal.CUSTOMER, `/customers/manager-${userId}`)
}

export const findCustomerByPhone = user => {
    return callApi(Type.FIND, Modal.CUSTOMER, `/customers/phone`, 'POST',
        JSON.stringify(user)
    )
}

export const getDetailTransactionCustomer = user => {
    return callApi(Type.GET_DETAIL, Modal.ORDER, `/transactions/customer/${user}`)
}

