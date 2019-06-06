import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const createBooking = (data) => {
    return callApi(Type.CREATE, Modal.BOOKING, `/bookings`, 'POST', JSON.stringify(data))
}

export const getDetailCreateBooking = (id) => {
    return callApi(Type.GET_DETAIL, Modal.BOOKING, `/bookings/${id}`)
}

export const updateBooking = (data) => {
    return callApi(Type.UPDATE, Modal.BOOKING, `/bookings/${data.id}`, 'PUT', JSON.stringify(data))
}

export const deleteBooking = (id) => {
    return callApi(Type.DELETE, Modal.BOOKING, `/bookings/${id}`, 'DELETE')
}

export const getStoreBooking = (data) => {
    console.log(data);
    return callApi(Type.GET, Modal.BOOKING, `/bookings/stores`, 'POST', JSON.stringify(data))
}

export const getEmployeesBooking = data => {
    return callApi(Type.GET, Modal.BOOKING, `/bookings/employees`, 'POST', JSON.stringify(data))
}

