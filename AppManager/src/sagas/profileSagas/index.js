import { Alert } from 'react-native'
import { call, put } from 'redux-saga/effects'
import takeFirst from '../takeFirst'
import * as profileAPI from '../../api/profileApi'
import { get } from 'lodash';
import { profileActions as actions, storeDetailActions } from '../../actions'
import * as storeService from '../../sagas/storeService'
import { LogManagerPersonal } from '../../components/react-native-teso';
import Toast from 'react-native-simple-toast';
import { nameOfConnectionReducers } from '../../reducers'

function* handlefetchProfileWithTokenRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { token, callback } = action.payload
        console.log(token, callback)
        const responeseUser = yield call(profileAPI.getUserInfo, token)
        //const responeseUser = yield call(profileAPI.getUserInfoById, 32)
        
        console.log(responeseUser)
        if (responeseUser.Response.id == 0) {
            yield Toast.show('Tài khoản không tồn tại', Toast.SHORT);
            throw ({ message: 'Tài khoản không tồn tại' })
        }
        const responeseStoreList = yield call(profileAPI.getStoreList, responeseUser.Response.id)
        console.log(responeseStoreList)
        const data = {
            'user': responeseUser.Response,
            'storeList': responeseStoreList.Response
        }
        yield put(actions.fetchProfileWithTokenSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        storeService.purge()
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchProfileWithTokenError(error.message));
        LogManagerPersonal("fetchProfileWithTokenError", error.message, error.messageLog);
    }
}

function* handlefetchProfileRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { userId, callback } = action.payload
        const { Response } = yield call(profileAPI.getUserInfoById, userId)
        const data = {
            'user': Response,
        }
        yield put(actions.fetchProfileSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchProfileError(error.message));
        LogManagerPersonal("fetchProfileError", error.message, error.messageLog);
    }
}

function* handleFetchStoreByProfleRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { userId, callback } = action.payload
        const { Response } = yield call(profileAPI.getStoreList, userId)
        const data = {
            'storeList': Response,
        }

        yield put(actions.fetchStoreByProfleSuccess(data));
        yield callback && callback()
    }
    catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.fetchStoreByProfleError(error.message));
        LogManagerPersonal("fetchStoreByProfleError", error.message, error.messageLog);
    }
}

function* handleUpdateProfileUserRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { user, callback } = action.payload
        const { Response } = yield call(profileAPI.createOwnerInfo, user)
        console.log(Response)
        yield put(actions.updateProfileUserSuccess({ 'user': Response }))
        yield callback && callback()
        yield Toast.show('Cập nhật thành công', Toast.SHORT);
    } catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.updateProfileUserError(error.message));
        LogManagerPersonal("updateProfileUserError", error.message, error.messageLog);
    }
}

function* handleCreateProfileStoreListRequest(action) {
    try {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            throw ({ 'message': 'Không Có kết nối mạng' })
        const { store, callback } = action.payload
        const { Response } = yield call(profileAPI.createNewStore, store)
        console.log('responses handleCreateProfileStoreListRequest ', Response)

        const data = {
            'storeId': Response.id,
            'displayName': Response.displayName,
            'address': Response.address,
        }
        storeService.dispatch(storeDetailActions.saveStoreDetail(data))
        yield put(actions.createProfileStoreListSuccess({ 'newStore': Response }))
        yield callback && callback()
        yield Toast.show('Tạo thành công', Toast.SHORT);
    } catch (error) {
        yield Toast.show(error.message, Toast.SHORT);
        yield put(actions.createProfileStoreListError(error.message));
        LogManagerPersonal("createProfileStoreListError", error.message, error.messageLog);
    }
}

function* fetchProfileWithTokenRequest() {
    yield takeFirst(actions.fetchProfileWithTokenRequest, handlefetchProfileWithTokenRequest);
}

function* fetchProfileRequest() {
    yield takeFirst(actions.fetchProfileRequest, handlefetchProfileRequest);
}

function* fetchStoreByProfleRequest() {
    yield takeFirst(actions.fetchStoreByProfleRequest, handleFetchStoreByProfleRequest);
}

function* updateProfileUserRequest() {
    yield takeFirst(actions.updateProfileUserRequest, handleUpdateProfileUserRequest)
}

function* createProfileStoreListRequest() {
    yield takeFirst(actions.createProfileStoreListRequest, handleCreateProfileStoreListRequest)
}

export default {
    fetchProfileWithTokenRequest,
    fetchProfileRequest,
    fetchStoreByProfleRequest,
    updateProfileUserRequest,
    createProfileStoreListRequest
}