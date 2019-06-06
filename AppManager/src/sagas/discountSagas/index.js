import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as discountApi from '../../api/discountApi'
import { discountActions as actions } from '../../actions'
import _, { get } from 'lodash';
import { LogManagerStore } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleCreateDiscountRequest(action) {
    try {
        // {
        //     "displayName":"asd",
        //     "description":"asd",
        //     "startDate":"asd",
        //     "endDate":"asd",
        //     "thumbnail":"asd",
        //     "price":"123",
        //     "promotion":"123",
        //     "storeId":3,
        //     "listServiceId":[1,2,3]
        // }
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { discount, callback } = action.payload
        console.log(JSON.stringify(discount))
        const { Response } = yield call(discountApi.createDiscount, discount)
        const data = {

        }
        yield put(actions.createDiscountSuccess(data));
        yield callback && callback()
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.createDiscountError(error.message));
        LogManagerStore("createDiscountError", error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleFetchDiscountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, callback } = action.payload
        const { Response } = yield call(discountApi.getDiscount, storeId)
        const data = {
            'storeId': storeId,
            'listDiscount': Response
        }
        yield put(actions.fetchDiscountSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchDiscountError(error.message));
        LogManagerStore("fetchDiscountError", error.message, error.messageLog);
    }
}

function* handleFetchDetailDiscountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { discountId, callback } = action.payload
        const { Response } = yield call(discountApi.getDetailDiscount, discountId)
        const data = {
            'discount': Response
        }
        yield put(actions.fetchDetailDiscountSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchDetailDiscountError(error.message));
        LogManagerStore("fetchDetailDiscountError", error.message, error.messageLog);
    }
}

function* handleUpdateDetailDiscountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { discount, callback } = action.payload
        const { Response } = yield call(discountApi.updateDiscount, discount)
        const data = {
            'discount': Response
        }
        yield put(actions.updateDetailDiscountSuccess(data));
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateDetailDiscountError(error.message));
        LogManagerStore("updateDetailDiscountError", error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleDeleteDetailDiscountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { discountId, callback } = action.payload
        const { Response } = yield call(discountApi.deleteDiscount, discountId)
        yield put(actions.deleteDetailDiscountSuccess());
        yield callback && callback()
        yield Toast.show('Xóa thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.deleteDetailDiscountError(error.message));
        LogManagerStore("deleteDetailDiscountError", error.message, error.messageLog);
    }
}

function* createDiscountRequest() {
    yield takeFirst(actions.createDiscountRequest, handleCreateDiscountRequest);
}

function* fetchDiscountRequest() {
    yield takeFirst(actions.fetchDiscountRequest, handleFetchDiscountRequest);
}

function* fetchDetailDiscountRequest() {
    yield takeFirst(actions.fetchDetailDiscountRequest, handleFetchDetailDiscountRequest);
}

function* updateDetailDiscountRequest() {
    yield takeFirst(actions.updateDetailDiscountRequest, handleUpdateDetailDiscountRequest);
}

function* deleteDetailDiscountRequest() {
    yield takeFirst(actions.deleteDetailDiscountRequest, handleDeleteDetailDiscountRequest);
}


export default {
    createDiscountRequest,
    fetchDiscountRequest,
    fetchDetailDiscountRequest,
    updateDetailDiscountRequest,
    deleteDetailDiscountRequest,
}