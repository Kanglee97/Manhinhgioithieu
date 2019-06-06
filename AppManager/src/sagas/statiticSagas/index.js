import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as statiticApi from '../../api/statiticApi'
import { get } from 'lodash';
import { statisticActions as actions } from '../../actions'
import * as storeService from '../storeService'
import { LogManagerStatistical } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import { nameOfConnectionReducers } from '../../reducers'

function* handleStatiticByTotalRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(statiticApi.getStatiticByTotal, user)
        const { total, byMoney, byTranfer } = Response
        yield put(actions.statiticByTotalSuccess({
            'total': total,
            'byMoney': byMoney,
            'byTranfer': byTranfer
        }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.statiticByTotalError(error.message));
        LogManagerStatistical("statiticByTotalError", error.message, error.messageLog);
    }
}

function* handleStatiticByCompareRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(statiticApi.getStatiticByCompare, user)
        const { now, previous } = Response
        yield put(actions.statiticByCompareSuccess({
            'now': now,
            'previous': previous
        }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.statiticByCompareError(error.message));
        LogManagerStatistical("statiticByCompareError", error.message, error.messageLog);
    }
}

function* handleStatiticByEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(statiticApi.getStatiticByEmployee, user)
        yield put(actions.statiticByEmployeeSuccess({
            'employee': Response
        }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.statiticByEmployeeError(error.message));
        LogManagerStatistical("statiticByEmployeeError", error.message, error.messageLog);
    }
}

function* handleStatiticByServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(statiticApi.getStatiticByService, user)
        const { now, previous } = Response
        yield put(actions.statiticByServiceSuccess({
            'now': now,
            'previous': previous
        }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.statiticByServiceError(error.message));
        LogManagerStatistical("statiticByServiceError", error.message, error.messageLog);
    }
}

function* handleStatiticByTotalOfEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(statiticApi.getStatiticByTotalOfEmployee, user.id, { 'type': user.type })
        const { total, byMoney, byTranfer } = Response
        yield put(actions.statiticByTotalOfEmployeeSuccess({
            'total': total,
            'byMoney': byMoney,
            'byTranfer': byTranfer
        }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.statiticByTotalOfEmployeeError(error.message));
        LogManagerStatistical("statiticByTotalError", error.message, error.messageLog);
    }
}

function* handleStatiticByServiceOfEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(statiticApi.getStatiticByServiceOfEmployee, user.id, { 'type': user.type })
        const { now, previous } = Response
        yield put(actions.statiticByServiceOfEmployeeSuccess({
            'now': now,
            'previous': previous
        }));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.statiticByServiceOfEmployeeError(error.message));
        LogManagerStatistical("statiticByServiceError", error.message, error.messageLog);
    }
}


function* statiticByTotalRequest() {
    yield takeFirst(actions.statiticByTotalRequest, handleStatiticByTotalRequest);
}

function* statiticByCompareRequest() {
    yield takeFirst(actions.statiticByCompareRequest, handleStatiticByCompareRequest)
}

function* statiticByEmployeeRequest() {
    yield takeFirst(actions.statiticByEmployeeRequest, handleStatiticByEmployeeRequest);
}

function* statiticByServiceRequest() {
    yield takeFirst(actions.statiticByServiceRequest, handleStatiticByServiceRequest)
}

function* statiticByTotalOfEmployeeRequest() {
    yield takeFirst(actions.statiticByTotalOfEmployeeRequest, handleStatiticByTotalOfEmployeeRequest);
}

function* statiticByServiceOfEmployeeRequest() {
    yield takeFirst(actions.statiticByServiceOfEmployeeRequest, handleStatiticByServiceOfEmployeeRequest)
}

export default {
    statiticByTotalRequest,
    statiticByCompareRequest,
    statiticByEmployeeRequest,
    statiticByServiceRequest,
    statiticByTotalOfEmployeeRequest,
    statiticByServiceOfEmployeeRequest
}