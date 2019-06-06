import { createAction } from 'redux-actions'

const ADD_IMAGE = 'ADD_IMAGE'
export const addImage = createAction(ADD_IMAGE)

const REMOVE_IMAGE = 'REMOVE_IMAGE'
export const removeImage = createAction(REMOVE_IMAGE)

const REMOVE_ALL_IMAGE = 'REMOVE_ALL_IMAGE'
export const removeAllImage = createAction(REMOVE_ALL_IMAGE)