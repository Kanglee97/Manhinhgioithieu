import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as serviceAPI from '../../api/serviceApi'
import * as optionAPI from '../../api/optionApi'
import { get } from 'lodash';
import { serviceChildActions as actions } from '../../actions'
import { LogManagerStore } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleUpdateServiceChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { service, callback } = action.payload
        const { Response } = yield call(serviceAPI.updateService, service)
        const data = {
            'serviceId': Response.id,
            'displayName': Response.displayName,
            'thumbnail': Response.img
        }
        yield put(actions.updateServiceChildSuccess(data));
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = action.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateServiceChildError(error.message));
        LogManagerStore("updateServiceChildError", error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleDeleteServiceChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { serviceId, callback } = action.payload
        const { Response } = yield call(serviceAPI.deleteService, serviceId)

        yield put(actions.deleteServiceChildSuccess());
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.deleteServiceChildError(error.message));
        LogManagerStore("deleteServiceChildError", error.message, error.messageLog);
    }
}

function* handleFetchModelServiceChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { serviceId, callback } = action.payload
        const { Response } = yield call(serviceAPI.getModals, serviceId)
        const data = {
            'serviceId': serviceId,
            'model': Response
        }
        yield put(actions.fetchModelServiceChildSuccess(data));

        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchModelServiceChildError(error.message));
        LogManagerStore("fetchModelServiceChildError", error.message, error.messageLog);
    }
}

function* handleFetchOptionServiceChildRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { serviceId, callback } = action.payload
        const { Response } = yield call(optionAPI.getOptionChildByServiceId, serviceId)
        const data = {
            'serviceId': serviceId,
            'option': Response
        }

        yield put(actions.fetchOptionServiceChildSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchOptionServiceChildError(error.message));
        LogManagerStore("fetchOptionServiceChildError", error.message, error.messageLog);
    }
}

function* updateServiceChildRequest() {
    yield takeFirst(actions.updateServiceChildRequest, handleUpdateServiceChildRequest)
}

function* deleteServiceChildRequest() {
    yield takeFirst(actions.deleteServiceChildRequest, handleDeleteServiceChildRequest);
}

function* fetchModelServiceChildRequest() {
    yield takeFirst(actions.fetchModelServiceChildRequest, handleFetchModelServiceChildRequest)
}

function* fetchOptionServiceChildRequest() {
    yield takeFirst(actions.fetchOptionServiceChildRequest, handleFetchOptionServiceChildRequest);
}



export default {
    updateServiceChildRequest,
    deleteServiceChildRequest,
    fetchModelServiceChildRequest,
    fetchOptionServiceChildRequest
}
