import { handleActions } from 'redux-actions'
import { serviceChildActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'ServiceChild'

const initialState = {
    serviceId: '',
    displayName: '',
    thumbnail: '',
    detail: {},
    model: [],
    option: []
};

export default handleActions(
    {
        [actions.setServiceChild]: (state, action) => {
            console.log('setServiceChild')
            const { serviceId, displayName, thumbnail } = action.payload
            console.log('setServiceChild', serviceId, displayName)
            return {
                ...state,
                serviceId,
                displayName,
                thumbnail
            }
        },
        [actions.updateServiceChildSuccess]: (state, action) => {
            const {serviceId, displayName, img} = action.payload
            return {
                ...state,
                serviceId,
                displayName,
                img
            }
        },
        [actions.updateServiceChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteServiceChildSuccess]: (state, action) => {
            return {
                ...initialState
            }
        },
        [actions.deleteServiceChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchModelServiceChildSuccess]: (state, action) => {
            let { model } = action.payload
            model.forEach(item => {
                item.thumbnail = item.thumbnail.split("_")
            });
            return {
                ...state,
                model: [
                    ...model
                ]
            }
        },
        [actions.fetchModelServiceChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.fetchOptionServiceChildSuccess]: (state, action) => {
            const { serviceId, option } = action.payload
            return {
                ...state,
                serviceId,
                option: [
                    ...option
                ]
            }
        },
        [actions.fetchOptionServiceChildError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.clearServiceChild]: (state, action ) => {
            return {
                ...initialState
            }
        }, 
        [PURGE]: (state, action) => {
            return initialState;
        }
    },
    initialState
)