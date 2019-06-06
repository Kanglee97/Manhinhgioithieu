import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as orderApi from '../../api/orderApi'
import { get } from 'lodash';
import { orderActions as actions } from '../../actions'
import _ from 'lodash';
import { LogManagerOrder } from '../../components/react-native-teso';
import { convertPriceToFloat } from '../../helper/validationHelper';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService';
import { nameOfConnectionReducers } from '../../reducers'

function* handleCreateDetailOrderRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { id, order, callback } = action.payload
        const { Response } = yield call(orderApi.createOrder, order)
        const data = {
            'order': Response,
        }
        yield put(actions.createDetailOrderSuccess(data))
        yield callback && callback(id)
        yield Toast.show('Tạo thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.createDetailOrderError(error.message));
        LogManagerOrder("createDetailOrderError", error.message, error.messageLog);
    }
}

function* handleFetchDetailOrderRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { id, callback } = action.payload
        const { Response } = yield call(orderApi.fetchDetailOrder, id)
        let _service = []
        let _promotion = []
        _.forEach(Response.transactionDetails, function (promotionItem) {
            promotionItem.detail = JSON.parse(promotionItem.detail)
            switch (promotionItem.type) {
                case 'SERVICE':
                    _service = _.concat(_service, {
                        'id': promotionItem.id,
                        'displayName': promotionItem.name,
                        'price': convertPriceToFloat(promotionItem.price),
                        'data': promotionItem.detail
                    })
                    break;
                case 'PROMOTION':
                    _promotion = _.concat(_promotion, {
                        'id': promotionItem.id,
                        'displayName': promotionItem.name,
                        'detail': promotionItem.detail
                    })
                    break;
            }
        })
        const data = {
            'id': Response.id,
            'empId': Response.empId,
            'userId': Response.userId,
            'phone': Response.phone,
            'cusName': Response.cusName,
            'totalPrice': Response.totalPrice,
            'service': _service,
            'promotion': _promotion,
            'payment': Response.payment
        }
        console.log(Response)
        yield put(actions.fetchDetailOrderSuccess(data))
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.fetchDetailOrderError(error.message));
        LogManagerOrder("fetchDetailOrderError", error.message, error.messageLog);
    }
}

function* handleFetchOrderByEmployeeRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { employee, callback } = action.payload
        const { Response } = yield call(orderApi.fetchOrdersByEmployee, employee)
        const data = {
            'listOrder': Response
        }
        yield put(actions.fetchOrderByEmployeeSuccess(data))
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.fetchOrderByEmployeeError(error.message));
        LogManagerOrder("fetchOrderByEmployeeError", error.message, error.messageLog);
    }
}

function* handleFetchOrderByStoreRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { store, callback } = action.payload
        const { Response } = yield call(orderApi.fetchOrdersByStore, store)
        const data = {
            'listOrder': Response
        }
        yield put(actions.fetchOrderByStoreSuccess(data))
        yield callback && callback()
    }
    catch (error) {
        console.log(error)
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.fetchOrderByStoreError(error.message));
        LogManagerOrder("fetchOrderByStoreError", error.message, error.messageLog);
    }
}

function* createDetailOrderRequest() {
    yield takeFirst(actions.createDetailOrderRequest, handleCreateDetailOrderRequest);
}

function* fetchDetailOrderRequest() {
    yield takeFirst(actions.fetchDetailOrderRequest, handleFetchDetailOrderRequest);
}

function* fetchOrderByEmployeeRequest() {
    yield takeFirst(actions.fetchOrderByEmployeeRequest, handleFetchOrderByEmployeeRequest);
}

function* fetchOrderByStoreRequest() {
    yield takeFirst(actions.fetchOrderByStoreRequest, handleFetchOrderByStoreRequest);
}

export default {
    createDetailOrderRequest,
    fetchDetailOrderRequest,
    fetchOrderByEmployeeRequest,
    fetchOrderByStoreRequest
}