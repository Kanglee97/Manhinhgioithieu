import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as serviceAPI from '../../api/serviceApi'
import { get } from 'lodash';
import { serviceActions as actions } from '../../actions'
import serviceChildSagas from './serviceChildSagas'
import detailModalSagas from './detailModalSagas'
import detailOptionSagas from './detailOptionSagas'
import _ from 'lodash';
import { LogManagerStore } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleFetchServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, callback } = action.payload
        const { Response } = yield call(serviceAPI.getServices, storeId)
        console.log('response fetchStoreDetailRequest:', Response)
        const data = {
            'storeId': storeId,
            'serviceData': Response
        }
        console.log(data)
        yield put(actions.fetchServiceSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchServiceError(error.message));
        LogManagerStore("fetchServiceError", error.message, error.messageLog);
    }
}

function* handleFetchSampleServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, callback } = action.payload
        const { Response } = yield call(serviceAPI.getSampleServices, storeId)
        const data = {
            'storeId': storeId,
            'serviceData': Response
        }
        yield put(actions.fetchSampleServiceSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchSampleServiceError(error.message));
        LogManagerStore("fetchSampleServiceError", error.message, error.messageLog);
    }
}

function* handleAddServiceFromSampleServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, selectedService, callback } = action.payload
        const { Response } = yield call(serviceAPI.addServiceFromSampleService, storeId, selectedService)
        const data = {
            'response': Response,
        }
        yield put(actions.addServiceFromSampleServiceSuccess(data));
        yield callback && callback()
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.addServiceFromSampleServiceError(error.message));
        LogManagerStore("addServiceFromSampleServiceError", error.message, error.messageLog);
    }
}

function* handleFetchSampleYourServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { storeId, callback } = action.payload
        const { Response } = yield call(serviceAPI.getSampleServices, storeId)

        let tmpData = []
        // response.foreach(item => {
        //     _.concat(tmpData, item.thumbnail)
        // })
        console.log(Response)
        _.forEach(Response, function (item) {
            tmpData = _.concat(tmpData, item.thumbnail)
        })
        const data = {
            'storeId': storeId,
            'serviceData': tmpData
        }
        yield put(actions.fetchSampleYourServiceSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchSampleYourServiceError(error.message));
        LogManagerStore("fetchSampleYourServiceError", error.message, error.messageLog);
    }
}

function* handleAddYourServiceRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { service, callback } = action.payload
        const { Response } = yield call(serviceAPI.addCustomService, service)
        const data = {
            'response': Response,
        }
        yield put(actions.addYourServiceSuccess(data));
        yield callback && callback()
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.addYourServiceError(error.message));
        LogManagerStore("addYourServiceError", error.message, error.messageLog);
    }
}


function* fetchServiceRequest() {
    yield takeFirst(actions.fetchServiceRequest, handleFetchServiceRequest);
}

function* fetchSampleServiceRequest() {
    yield takeFirst(actions.fetchSampleServiceRequest, handleFetchSampleServiceRequest)
}

function* addServiceFromSampleServiceRequest() {
    yield takeFirst(actions.addServiceFromSampleServiceRequest, handleAddServiceFromSampleServiceRequest)
}

function* fetchSampleYourServiceRequest() {
    yield takeFirst(actions.fetchSampleYourServiceRequest, handleFetchSampleYourServiceRequest)
}

function* addYourServiceRequest() {
    yield takeFirst(actions.addYourServiceRequest, handleAddYourServiceRequest)
}


export default {
    fetchServiceRequest,
    fetchSampleServiceRequest,
    addServiceFromSampleServiceRequest,
    fetchSampleYourServiceRequest,
    addYourServiceRequest,
    ...serviceChildSagas,
    ...detailModalSagas,
    ...detailOptionSagas
}