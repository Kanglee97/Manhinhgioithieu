import callApi from '../helper'
import { Type, Modal } from '../../assets/styles/Constant'

export const signInManager = (type, data) => {
    return callApi(Type.SIGN_IN, Modal.ACCOUNT, `/managers/signin`, 'POST',
        JSON.stringify({
            'loginType': type,
            'externalToken': data
        })
    )
}

export const loginEmployee = (data) => {
    return callApi(Type.SIGN_IN, Modal.EMPLOYEE, `/employees/signin`, 'POST',
        JSON.stringify(data)
    )
}

