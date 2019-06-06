import {createAction} from 'redux-actions'

export const FETCH_STORE_DETAIL = 'FETCH_STORE_DETAIL'
const FETCH_STORE_DETAIL_REQUEST = 'FETCH_STORE_DETAIL_REQUEST'
const FETCH_STORE_DETAIL_SUCCESS = 'FETCH_STORE_DETAIL_SUCCESS'
const FETCH_STORE_DETAIL_ERROR = 'FETCH_STORE_DETAIL_ERROR'

export const fetchStoreDetailRequest = createAction(FETCH_STORE_DETAIL_REQUEST)
export const fetchStoreDetailSuccess = createAction(FETCH_STORE_DETAIL_SUCCESS)
export const fetchStoreDetailError = createAction(FETCH_STORE_DETAIL_ERROR)

export const UPDATE_STORE_DETAIL = 'UPDATE_STORE_DETAIL'
const UPDATE_STORE_DETAIL_REQUEST = 'UPDATE_STORE_DETAIL_REQUEST'
const UPDATE_STORE_DETAIL_SUCCESS = 'UPDATE_STORE_DETAIL_SUCCESS'
const UPDATE_STORE_DETAIL_ERROR = 'UPDATE_STORE_DETAIL_ERROR'

export const updateStoreDetailRequest = createAction(UPDATE_STORE_DETAIL_REQUEST)
export const updateStoreDetailSuccess = createAction(UPDATE_STORE_DETAIL_SUCCESS)
export const updateStoreDetailError = createAction(UPDATE_STORE_DETAIL_ERROR)

export const DELETE_STORE_DETAIL = 'DELETE_STORE_DETAIL'
const DELETE_STORE_DETAIL_REQUEST = 'DELETE_STORE_DETAIL_REQUEST'
const DELETE_STORE_DETAIL_SUCCESS = 'DELETE_STORE_DETAIL_SUCCESS'
const DELETE_STORE_DETAIL_ERROR = 'DELETE_STORE_DETAIL_ERROR'

export const deleteStoreDetailRequest = createAction(DELETE_STORE_DETAIL_REQUEST)
export const deleteStoreDetailSuccess = createAction(DELETE_STORE_DETAIL_SUCCESS)
export const deleteStoreDetailError = createAction(DELETE_STORE_DETAIL_ERROR)

export const SAVE_STORE_DETAIL = 'SAVE_STORE_DETAIL'
export const saveStoreDetail = createAction(SAVE_STORE_DETAIL)

export const CLEAR_STORE = 'CLEAR_STORE'
export const clearStore = createAction(CLEAR_STORE)