import {createAction} from 'redux-actions'

const SET_ORDER_DETAIL = 'SET_ORDER_DETAIL'
export const setOrderDetail = createAction(SET_ORDER_DETAIL)

const GET_ORDER_DETAIL = 'GET_ORDER_DETAIL'
export const getOrderDetail = createAction(GET_ORDER_DETAIL)

const UPDATE_PROMOTION = 'UPDATE_PROMOTION'
export const updatePromotion = createAction(UPDATE_PROMOTION)

const REMOVE_PROMOTION = 'REMOVE_PROMOTION'
export const removePromotion = createAction(REMOVE_PROMOTION)

const UPDATE_SERVICE = 'UPDATE_SERVICE'
export const updateService = createAction(UPDATE_SERVICE)

const REMOVE_SERVICE = 'REMOVE_SERVICE'
export const removeService = createAction(REMOVE_SERVICE)

const UPDATE_SERVICE_CHILD = 'UPDATE_SERVICE_CHILD'
export const updateServiceChild = createAction(UPDATE_SERVICE_CHILD)

const UPDATE_OPTION = 'UPDATE_OPTION'
export const updateOption = createAction(UPDATE_OPTION)

const REMOVE_SERVICE_CHILD = 'REMOVE_SERVICE_CHILD'
export const removeServiceChild = createAction(REMOVE_SERVICE_CHILD)

const REMOVE_OPTION = 'REMOVE_OPTION' 
export const removeOption = createAction(REMOVE_OPTION)

const START_PROCESSING_SERVICE = 'START_PROCESSING_SERVICE'
export const startProcessingService = createAction(START_PROCESSING_SERVICE)

const DONE_SERVICE = 'DONE_SERVICE'
export const doneService = createAction(DONE_SERVICE)

const START_PROCESSING_PROMOTION = 'START_PROCESSING_PROMOTION'
export const startProcessingPromotion = createAction(START_PROCESSING_PROMOTION)

const DONE_PROMOTION = 'DONE_PROMOTION'
export const donePromotion = createAction(DONE_PROMOTION)

const SET_CUSTOMER = 'SET_CUSTOMER'
export const setCustomer = createAction(SET_CUSTOMER)

const REMOVE_CUSTOMER = 'REMOVE_CUSTOMER'
export const removeCustomer = createAction(REMOVE_CUSTOMER)

export const CREATE_DETAIL_ORDER = 'CREATE_DETAIL_ORDER'
const CREATE_DETAIL_ORDER_REQUEST = 'CREATE_DETAIL_ORDER_REQUEST'
const CREATE_DETAIL_ORDER_SUCCESS = 'CREATE_DETAIL_ORDER_SUCCESS'
const CREATE_DETAIL_ORDER_ERROR = 'CREATE_DETAIL_ORDER_ERROR'

export const FETCH_DETAIL_ORDER = 'FETCH_DETAIL_ORDER'
const FETCH_DETAIL_ORDER_REQUEST = 'FETCH_DETAIL_ORDER_REQUEST'
const FETCH_DETAIL_ORDER_SUCCESS = 'FETCH_DETAIL_ORDER_SUCCESS'
const FETCH_DETAIL_ORDER_ERROR = 'FETCH_DETAIL_ORDER_ERROR'

export const FETCH_ORDER_BY_EMPLOYEE = 'FETCH_ORDER_BY_EMPLOYEE'
const FETCH_ORDER_BY_EMPLOYEE_REQUEST = 'FETCH_ORDER_BY_EMPLOYEE_REQUEST'
const FETCH_ORDER_BY_EMPLOYEE_SUCCESS = 'FETCH_ORDER_BY_EMPLOYEE_SUCCESS'
const FETCH_ORDER_BY_EMPLOYEE_ERROR = 'FETCH_ORDER_BY_EMPLOYEE_ERROR'

export const FETCH_ORDER_BY_STORE = 'FETCH_ORDER_BY_STORE'
const FETCH_ORDER_BY_STORE_REQUEST = 'FETCH_ORDER_BY_STORE_REQUEST'
const FETCH_ORDER_BY_STORE_SUCCESS = 'FETCH_ORDER_BY_STORE_SUCCESS'
const FETCH_ORDER_BY_STORE_ERROR = 'FETCH_ORDER_BY_STORE_ERROR'

export const FETCH_ORDER_BY_MANAGER = 'FETCH_ORDER_BY_MANAGER'
const FETCH_ORDER_BY_MANAGER_REQUEST = 'FETCH_ORDER_BY_MANAGER_REQUEST'
const FETCH_ORDER_BY_MANAGER_SUCCESS = 'FETCH_ORDER_BY_MANAGER_SUCCESS'
const FETCH_ORDER_BY_MANAGER_ERROR = 'FETCH_ORDER_BY_MANAGER_ERROR'

export const createDetailOrderRequest = createAction(CREATE_DETAIL_ORDER_REQUEST)
export const createDetailOrderSuccess = createAction(CREATE_DETAIL_ORDER_SUCCESS)
export const createDetailOrderError = createAction(CREATE_DETAIL_ORDER_ERROR)

export const fetchDetailOrderRequest = createAction(FETCH_DETAIL_ORDER_REQUEST)
export const fetchDetailOrderSuccess = createAction(FETCH_DETAIL_ORDER_SUCCESS)
export const fetchDetailOrderError = createAction(FETCH_DETAIL_ORDER_ERROR)

export const fetchOrderByEmployeeRequest = createAction(FETCH_ORDER_BY_EMPLOYEE_REQUEST)
export const fetchOrderByEmployeeSuccess = createAction(FETCH_ORDER_BY_EMPLOYEE_SUCCESS)
export const fetchOrderByEmployeeError = createAction(FETCH_ORDER_BY_EMPLOYEE_ERROR)

export const fetchOrderByStoreRequest = createAction(FETCH_ORDER_BY_STORE_REQUEST)
export const fetchOrderByStoreSuccess = createAction(FETCH_ORDER_BY_STORE_SUCCESS)
export const fetchOrderByStoreError = createAction(FETCH_ORDER_BY_STORE_ERROR)

export const fetchOrderByManagerRequest = createAction(FETCH_ORDER_BY_MANAGER_REQUEST)
export const fetchOrderByManagerSuccess = createAction(FETCH_ORDER_BY_MANAGER_SUCCESS)
export const fetchOrderByManagerError = createAction(FETCH_ORDER_BY_MANAGER_ERROR)

const PUT_IN_QUERE_DETAIL_ORDER = 'PUT_IN_QUERE_DETAIL_ORDER'
export const putInQuereDetailOrder = createAction(PUT_IN_QUERE_DETAIL_ORDER)

const GET_FROM_QUERE_DETAIL_ORDER = 'GET_FROM_QUERE_DETAIL_ORDER'
export const getFromQuereDetailOrder = createAction(GET_FROM_QUERE_DETAIL_ORDER)

const CLEAR_DETAIL_ORDER = 'CLEAR_DETAIL_ORDER'
export const clearDetailOrder = createAction(CLEAR_DETAIL_ORDER)

const REMOVE_ORDER = 'REMOVE_ORDER'
export const removeOrder = createAction(REMOVE_ORDER)

