import { handleActions } from 'redux-actions'
import { employeeActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'Employee'

const initialState = {
    storeId: '',
    employees: [],
};

export default handleActions(
    {
        [actions.fetchAllEmployeeSuccess]: (state, action) => {
            const { storeId, employees } = action.payload
            return {
                ...state,
                storeId,
                employees: [
                    ...employees
                ]
            };
        },
        [actions.fetchAllEmployeeError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.fetchAllEmployeeByManagerSuccess]: (state, action) => {
            const { storeId, employees } = action.payload
            return {
                ...state,
                storeId,
                employees: [
                    ...employees
                ]
            };
        },
        [actions.fetchAllEmployeeByManagerError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.clearEmployee]: (state, action) => {
            return {
                ...initialState
            };
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)