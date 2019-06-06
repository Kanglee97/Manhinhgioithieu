import { handleActions } from 'redux-actions'
import { detailModalActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'

export const name = 'DetailModal'

const initialState = {
    serviceId: '',
    modalId: '',
    displayName: '',
    price : '',
    description : '',
    thumbnail: [],
};

export default handleActions(
    {
        [actions.setModalDetail]: (state, action) => {
            try {
                const {model} = action.payload
                model.thumbnail = model.thumbnail.split("_")
                console.log('setModalDetail', model)
                return {
                    ...state,
                    modalId: model.id,
                    displayName: model.displayName,
                    price : model.price,
                    description : model.description,
                    thumbnail: model.thumbnail,
                }
            } catch {
                console.log('error') 
                return {
                    ...state
                }
            }
        },
        [actions.fetchDetailModalServiceSuccess]: (state, action) => {
            const { serviceId, modalId, displayName, price , description, thumbnail} = action.payload
            console.log(serviceId, modalId, displayName, price , description, thumbnail)
            return {
                ...state,
                serviceId, 
                modalId, 
                displayName, 
                price, 
                description, 
                thumbnail
            };
        },
        [actions.fetchDetailModalServiceError]: (state, action) => {
            return {
                ...state
            };
        },
        [actions.addDetailModalServiceSuccess]: (state, action) => {
            const { modalId } = action.payload
            return {
                ...state,
                modalId
            };
        },
        [actions.addDetailModalServiceError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.updateDetailModalServiceSuccess]: (state, action) => {
            // const { serviceId, modalId, displayName, price , description, thumbnail} = action.payload
            return {
                ...state,
                // serviceId, 
                // modalId, 
                // displayName, 
                // price , 
                // description, 
                // thumbnail
            };
        },
        [actions.updateDetailModalServiceError]: (state, action) => {
            return {
                ...state
            }
        },
        [actions.deleteDetailModalServiceSuccess]: (state,action) => {
            return {
                ...initialState
            }
        },
        [actions.deleteDetailModalServiceError]: (state, action) => {
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