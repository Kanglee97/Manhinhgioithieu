import {createAction} from 'redux-actions'

export const CREATE_CHATS = 'CREATE_CHATS'
const CREATE_CHAT_REQUEST = 'CREATE_CHAT_REQUEST'
const CREATE_CHAT_SUCCESS = 'CREATE_CHAT_SUCCESS'
const CREATE_CHAT_ERROR = 'CREATE_CHAT_ERROR'

export const FETCH_CHAT_BYID = 'FETCH_CHAT_BYID'
const FETCH_CHAT_BYID_REQUEST = 'FETCH_CHAT_BYID_REQUEST'
const FETCH_CHAT_BYID_SUCCESS = 'FETCH_CHAT_BYID_SUCCESS'
const FETCH_CHAT_BYID_ERROR = 'FETCH_CHAT_BYID_ERROR'

export const DELETE_CHAT_BYID = 'DELETE_CHAT_BYID'
const DELETE_CHAT_BYID_REQUEST = 'DELETE_CHAT_BYID_REQUEST'
const DELETE_CHAT_BYID_SUCCESS = 'DELETE_CHAT_BYID_SUCCESS'
const DELETE_CHAT_BYID_ERROR = 'DELETE_CHAT_BYID_ERROR'

export const UPDATE_CHAT_BYID = 'UPDATE_CHAT_BYID'
const UPDATE_CHAT_BYID_REQUEST = 'UPDATE_CHAT_BYID_REQUEST'
const UPDATE_CHAT_BYID_SUCCESS = 'UPDATE_CHAT_BYID_SUCCESS'
const UPDATE_CHAT_BYID_ERROR = 'UPDATE_CHAT_BYID_ERROR'

export const FETCH_CHAT_WITH_CUSTOMER = 'FETCH_CHAT_WITH_CUSTOMER'
const FETCH_CHAT_WITH_CUSTOMER_REQUEST = 'FETCH_CHAT_WITH_CUSTOMER_REQUEST'
const FETCH_CHAT_WITH_CUSTOMER_SUCCESS = 'FETCH_CHAT_WITH_CUSTOMER_SUCCESS'
const FETCH_CHAT_WITH_CUSTOMER_ERROR = 'FETCH_CHAT_WITH_CUSTOMER_ERROR'

export const FETCH_CHAT_BY_STOREID = 'FETCH_CHAT_BY_STOREID'
const FETCH_CHAT_BY_STOREID_REQUEST = 'FETCH_CHAT_BY_STOREID_REQUEST'
const FETCH_CHAT_BY_STOREID_SUCCESS = 'FETCH_CHAT_BY_STOREID_SUCCESS'
const FETCH_CHAT_BY_STOREID_ERROR = 'FETCH_CHAT_BY_STOREID_ERROR'

export const FETCH_CHAT_BY_STORES = 'FETCH_CHAT_BY_STORES'
const FETCH_CHAT_BY_STORES_REQUEST = 'FETCH_CHAT_BY_STORES_REQUEST'
const FETCH_CHAT_BY_STORES_SUCCESS = 'FETCH_CHAT_BY_STORES_SUCCESS'
const FETCH_CHAT_BY_STORES_ERROR = 'FETCH_CHAT_BY_STORES_ERROR'

export const createChatRequest = createAction(CREATE_CHAT_REQUEST)
export const createChatSuccess = createAction(CREATE_CHAT_SUCCESS)
export const createChatError = createAction(CREATE_CHAT_ERROR)

export const fetchChatByIdRequest = createAction(FETCH_CHAT_BYID_REQUEST)
export const fetchChatByIdSuccess = createAction(FETCH_CHAT_BYID_SUCCESS)
export const fetchChatByIdError = createAction(FETCH_CHAT_BYID_ERROR)

export const deleteChatByidRequest = createAction(DELETE_CHAT_BYID_REQUEST)
export const deleteChatByidSuccess = createAction(DELETE_CHAT_BYID_SUCCESS)
export const deleteChatByidError = createAction(DELETE_CHAT_BYID_ERROR)

export const updateChatByidRequest = createAction(UPDATE_CHAT_BYID_REQUEST)
export const updateChatByidSuccess = createAction(UPDATE_CHAT_BYID_SUCCESS)
export const updateChatByidError = createAction(UPDATE_CHAT_BYID_ERROR)

export const fetchChatWithCustomerRequest = createAction(FETCH_CHAT_WITH_CUSTOMER_REQUEST)
export const fetchChatWithCustomerSuccess = createAction(FETCH_CHAT_WITH_CUSTOMER_SUCCESS)
export const fetchChatWithCustomerError = createAction(FETCH_CHAT_WITH_CUSTOMER_ERROR)

export const fetchChatByStoreidRequest = createAction(FETCH_CHAT_BY_STOREID_REQUEST)
export const fetchChatByStoreidSuccess = createAction(FETCH_CHAT_BY_STOREID_SUCCESS)
export const fetchChatByStoreidError = createAction(FETCH_CHAT_BY_STOREID_ERROR)

export const fetchChatByStoresRequest = createAction(FETCH_CHAT_BY_STORES_REQUEST)
export const fetchChatByStoresSuccess = createAction(FETCH_CHAT_BY_STORES_SUCCESS)
export const fetchChatByStoresError = createAction(FETCH_CHAT_BY_STORES_ERROR)
