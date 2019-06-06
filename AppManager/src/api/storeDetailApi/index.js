import callApi from '../helper'
import {Type, Modal} from '../../assets/styles/Constant'

export const getStoreInfo = storeId => {
    return callApi(Type.GET_DETAIL, Modal.STORE, `/stores/${storeId}`)
}

export const updateStoreInfo = (data) => {
    console.log(JSON.stringify(data))
    return callApi(Type.UPDATE, Modal.STORE, `/stores/${data.id}`, 'PUT', JSON.stringify(data))
}

export const deleteStore = (storeId) => {
    return callApi(Type.DELETE, Modal.STORE, `/stores/${storeId}`, 'DELETE')
}