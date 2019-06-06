import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as customerApi from '../../api/customerApi'
import { get } from 'lodash';
import { customerActions as actions } from '../../actions'
import * as storeService from '../storeService';
import { LogManagerCustomer } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import { nameOfConnectionReducers } from '../../reducers'

function* handleCreateCustomerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(customerApi.createCustomer, user)
        yield put(actions.createCustomerSuccess());
        yield callback && callback(Response);
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.createCustomerError(error.message));
        LogManagerCustomer('createCustomerError', error.message, error.messageLog);
    }
}

function* handleGetAllCustomerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(customerApi.getAllCustomer, user)
        yield put(actions.getAllCustomerSuccess({ 'customers': Response }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.getAllCustomerError(error.message));
        LogManagerCustomer('getAllCustomerError', error.message, error.messageLog);
    }
}

function* handleGetCustomerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(customerApi.getCustomer, user)
        yield put(actions.getCustomerSuccess({ 'customer': Response }));
        yield callback && callback(Response);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.getCustomerError(error.message));
        LogManagerCustomer('getCustomerError', error.message, error.messageLog);
    }
}

function* handleFindCustomerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(customerApi.findCustomerByPhone, user)
        if (Response.id == 0) throw ({
            'message': 'Không tìm thấy khách hàng'
        })
        yield put(actions.findCustomerSuccess());
        yield callback && callback(Response);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.findCustomerError(error.message));
        LogManagerCustomer('findCustomerError', error.message, error.messageLog);
    }
}

function* handleGetDetailTransactionCustomerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(customerApi.getDetailTransactionCustomer, user)

        yield put(actions.getDetailTransactionCustomerSuccess({ 'transaction': Response }));
        yield callback && callback(Response);
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.getDetailTransactionCustomerError(error.message));
        LogManagerCustomer('getDetailTransactionCustomerError', error.message, error.messageLog);
    }
}

function* createCustomerRequest() {
    yield takeFirst(actions.createCustomerRequest, handleCreateCustomerRequest);
}

function* getCustomerRequest() {
    yield takeFirst(actions.getCustomerRequest, handleGetCustomerRequest)
}

function* getAllCustomerRequest() {
    yield takeFirst(actions.getAllCustomerRequest, handleGetAllCustomerRequest)
}

function* findCustomerRequest() {
    yield takeFirst(actions.findCustomerRequest, handleFindCustomerRequest)
}

function* getDetailTransactionCustomerRequest() {
    yield takeFirst(actions.getDetailTransactionCustomerRequest, handleGetDetailTransactionCustomerRequest)
}

export default {
    createCustomerRequest,
    getCustomerRequest,
    getAllCustomerRequest,
    findCustomerRequest,
    getDetailTransactionCustomerRequest
}

