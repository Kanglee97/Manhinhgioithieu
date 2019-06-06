import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { reducer as fromReducer } from 'redux-form'

////
//import reduders here
import authReducers, { name as nameOfAuthReducers } from './authReducers'
import profileReducers, { name as nameOfProfileReducers } from './profileReducers'
import storeDetailReducers, { name as nameOfStoreDetailReducers } from './storeDetailReducers'
import serviceReducers, { name as nameOfServiceReducers } from './serviceReducers'
import serviceChildReducers, { name as nameOfServiceChildReducers } from './serviceChildReducers'
import detailModalReducers, { name as nameOfDetailModalReducers } from './detailModalReducers'
import detailOptionReducers, { name as nameOfDetailOptionReducers } from './detailOptionReducers'
import detailOptionChildReducers, { name as nameOfDetailOptionChildReducers } from './detailOptionChildReducers'
import employeeReducers, { name as nameOfEmployeeReducers } from './employeeReducers'
import employeeDetailReducers, { name as nameOfEmployeeDetailReducers } from './employeeDetailReducers'
import discountReducers, { name as nameOfDiscountReducers } from './discountReducers'
import detailDiscountReducers, { name as nameOfDetailDiscountReducers } from './detailDiscountReducers'
import loadingReducers, { name as nameOfLoadingReducers } from './loadingReducers'
import detailOrderReducers, { name as nameOfDetailOrderReducers } from './detailOrderReducers'
import orderReducers, { name as nameOfOrderReducers } from './orderReducers'
import messengerReducers, { name as nameOfMessengerReducers } from './messengerReducers'
import customerReducers, { name as nameOfCustomerReducers } from './customerReducers'
import statiticReducers, { name as nameOfStatiticReducers } from './statiticReducers'
import chatReducers, { name as nameOfChatReducers } from './chatReducers'
import bookingReducers, { name as nameOfBookingReducers } from './bookingReducers'
import accountPackageReducers, { name as nameOfAccountPackageReducers } from './accountPackageReducers'
import storeImageReducers, { name as nameOfStoreImageReducers } from './storeImageReducers'
import connectionReducers, {name as nameOfConnectionReducers} from './connectionReducers'
////



const rootPersisConfig = {
    key: 'root',
    storage: storage,
    debug: true,
    timeout: null,
    blacklist: [nameOfLoadingReducers]
};

const authPersistConfig = {
    key: nameOfAuthReducers,
    storage: storage,
    debug: true,
    timeout: null
}

const reducers = {
    [nameOfAuthReducers]: persistReducer(authPersistConfig, authReducers),
    [nameOfProfileReducers]: profileReducers,
    [nameOfStoreDetailReducers]: storeDetailReducers,
    [nameOfServiceReducers]: serviceReducers,
    [nameOfServiceChildReducers]: serviceChildReducers,
    [nameOfDetailModalReducers]: detailModalReducers,
    [nameOfDetailOptionReducers]: detailOptionReducers,
    [nameOfDetailOptionChildReducers]: detailOptionChildReducers,
    [nameOfEmployeeReducers]: employeeReducers,
    [nameOfEmployeeDetailReducers]: employeeDetailReducers,
    [nameOfDetailDiscountReducers]: detailDiscountReducers,
    [nameOfDiscountReducers]: discountReducers,
    [nameOfLoadingReducers]: loadingReducers,
    [nameOfDetailOrderReducers]: detailOrderReducers,
    [nameOfOrderReducers]: orderReducers,
    [nameOfMessengerReducers]: messengerReducers,
    [nameOfCustomerReducers]: customerReducers,
    [nameOfStatiticReducers]: statiticReducers,
    [nameOfChatReducers]: chatReducers,
    [nameOfBookingReducers]: bookingReducers,
    [nameOfAccountPackageReducers]: accountPackageReducers,
    [nameOfStoreImageReducers]: storeImageReducers,
    [nameOfConnectionReducers]: connectionReducers
}

////search here Object.assign(reducers,{form: fromReducer})
const rootReducer = combineReducers(
    Object.assign(reducers, {
        form: fromReducer
    })
);

export default persistReducer(rootPersisConfig, rootReducer);

export {
    nameOfAuthReducers,
    nameOfProfileReducers,
    nameOfStoreDetailReducers,
    nameOfServiceReducers,
    nameOfServiceChildReducers,
    nameOfDetailModalReducers,
    nameOfDetailOptionReducers,
    nameOfDetailOptionChildReducers,
    nameOfEmployeeReducers,
    nameOfEmployeeDetailReducers,
    nameOfDiscountReducers,
    nameOfDetailDiscountReducers,
    nameOfLoadingReducers,
    nameOfDetailOrderReducers,
    nameOfMessengerReducers,
    nameOfCustomerReducers,
    nameOfStatiticReducers,
    nameOfOrderReducers,
    nameOfChatReducers,
    nameOfBookingReducers,
    nameOfAccountPackageReducers,
    nameOfStoreImageReducers,
    nameOfConnectionReducers
}