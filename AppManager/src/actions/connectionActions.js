import {createAction} from 'redux-actions'

const CHANGE_CONNECTION_ON = 'CHANGE_CONNECTION_ON'
export const changeConnectionOn = createAction(CHANGE_CONNECTION_ON)

const CHANGE_CONNECTION_OFF = 'CHANGE_CONNECTION_OFF'
export const changeConnectionOff = createAction(CHANGE_CONNECTION_OFF)
