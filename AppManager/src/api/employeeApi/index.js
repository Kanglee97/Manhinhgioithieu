import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const createEmployee = employee => {
    return callApi(Type.CREATE, Modal.EMPLOYEE, `/employees`, 'POST', JSON.stringify(employee));
}

export const updateEmployee = employee => {
    return callApi(Type.UPDATE, Modal.EMPLOYEE, `/employees/${employee.id}`, 'PUT', JSON.stringify(employee));
}

export const updateEmployeePassword = employee => {
    return callApi(Type.UPDATE, Modal.EMPLOYEE, `/employees/password`, 'POST', JSON.stringify(employee));
}

export const deleteEmployee = (employee) => {
    return callApi(Type.DELETE, Modal.EMPLOYEE, `/employees`, `DELETE`, JSON.stringify(employee))
}

export const getEmployee = employeeId => {
    return callApi(Type.GET_DETAIL, Modal.EMPLOYEE, `/employees/${employeeId}`)
}

export const getEmployeeByOwner = ownerId => {
    return callApi(Type.GET, Modal.EMPLOYEE, `/employees/manager-${ownerId}`)
}

export const getEmployeeByStore = storeId => {
    return callApi(Type.GET, Modal.EMPLOYEE, `/employees/store-${storeId}`)
}
