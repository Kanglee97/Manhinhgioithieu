import { handleActions } from 'redux-actions'
import { messengerActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Messenger'

const initialState = {
    id: '',
    title: '',
    managerId: '',
    empId: '',
    content: '',
    receiverInfo: '',
    lstReceiver: [],
    messengers: []
};

export default handleActions(
    {
        [actions.addDeviceSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.addDeviceError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchDeviceSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchDeviceError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.sendMessengerSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.sendMessengerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getMessengerManagerSuccess]: (state, action) => {
            const { managerId, messengers } = action.payload
            _.reverse(messengers)
            return {
                ...state,
                managerId,
                messengers: [
                    ...messengers
                ]
            }
        },
        [actions.getMessengerManagerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteMessengerEmployeeSuccess]: (state, action) => {
            return {
                ...state,
            }
        },
        [actions.deleteMessengerManagerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getMessengerEmployeeSuccess]: (state, action) => {
            const { messengers } = action.payload
            return {
                ...state,
                messengers: [
                    ...messengers
                ]
            }
        },
        [actions.getMessengerEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteMessengerEmployeeSuccess]: (state, action) => {
            return {
                ...state,
            }
        },
        [actions.deleteMessengerEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.addReceivedMessengerEmployee]: (state, action) => {
            try {

                const { employee } = action.payload
                const receiverExists = state.lstReceiver.find(sc => sc.id === employee.id)
                if (receiverExists) {
                    return {
                        ...state,
                        lstReceiver: state.lstReceiver.filter(sc => sc.id !== employee.id),
                    }
                }
                return {
                    ...state,
                    lstReceiver: [
                        employee,
                        ...state.lstReceiver
                    ],
                }
            }
            catch {
                return {
                    ...state
                }
            }
        },
        [actions.addAllReceivedMessengerEmployee]: (state, action) => {
            try {
                const { employees } = action.payload
                return {
                    ...state,
                    lstReceiver: [
                        ...employees
                    ]
                }
            }
            catch {
                return {
                    ...state
                }
            }
        },
        [actions.removeReceivedMessengerEmployee]: (state, action) => {
            const { employee } = action.payload
            return {
                ...state,
                lstReceiver: _.filter(state.lstReceiver, function (item) { return (item.id != employee.id) })
            }
        },
        [actions.sendAbsentformSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.sendAbsentformError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.updateAbsentformSuccess]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.updateAbsentformError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getAbsentformEmployeeSuccess]: (state, action) => {
            let { messengers } = action.payload
            _.reverse(messengers)
            return {
                ...state,
                messengers: [
                    ...messengers
                ]
            }
        },
        [actions.getAbsentformEmployeeError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.getAbsentformManagerSuccess]: (state, action) => {
            let { messengers } = action.payload
            _.reverse(messengers)
            return {
                ...state,
                messengers: [
                    ...messengers
                ]
            }
        },
        [actions.getAbsentformManagerError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.pushNotificationSuccess]: (state, action) => {
            return { ...state }
        },
        [actions.pushNotificationError]: (state, action) => {

        },
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)