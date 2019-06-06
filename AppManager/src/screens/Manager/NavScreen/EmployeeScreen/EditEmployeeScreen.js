import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { ButtonGradient, FormInput, MainHeader, PopUpInput, ButtonSolid, ButtonText, PopUpConfirm } from '../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NavigationService from '../../../../navigation/NavigationService';
import { nameOfEmployeeDetailReducers, nameOfStoreDetailReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../reducers';
import { validateEmail, validatePhoneNumber, validateIdentification, convertVietNamPhoneNumber, validateName, validateYoB, confirmPassword } from '../../../../helper/validationHelper';
import { bindActionCreators } from 'redux';
import { employeeActions, profileActions } from '../../../../actions/index';
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'
import { get } from 'lodash'


class EditEmployeeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            position: '',
            birthday: '',
            hometown: '',
            address: '',
            identification: '',
            phone: '',
            email: '',
            isEdit: false,
            password: '',
            verifyPassword: '',
            isPopupInputVisible: false,
            isVisiblePopup: false,
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.setState({
            firstName: this.props.detail.firstName || '',
            lastName: this.props.detail.lastName || '',
            position: this.props.detail.position || '',
            birthday: this.props.detail.birthday || '',
            hometown: this.props.detail.hometown || '',
            address: this.props.detail.address || '',
            identification: this.props.detail.identification || '',
            phone: this.props.detail.phone || '',
            email: this.props.detail.email || ''
        })
    }

    updateEmployee() {
        const employee = {
            'id': this.props.employeeId,
            'lastName': this.state.lastName,
            'firstName': this.state.firstName,
            'position': this.state.position,
            'birthday': this.state.birthday,
            'hometown': this.state.hometown,
            'address': this.state.address,
            'identification': this.state.identification,
            'phone': convertVietNamPhoneNumber(this.state.phone),
            'email': this.state.email,
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }
        const data = {
            'user': employee,
            callback: () => {
                this.props.navigation.state.params.callback()
                NavigationService.goBack();
                this.setState({ isEdit: false });
            }
        }
        console.log(this.props, data)
        this.props.actions.updateProfileUserRequest(data)
    }

    updateEmployeePassword = (password) => {
        const employee = {
            'portal': get(storeService.getSpecificState(nameOfProfileReducers), 'user.portal'),
            'username': this.props.detail.userName,
            'newPassword': password,
        }
        const data = {
            'employee': employee,
            callback: () => {
                this.props.navigation.state.params.callback()
                NavigationService.goBack()
            }
        }
        console.log(this.props, data)
        this.props.actions.updateEmployeePasswordRequest(data)
    }


    renderLeftComponent() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ width: 50, height: 25, justifyContent: 'center' }} onPress={() => NavigationService.navigate('Employee')}>
                    <FontAwesome5
                        name='chevron-left'
                        size={FontStyle.mdText}
                        color={Colors.dark9}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderCenterComponent() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold', marginLeft: -40 }}>
                    CHỈNH SỬA
                </Text>
            </View>
        );
    }

    _togglePopupInput = () => this.setState({ isPopupInputVisible: !this.state.isPopupInputVisible });

    _togglePopup = () => this.setState({ isVisiblePopup: !this.state.isVisiblePopup });

    deleteEmployee = () => {
        this.setState({ loading: true }, async () => {
            const obj = {
                'id': this.props.detail.id,
                'portal': get(storeService.getSpecificState(nameOfProfileReducers), 'user.portal'),
            }
            const data = {
                'employee': obj,
                callback: () => {
                    this.setState({ loading: true });
                    storeService.dispatch(employeeActions.fetchAllEmployeeRequest({ 'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId') }))
                    NavigationService.navigate('Employee')
                },
                fallback: () => {
                    this.setState({ loading: false });
                }
            }
            this._togglePopup()
            this.props.actions.deleteEmployeeRequest(data)
        })
    }

    render() {
        const {
            firstName,
            lastName,
            position,
            birthday,
            hometown,
            address,
            identification,
            phone,
            email,
            isEdit
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.navigate('Employee')}
                    centerComponent={'Sửa thông tin'}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.containerBody}>
                        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold', paddingTop: 1, marginBottom: -10 }}>
                            THÔNG TIN CÁ NHÂN
                        </Text>
                        <View style={styles.displayInlineBlock}>
                            <View style={{ width: '50%' }}>
                                <FormInput
                                    line
                                    label={'Tên'}
                                    textBox
                                    require
                                    onChangeText={(text) => this.setState({ firstName: text, isEdit: true })}
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
                                    onChangeText={(text) => this.setState({ lastName: text, isEdit: true })}
                                    value={lastName}
                                    placeholder={'Họ nhân viên...'}
                                    errorMessage={!lastName || lastName == '' ? null : (validateName(lastName.normalize('NFC')) ? null : 'Họ không hợp lệ')}
                                />
                            </View>
                        </View>
                        <FormInput
                            label={'Chức vụ'}
                            textBox
                            line
                            require
                            editable={position != 'Chủ sở hữu'}
                            onChangeText={(text) => this.setState({ position: text, isEdit: true })}
                            value={position}
                            placeholder={'Nhập chức vụ...'}
                        />
                        <View style={styles.displayInlineBlock}>
                            <View style={{ width: '50%' }}>
                                <FormInput
                                    label={'Quê quán'}
                                    textBox
                                    line
                                    onChangeText={(text) => this.setState({ hometown: text, isEdit: true })}
                                    value={hometown}
                                    placeholder={'Nhập quê quán...'}
                                />
                            </View>
                            <View style={{ width: '50%' }}>
                                <FormInput
                                    label={'Năm sinh'}
                                    textBox
                                    line
                                    maxLength={4}
                                    keyboardType={Platform.OS == 'ios' ? 'number-pad' : 'numeric'}
                                    onChangeText={(text) => this.setState({ birthday: text, isEdit: true })}
                                    value={birthday}
                                    placeholder={'Nhập năm sinh...'}
                                    errorMessage={!birthday || birthday == '' ? null : (validateYoB(birthday) ? null : 'Năm sinh không hợp lệ')}
                                />
                            </View>
                        </View>
                        <FormInput
                            label={'Chổ ở hiện tại'}
                            textBox
                            line
                            onChangeText={(text) => this.setState({ address: text, isEdit: true })}
                            value={address}
                            placeholder={'Nhập chổ ở hiện tại...'}
                        />
                        <FormInput
                            label={'Căn cước/CMND'}
                            textBox
                            line
                            keyboardType={Platform.OS == 'ios' ? 'number-pad' : 'numeric'}
                            onChangeText={(text) => this.setState({ identification: text, isEdit: true })}
                            value={identification}
                            placeholder={'Nhập căn cước hoặc CMND...'}
                            errorMessage={!identification || identification == '' ? null : (validateIdentification(identification) ? null : 'Số căn cước hoặc CMND không hợp lệ')}
                        />
                        <FormInput
                            label={'Điện thoại'}
                            textBox
                            line
                            require
                            keyboardType={'phone-pad'}
                            onChangeText={(text) => this.setState({ phone: text, isEdit: true })}
                            value={phone}
                            placeholder={'Nhập số điện thoại...'}
                            errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                        />
                        <FormInput
                            label={'Email'}
                            textBox
                            line
                            keyboardType={'email-address'}
                            onChangeText={(text) => this.setState({ email: text, isEdit: true })}
                            value={email}
                            placeholder={'Nhập địa chỉ email (nếu có)'}
                            errorMessage={!email || email == '' ? null : (validateEmail(email) ? null : 'Email không hợp lệ')}
                        />
                    </View>
                    {isEdit ?
                        <View style={[styles.form, styles.formSubmit]}>
                            <ButtonSolid
                                onPress={() => this.updateEmployee()}
                                disable={
                                    email && !validateEmail(this.state.email)
                                    || !validatePhoneNumber(phone)
                                    || !validateName(firstName.normalize('NFC'))
                                    || !validateName(lastName.normalize('NFC'))
                                    || identification && !validateIdentification(identification)
                                    || firstName == ''
                                    || lastName == ''
                                    || position == ''}
                                backgroundColor={Colors.primaryButton}
                                width={'85%'}
                                label={'Lưu'}
                            />
                        </View>
                        :
                        <View style={[styles.form, styles.formSubmit]}>
                            <ButtonSolid
                                onPress={() => this._togglePopupInput()}
                                label='Đặt lại mật khẩu'
                                width={'85%'}
                                backgroundColor={Colors.primaryButton}
                            />
                            {position != 'Chủ sở hữu' &&
                                < ButtonText
                                    onPress={this._togglePopup}
                                    label={'Xóa'}
                                />
                            }
                        </View>
                    }
                </ScrollView>
                <PopUpConfirm
                    isVisible={this.state.isVisiblePopup}
                    modalText={'Bạn chắc chắn muốn xoá nhân viên này?'}
                    confirmText={'Xoá'}
                    confirmPress={this.deleteEmployee}
                    confirmCancel={'Hủy bỏ'}
                    confirmCancelPress={this._togglePopup}
                />
                <PopUpInput isVisible={this.state.isPopupInputVisible}
                    onBackdropPress={this._togglePopupInput}>
                    <Text style={styles.modalTitle}>
                        {'Đổi Mật khẩu'}
                    </Text>
                    <TextInput style={[styles.formInput, { marginTop: Layout.window.height * 0.02 }]}
                        onChangeText={(text) => this.setState({ password: text })}
                        value={this.state.password}
                        placeholder={'Mật khẩu'}
                        secureTextEntry={true}
                        autoFocus
                    />
                    <TextInput style={[styles.formInput, { marginTop: Layout.window.height * 0.02 }]}
                        onChangeText={(text) => this.setState({ verifyPassword: text })}
                        value={this.state.verifyPassword}
                        placeholder={'Nhập lại mật khẩu'}
                        secureTextEntry={true}
                    />
                    {!confirmPassword(this.state.password, this.state.verifyPassword) &&
                        <Text style={[{ color: Colors.errorText, fontStyle: 'italic', fontSize: FontStyle.miniText }, this.props.errorStyle]}>
                            {'Mật khẩu không trùng khớp'}
                        </Text>
                    }
                    <View style={[{ marginTop: 20 }, styles.displayInlineBlock]}>
                        <TouchableOpacity style={[styles.cancelBtn]} onPress={this._togglePopupInput}>
                            <Text style={styles.textBold}>{'Hủy bỏ'}</Text>
                        </TouchableOpacity>
                        <ButtonGradient
                            width={'45%'}
                            disabled={
                                this.state.password == ''
                                || this.state.verifyPassword == ''
                                || !confirmPassword(this.state.password, this.state.verifyPassword)}
                            onPress={() => this.updateEmployeePassword(this.state.password)}
                            content={'Xác nhận'}
                            labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }} />
                    </View>
                </PopUpInput>
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
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
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
    modalText: {
        textAlign: 'center',
        fontFamily: FontStyle.mainFont,
        fontSize: FontStyle.smallText,
        color: Colors.darkText,
        marginTop: 30,
        marginBottom: 30,
        width: Layout.window.width * 0.5
    },
    cancelBtn: {
        height: 40,
        width: '45%',
        backgroundColor: Colors.transparent,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    formInput: {
        height: 40,
        width: Layout.window.width * 0.65,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingBottom: 10,
        paddingLeft: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
    },
    modalTitle: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        fontFamily: FontStyle.mainFont
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfEmployeeDetailReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...employeeActions, ...profileActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEmployeeScreen)