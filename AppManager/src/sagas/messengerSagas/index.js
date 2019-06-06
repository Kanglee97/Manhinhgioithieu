import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as messengerApi from '../../api/messengerApi'
import _, { get } from 'lodash';
import { messengerActions as actions } from '../../actions'
import { LogManagerMessage } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleAddDeviceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { device, callback } = action.payload
        const { Response } = yield call(messengerApi.addDevice, device)
        yield put(actions.addDeviceSuccess());
        yield callback && callback();
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        // yield Toast.show('Cập nhật thất bại', Toast.SHORT);
        yield put(actions.addDeviceError(error.message));
        LogManagerMessage("addDeviceError", error.message, error.messageLog);
    }
}

function* handleFetchDeviceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { deviceId, callback } = action.payload
        const { Response } = yield call(messengerApi.fetchDevice, deviceId)

        yield put(actions.fetchDeviceSuccess());
        yield callback && callback(Response);
    }
    catch (error) {
        // yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.fetchDeviceError(error.message));
        LogManagerMessage("addDeviceError", error.message, error.messageLog);
    }
}

function* handleSendMessengerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { messenger, callback } = action.payload
        const { Response } = yield call(messengerApi.createMessage, messenger)
        yield put(actions.sendMessengerSuccess());
        yield callback && callback()
        yield Toast.show('Gửi tin nhắn thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show('Gửi tin nhắn thất bại', Toast.SHORT);
        yield put(actions.sendMessengerError(error.message));
        LogManagerMessage("sendMessengerError", error.message, error.messageLog);
    }
}

function* handleGetMessengerManagerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { managerId, callback } = action.payload
        const { Response } = yield call(messengerApi.getMessengerManager, managerId)
        const data = {
            'managerId': managerId,
            'messengers': Response.listMess
        }
        yield put(actions.getMessengerManagerSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show('Tải tin nhắn thất bại', Toast.SHORT);
        yield put(actions.getMessengerManagerError(error.message));
        LogManagerMessage("getMessengerManagerError", error.message, error.messageLog);
    }
}

function* handledDeleteMessengerManagerRequest(action) {
    try {
        const { item, callback } = action.payload
        const { Response } = yield call(messengerApi.deleteMessenger, item)
        yield put(actions.deleteMessengerManagerSuccess());
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show('Tải tin nhắn thất bại', Toast.SHORT);
        yield put(actions.deleteMessengerManagerError(error.message));
        LogManagerMessage("getMessengerManagerError", error.message, error.messageLog);
    }
}

function* handleGetMessengerEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(messengerApi.getMessengerEmployee, user)
        const data = {
            'messengers': Response.listMess
        }
        yield put(actions.getMessengerEmployeeSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.getMessengerEmployeeError(error.message));
        LogManagerMessage("getMessengerEmployeeError", error.message, error.messageLog);
    }
}

function* handleDeleteMessengerEmployeeRequest(action) {
    try {
        const { item, callback } = action.payload
        const { Response } = yield call(messengerApi.deleteMessenger, item)
        yield put(actions.deleteMessengerEmployeeSuccess());
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.deleteMessengerEmployeeError(error.message));
        LogManagerMessage("getMessengerEmployeeError", error.message, error.messageLog);
    }
}

function* handleSendAbsentformRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { form, callback } = action.payload
        const { Response } = yield call(messengerApi.addAbsentform, form)
        const data = {
            'messengers': Response.listMess
        }
        yield put(actions.sendAbsentformSuccess());
        yield callback && callback()
        yield Toast.show('Gửi thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.sendAbsentformError(error.message));
        LogManagerMessage("sendAbsentformError", error.message, error.messageLog);
    }
}

function* handleUpdateAbsentformRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { form, callback } = action.payload
        const { Response } = yield call(messengerApi.updateAbsentform, form)
        const data = {
            'messengers': Response.listMess
        }
        yield put(actions.updateAbsentformSuccess());
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateAbsentformError(error.message));
        LogManagerMessage("updateAbsentformError", error.message, error.messageLog);
    }
}

function* handleGetAbsentformEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(messengerApi.getAbsentformByEmployee, user)
        const data = {
            'messengers': Response.listAbsForm
        }
        yield put(actions.getAbsentformEmployeeSuccess());
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.getAbsentformEmployeeError(error.message));
        LogManagerMessage("getAbsentformEmployeeError", error.message, error.messageLog);
    }
}

function* handleGetAbsentformManagerRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { userId, callback } = action.payload
        const { Response } = yield call(messengerApi.getAbsentformByManager, userId)
        const data = {
            'messengers': Response.listAbsForm
        }
        yield put(actions.getAbsentformManagerSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.getAbsentformManagerError(error.message));
        LogManagerMessage("getAbsentformManagerError", error.message, error.messageLog);
    }
}

function* handlePushNotificationRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { data, callback } = action.payload
        const { Response } = yield call(messengerApi.pushNotificationToUser, data)
        yield put(actions.pushNotificationSuccess());
        yield callback && callback();
        yield Toast.show('Gửi thông báo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show('Gửi thông báo thất bại', Toast.SHORT);
        yield put(actions.pushNotificationError(error.message));
        LogManagerMessage("getAbsentformManagerError", error.message, error.messageLog);
    }
}

function* addDeviceRequest() {
    yield takeFirst(actions.addDeviceRequest, handleAddDeviceRequest);
}

function* fetchDeviceRequest() {
    yield takeFirst(actions.fetchDeviceRequest, handleFetchDeviceRequest);
}

function* sendMessengerRequest() {
    yield takeFirst(actions.sendMessengerRequest, handleSendMessengerRequest);
}

function* getMessengerManagerRequest() {
    yield takeFirst(actions.getMessengerManagerRequest, handleGetMessengerManagerRequest);
}

function* deleteMessengerManagerRequest() {
    yield takeFirst(actions.deleteMessengerManagerRequest, handledDeleteMessengerManagerRequest);
}

function* getMessengerEmployeeRequest() {
    yield takeFirst(actions.getMessengerEmployeeRequest, handleGetMessengerEmployeeRequest);
}

function* deleteMessengerEmployeeRequest() {
    yield takeFirst(actions.deleteMessengerEmployeeRequest, handleDeleteMessengerEmployeeRequest);
}

function* sendAbsentformRequest() {
    yield takeFirst(actions.sendAbsentformRequest, handleSendAbsentformRequest);
}

function* updateAbsentformRequest() {
    yield takeFirst(actions.updateAbsentformRequest, handleUpdateAbsentformRequest);
}

function* getAbsentformEmployeeRequest() {
    yield takeFirst(actions.getAbsentformEmployeeRequest, handleGetAbsentformEmployeeRequest);
}

function* getAbsentformManagerRequest() {
    yield takeFirst(actions.getAbsentformManagerRequest, handleGetAbsentformManagerRequest);
}

function* pushNotificationRequest() {
    yield takeFirst(actions.pushNotificationRequest, handlePushNotificationRequest);
}

export default {
    addDeviceRequest,
    fetchDeviceRequest,
    sendMessengerRequest,
    getMessengerManagerRequest,
    deleteMessengerManagerRequest,
    getMessengerEmployeeRequest,
    deleteMessengerEmployeeRequest,
    sendAbsentformRequest,
    updateAbsentformRequest,
    getAbsentformEmployeeRequest,
    getAbsentformManagerRequest,
    pushNotificationRequest
}