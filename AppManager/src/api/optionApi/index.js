import callApi from '../helper'
import {Type, Modal} from '../../assets/styles/Constant'

export const createOption = option => {
    return callApi(Type.CREATE, Modal.OPTION, `/options`, 'POST', JSON.stringify(option));
}

export const updateOption = option => {
    return callApi(Type.UPDATE, Modal.OPTION, `/options/${option.id}`, 'PUT', JSON.stringify(option));
}

export const deleteOption = optionId => {
    return callApi(Type.DELETE, Modal.OPTION, `/options/${optionId}`, 'DELETE')
}

export const createOptionChild = option => {
    return callApi(Type.CREATE, Modal.OPTION, `/options`, 'POST', JSON.stringify(option));
}

export const fetchOptionChildByParentId = optionId => {
    return callApi(Type.GET, Modal.OPTION, `/options/parent-${optionId}`)
}

export const updateOptionChild = option => {
    return callApi(Type.UPDATE, Modal.OPTION, `/options/${option.id}`, 'PUT', JSON.stringify(option));
}

export const deleteOptionChild = optionId => {
    return callApi(Type.DELETE, Modal.OPTION, `/options/${optionId}`, 'DELETE')
}

export const getOptionChildByServiceId = serviceId => {
    return callApi(Type.GET_DETAIL, Modal.OPTION, `/options/service-${serviceId}`)
}
