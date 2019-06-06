/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert,
  StatusBar
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { logoutFacebook, logoutGoogle, logoutPhone } from './src/helper/logoutHelper';
import * as storeService from './src/sagas/storeService';
import { createAppContainer, nav } from 'react-navigation';
import AppNavigator from './src/navigation/AppNavigator';
import firebase from 'react-native-firebase';
import { Colors } from './src/components/react-native-teso/Magic';
import NavigationService from './src/navigation/NavigationService';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import createStore from './src/store';
import { get } from 'lodash'
import { nameOfAuthReducers, nameOfProfileReducers } from './src/reducers';
import { accountPackageActions } from './src/actions/index';
import { OfflineNotice } from './src/components/react-native-teso'

const AppContainer = createAppContainer(AppNavigator);

export const { store, persistor } = createStore();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
    this.checkPackage()
    // SplashScreen.hide()
  }

  checkPackage = () => {
    storeService.dispatch(accountPackageActions.getAccountPackageRequest({
      callback: () => {

      }
    }))
    const user = get(storeService.getSpecificState(nameOfProfileReducers), 'user')
    user.id && storeService.dispatch(accountPackageActions.setCurrentPackage({ 'currentPackageName': user.accountType }))
    user.id && storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({ 'managerId': user.id }))
  }

  //1
  async checkPermission() {
    await firebase.messaging().hasPermission().then((enabled) => {
      if (enabled) {
        this.getToken();
      } else {
        this.requestPermission();
      }
    }).catch(() => {
      console.log('Check Permission fail');
    });
  }

  //2
  async requestPermission() {
    await firebase.messaging().requestPermission().then(() => {
      this.getToken();
    }).catch(() => {
      console.log('permission rejected');
    });
  }

  //3
  async getToken() {
    try {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      }
      console.log(fcmToken);
    } catch (error) {
      console.log(error)
    }
  }

  ////////////////////// Add these methods //////////////////////

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
    // const auth = storeService.getSpecificState(nameOfAuthReducers)
    // if (get(auth, 'isAuthorized')) {
    //   if (auth.phoneToken != '') {
    //     logoutPhone({
    //       logout: () => {
    //         NavigationService.navigate('SelectRole')
    //       }
    //     });
    //   } else if (auth.facebookToken != '') {
    //     logoutFacebook({
    //       logout: () => {
    //         NavigationService.navigate('SelectRole')
    //       }
    //     });
    //   } else if (auth.googleToken != '') {
    //     logoutGoogle({
    //       logout: () => {
    //         NavigationService.navigate('SelectRole')
    //       }
    //     });
    //   }
    // }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      console.log(notification);
      const { title, body } = notification;
      //this.showAlert(title, body);
      firebase.notifications().displayNotification(notification)
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      console.log(notificationOpen);
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(message);
    });
  }

  async requestMultiplePermissions() {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ]).then((granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    }).catch(err => {
      console.warn(err);
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <View style={styles.container}>
            <StatusBar
              backgroundColor={Colors.transparent}
              barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
            <OfflineNotice />
            <AppContainer ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }}
            />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg
  }
});

// iPhoneNotification
// x2:40x40
// x3:60x60
// iPhoneSetting
// x2:58x58
// x3:87x87
// iPhoneSpotligt
// x2:80x80
// x3:120x120
// iPhoneApp
// x2:120x120
// x3:180x180
// AppStore
// 1x:1024x1024