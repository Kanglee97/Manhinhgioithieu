import callApi from '../helper'
import {Type, Modal} from '../../assets/styles/Constant'

export const createChat = chatDetail => {
    return callApi(Type.CREATE, Modal.MESSAGE, `/chats`,'POST', JSON.stringify(chatDetail))
}

export const getDetailChat = chatId => {
    return callApi(Type.GET_DETAIL, Modal.MESSAGE, `/chats/${chatId}`)
}

export const detailChat = chatId => {
    return callApi(Type.GET_DETAIL, Modal.MESSAGE, `/chats/${id}`, 'DELETE')
}