import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as employeeApi from '../../api/employeeApi'
import { get } from 'lodash';
import { employeeActions as actions } from '../../actions'
import _ from 'lodash';
import { LogManagerEmployee } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleCreateEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { employee, callback } = action.payload
        const { Response } = yield call(employeeApi.createEmployee, employee)
        yield put(actions.createEmployeeSuccess());
        yield callback && callback()
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.createEmployeeError(error));
        LogManagerEmployee("createEmployeeError", error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleFetchEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { employeeId, callback } = action.payload
        const { Response } = yield call(employeeApi.getEmployee, employeeId)

        const data = {
            'employeeId': Response.id,
            'detail': Response
        }
        yield put(actions.fetchEmployeeSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchEmployeeError(error.message));
        LogManagerEmployee("fetchEmployeeError", error.message, error.messageLog);
    }
}

function* handleUpdateEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { employee, callback } = action.payload
        const { Response } = yield call(employeeApi.updateEmployee, employee)


        const data = {
            'employeeId': Response.id,
            'detail': Response
        }
        console.log('handleUpdateEmployeeRequest data', data)

        yield put(actions.updateEmployeeSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateEmployeeError(error.message));
        LogManagerEmployee("updateEmployeeError", error.message, error.messageLog);
    }
}

function* handleUpdateEmployeePasswordRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { employee, callback } = action.payload
        const { Response } = yield call(employeeApi.updateEmployeePassword, employee)
        const data = {
            'employeeId': Response.id,
            'detail': Response
        }
        console.log('handleUpdateEmployeeRequest data', data)
        yield put(actions.updateEmployeePasswordSuccess(data));
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateEmployeePasswordError(error.message));
        LogManagerEmployee("updateEmployeeError", error.message, error.messageLog);
    }
}

function* handleDeleteEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { employee, callback } = action.payload
        const { Response } = yield call(employeeApi.deleteEmployee, employee)
        yield put(actions.deleteEmployeeSuccess());
        yield callback && callback()
        yield Toast.show('Xóa thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.deleteEmployeeError(error.message));
        LogManagerEmployee("deleteEmployeeError", error.message, error.messageLog);
    }
}

function* createEmployeeRequest() {
    yield takeFirst(actions.createEmployeeRequest, handleCreateEmployeeRequest);
}

function* fetchEmployeeRequest() {
    yield takeFirst(actions.fetchEmployeeRequest, handleFetchEmployeeRequest);
}

function* updateEmployeeRequest() {
    yield takeFirst(actions.updateEmployeeRequest, handleUpdateEmployeeRequest);
}

function* updateEmployeePasswordRequest() {
    yield takeFirst(actions.updateEmployeePasswordRequest, handleUpdateEmployeePasswordRequest);
}

function* deleteEmployeeRequest() {
    yield takeFirst(actions.deleteEmployeeRequest, handleDeleteEmployeeRequest);
}

export default {
    createEmployeeRequest,
    fetchEmployeeRequest,
    updateEmployeeRequest,
    updateEmployeePasswordRequest,
    deleteEmployeeRequest
}