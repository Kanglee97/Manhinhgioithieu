import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as bookingApi from '../../api/bookingApi'
import _, { get } from 'lodash';
import { bookingActions as actions } from '../../actions'
import { LogCustomerMessage } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import * as storeService from '../storeService'
import { nameOfConnectionReducers } from '../../reducers'

function* handleCreateBookingRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { booking, callback } = action.payload
        const { Response } = yield call(bookingApi.createBooking, booking)
        console.log('response createBookingRequest', booking);
        const data = {
            'booking': Response
        }
        yield put(actions.createBookingSuccess(data));
        yield callback && callback();
        yield Toast.show('Đặt thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.createBookingError(error.message));
        LogCustomerMessage("createBookingError", error.message);
    }
}

function* handleGetDetailBookingRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(bookingApi.getDetailCreateBooking, user)
        const data = {
            'bookingId': Response.id,
            'booking': Response
        }
        console.log(Response);
        yield put(actions.getDetailBookingSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.getDetailBookingError(error.message));
        LogCustomerMessage("createBookingError", error.message);
    }
}

function* handleUpdateBookingRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { booking, callback } = action.payload
        const { Response } = yield call(bookingApi.updateBooking, booking)
        const data = {
            'booking': Response
        }
        console.log('booking', booking);
        yield put(actions.updateBookingSuccess(data));
        yield callback && callback();
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    }
    catch (error) {
        yield Toast.show('Cập nhật thất bại', Toast.SHORT);
        yield put(actions.updateBookingError(error.message));
        LogCustomerMessage("createBookingError", error.message);
    }
}

function* handleDeleteBookingRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { bookingId, callback } = action.payload
        const { Response } = yield call(bookingApi.deleteBooking, bookingId)

        yield put(actions.deleteBookingSuccess());
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Cập nhật thất bại', Toast.SHORT);
        yield put(actions.deleteBookingError(error.message));
        LogCustomerMessage("createBookingError", error.message);
    }
}

function* handleGetEmployeesBookingRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { booking, callback } = action.payload
        const { Response } = yield call(bookingApi.getEmployeesBooking, booking)
        const data = {
            'listBooking': Response
        }
        yield put(actions.getEmployeesBookingSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại ', Toast.SHORT);
        yield put(actions.getEmployeesBookingError(error.message));
        LogCustomerMessage("createBookingError", error.message);
    }
}

function* handleGetStoreBookingRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { booking,  callback } = action.payload
        const { Response } = yield call(bookingApi.getStoreBooking, booking)
        const data = {
            'listBooking': Response,
        }
        yield put(actions.getStoreBookingSuccess(data));
        yield callback && callback();
    }
    catch (error) {
        yield Toast.show('Tải thất bại', Toast.SHORT);
        yield put(actions.getStoreBookingError(error.message));
        LogCustomerMessage("getStoreBookingError", error.message);
    }
}

function* createBookingRequest() {
    yield takeFirst(actions.createBookingRequest, handleCreateBookingRequest);
}

function* getDetailBookingRequest() {
    yield takeFirst(actions.getDetailBookingRequest, handleGetDetailBookingRequest);
}

function* updateBookingRequest() {
    yield takeFirst(actions.updateBookingRequest, handleUpdateBookingRequest);
}

function* deleteBookingRequest() {
    yield takeFirst(actions.deleteBookingRequest, handleDeleteBookingRequest);
}

function* getEmployeesBookingRequest() {
    yield takeFirst(actions.getEmployeesBookingRequest, handleGetEmployeesBookingRequest);
}

function* getStoreBookingRequest() {
    yield takeFirst(actions.getStoreBookingRequest, handleGetStoreBookingRequest);
}

export default {
    createBookingRequest,
    getDetailBookingRequest,
    updateBookingRequest,
    deleteBookingRequest,
    getEmployeesBookingRequest,
    getStoreBookingRequest
}