import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as storeDetailAPI from '../../api/storeDetailApi'
import { get } from 'lodash';
import { storeDetailActions as actions } from '../../actions';
import { LogManagerStore } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../../sagas/storeService'
import { nameOfConnectionReducers } from '../../reducers'


function* handleFetchStoreDetailRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        console.log(action.payload)
        const { storeId, callback } = action.payload
        console.log(storeId, callback)
        const { Response } = yield call(storeDetailAPI.getStoreInfo, storeId)
        console.log('response fetchStoreDetailRequest:', Response)
        const data = {
            'storeId': storeId,
            'data': Response
        }
        console.log('data fetchStoreDetailRequest:', data)
        yield put(actions.fetchStoreDetailSuccess(data));
        yield callback && callback(Response);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchStoreDetailError(error.message));
        LogManagerStore("fetchStoreDetailError", error.message, error.messageLog);
    }
}

function* handleUpdateStoreDetailRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        console.log(action.payload)
        const { store, storeId, callback } = action.payload
        console.log(store, storeId, callback)
        const { Response } = yield call(storeDetailAPI.updateStoreInfo, store)
        console.log('response updateStoreDetailRequest:', Response)
        const data = {
            'storeId': storeId,
            'data': Response
        }
        console.log('data updateStoreDetailRequest:', data)
        yield put(actions.updateStoreDetailSuccess(data));
        yield callback && callback(Response)
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateStoreDetailError(error.message));
        LogManagerStore("fetchStoreDetailError", error.message, error.messageLog);
    }
}

function* handleDeleteStoreDetailRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, callback } = action.payload
        const { Response } = yield call(storeDetailAPI.deleteStore, storeId)
        yield put(actions.deleteStoreDetailSuccess());
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.deleteStoreDetailError(error.message));
        LogManagerStore("fetchStoreDetailError", error.message, error.messageLog);
    }
}

function* fetchStoreDetailRequest() {
    yield takeFirst(actions.fetchStoreDetailRequest, handleFetchStoreDetailRequest);
}

function* updateStoreDetailRequest() {
    yield takeFirst(actions.updateStoreDetailRequest, handleUpdateStoreDetailRequest);
}

function* deleteStoreDetailRequest() {
    yield takeFirst(actions.deleteStoreDetailRequest, handleDeleteStoreDetailRequest);
}

export default {
    fetchStoreDetailRequest,
    updateStoreDetailRequest,
    deleteStoreDetailRequest
}