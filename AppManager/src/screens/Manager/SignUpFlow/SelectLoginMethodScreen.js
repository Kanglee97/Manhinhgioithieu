import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    BackHandler,
    AsyncStorage,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { authActions, profileActions, storeDetailActions, messengerActions, accountPackageActions, serviceActions } from '../../../actions/index';
import { nameOfAuthReducers, nameOfProfileReducers, nameOfLoadingReducers, nameOfConnectionReducers } from '../../../reducers';
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { MainHeader, Logo, Loading } from '../../../components/react-native-teso';
import { googleIOSClientID, googleWebClientID } from '../../../config/constants';
import { AccessToken, LoginManager, LoginButton } from 'react-native-fbsdk';
import { LogManagerLogin } from '../../../components/react-native-teso';
import NavigationService from '../../../navigation/NavigationService';
import * as storeService from '../../../sagas/storeService';
import firebase from 'react-native-firebase';
import { bindActionCreators } from 'redux';
import callApi from '../../../api/helper';
import { connect } from 'react-redux';
import _, { get } from 'lodash'


class SelectLoginMethodScreen extends Component {
    constructor(props) {
        super(props);
        this.unsubscriber = null;
        this.state = {
            isAuthenticated: false,
            typedEmail: '',
            typedPassword: '',
            user: null,
            isSigninInProgress: false,
            userInfo: null,
            loading: false
        };

        this.getUserInfo = this.getUserInfo.bind(this)
        this.checkAccountGG = this.checkAccountGG.bind(this)
        this._signInGG = this._signInGG.bind(this)
        this.onLoginFacebook = this.onLoginFacebook.bind(this)
        this._retrieveData = this._retrieveData.bind(this)
        this.onSelectStore = this.onSelectStore.bind(this)
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        this.checkAccountGG();
        console.log('SelectLoginMethodScreen will mount ', this.props)
        this._isMounted = true;
        try {
            var serverToken = null;
            // if (await AsyncStorage.getItem('FB_SERVER_TOKEN')) {
            //     serverToken = await AsyncStorage.getItem('FB_SERVER_TOKEN');
            //     console.log("FB: " + serverToken);
            // } else if (await AsyncStorage.getItem('GG_SERVER_TOKEN')) {
            //     serverToken = await AsyncStorage.getItem('GG_SERVER_TOKEN');
            //     console.log("GG: " + serverToken);
            // } else if (await AsyncStorage.getItem('PHONE_SERVER_TOKEN')) {
            //     serverToken = await AsyncStorage.getItem('PHONE_SERVER_TOKEN');
            //     console.log("PHONE: " + serverToken);
            // }
            //} 
            if (this.props.isAuthorized) {
                serverToken = this.props.phoneToken || this.props.facebookToken || this.props.googleToken
                this.getUserInfo(serverToken).then(res => {
                    if (this._isMounted) {
                        this.setState({ user: res });
                        if (this.state.user) {
                            NavigationService.navigate('Main');
                        }
                    }
                }).catch(err => {
                    console.log(err);
                    // LogManagerLogin('getUserInfo error', String(err));
                })
            }
        } catch (err) {
            console.log(`Server token: ${err}`);
            // LogManagerLogin('Server token:', String(err));
        }
    }

    componentWillUnmount = () => {
        BackHandler.removeEventListener('hardwareBackPress');
    }

    getUserInfo(serverToken) {
        return new Promise((resolve, reject) => {
            callApi(`api/user/get-bytoken-${serverToken}`, 'GET')
                .then((res) => {
                    resolve(res)
                }).catch((err) => {
                    reject(err);
                })
        })
    }

    async checkAccountGG() {
        // this.unsubscriber = firebase.auth().onAuthStateChanged((changedUser) => {
        //   // console.log(`changed User : ${JSON.stringify(changedUser.toJSON())}`);
        //   this.setState({ user: changedUser });
        //   // console.log(changedUser);
        // });
        GoogleSignin.signInSilently().then(res => {
            this.setState({ user: res })
            console.log(`Login success with user: ${res}`);
        }
        ).catch(error => {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                // user has not signed in yet
                console.log(`Login fail with SIGN_IN_REQUIRED: ${error}`);
                // LogManagerLogin('Login fail with SIGN_IN_REQUIRED:', String(error));
            } else {
                // some other error
                console.log(`Login fail with ERROR: ${error}`);
                // LogManagerLogin('Login fail with ERROR:', String(error));
            }
        });
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            iosClientId: googleIOSClientID, // only for iOS
            webClientId: googleWebClientID,
            // offlineAccess: true,
        });
    }

    // Somewhere in your code
    async _signInGG() {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            return;
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        GoogleSignin.signIn()
            .then((data) => {
                console.log('signInGG', data)
                this.setState({ user: data });
                console.log(`Google Login with user : ${JSON.stringify(data)}`);
                return data;
            })
            .then((currentUser) => {
                const credential = firebase.auth.GoogleAuthProvider.credential(
                    currentUser.idToken,
                    currentUser.accessToken,
                );
                //this._signUpServer(currentUser.accessToken, 1);
                //console.log('signInGG', currentUser)
                const data = {
                    'User': currentUser.accessToken,
                    callback: () => {
                        firebase.auth().signInWithCredential(credential);
                        this.props.actions.fetchProfileWithTokenRequest({
                            'token': this.props.googleToken,
                            callback: () => {
                                console.log('callback')
                                this._retrieveData()
                            }
                        })
                    },
                    fallback: () => {

                    }
                }
                this.props.actions.loginGoogleAccountRequest(data);
            })
            .catch((error) => {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                    // user cancelled the login flow
                    console.log('Vui lòng login');
                    // console.log(`Login fail with SIGN_IN_CANCELLED: ${error}`);
                } else if (error.code === statusCodes.IN_PROGRESS) {
                    // operation (f.e. sign in) is in progress already
                    console.log(`Login fail with IN_PROGRESS: ${error}`);
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                    // play services not available or outdated
                    console.log(`Login fail with PLAY_SERVICES_NOT_AVAILABLE: ${error}`);
                } else {
                    // some other error happened
                    console.log(`Login fail with ERROR: ${error}`);
                    // LogManagerLogin('Login fail with ERROR:', String(error));
                }
            });
    }

    onLoginFacebook() {
        if (!get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected'))
            return;
        LoginManager
            .logInWithReadPermissions(['public_profile'])
            .then((result) => {
                console.log(result)
                if (result.isCancelled) {
                    return Promise.reject(new Error('The user cancelled the request', result));
                }
                console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);
                // get the access token
                return AccessToken.getCurrentAccessToken();
            })
            .then(data => {
                console.log("Login success with token:" + data.accessToken.toString());
                const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                const datatmp = {
                    'User': data.accessToken,
                    callback: () => {
                        firebase.auth().signInWithCredential(credential)
                        this.props.actions.fetchProfileWithTokenRequest({
                            'token': this.props.facebookToken,
                            callback: () => {
                                console.log('callback')
                                this._retrieveData()
                            }
                        })
                    },
                    fallback: () => {

                    }
                }
                this.props.actions.loginFacebookAccountRequest(datatmp);
                console.log('onLoginFacebook ', data)
            })
            .catch((error) => {
                console.log(`Facebook login fail with error: ${error}`);
                // LogManagerLogin('Facebook login fail with error:', String(error));
            });
    }


    _retrieveData = () => {
        try {
            storeService.dispatch(accountPackageActions.setCurrentPackage({ 'currentPackageName': this.props.user.accountType }))
            storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({ 'managerId': this.props.user.id }))
            storeService.dispatch(messengerActions.fetchDeviceRequest({
                'deviceId': this.props.user.id,
                callback: async (data) => {
                    const value = await AsyncStorage.getItem('fcmToken')
                    console.log(value)
                    if (value !== null) {
                        // We have data!!
                        if (_.findIndex(data, function (item) {
                            return (item.type === 'MANAGER' && item.keyPush === value)
                        }) == -1) {
                            console.log(value);
                            const device = {
                                'deviceId': '',
                                'userId': this.props.user.id,
                                'keyPush': value,
                                'deviceOs': '',
                                'deviceInfo': '',
                                'type': 'MANAGER'
                            }
                            const deviceData = {
                                'device': device,
                                callback: () => {

                                }
                            }
                            storeService.dispatch(messengerActions.addDeviceRequest(deviceData))
                        }
                    }
                    if (this.props.storeList.length < 1) {
                        console.log('navigate WelcomeCreateStore')
                        this.props.navigation.navigate('WelcomeCreateStore')
                    }
                    else {
                        this.onSelectStore(this.props.storeList[0].id, this.props.storeList[0].displayName, this.props.storeList[0].address)
                        //this.props.navigation.navigate('Main')
                    }
                }
            }))
        } catch (error) {
            console.log(error)
            LogManagerLogin('Error retrieving data:', String(error));
        }
    };

    onSelectStore = async (storeId, displayName, address) => {
        const data = {
            'storeId': storeId,
            'displayName': displayName,
            'address': address,
        }
        storeService.dispatch(storeDetailActions.saveStoreDetail(data))
        this.setState({
            welcome: true
        }, () =>
                NavigationService.navigate('Store')
        )
    }

    render() {
        if (this.props.isLoading || this.state.loading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView>
                <MainHeader
                    backgroundColor={Colors.transparent}
                    leftPress={() => NavigationService.navigate('SelectRole')}
                    containerStyle={{
                        backgroundColor: Colors.transparent,
                        paddingTop: 0,
                        marginTop: 0,
                        width: Layout.window.width,
                    }}
                />
                <View style={styles.backgroundImage}>
                    <Logo />
                    <View style={styles.BtnContainer}>
                        <TouchableOpacity style={[styles.btnLogin, styles.displayInlineBlock, { backgroundColor: '#2D4486' }]} onPress={() => this.onLoginFacebook()}>
                            <View style={styles.iconBlock}>
                                <Image source={require('../../../assets/img/facebook.png')} style={styles.Icon} />
                            </View>
                            <View style={styles.textBlock}>
                                <Text style={styles.Text}>Đăng nhập với Facebook</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnLogin, styles.displayInlineBlock, { backgroundColor: '#FFFFFF' }]} onPress={() => this._signInGG()}>
                            <View style={styles.iconBlock}>
                                <Image source={require('../../../assets/img/google.png')} style={styles.Icon} />
                            </View>
                            <View style={styles.textBlock}>
                                <Text style={[styles.Text, { color: Colors.dark1 }]} >Đăng nhập với Google</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnLogin, styles.displayInlineBlock, { backgroundColor: '#3BBB95' }]} onPress={() =>
                            get(storeService.getSpecificState(nameOfConnectionReducers), 'isConnected') && NavigationService.navigate('PhoneAuth')}>
                            <View style={styles.iconBlock}>
                                <Image source={require('../../../assets/img/phone.png')} style={styles.Icon} />
                            </View>
                            <View style={styles.textBlock}>
                                <Text style={styles.Text}>Đăng nhập với Phone</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        height: '85%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.lightBg
    },
    BtnContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    Icon: {
        width: 30,
        height: 30,
    },
    Text: {
        fontSize: Layout.isSmallDevice ? FontStyle.smallText : FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.lightText,
        textAlign: 'center',
    },
    btnLogin: {
        height: Layout.isSmallDevice ? 45 : 50,
        width: Layout.isSmallDevice ? 250 : 280,
        borderRadius: 5,
        justifyContent: 'flex-start',
        marginTop: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconBlock: {
        justifyContent: 'center',
        height: '100%',
        padding: 7,
        paddingRight: 10,
    },
    textBlock: {
        justifyContent: 'center',
        height: '100%',
        paddingLeft: 7,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAuthReducers],
        ...state[nameOfProfileReducers],
        ...state[nameOfLoadingReducers]
        [authActions.LOGIN_FACEBOOK_ACCOUNT,
        authActions.LOGIN_GOOGLE_ACCOUNT,
        profileActions.FETCH_PROFILE_WITH_TOKEN],
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...authActions, ...profileActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectLoginMethodScreen)
