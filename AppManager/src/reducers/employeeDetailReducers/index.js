import { handleActions } from 'redux-actions'
import { employeeActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'EmployeeDetail'

const initialState = {
    employeeId: '',
    detail: {},
    comment: {},
};

export default handleActions(
    {
        [actions.createEmployeeSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.createEmployeeError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchEmployeeSuccess]: (state, action) => {
            const { employeeId, detail } = action.payload
            return {
                ...state,
                employeeId,
                detail
            };
        },
        [actions.fetchEmployeeError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.updateEmployeeSuccess]: (state, action) => {
            const { employeeId, detail } = action.payload
            return {
                ...state,
                employeeId,
                detail
            };
        },
        [actions.updateEmployeeError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.updateEmployeePasswordSuccess]: (state, action) => {
            const { employeeId, detail } = action.payload
            return {
                ...state,
                employeeId,
                detail
            };
        },
        [actions.updateEmployeePasswordError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.deleteEmployeeSuccess]: (state, action) => {
            return {
                ...state,
            };
        },
        [actions.deleteEmployeeError]: (state, action) => {
            return {
                ...state
            };
        },

        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)