import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as optionApi from '../../api/optionApi'
import { get } from 'lodash';
import { detailOptionActions as actions } from '../../actions'
import _ from 'lodash';
import { LogManagerStore } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleCreateOptionServiceChildRequest(action) {
    try {
        //option define: 
        //{
        //  "displayName":"Độ dài tóc",
        //  "type":"option",
        //  "serviceId":"2"
        //}
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
        throw ({ 'message': 'Không Có kết nối mạng' })
        const { option, callback } = action.payload
        const { Response } = yield call(optionApi.createOption, option)
        yield put(actions.createOptionServiceChildSuccess());
        yield callback && callback();
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);                        
        yield put(actions.createOptionServiceChildError(error.message));
        const { callback } = action.payload
        yield callback && callback();
        LogManagerStore("createOptionServiceChildError", error.message, error.messageLog);
    }
}

function* handleUpdateOptionServiceChildRequest(action) {
    try {
        //option define:
        //{
        //  "id": 12,
        //  "displayName":"123123123",
        //  "type":"option",
        //  "serviceId":"2"
        //}
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
        throw ({ 'message': 'Không Có kết nối mạng' })
        const { option, callback } = action.payload
        const { Response } = yield call(optionApi.updateOption, option)
        yield put(actions.updateOptionServiceChildSuccess())
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);                                
        yield put(actions.updateOptionServiceChildError(error.message));
        LogManagerStore("updateOptionServiceChildError", error.message, error.messageLog);
    }
}

function* handleDeleteOptionServiceChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { optionId, callback } = action.payload
        const { Response } = yield call(optionApi.deleteOption, optionId)

        yield put(actions.deleteOptionServiceChildSuccess());
        yield callback && callback()
        yield Toast.show('Xóa thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);                                        
        yield put(actions.deleteOptionServiceChildError(error.message));
        LogManagerStore("deleteOptionServiceChildError", error.message, error.messageLog);
    }
}

function* handleCreateOptionChildRequest(action) {
    try {
        //option define
        //{
        //  "displayName":"độ dài 10 cm",
        //  "type":"option",
        //  "description":"mô tảaaaaaaaaaaaaa",
        //  "price":"500000",
        //  "parentId":"7"
        //}
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
        throw ({ 'message': 'Không Có kết nối mạng' })
        const { option, callback } = action.payload
        const { Response } = yield call(optionApi.createOptionChild, option)

        yield put(actions.createOptionChildSuccess());
        yield callback && callback()
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);                                                
        yield put(actions.createOptionChildError(error.message));
        LogManagerStore("createOptionChildError", error.message, error.messageLog);
    }
}

function* handleFetchOptionChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { optionId, callback } = action.payload
        const { Response } = yield call(optionApi.fetchOptionChildByParentId, optionId)

        const data = {
            'optionId': optionId,
            'data': Response,
        }

        yield put(actions.fetchOptionChildSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);                                                        
        yield put(actions.fetchOptionChildError(error.message));
        LogManagerStore("fetchOptionChildError", error.message, error.messageLog);
    }
}

function* handleUpdateOptionChildRequest(action) {
    try {
        // option defind
        // {
        //     "id": 29,
        //     "displayName":"độ dài 10 cm",
        //     "type":"option",
        //     "description":"mô tảaaaaaaaaaaaaa",
        //     "price":"500000",
        //     "parentId":"7"
        // }
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
        throw ({ 'message': 'Không Có kết nối mạng' })
        const { option, callback } = action.payload
        const { Response } = yield call(optionApi.updateOptionChild, option)
        yield put(actions.updateOptionChildSuccess());
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);                                                                
        yield put(actions.updateOptionChildError(error.message));
        LogManagerStore("updateOptionChildError", error.message, error.messageLog);
    }
}

function* handleDeleteOptionChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { optionId, callback } = action.payload
        const { Response } = yield call(optionApi.deleteOptionChild, optionId)
        yield put(actions.deleteOptionChildSuccess());
        yield callback && callback()
        yield Toast.show('Xóa thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message,  Toast.SHORT);                                                                        
        yield put(actions.deleteOptionChildError(error.message));
        LogManagerStore("deleteOptionChildError", error.message, error.messageLog);
    }
}

function* createOptionServiceChildRequest() {
    yield takeFirst(actions.createOptionServiceChildRequest, handleCreateOptionServiceChildRequest);
}

function* updateOptionServiceChildRequest() {
    yield takeFirst(actions.updateOptionServiceChildRequest, handleUpdateOptionServiceChildRequest);
}

function* deleteOptionServiceChildRequest() {
    yield takeFirst(actions.deleteOptionServiceChildRequest, handleDeleteOptionServiceChildRequest);
}

function* createOptionChildRequest() {
    yield takeFirst(actions.createOptionChildRequest, handleCreateOptionChildRequest);
}

function* fetchOptionChildRequest() {
    yield takeFirst(actions.fetchOptionChildRequest, handleFetchOptionChildRequest);
}

function* updateOptionChildRequest() {
    yield takeFirst(actions.updateOptionChildRequest, handleUpdateOptionChildRequest);
}

function* deleteOptionChildRequest() {
    yield takeFirst(actions.deleteOptionChildRequest, handleDeleteOptionChildRequest);
}

export default {
    createOptionServiceChildRequest,
    updateOptionServiceChildRequest,
    deleteOptionServiceChildRequest,
    createOptionChildRequest,
    fetchOptionChildRequest,
    updateOptionChildRequest,
    deleteOptionChildRequest,
}