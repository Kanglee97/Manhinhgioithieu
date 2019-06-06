import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const getAccountPackage = () => {
    return callApi(Type.GET_DETAIL, Modal.PACKAGE, `/accountpacks`)
}

export const addRegisterPayment = (data) => {
    return callApi(Type.GET_DETAIL, Modal.PACKAGE, `/payments`, 'POST', JSON.stringify(data));
}

export const activeCode = (data) => {
    return callApi('Kích hoạt', Modal.PACKAGE, `/activationcodes/active`, 'POST', JSON.stringify(data));
}

export const getAccountCurrentState = (managerId) => {
    return callApi(Type.GET_DETAIL, Modal.CURRENT_PACKAGE, `/accounts/${managerId}`)
}