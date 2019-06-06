import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as serviceAPI from '../../api/serviceApi'
import { get } from 'lodash';
import { detailModalActions as actions } from '../../actions'
import { LogManagerStore } from '../../components/react-native-teso';
import { convertPriceToFloat } from '../../helper/validationHelper';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleFetchDetailModalServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { modalId, callback } = action.payload
        const { Response } = yield call(serviceAPI.getDetailModals, modalId)
        const data = {
            'modalId': modalId,
            'displayName': Response.displayName,
            'price': convertPriceToFloat(Response.price),
            'description': Response.description,
            'thumbnail': Response.thumbnail.split("_"),
            'serviceId': Response.serviceId,
        }
        console.log(data)
        yield put(actions.fetchDetailModalServiceSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchDetailModalServiceError(error.message));
        LogManagerStore("fetchDetailModalServiceError", error.message, error.messageLog);
    }
}

function* handleAddDetailModalServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { model, callback } = action.payload
        const { Response } = yield call(serviceAPI.addModal, model)
        const data = {
            'modalId': Response.id
        }
        yield put(actions.addDetailModalServiceSuccess(data));
        yield callback && callback(Response)
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.addDetailModalServiceError(error.message));
        LogManagerStore("addDetailModalServiceError", error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleUpdateDetailModalServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { model, callback } = action.payload
        const { Response } = yield call(serviceAPI.updateModal, model)
        // console.log('response fetchStoreDetailRequest:', Response)
        // const data = {
        //     'modalId': Response.id,
        //     'displayName': Response.displayName,
        //     'price': Response.price,
        //     'description': Response.description,
        //     'thumbnail': Response.thumbnail.split("_"),
        //     'serviceId': Response.serviceId,
        // }
        // console.log(data)

        yield put(actions.updateDetailModalServiceSuccess())//data));
        yield callback && callback(model)
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateDetailModalServiceError(error.message));
        LogManagerStore("updateDetailModalServiceError", error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleDeleteDetailModalServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { modalId, callback } = action.payload
        const { Response } = yield call(serviceAPI.deleteModal, modalId)

        yield put(actions.deleteDetailModalServiceSuccess())
        yield callback && callback()
        yield Toast.show('Xóa thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.deleteDetailModalServiceError(error.message));
        LogManagerStore("deleteDetailModalServiceError", error.message, error.messageLog);
    }
}

function* fetchDetailModalServiceRequest() {
    yield takeFirst(actions.fetchDetailModalServiceRequest, handleFetchDetailModalServiceRequest);
}

function* addDetailModalServiceRequest() {
    yield takeFirst(actions.addDetailModalServiceRequest, handleAddDetailModalServiceRequest)
}

function* updateDetailModalServiceRequest() {
    yield takeFirst(actions.updateDetailModalServiceRequest, handleUpdateDetailModalServiceRequest)
}

function* deleteDetailModalServiceRequest() {
    yield takeFirst(actions.deleteDetailModalServiceRequest, handleDeleteDetailModalServiceRequest)
}

export default {
    fetchDetailModalServiceRequest,
    addDetailModalServiceRequest,
    updateDetailModalServiceRequest,
    deleteDetailModalServiceRequest
}
