import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as authAPI from '../../api/authApi'
import { get } from 'lodash';
import { authActions as actions, profileActions } from '../../actions'
//import {authService} from '../../services'
import * as storeService from '../storeService'
import { LogManagerLogin } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import { nameOfConnectionReducers } from '../../reducers'

function* handleLoginPhoneAccountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { User, callback } = action.payload
        const { Response } = yield call(authAPI.signInManager, 'phone', User.phoneNumber)
        console.log(Response)
        if (Response === '') {
            yield Toast.show('Không tồn tại tài khoản này', Toast.SHORT);
            throw ({ 'message': 'Không tồn tại tài khoản này' })
        }
        yield put(actions.loginPhoneAccountSuccess(Response.serverToken));
        yield callback && callback();
        yield Toast.show('Đăng nhập thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.loginPhoneAccountError(error.message));
        LogManagerLogin('loginPhoneAccountError', error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleLogoutPhoneAccountRequest(action) {
    try {
        const { callback } = action.payload
        storeService.purge()
        yield put(actions.logoutPhoneAccountSuccess())
        storeService.dispatch(profileActions.clearProfile())
        yield callback && callback()
        yield Toast.show('Đăng xuất thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show('Đăng xuất thất bại', Toast.SHORT);
        yield put(actions.logoutPhoneAccountError(error.message))
        LogManagerLogin('logoutPhoneAccountError', error.message);
        yield fallback && fallback()
    }
}

function* handleLoginFacebookAccountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { User, callback } = action.payload
        const { Response } = yield call(authAPI.signInManager, 'facebook', User)
        if (Response === '') {
            yield Toast.show('Không tồn tại tài khoản này', Toast.SHORT);
            throw ({ 'message': 'Không tồn tại tài khoản này' })
        }
        yield put(actions.loginFacebookAccountSuccess(Response.serverToken));
        yield callback && callback(User);
        yield Toast.show('Đăng nhập thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.loginFacebookAccountError(error.message));
        LogManagerLogin('loginFacebookAccountError', error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleLogoutFacebookAccountRequest(action) {
    try {
        const { callback } = action.payload
        storeService.purge()
        yield put(actions.logoutFacebookAccountSuccess())
        storeService.dispatch(profileActions.clearProfile())
        yield callback && callback()
        yield Toast.show('Đăng xuất thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show('Đăng xuất thất bại', Toast.SHORT);
        yield put(actions.logoutFacebookAccountError(error.message))
        LogManagerLogin('logoutFacebookAccountError', error.message);
        yield fallback && fallback()
    }
}

function* handleLoginGoogleAccountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { User, callback } = action.payload
        const { Response } = yield call(authAPI.signInManager, 'gmail', User)

        if (Response === '') {
            yield Toast.show('Không tồn tại tài khoản này', Toast.SHORT);
            throw ({ 'message': 'Không tồn tại tài khoản này' })
        }
        yield put(actions.loginGoogleAccountSuccess(Response.serverToken));
        yield callback && callback();
        yield Toast.show('Đăng nhập thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.loginGoogleAccountError(error.message));
        LogManagerLogin('loginGoogleAccountError', error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleLogoutGoogleAccountRequest(action) {
    try {
        const { callback } = action.payload
        storeService.purge()
        yield put(actions.logoutGoogleAccountSuccess())
        storeService.dispatch(profileActions.clearProfile())
        yield callback && callback()
        yield Toast.show('Đăng xuất thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show('Đăng xuất thất bại', Toast.SHORT);
        yield put(actions.logoutGoogleAccountError(error.message));
        LogManagerLogin('logoutGoogleAccountError', error.message);
        yield fallback && fallback()
    }
}

function* handleLoginEmployeeAccountRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(authAPI.loginEmployee, user)
        const data = {
            'user': Response
        }
        if (Response.id == 0) {
            yield Toast.show('Tài khoản không tồn tại', Toast.SHORT);
            throw ({ message: 'Tài khoản không tồn tại' });
        }
        yield put(actions.loginEmployeeAccountSuccess())
        yield callback && callback(data)
        yield Toast.show('Đăng nhập thành công', Toast.SHORT);
    } catch (error) {
        const { fallback } = action.payload
        storeService.purge()
        yield Toast.show(`Đăng nhập thất bại`, Toast.SHORT);
        yield put(actions.loginEmployeeAccountError(error.message))
        LogManagerLogin('loginEmployeeAccountError', error.message, error.messageLog);
        yield fallback && fallback()
    }
}

function* handleLogoutEmployeeAccountRequest(action) {
    try {
        const { callback } = action.payload
        storeService.purge()
        yield put(actions.logoutEmployeeAccountSuccess())
        yield callback && callback()
        yield Toast.show('Đăng xuất thành công', Toast.SHORT);
    }
    catch (error) {
        const { fallback } = actions.payload
        yield Toast.show('Đăng xuất thất bại', Toast.SHORT);
        yield put(actions.logoutEmployeeAccountError(error.message));
        LogManagerLogin('logoutEmployeeAccountError', error.message);
        yield fallback && fallback()
    }
}

function* loginPhoneAccountRequest() {
    yield takeFirst(actions.loginPhoneAccountRequest, handleLoginPhoneAccountRequest);
}

function* logoutPhoneAccountRequest() {
    yield takeFirst(actions.logoutPhoneAccountRequest, handleLogoutPhoneAccountRequest)
}

function* loginFacebookAccountRequest() {
    yield takeFirst(actions.loginFacebookAccountRequest, handleLoginFacebookAccountRequest);
}

function* logoutFacebookAccountRequest() {
    yield takeFirst(actions.logoutFacebookAccountRequest, handleLogoutFacebookAccountRequest)
}

function* loginGoogleAccountRequest() {
    yield takeFirst(actions.loginGoogleAccountRequest, handleLoginGoogleAccountRequest);
}

function* logoutGoogleAccountRequest() {
    yield takeFirst(actions.logoutGoogleAccountRequest, handleLogoutGoogleAccountRequest)
}

function* loginEmployeeAccountRequest() {
    yield takeFirst(actions.loginEmployeeAccountRequest, handleLoginEmployeeAccountRequest);
}

function* logoutEmployeeAccountRequest() {
    yield takeFirst(actions.logoutEmployeeAccountRequest, handleLogoutEmployeeAccountRequest)
}

export default {
    loginPhoneAccountRequest,
    logoutPhoneAccountRequest,
    loginFacebookAccountRequest,
    logoutFacebookAccountRequest,
    loginGoogleAccountRequest,
    logoutGoogleAccountRequest,
    loginEmployeeAccountRequest,
    logoutEmployeeAccountRequest
}

