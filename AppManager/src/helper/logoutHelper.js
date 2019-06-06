import firebase from 'react-native-firebase';
import { AccessToken, LoginManager, LoginButton } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes, } from 'react-native-google-signin';

import * as storeService from '../sagas/storeService'
import { authActions as actions } from '../actions'

const logoutFacebook = ({ logout }) => {
    LoginManager.logOut();
    try {
        firebase.auth().signOut();
        storeService.dispatch(actions.logoutFacebookAccountRequest({
            callback: () => {
                logout && logout()
            }
        }))
    } catch{
        console.log('Vui lòng login');
    }
    console.log('Logout Success');
    console.log();
}

const logoutGoogle = async ({ logout }) => {
    // await GoogleSignin.revokeAccess()
    //     .then(res => {
    GoogleSignin.signOut();
    firebase.auth().signOut();
    storeService.dispatch(actions.logoutGoogleAccountRequest({
        callback: () => {
            logout && logout()
        }
    }))
    //AsyncStorage.setItem('GG_SERVER_TOKEN', '');
    // })
    // .catch(err => {
    //     console.error(err);
    // });
}

const logoutPhone = ({ logout }) => {
    firebase.auth().signOut()
        .then(() => {
            console.log('firebase signout')
            storeService.dispatch(actions.logoutPhoneAccountRequest({
                callback: () => {
                    logout && logout()
                }
            }))
        })
    .catch((error) => {
        console.log(error)
    })
}

export {
    logoutFacebook,
    logoutGoogle,
    logoutPhone
}