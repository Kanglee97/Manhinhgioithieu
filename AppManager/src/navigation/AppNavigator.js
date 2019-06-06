import React from 'react';
import {
  createSwitchNavigator,
  createStackNavigator
} from 'react-navigation';

import SelectRoleScreen from '../screens/SelectRoleScreen';
import SelectLoginMethodScreen from '../screens/Manager/SignUpFlow/SelectLoginMethodScreen';
import PhoneAuthScreen from '../screens/Manager/SignUpFlow/PhoneAuthScreen';

import WelcomeCreateStoreScreen from '../screens/Manager/SignUpFlow/WelcomeCreateStoreScreen'
import WelcomeScreen from '../screens/Manager/SignUpFlow/WelcomeScreen';
import CreateOwnerScreen from '../screens/Manager/CreateStoreFlow/CreateOwnerScreen';
import CreateStoreScreen from '../screens/Manager/CreateStoreFlow/CreateStoreScreen';
import CreateSuccessScreen from '../screens/Manager/CreateStoreFlow/CreateSuccessScreen';
import EditStoreScreen from '../screens/Manager/CreateStoreFlow/EditStoreScreen';

import MainTabManagerNavigator from './Manager/MainTabManagerNavigator';

import SignInScreen from '../screens/Staff/SignInScreen';
import MainTabStaffNavigator from './Staff/MainTabStaffNavigator';
import CustomerChatScreen from '../screens/Manager/NavScreen/CustomerScreen/CustomerChatScreen'

import IntroScreen from '../screens/IntroScreen/IntroScreen';

const LoginStack = createStackNavigator({
  SelectRole: SelectRoleScreen,
  SelectLoginMethod: SelectLoginMethodScreen,
  PhoneAuth: PhoneAuthScreen,
  SignIn: SignInScreen,
  Intro: IntroScreen
})

export default createSwitchNavigator(
  {
    CustomerChatScreen: CustomerChatScreen,
    SelectRole: LoginStack,
    // SelectRole: SelectRoleScreen,
    // SelectLoginMethod: SelectLoginMethodScreen,
    // PhoneAuth: PhoneAuthScreen,
    Welcome: WelcomeScreen,
    CreateOwner: CreateOwnerScreen,
    CreateStore: CreateStoreScreen,
    CreateSuccess: CreateSuccessScreen,
    EditStore: EditStoreScreen,
    WelcomeCreateStore: WelcomeCreateStoreScreen,
    MainManager: MainTabManagerNavigator,

    //Staff
    // SignIn: SignInScreen,
    MainStaff: MainTabStaffNavigator,
  }, {
    initialRouteName: 'SelectRole'
  }
);
