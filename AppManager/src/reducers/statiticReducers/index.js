import { handleActions } from 'redux-actions'
import { statisticActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'Statitic'

const initialState = {
    id: {},
    type: '',
    byTotal: {
        total: 0,
        byMoney: 0,
        byTranfer: 0,
    },
    byCompare: {
        now: 0,
        previous: 0,
    },
    byEmployee: [],
    byService: {
        now: [],
        previous: []
    }
};

export default handleActions(
    {
        [actions.statiticByTotalSuccess]: (state, action) => {
            const {total, byMoney, byTranfer} = action.payload
            return {
                ...state,
                byTotal: {
                    total, 
                    byMoney, 
                    byTranfer
                }
            };
        },
        [actions.statiticByTotalError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.statiticByCompareSuccess]: (state, action) => {
            const { now, previous } = action.payload
            return {
                ...state,
                byCompare: {
                    now,
                    previous
                }
            }
        },
        [actions.statiticByCompareError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.statiticByEmployeeSuccess]: (state, action) => {
            const {employee} = action.payload
            return {
                ...state, 
                byEmployee: [
                    ...employee
                ]
            }
        },
        [actions.statiticByEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.statiticByServiceSuccess]: (state, action) => {
            const { now, previous } = action.payload
            return {
                ...state,
                byService: {
                    now,
                    previous
                }
            }
        },
        [actions.statiticByServiceError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.statiticByTotalOfEmployeeSuccess]: (state, action) => {
            const {total, byMoney, byTranfer} = action.payload
            return {
                ...state,
                byTotal: {
                    total, 
                    byMoney, 
                    byTranfer
                }
            };
        },
        [actions.statiticByTotalOfEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.statiticByServiceOfEmployeeSuccess]: (state, action) => {
            const { now, previous } = action.payload
            return {
                ...state,
                byService: {
                    now,
                    previous
                }
            }
        },
        [actions.statiticByServiceOfEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)