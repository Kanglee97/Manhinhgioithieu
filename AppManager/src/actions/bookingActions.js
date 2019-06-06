import {createAction} from 'redux-actions'

export const CREATE_BOOKING = 'CREATE_BOOKING'
const CREATE_BOOKING_REQUEST = 'CREATE_BOOKING_REQUEST'
const CREATE_BOOKING_SUCCESS = 'CREATE_BOOKING_SUCCESS'
const CREATE_BOOKING_ERROR = 'CREATE_BOOKING_ERROR'

export const GET_DETAIL_BOOKING = 'GET_DETAIL_BOOKING'
const GET_DETAIL_BOOKING_REQUEST = 'GET_DETAIL_BOOKING_REQUEST'
const GET_DETAIL_BOOKING_SUCCESS = 'GET_DETAIL_BOOKING_SUCCESS'
const GET_DETAIL_BOOKING_ERROR = 'GET_DETAIL_BOOKING_ERROR'

export const UPDATE_BOOKING = 'UPDATE_BOOKING'
const UPDATE_BOOKING_REQUEST = 'UPDATE_BOOKING_REQUEST'
const UPDATE_BOOKING_SUCCESS = 'UPDATE_BOOKING_SUCCESS'
const UPDATE_BOOKING_ERROR = 'UPDATE_BOOKING_ERROR'

export const DELETE_BOOKING = 'DELETE_BOOKING'
const DELETE_BOOKING_REQUEST = 'DELETE_BOOKING_REQUEST'
const DELETE_BOOKING_SUCCESS = 'DELETE_BOOKING_SUCCESS'
const DELETE_BOOKING_ERROR = 'DELETE_BOOKING_ERROR'

export const GET_STORE_BOOKING = 'GET_STORE_BOOKING'
const GET_STORE_BOOKING_REQUEST = 'GET_STORE_BOOKING_REQUEST'
const GET_STORE_BOOKING_SUCCESS = 'GET_STORE_BOOKING_SUCCESS'
const GET_STORE_BOOKING_ERROR = 'GET_STORE_BOOKING_ERROR'

export const GET_EMPLOYEES_BOOKING = 'GET_EMPLOYEES_BOOKING'
const GET_EMPLOYEES_BOOKING_REQUEST = 'GET_EMPLOYEES_BOOKING_REQUEST'
const GET_EMPLOYEES_BOOKING_SUCCESS = 'GET_EMPLOYEES_BOOKING_SUCCESS'
const GET_EMPLOYEES_BOOKING_ERROR = 'GET_EMPLOYEES_BOOKING_ERROR'

export const createBookingRequest = createAction(CREATE_BOOKING_REQUEST)
export const createBookingSuccess = createAction(CREATE_BOOKING_SUCCESS)
export const createBookingError = createAction(CREATE_BOOKING_ERROR)

export const getDetailBookingRequest = createAction(GET_DETAIL_BOOKING_REQUEST)
export const getDetailBookingSuccess = createAction(GET_DETAIL_BOOKING_SUCCESS)
export const getDetailBookingError = createAction(GET_DETAIL_BOOKING_ERROR)

export const updateBookingRequest = createAction(UPDATE_BOOKING_REQUEST)
export const updateBookingSuccess = createAction(UPDATE_BOOKING_SUCCESS)
export const updateBookingError = createAction(UPDATE_BOOKING_ERROR)

export const deleteBookingRequest = createAction(DELETE_BOOKING_REQUEST)
export const deleteBookingSuccess = createAction(DELETE_BOOKING_SUCCESS)
export const deleteBookingError = createAction(DELETE_BOOKING_ERROR)

export const getStoreBookingRequest = createAction(GET_STORE_BOOKING_REQUEST)
export const getStoreBookingSuccess = createAction(GET_STORE_BOOKING_SUCCESS)
export const getStoreBookingError = createAction(GET_STORE_BOOKING_ERROR)

export const getEmployeesBookingRequest = createAction(GET_EMPLOYEES_BOOKING_REQUEST)
export const getEmployeesBookingSuccess = createAction(GET_EMPLOYEES_BOOKING_SUCCESS)
export const getEmployeesBookingError = createAction(GET_EMPLOYEES_BOOKING_ERROR)

const CLEAR_LIST_BOOKING = 'CLEAR_LIST_BOOKING'
export const clearListBooking = createAction(CLEAR_LIST_BOOKING)