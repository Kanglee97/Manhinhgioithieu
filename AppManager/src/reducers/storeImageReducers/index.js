import { handleActions } from 'redux-actions'
import { storeImageActions as actions } from '../../actions'
import { PURGE } from 'redux-persist'
import _ from 'lodash'

export const name = 'Store Image'

const initialState = {
    listImage: []
};

export default handleActions(
    {
        [actions.addImage]: (state, action) => {
            const { image } = action.payload
            return {
                ...state,
                listImage: _.concat(state.listImage, image)
            }
        },
        [actions.removeImage]: (state, action) => {
            const { image } = action.payload
            return {
                ...state,
                listImage: _.filter(state.listImage, function (item) { return item !== image })
            }
        },
        [actions.removeAllImage]: (state, action) => {
            return {
                ...state,
                listImage: []
            }
        },
    },
    initialState
)