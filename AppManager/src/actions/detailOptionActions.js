import {createAction} from 'redux-actions'

export const CREATE_OPTION_SERVICE_CHILD  = 'CREATE_OPTION_SERVICE_CHILD '
const CREATE_OPTION_SERVICE_CHILD_REQUEST = 'CREATE_OPTION_SERVICE_CHILD_REQUEST'
const CREATE_OPTION_SERVICE_CHILD_SUCCESS = 'CREATE_OPTION_SERVICE_CHILD _SUCCESS'
const CREATE_OPTION_SERVICE_CHILD_ERROR = 'CREATE_OPTION_SERVICE_CHILD_ERROR'

export const UPDATE_OPTION_SERVICE_CHILD = 'UPDATE_OPTION_SERVICE_CHILD'
const UPDATE_OPTION_SERVICE_CHILD_REQUEST = 'UPDATE_OPTION_SERVICE_CHILD_REQUEST'
const UPDATE_OPTION_SERVICE_CHILD_SUCCESS = 'UPDATE_OPTION_SERVICE_CHILD_SUCCESS'
const UPDATE_OPTION_SERVICE_CHILD_ERROR = 'UPDATE_OPTION_SERVICE_CHILD_ERROR'

export const DELETE_OPTION_SERVICE_CHILD = 'DELETE_OPTION_SERVICE_CHILD'
const DELETE_OPTION_SERVICE_CHILD_REQUEST = 'DELETE_OPTION_SERVICE_CHILD_REQUEST'
const DELETE_OPTION_SERVICE_CHILD_SUCCESS = 'DELETE_OPTION_SERVICE_CHILD_SUCCESS'
const DELETE_OPTION_SERVICE_CHILD_ERROR = 'DELETE_OPTION_SERVICE_CHILD_ERROR'

export const CREATE_OPTION_CHILD = 'CREATE_OPTION_CHILD'
const CREATE_OPTION_CHILD_REQUEST = 'CREATE_OPTION_CHILD_REQUEST'
const CREATE_OPTION_CHILD_SUCCESS = 'CREATE_OPTION_CHILD_SUCCESS'
const CREATE_OPTION_CHILD_ERROR = 'CREATE_OPTION_CHILD_ERROR'

export const FETCH_OPTION_CHILD = 'FETCH_OPTION_CHILD'
const FETCH_OPTION_CHILD_REQUEST = 'FETCH_OPTION_CHILD_REQUEST'
const FETCH_OPTION_CHILD_SUCCESS = 'FETCH_OPTION_CHILD_SUCCESS'
const FETCH_OPTION_CHILD_ERROR = 'FETCH_OPTION_CHILD_ERROR'

export const UPDATE_OPTION_CHILD = 'UPDATE_OPTION_CHILD'
const UPDATE_OPTION_CHILD_REQUEST = 'UPDATE_OPTION_CHILD_REQUEST'
const UPDATE_OPTION_CHILD_SUCCESS = 'UPDATE_OPTION_CHILD_SUCCESS'
const UPDATE_OPTION_CHILD_ERROR = 'UPDATE_OPTION_CHILD_ERROR'

export const DELETE_OPTION_CHILD = 'DELETE_OPTION_CHILD'
const DELETE_OPTION_CHILD_REQUEST = 'DELETE_OPTION_CHILD_REQUEST'
const DELETE_OPTION_CHILD_SUCCESS = 'DELETE_OPTION_CHILD_SUCCESS'
const DELETE_OPTION_CHILD_ERROR = 'DELETE_OPTION_CHILD_ERROR'

export const createOptionServiceChildRequest = createAction(CREATE_OPTION_SERVICE_CHILD_REQUEST)
export const createOptionServiceChildSuccess = createAction(CREATE_OPTION_SERVICE_CHILD_SUCCESS)
export const createOptionServiceChildError = createAction(CREATE_OPTION_SERVICE_CHILD_ERROR)

export const updateOptionServiceChildRequest = createAction(UPDATE_OPTION_SERVICE_CHILD_REQUEST)
export const updateOptionServiceChildSuccess = createAction(UPDATE_OPTION_SERVICE_CHILD_SUCCESS)
export const updateOptionServiceChildError = createAction(UPDATE_OPTION_SERVICE_CHILD_ERROR)

export const deleteOptionServiceChildRequest = createAction(DELETE_OPTION_SERVICE_CHILD_REQUEST)
export const deleteOptionServiceChildSuccess = createAction(DELETE_OPTION_SERVICE_CHILD_SUCCESS)
export const deleteOptionServiceChildError = createAction(DELETE_OPTION_SERVICE_CHILD_ERROR)

export const createOptionChildRequest = createAction(CREATE_OPTION_CHILD_REQUEST)
export const createOptionChildSuccess = createAction(CREATE_OPTION_CHILD_SUCCESS)
export const createOptionChildError = createAction(CREATE_OPTION_CHILD_ERROR)

export const fetchOptionChildRequest = createAction(FETCH_OPTION_CHILD_REQUEST)
export const fetchOptionChildSuccess = createAction(FETCH_OPTION_CHILD_SUCCESS)
export const fetchOptionChildError = createAction(FETCH_OPTION_CHILD_ERROR)

export const updateOptionChildRequest = createAction(UPDATE_OPTION_CHILD_REQUEST)
export const updateOptionChildSuccess = createAction(UPDATE_OPTION_CHILD_SUCCESS)
export const updateOptionChildError = createAction(UPDATE_OPTION_CHILD_ERROR)

export const deleteOptionChildRequest = createAction(DELETE_OPTION_CHILD_REQUEST)
export const deleteOptionChildSuccess = createAction(DELETE_OPTION_CHILD_SUCCESS)
export const deleteOptionChildError = createAction(DELETE_OPTION_CHILD_ERROR)


const SET_OPTION = 'SET_OPTION'
export const setOption = createAction(SET_OPTION)

export const SET_OPTION_CHILD = 'SET_OPTION_CHILD'
export const setOptionChild = createAction(SET_OPTION_CHILD)