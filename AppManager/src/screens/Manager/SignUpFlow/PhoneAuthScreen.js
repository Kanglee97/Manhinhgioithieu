import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Platform, TextInput, AsyncStorage, ActivityIndicator, SafeAreaView } from 'react-native';
import { authActions, profileActions, messengerActions, storeDetailActions, accountPackageActions } from '../../../actions/index';
import { nameOfAuthReducers, nameOfProfileReducers, nameOfLoadingReducers, nameOfEmployeeReducers } from '../../../reducers'
import { ButtonGradient, MainHeader, FormInput, Loading, MaterialIcon } from '../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { validatePhoneNumber } from '../../../helper/validationHelper';
import NavigationService from '../../../navigation/NavigationService';
import CountryPicker from 'react-native-country-picker-modal';
import * as storeService from '../../../sagas/storeService';
import Toast from 'react-native-simple-toast';
import firebase from 'react-native-firebase';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash'

const MAX_LENGTH_CODE = 6;
const MAX_LENGTH_NUMBER = 20;
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

// if you want to customize the country picker
const countryPickerCustomStyles = {};

class PhoneAuthScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            message: '',
            codeInput: '',
            code1: '',
            code2: '',
            code3: '',
            code4: '',
            code5: '',
            code6: '',
            phoneNumber: '',
            confirmResult: '',
            enterCode: false,
            spinner: false,
            country: {
                cca2: 'VN',
                callingCode: '84'
            },
            timer: 60,
            loading: false,
        };

        this.signIn = this.signIn.bind(this)
        this.resendCode = this.resendCode.bind(this)
        this.confirmCode = this.confirmCode.bind(this)
        this.loginRequest = this.loginRequest.bind(this)
        this._retrieveData = this._retrieveData.bind(this)
        this.onSelectStore = this.onSelectStore.bind(this)
        this._renderCallingCode = this._renderCallingCode.bind(this)
        this._changeCountry = this._changeCountry.bind(this)
        this.changePhoneNumber = this.changePhoneNumber.bind(this)
        this.renderMessage = this.renderMessage.bind(this)
        this.renderEnterPhoneNumber = this.renderEnterPhoneNumber.bind(this)
        this.inputVerifyCode = this.inputVerifyCode.bind(this)
        this.renderEnterVerifyCode = this.renderEnterVerifyCode.bind(this)
    }

    static navigationOptions = {
        header: null
    };

    // componentDidMount() {
    //     this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
    //         if (user) {
    //             console.log(user)
    //             this.setState({ user: user.toJSON() }, () => {
    //                 this.loginRequest(user._user)
    //             });
    //         } else {
    //             // User has been signed out, reset the state
    //             this.setState({
    //                 user: null,
    //                 message: '',
    //                 codeInput: '',
    //                 phoneNumber: '',
    //                 confirmResult: '',
    //             }, () => {
    //                 console.log('PhoneAutheScreen did mount: get not user ', this.state.user)
    //             });
    //         }
    //     });
    // }

    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
        }
    }

    componentWillMount() {
        console.log('PhoneAuthScreen will mount')
    }

    signIn() {
        const { phoneNumber, country } = this.state;
        this.setState({ loading: true }, () => Toast.show('Đang gửi mã xác thực...', Toast.SHORT));
        firebase.auth().signInWithPhoneNumber(`+${country.callingCode + this.changePhoneNumber(phoneNumber)}`)
            .then(confirmResult => {
                console.log('hear')
                this.setState({ confirmResult }, () => Toast.show('Mã xác thực đã được gửi!', Toast.SHORT));
                this.interval = setInterval(
                    () => {
                        this.setState((prevState) => ({ timer: prevState.timer - 1 }));
                        this.setState({ loading: false });
                    }, 1000
                );
            })
            .catch(error => this.setState({ message: `Gửi mã thất bại: ${error.message}` }));
    };

    resendCode() {
        firebase.auth().signInWithPhoneNumber(`+${this.state.country.callingCode + this.state.phoneNumber}`)
            .then(confirmResult => {
                this.setState({ confirmResult }, () => Toast.show('Mã xác thực đã được gửi!', Toast.SHORT));
                this.setState({ timer: 60 }, () => {
                    this.interval = setInterval(
                        () => {
                            this.setState((prevState) => ({ timer: prevState.timer - 1 }));
                            this.setState({ loading: false });
                        }, 1000
                    );
                })

            })
            .catch(error => this.setState({ message: `Gửi mã thất bại: ${error.message}` }));
    }

    confirmCode() {
        const { codeInput, confirmResult } = this.state;
        console.log('confirm code')
        this.setState({ loading: true });
        if (confirmResult && codeInput.length) {
            var credential = firebase.auth.PhoneAuthProvider.credential(confirmResult._verificationId, codeInput);
            firebase.auth().signInWithCredential(credential)
                .then((data) => {
                    Toast.show('Mã xác thực chính xác!', Toast.SHORT);
                    console.log('data', data);
                    this.loginRequest(data.user._user)
                })
                .catch(error => this.setState({ message: `Xác thực mã thất bại: ${error.message}` }));;
            // confirmResult.confirm(codeInput)
            //     .then((data) => {
            //         Toast.show('Mã xác thực chính xác!', Toast.SHORT);
            //         this.loginRequest(data._user)
            //     })
            //     .catch(error => this.setState({ message: `Xác thực mã thất bại: ${error.message}` }));
        }
    };

    loginRequest(user) {
        this.props.actions.loginPhoneAccountRequest({
            'User': user || this.state.user,
            callback: () => {
                this.props.actions.fetchProfileWithTokenRequest({
                    'token': this.props.phoneToken,
                    callback: () => {
                        this.setState({ loading: false });
                        this._retrieveData();
                    }
                })
            },
            fallback: () => {
                this.setState({ loading: false });
            }
        })
    }

    _retrieveData = async () => {
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
                                callback: () => { }
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
            // Error retrieving data
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

    _renderCallingCode() {
        return (
            <View style={styles.callingCodeBlock}>
                <Text style={styles.callingCode}>
                    +{this.state.country.callingCode}
                </Text>
            </View>
        );
    }

    _changeCountry(country) {
        this.setState({ country });
    }

    changePhoneNumber(value) {
        return String(value).indexOf('0') == 0 ? String(value).replace('0', '') : String(value);
    }

    renderMessage() {
        const { message } = this.state;

        if (!message.length) return null;

        return <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    }

    renderEnterPhoneNumber() {
        const { phoneNumber } = this.state;
        return (
            <View style={styles.body}>
                <Text style={{ color: Colors.functionColorLight }}>Nhập số điện thoại của bạn</Text>
                <View style={styles.displayInlineBlock}>
                    <View style={[styles.flagBlock]}>
                        <CountryPicker
                            closeable
                            style={styles.countryPicker}
                            onChange={(country) => this._changeCountry(country)}
                            cca2={this.state.country.cca2}
                            translation='vi'
                            animationType={'slide'}
                        />
                    </View>
                    <View style={{ position: 'relative' }}>
                        <TextInput
                            textContentType='telephoneNumber'
                            keyboardType={'phone-pad'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            underlineColorAndroid={'transparent'}
                            autoFocus
                            onSubmitEditing={() => {
                                if (phoneNumber && validatePhoneNumber(phoneNumber))
                                    this.signIn();
                                else null;
                            }}
                            placeholder={'Số điện thoại'}
                            maxLength={MAX_LENGTH_NUMBER}
                            onChangeText={(value) => this.setState({ phoneNumber: value })}
                            value={phoneNumber}
                            style={[styles.phoneInput,
                            { paddingLeft: this.state.country.callingCode ? ((this.state.country.callingCode.split().join().length * 10) + 20) : (20) },
                            { borderColor: phoneNumber && !validatePhoneNumber(phoneNumber) ? Colors.errorBackground : Colors.functionColorLight }]}
                            onSubmitEditing={() => {
                                console.log('onSubmitEditing')
                                this.signIn()
                            }}
                        />
                        {this._renderCallingCode()}
                        {phoneNumber && !validatePhoneNumber(phoneNumber) ? <Text style={{ color: 'red', fontStyle: 'italic', fontSize: FontStyle.miniText, }}>
                            {'Hãy nhập đúng số điện thoại của bạn'}
                        </Text> : null}
                    </View>
                </View>
                <Text style={{
                    textAlign: 'left',
                    width: Layout.window.width * 0.8,
                    fontSize: FontStyle.smallText,
                    fontFamily: FontStyle.mainFont,
                    color: Colors.lightGreyColor,
                    marginTop: 20,
                }}>Lưu ý: Vui lòng chọn quốc gia và nhập đúng số điện thoại thật của bạn tại quốc gia mà bạn đang sử dụng SĐT để nhận mã kích hoạt miễn phí.</Text>
                <View style={{ marginTop: Layout.window.height * 0.1 }}>
                    <ButtonGradient
                        labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                        onPress={() => this.signIn()}
                        content='Gửi Mã Xác Thực'
                        disabled={!phoneNumber || !validatePhoneNumber(phoneNumber)}
                    />
                </View>
            </View>
        );
    }

    inputVerifyCode = (value) => {
        this.setState({ codeInput: value }, () => {
            value.length >= 6 ? this.confirmCode() : null
        });
    }

    renderEnterVerifyCode() {
        const { codeInput } = this.state;
        return (
            <View style={styles.body}>
                <Text style={{ color: Colors.darkText }}>Nhập mã được gửi đến số điện thoại</Text>
                <Text style={{ fontWeight: 'bold', fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>
                    {String(this.state.phoneNumber).charAt(0) == '0' ? this.state.phoneNumber : `0${this.state.phoneNumber}`}
                </Text>
                <View style={[styles.displayInlineBlock, { width: Layout.window.width, justifyContent: 'center', alignItems: 'center', marginTop: Layout.window.height * 0.1 }]}>
                    <TextInput
                        textContentType='telephoneNumber'
                        keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'} maxLength={1}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        underlineColorAndroid={'transparent'}
                        onChangeText={value => this.inputVerifyCode(value)}
                        value={codeInput}
                        autoFocus
                        maxLength={MAX_LENGTH_CODE}
                        style={styles.verifyInput}
                        onSubmitEditing={() => this.confirmCode()}
                    />
                </View>
                <View style={styles.displayInlineBlock}>
                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>Bạn không nhận được mã?</Text>
                    <TouchableOpacity disabled={this.state.timer > 0} onPress={() => this.resendCode()}>
                        <Text style={{ fontWeight: 'bold', color: Colors.functionColorDark, fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}> Gửi lại<Text style={{ color: Colors.darkText }}>{` (${this.state.timer})`}</Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: Layout.window.height * 0.1 }}>
                    <ButtonGradient
                        labelStyle={{ fontWeight: 'bold', }}
                        onPress={() => this.confirmCode()}
                        content='Tiếp theo'
                    />
                </View>
            </View>
        );
    }

    render() {
        console.log('render', this.state, this.props)
        const { user, confirmResult } = this.state;
        if (this.props.isLoading || this.state.loading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => {
                        // this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                        //     if (user) {
                        //         console.log(user)

                        //     }
                        // });
                        firebase.auth().signOut();
                        NavigationService.navigate('SelectLoginMethod')
                    }}
                />
                <View style={styles.body}>
                    {(!user && confirmResult === '') && this.renderEnterPhoneNumber()}
                    {(!user && confirmResult === '') && this.renderMessage()}
                    {confirmResult !== '' && this.renderEnterVerifyCode()}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    title: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.darkText,
    },
    body: {
        flex: 1,
        alignItems: 'center',
    },
    flagBlock: {
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
        width: Layout.window.width * 0.15,
        height: 40,
        paddingTop: 4,
    },
    countryPicker: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: Layout.window.height * 0.1,
    },
    phoneInput: {
        width: Layout.window.width * 0.65,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: FontStyle.mdText,
        paddingTop: 0,
        paddingBottom: 0,
        letterSpacing: 2
    },
    callingCodeBlock: {
        position: 'absolute',
        left: 3,
        top: 0,
        height: 40,
        justifyContent: 'center'
    },
    callingCode: {
        letterSpacing: 2,
        fontSize: FontStyle.mdText,
    },
    verifyInput: {
        width: 220,
        height: 50,
        fontSize: 40,
        paddingTop: 0,
        paddingBottom: 0,
        letterSpacing: 10,
        color: Colors.functionColorLight,
        borderBottomColor: Colors.functionColorLight,
        borderBottomWidth: 1,
        textAlign: 'center'
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAuthReducers],
        ...state[nameOfProfileReducers],
        ...state[nameOfLoadingReducers]
        [authActions.LOGIN_PHONE_ACCOUNT,
        profileActions.FETCH_PROFILE_WITH_TOKEN]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...authActions, ...profileActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneAuthScreen)