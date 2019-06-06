import { flatten } from 'lodash/array'
import { values } from 'lodash/object'
import { fork, all } from 'redux-saga/effects'

////
//import sagas list here
import authSagas from './authSagas'
import profileSagas from './profileSagas'
import storeDetailSagas from './storeDetailSagas'
import serviceSagas from './serviceSagas'
import employeeSagas from './employeeSagas'
import discountSagas from './discountSagas'
import orderSagas from './orderSagas'
import messengerSagas from './messengerSagas'
import customerSagas from './customerSagas'
import statiticSagas from './statiticSagas'
import bookingSagas from './bookingSagas'
import accountPackageSagas from './accountPackageSagas';
///

const sagaList = [
    ////
    //add sagas list here
    authSagas,
    profileSagas,
    storeDetailSagas,
    serviceSagas,
    employeeSagas,
    discountSagas,
    orderSagas,
    messengerSagas,
    customerSagas,
    statiticSagas,
    bookingSagas,
    accountPackageSagas
    ///
];

export default function* () {
    yield all(
        flatten(sagaList.map(sagas => values(sagas))).map(saga => fork(saga))
    );
}