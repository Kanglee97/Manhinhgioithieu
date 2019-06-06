import { createAction } from 'redux-actions'

export const GET_ACCOUNT_PACKAGE = 'GET_ACCOUNT_PACKAGE'
const GET_ACCOUNT_PACKAGE_REQUEST = 'GET_ACCOUNT_PACKAGE_REQUEST'
const GET_ACCOUNT_PACKAGE_SUCCESS = 'GET_ACCOUNT_PACKAGE_SUCCESS'
const GET_ACCOUNT_PACKAGE_ERROR = 'GET_ACCOUNT_PACKAGE_ERROR'

export const ADD_REGISTER_PAYMENT = 'ADD_REGISTER_PAYMENT'
const ADD_REGISTER_PAYMENT_REQUEST = 'ADD_REGISTER_PAYMENT_REQUEST'
const ADD_REGISTER_PAYMENT_SUCCESS = 'ADD_REGISTER_PAYMENT_SUCCESS'
const ADD_REGISTER_PAYMENT_ERROR = 'ADD_REGISTER_PAYMENT_ERROR'

export const ACTIVE_CODE = 'ACTIVE_CODE'
const ACTIVE_CODE_REQUEST = 'ACTIVE_CODE_REQUEST'
const ACTIVE_CODE_SUCCESS = 'ACTIVE_CODE_SUCCESS'
const ACTIVE_CODE_ERROR = 'ACTIVE_CODE_ERROR'

export const getAccountPackageRequest = createAction(GET_ACCOUNT_PACKAGE_REQUEST)
export const getAccountPackageSuccess = createAction(GET_ACCOUNT_PACKAGE_SUCCESS)
export const getAccountPackageError = createAction(GET_ACCOUNT_PACKAGE_ERROR)

export const addRegisterPaymentRequest = createAction(ADD_REGISTER_PAYMENT_REQUEST)
export const addRegisterPaymentSuccess = createAction(ADD_REGISTER_PAYMENT_SUCCESS)
export const addRegisterPaymentError = createAction(ADD_REGISTER_PAYMENT_ERROR)

export const activeCodeRequest = createAction(ACTIVE_CODE_REQUEST)
export const activeCodeSuccess = createAction(ACTIVE_CODE_SUCCESS)
export const activeCodeError = createAction(ACTIVE_CODE_ERROR)

export const FETCH_CURRENT_ACCOUNT_STATE = 'FETCH_CURRENT_ACCOUNT_STATE'
const FETCH_CURRENT_ACCOUNT_STATE_REQUEST = 'FETCH_CURRENT_ACCOUNT_STATE_REQUEST'
const FETCH_CURRENT_ACCOUNT_STATE_SUCCESS = 'FETCH_CURRENT_ACCOUNT_STATE_SUCCESS'
const FETCH_CURRENT_ACCOUNT_STATE_ERROR = 'FETCH_CURRENT_ACCOUNT_STATE_ERROR'

export const fetchCurrentAccountStateRequest = createAction(FETCH_CURRENT_ACCOUNT_STATE_REQUEST)
export const fetchCurrentAccountStateSuccess = createAction(FETCH_CURRENT_ACCOUNT_STATE_SUCCESS)
export const fetchCurrentAccountStateError = createAction(FETCH_CURRENT_ACCOUNT_STATE_ERROR)

const SET_CURRENT_PACKAGE = 'SET_CURRENT_PACKAGE'
export const setCurrentPackage = createAction(SET_CURRENT_PACKAGE)

// const SET_DESIGN_COUNT = 'SET_DESIGN_COUNT'
// export const setDesignCount = createAction(SET_DESIGN_COUNT)

// const SET_EMPLOYEE_COUNT = 'SET_EMPLOYEE_COUNT'
// export const setEmployeeCount = createAction(SET_EMPLOYEE_COUNT)

// const SET_OPTION_COUNT = 'SET_OPTION_COUNT'
// export const setOptionCount = createAction(SET_OPTION_COUNT)

// const SET_PROMOTION_COUNT = 'SET_PROMOTION_COUNT'
// export const setPromotionCount = createAction(SET_PROMOTION_COUNT)

// const SET_STORE_COUNT = 'SET_STORE_COUNT'
// export const setStoreCount = createAction(SET_STORE_COUNT)
