import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const addDevice = (device) => {
    return callApi(Type.CREATE, Modal.DEVICE, `/devices`, 'POST',
        JSON.stringify(device)
    )
}

export const fetchDevice = deviceId => {
    return callApi(Type.GET, Modal.DEVICE, `/devices/${deviceId}`)
}

export const createMessage = (messenger) => {
    return callApi(Type.CREATE, Modal.MESSAGE, `/messages`, 'POST',
        JSON.stringify(messenger)
    )
}

export const getMessengerManager = (user) => {
    return callApi(Type.GET, Modal.MESSAGE, `/messages/manager`, 'POST',
        JSON.stringify({ 'managerId': user })
    )
}

export const deleteMessenger = item => {
    return callApi(Type.DELETE, Modal.MESSAGE, `/messages/${item}`, 'DELETE')
}

export const getMessengerEmployee = (user) => {
    return callApi(Type.GET, Modal.MESSAGE, `/messages/employee`, 'POST',
        JSON.stringify(user)
    )
}

export const addAbsentform = form => {
    return callApi(Type.CREATE, Modal.MESSAGE, `/absentforms`, 'POST',
        JSON.stringify(form)
    )
}

export const updateAbsentform = form => {
    return callApi(Type.UPDATE, Modal.MESSAGE, `/absentforms/${form.id}`, 'PUT',
        JSON.stringify(form)
    )
}

export const deleteAbsentform = form => {
    return callApi(Type.DELETE, Modal.MESSAGE, `/absentforms/${form}`, 'DELETE')
}

export const getAbsentformByEmployee = user => {
    return callApi(Type.GET, Modal.MESSAGE, `/absentforms/employee-${user}`)
}

export const getAbsentformByManager = user => {
    return callApi(Type.GET, Modal.MESSAGE, `/absentforms/manager-${user}`)
}

export const pushNotificationToUser = notification => {
    return callApi(Type.CREATE, Modal.NOTIFICATION, `/notifications`, 'POST', JSON.stringify(notification))
}