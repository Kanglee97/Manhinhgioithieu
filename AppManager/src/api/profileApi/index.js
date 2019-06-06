import callApi from '../helper'
import { convertVietNamPhoneNumber } from '../../helper/validationHelper';
import {Type, Modal} from '../../assets/styles/Constant'

export const getStoreList = (id) => {
    return callApi(Type.GET, Modal.STORE, `/stores/manager-${id}`, 'GET')
}

export const getUserInfo = (serverToken) => {
    return callApi(Type.GET_DETAIL, Modal.ACCOUNT, `/managers/token-${serverToken}`)
}

export const getUserInfoById = (userId) => {
    return callApi(Type.GET_DETAIL, Modal.ACCOUNT, `/managers/${userId}`)
}

export const createOwnerInfo = user => {
    const { id, displayName, emailId, phone = convertVietNamPhoneNumber(phone), email, facebookId, phoneId, birthday, gender } = user;
    // return callApi('api/user/user-update', 'POST',
    //     JSON.stringify(user)
    // )
    return callApi(Type.UPDATE, Modal.ACCOUNT, `/managers/${user.id}`, 'PUT',
        JSON.stringify(user)
    )
}

export const createNewStore = store => {
    const { ownerId, displayName, portal, address, phone, email, latitude, longitude, openTime, closeTime } = store;
    return callApi(Type.CREATE, Modal.STORE, '/stores', 'POST',
        JSON.stringify({
            ownerId: ownerId,
            displayName: displayName,
            portal: portal,
            phone: convertVietNamPhoneNumber(phone),
            email: email,
            latitude: latitude,
            longitude: longitude,
            openTime: openTime,
            closeTime: closeTime,
            address: address,
        })
    )
}

