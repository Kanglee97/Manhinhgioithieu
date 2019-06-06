import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const createDiscount = (discount) => {
    return callApi(Type.CREATE, Modal.DISCOUNT, `/promotions`, 'POST',
        JSON.stringify(discount)
    )
}

export const getDiscount = (storeId) => {
    return callApi(Type.GET, Modal.DISCOUNT, `/promotions/store-${storeId}`)
}

export const getDetailDiscount = (id) => {
    return callApi(Type.GET_DETAIL, Modal.DISCOUNT, `/promotions/${id}`)
}

export const updateDiscount = (discount) => {
    return callApi(Type.UPDATE, Modal.DISCOUNT, `/promotions/${discount.id}`, 'PUT', JSON.stringify(discount))
}

export const deleteDiscount = (id) => {
    return callApi(Type.DELETE, Modal.DISCOUNT, `/promotions/${id}`, 'DELETE')
}