import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as employeeApi from '../../api/employeeApi'
import { get } from 'lodash';
import { employeeActions as actions } from '../../actions'
import employeeDetailSagas from './employeeDetailSagas'
import _ from 'lodash';
import { LogManagerEmployee } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleFetchAllEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, callback } = action.payload
        const { Response } = yield call(employeeApi.getEmployeeByStore, storeId)
        const data = {
            'storeId': storeId,
            'employees': Response
        }
        yield put(actions.fetchAllEmployeeSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.fetchAllEmployeeError(error.message));
        LogManagerEmployee("fetchAllEmployeeError", error.message);
        yield fallback && fallback()
    }
}

function* handleFetchAllEmployeeByManagerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { ownerId, callback } = action.payload
        const { Response } = yield call(employeeApi.getEmployeeByOwner, ownerId)
        const data = {
            'ownerId': ownerId,
            'employees': Response
        }
        yield put(actions.fetchAllEmployeeByManagerSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.fetchAllEmployeeByManagerError(error.message));
        LogManagerEmployee("fetchAllEmployeeByManagerError", error.message);
    }
}

function* fetchAllEmployeeRequest() {
    yield takeFirst(actions.fetchAllEmployeeRequest, handleFetchAllEmployeeRequest);
}

function* fetchAllEmployeeByManagerRequest() {
    yield takeFirst(actions.fetchAllEmployeeByManagerRequest, handleFetchAllEmployeeByManagerRequest)
}

export default {
    fetchAllEmployeeRequest,
    fetchAllEmployeeByManagerRequest,
    ...employeeDetailSagas
}