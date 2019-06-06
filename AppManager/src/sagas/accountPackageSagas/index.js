import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as accountPackageApi from '../../api/accountPackageApi'
import _, { get } from 'lodash';
import { accountPackageActions as actions } from '../../actions'
import * as storeService from '../../sagas/storeService'
import { LogManagerPersonal } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import { nameOfConnectionReducers } from '../../reducers/index';

function* handleGetAccountPackageRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không có kết nối mạng' })
        const { callback } = action.payload
        const { Response } = yield call(accountPackageApi.getAccountPackage)
        const data = {
            'listPackages': Response
        }
        yield put(actions.getAccountPackageSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.getAccountPackageError(error.message));
        LogManagerPersonal("getAccountPackageError", error.message, error.messageLog);
    }
}

function* handleAddRegisterPaymentRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { payment, callback } = action.payload
        const { Response } = yield call(accountPackageApi.addRegisterPayment, payment)
        const data = {
            'payment': Response
        }
        yield put(actions.addRegisterPaymentSuccess(data));
        yield callback && callback();
        yield Toast.show('Đăng ký thành công, đợi liên hệ từ tư vấn viên!', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show('Đăng ký thất bại, thử lại sau!', Toast.SHORT);
        yield put(actions.addRegisterPaymentError(error.message));
        LogManagerPersonal("addRegisterPaymentError", error.message);
    }
}

function* handleActiveCodeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { code, callback } = action.payload
        const { Response } = yield call(accountPackageApi.activeCode, code)
        const data = {
            'code': Response
        }
        yield put(actions.activeCodeSuccess(data));
        yield callback && callback();
        yield Toast.show('Kích hoạt thành công!', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show('Kích hoạt thất bại, thử lại sau!', Toast.SHORT);
        yield put(actions.activeCodeError(error.message));
        LogManagerPersonal("activeCodeError", error.message);
    }
}

function* handleFetchCurrentAccountStateRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { managerId, callback } = action.payload
        const { Response } = yield call(accountPackageApi.getAccountCurrentState, managerId)
        const data = {
            'currentState': Response,
        }
        yield put(actions.fetchCurrentAccountStateSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield put(actions.fetchCurrentAccountStateError(error.message));
        LogManagerPersonal("fetchCurrentAccountStateError", error.messageLog);
    }
}

function* getAccountPackageRequest() {
    yield takeFirst(actions.getAccountPackageRequest, handleGetAccountPackageRequest);
}

function* addRegisterPaymentRequest() {
    yield takeFirst(actions.addRegisterPaymentRequest, handleAddRegisterPaymentRequest);
}

function* activeCodeRequest() {
    yield takeFirst(actions.activeCodeRequest, handleActiveCodeRequest);
}

function* fetchCurrentAccountStateRequest() {
    yield takeFirst(actions.fetchCurrentAccountStateRequest, handleFetchCurrentAccountStateRequest);
}

export default {
    getAccountPackageRequest,
    addRegisterPaymentRequest,
    fetchCurrentAccountStateRequest,
    activeCodeRequest
}