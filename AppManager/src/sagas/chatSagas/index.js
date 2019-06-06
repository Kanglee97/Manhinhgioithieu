// import { Alert } from 'react-native'
// import { call, put } from 'redux-saga/effects'
// import takeFirst from '../takeFirst'
// import * as authAPI from '../../api/authApi'
// import { get } from 'lodash';
// import { chatActions as actions } from '../../actions'
// //import {authService} from '../../services'
// import * as storeService from '../storeService'

// function* handleLoginPhoneAccountRequest(action) {
//     try {
//         const { User, callback } = action.payload
//         const { Response } = yield call(authAPI.signInManager, 'phone', User.phoneNumber)
//         console.log(Response)
//         if (Response === '') throw ({'message': 'Không tồn tại tài khoản này'})
//         yield put(actions.loginPhoneAccountSuccess(Response.serverToken));
//         yield callback && callback();
//     }
//     catch (error) {

//         yield Alert.alert('Thông Báo', error.message);
//         yield put(actions.loginPhoneAccountError(error.message));
//     }
// }

// function* loginPhoneAccountRequest() {
//     yield takeFirst(actions.loginPhoneAccountRequest, handleLoginPhoneAccountRequest);
// }

// export default {
//     loginPhoneAccountRequest,
// }

