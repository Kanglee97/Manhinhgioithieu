import { createAction } from 'redux-actions'

export const CREATE_CUSTOMER = 'CREATE_CUSTOMER'
const CREATE_CUSTOMER_REQUEST = 'CREATE_CUSTOMER_REQUEST'
const CREATE_CUSTOMER_SUCCESS = 'CREATE_CUSTOMER_SUCCESS'
const CREATE_CUSTOMER_ERROR = 'CREATE_CUSTOMER_ERROR'

export const GET_CUSTOMER = 'GET_CUSTOMER'
const GET_CUSTOMER_REQUEST = 'GET_CUSTOMER_REQUEST'
const GET_CUSTOMER_SUCCESS = 'GET_CUSTOMER_SUCCESS'
const GET_CUSTOMER_ERROR = 'GET_CUSTOMER_ERROR'

export const GET_ALL_CUSTOMER = 'GET_ALL_CUSTOMER'
const GET_ALL_CUSTOMER_REQUEST = 'GET_ALL_CUSTOMER_REQUEST'
const GET_ALL_CUSTOMER_SUCCESS = 'GET_ALL_CUSTOMER_SUCCESS'
const GET_ALL_CUSTOMER_ERROR = 'GET_ALL_CUSTOMER_ERROR'

export const FIND_CUSTOMER = 'FIND_CUSTOMER'
const FIND_CUSTOMER_REQUEST = 'FIND_CUSTOMER_REQUEST'
const FIND_CUSTOMER_SUCCESS = 'FIND_CUSTOMER_SUCCESS'
const FIND_CUSTOMER_ERROR = 'FIND_CUSTOMER_ERROR'

export const GET_DETAIL_TRANSACTION_CUSTOMER = 'GET_DETAIL_TRANSACTION_CUSTOMER'
const GET_DETAIL_TRANSACTION_CUSTOMER_REQUEST = 'GET_DETAIL_TRANSACTION_CUSTOMER_REQUEST'
const GET_DETAIL_TRANSACTION_CUSTOMER_SUCCESS = 'GET_DETAIL_TRANSACTION_CUSTOMER_SUCCESS'
const GET_DETAIL_TRANSACTION_CUSTOMER_ERROR = 'GET_DETAIL_TRANSACTION_CUSTOMER_ERROR'

export const createCustomerRequest = createAction(CREATE_CUSTOMER_REQUEST)
export const createCustomerSuccess = createAction(CREATE_CUSTOMER_SUCCESS)
export const createCustomerError = createAction(CREATE_CUSTOMER_ERROR)

export const getCustomerRequest = createAction(GET_CUSTOMER_REQUEST)
export const getCustomerSuccess = createAction(GET_CUSTOMER_SUCCESS)
export const getCustomerError = createAction(GET_CUSTOMER_ERROR)

export const getAllCustomerRequest = createAction(GET_ALL_CUSTOMER_REQUEST)
export const getAllCustomerSuccess = createAction(GET_ALL_CUSTOMER_SUCCESS)
export const getAllCustomerError = createAction(GET_ALL_CUSTOMER_ERROR)

export const findCustomerRequest = createAction(FIND_CUSTOMER_REQUEST)
export const findCustomerSuccess = createAction(FIND_CUSTOMER_SUCCESS)
export const findCustomerError = createAction(FIND_CUSTOMER_ERROR)

export const getDetailTransactionCustomerRequest = createAction(GET_DETAIL_TRANSACTION_CUSTOMER_REQUEST)
export const getDetailTransactionCustomerSuccess = createAction(GET_DETAIL_TRANSACTION_CUSTOMER_SUCCESS)
export const getDetailTransactionCustomerError = createAction(GET_DETAIL_TRANSACTION_CUSTOMER_ERROR)

const SET_DETAIL_CUSTOMER = 'SET_DETAIL_CUSTOMER'
export const setDetailCustomer = createAction(SET_DETAIL_CUSTOMER)

const CLEAR_DETAIL_CUSTOMER = 'CLEAR_DETAIL_CUSTOMER'
export const clearDetailCustomer = createAction(CLEAR_DETAIL_CUSTOMER)