import React, { Component } from 'react';
import {
    View,
    Platform,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';

import { validateEmail, validatePhoneNumber, confirmPassword, validateSpecialKey, validateLimituserName, convertVietNamPhoneNumber, validateName } from '../../../../helper/validationHelper';
import { nameOfEmployeeDetailReducers, nameOfStoreDetailReducers, nameOfProfileReducers, nameOfLoadingReducers, nameOfAuthReducers } from '../../../../reducers/index';
import { ButtonGradient, FormInput, PopUpUploadImage, MainHeader, Loading, PopUpConfirm } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { employeeActions, accountPackageActions } from '../../../../actions/index';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService';
import { Avatar, CheckBox } from 'react-native-elements';
import { importImage } from '../../../../helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { DefaultImages } from '../../../../assets/styles/Constant';


class CreateEmployeeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastName: '',
            firstName: '',
            position: 'Nhân viên',
            avatar: DefaultImages.AVATAR,
            email: '',
            phone: '',
            password: '',
            confirm: '',
            userName: '',
            manager: false,
            isVisiblePopupUploadImage: false,
            loading: false,
            isModalBackVisible: false
        };
        this.createEmployee = this.createEmployee.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.takeImage = this.takeImage.bind(this);
        this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    _toggleModalBack = () => this.setState({ isModalBackVisible: !this.state.isModalBackVisible });

    createEmployee(lastName, firstName, email, position, phone, userName, password, storeId, manager, avatar) {
        this.setState({ loading: true },
            async () => {
                var thumbnailImage = ''
                if (avatar) {
                    if (String(avatar).substr(0, 4) !== 'http') {
                        await importImage.uploadImage(avatar)
                            .then(image => {
                                thumbnailImage = image
                            })
                    }
                    else {
                        thumbnailImage = avatar
                    }
                } else {
                    thumbnailImage = DefaultImages.AVATAR
                }

                console.log(thumbnailImage);

                const employee = {
                    'lastName': lastName || '',
                    'firstName': firstName,
                    'position': position,
                    'email': email,
                    'phone': convertVietNamPhoneNumber(phone),
                    'userName': userName,
                    'password': password,
                    'storeId': storeId,
                    'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                        get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                        get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId'),
                    'portal': get(storeService.getSpecificState(nameOfProfileReducers), 'user.portal'),
                    'manager': manager || false,
                    'avatar': thumbnailImage,
                }
                console.log(employee);

                const data = {
                    'employee': employee,
                    callback: () => {
                        this.setState({ loading: false });
                        storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
                            'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                                get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                                get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
                        }))
                        this.props.navigation.state.params.callback()
                        NavigationService.goBack()
                    },
                    fallback: () => {
                        this.setState({ loading: false });
                    }
                }
                this.props.actions.createEmployeeRequest(data)
            })
    }

    selectImage() {
        this._togglePopupUploadImage();
        importImage.selectImage()
            .then(url => {
                this.setState({
                    avatar: url.path
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    takeImage() {
        this._togglePopupUploadImage();
        importImage.takeImage()
            .then(url => {
                this.setState({
                    avatar: url.path
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    _togglePopupUploadImage() {
        this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
    }

    render() {
        const { lastName, firstName, email, position, phone, userName, password, confirm, manager, avatar, } = this.state;
        if (this.props.isLoading || this.state.loading)
            return (
                <Loading />
            )
        else
            return (
                <SafeAreaView style={styles.container} >
                    <MainHeader
                        backgroundColor={Colors.lightBg}
                        leftPress={() => {
                            if (firstName !== '' ||
                                lastName !== '' ||
                                position !== '' ||
                                userName !== '' ||
                                password !== '')
                                this._toggleModalBack()
                            else
                                NavigationService.navigate('Employee')
                        }}
                        centerComponent={'Thêm nhân viên'}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { paddingTop: 10 }]}>
                        <View style={styles.containerBody}>
                            <Avatar
                                rounded
                                size={Layout.window.width * 0.3}
                                source={{ uri: avatar }}
                                showEditButton
                                containerStyle={styles.imageCard}
                                onPress={this._togglePopupUploadImage}
                            />
                            <View style={styles.displayInlineBlock}>
                                <View style={{ width: '50%' }}>
                                    <FormInput
                                        line
                                        label={'Tên'}
                                        textBox
                                        require
                                        onChangeText={(text) => this.setState({ firstName: text })}
                                        value={firstName}
                                        placeholder={'Tên nhân viên...'}
                                        errorMessage={!firstName || firstName == '' ? null : (validateName(firstName.normalize('NFC')) ? null : 'Tên không hợp lệ')}
                                    />
                                </View>
                                <View style={{ width: '50%' }}>
                                    <FormInput
                                        line
                                        label={'Họ'}
                                        textBox
                                        require
                                        onChangeText={(text) => this.setState({ lastName: text })}
                                        value={lastName}
                                        placeholder={'Họ nhân viên...'}
                                        errorMessage={!lastName || lastName == '' ? null : (validateName(lastName.normalize('NFC')) ? null : 'Họ không hợp lệ')}
                                    />
                                </View>
                            </View>
                            {/* <View style={styles.displayInlineBlock}>
                                <View style={{ width: '50%' }}> */}
                            <FormInput
                                line
                                label={'Chức vụ'}
                                textBox
                                require
                                onChangeText={(text) => this.setState({ position: text })}
                                value={position}
                                placeholder={'Nhập chức vụ...'}
                            />
                            {/* </View>
                                <View style={{ width: '50%', height: 70, justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <CheckBox
                                        containerStyle={{
                                            backgroundColor: Colors.transparent,
                                            borderWidth: 0,
                                            padding: 0,
                                        }}
                                        title={'Quyền quản lý'}
                                        checked={manager}
                                        onPress={() => this.setState({ manager: !manager, position: position == 'Quản lý' ? 'Nhân viên' : 'Quản lý' })} />
                                </View>
                            </View> */}
                            {manager &&
                                <Text style={{ marginTop: 10 }}>*Lưu ý: Quyền quản lý được phép quản lý các dịch vụ và khuyến mãi, quản lý nhân viên, quản lý khách hàng, xem doanh số của cửa hàng này. Một cửa hàng nên có một quản lý.</Text>
                            }
                            <FormInput
                                line
                                label={'Tên tài khoản'}
                                textBox
                                require
                                onChangeText={(text) => this.setState({ userName: text })}
                                value={userName}
                                placeholder={'Nhập tên tài khoản...'}
                                errorMessage={!userName || userName == '' ? null : (validateSpecialKey(userName) ? null : 'Tên tài khoản không chứa ký tự đặc biệt')}
                            />
                            <View style={styles.displayInlineBlock}>
                                <View style={{ width: '50%' }}>
                                    <FormInput
                                        line
                                        label={'Mật khẩu'}
                                        textBox
                                        require
                                        secureTextEntry
                                        onChangeText={(text) => this.setState({ password: text })}
                                        value={password}
                                        placeholder={'Nhập mật khẩu...'} />
                                </View>
                                <View style={{ width: '50%' }}>
                                    <FormInput
                                        line
                                        label={'Xác nhận'}
                                        textBox
                                        require
                                        secureTextEntry
                                        onChangeText={(text) => this.setState({ confirm: text })}
                                        value={confirm}
                                        placeholder={'Xác nhận mật khẩu...'}
                                        errorMessage={!confirm || confirm == '' ? null : (confirmPassword(password, confirm) ? null : 'Mật khẩu xác nhận chưa trùng khớp')}
                                    />
                                </View>
                            </View>
                            <FormInput
                                line
                                label={'Số điện thoại'}
                                textBox
                                require
                                keyboardType={'phone-pad'}
                                onChangeText={(text) => this.setState({ phone: text })}
                                value={phone}
                                placeholder={'Nhập số điện thoại...'}
                                errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                            />
                            <FormInput
                                line
                                label={'Email'}
                                textBox
                                keyboardType={'email-address'}
                                onChangeText={(text) => this.setState({ email: text })}
                                value={email}
                                placeholder={'Nhập địa chỉ email (nếu có)'}
                                errorMessage={!email || email == '' ? null : (validateEmail(email) ? null : 'Email không hợp lệ')}
                            />
                            <View style={[styles.form, styles.formSubmit]}>
                                <ButtonGradient
                                    disabled={
                                        email != '' && !validateEmail(email) ||
                                        !validatePhoneNumber(phone) ||
                                        !confirmPassword(password, confirm) ||
                                        !validateLimituserName(userName) ||
                                        !validateSpecialKey(userName) ||
                                        !validateName(firstName.normalize('NFC')) ||
                                        !validateName(lastName.normalize('NFC')) ||
                                        firstName == '' ||
                                        lastName == '' ||
                                        position == '' ||
                                        userName == '' ||
                                        password == ''
                                    }
                                    onPress={() =>
                                        this.createEmployee(
                                            lastName,
                                            firstName,
                                            email,
                                            position,
                                            phone,
                                            userName,
                                            password,
                                            get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
                                            manager,
                                            avatar
                                        )
                                    }
                                    content='Thêm nhân viên'
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <PopUpUploadImage
                        isVisible={this.state.isVisiblePopupUploadImage}
                        takeImage={() => this.takeImage()}
                        selectImage={() => this.selectImage()}
                        pressCancel={this._togglePopupUploadImage}
                    />
                    <PopUpConfirm isVisible={this.state.isModalBackVisible}
                        modalText={'Bạn chắc chắn muốn trở lại?'}
                        confirmText={'Trở lại'}
                        confirmPress={() => {
                            this._toggleModalBack()
                            NavigationService.navigate('Employee')
                        }}
                        confirmCancel={'Hủy bỏ'}
                        confirmCancelPress={this._toggleModalBack}
                    />
                </SafeAreaView>
            );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    containerBody: {
        flex: 1,
        backgroundColor: Colors.bg,
        paddingLeft: 20,
        paddingRight: 20,
    },
    imageCard: {
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.functionColorDark,
    },
    text: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 17,
        marginTop: 3,
    },
    form: {
        marginTop: 30,
    },
    formSubmit: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 22,
    },
});


const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfEmployeeDetailReducers],
        ...state[nameOfLoadingReducers][
        employeeActions.CREATE_EMPLOYEE
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(employeeActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployeeScreen)