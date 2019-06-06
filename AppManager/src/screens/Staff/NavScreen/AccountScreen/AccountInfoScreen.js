import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { validateEmail, validatePhoneNumber, validateIdentification, convertVietNamPhoneNumber, validateName, validateYoB, confirmPassword } from '../../../../helper/validationHelper';
import { FormInput, MainHeader, UserAvatar, ButtonGradient, PopUpInput, PopUpUploadImage } from '../../../../components/react-native-teso';
import { nameOfEmployeeDetailReducers, nameOfProfileReducers } from '../../../../reducers';
import { importImage } from '../../../../helper';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { employeeActions, profileActions } from '../../../../actions/index';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService'
import { Avatar } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { get } from 'lodash'
import { DefaultImages } from '../../../../assets/styles/Constant';

class AccountInfoScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: '',
            lastName: '',
            firstName: '',
            position: '',
            phone: '',
            email: '',
            birthday: '',
            hometown: '',
            address: '',
            identification: '',
            password: '',
            verifyPassword: '',
            avatar: null,
            isPopupInputVisible: false,
            isChange: false,
            loading: false,
            isVisiblePopupUploadImage: false,
        };
        this.updateEmployeePassword = this.updateEmployeePassword.bind(this)
        this.updateInfo = this.updateInfo.bind(this)
        this.loadData = this.loadData.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.takeImage = this.takeImage.bind(this);
        this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.loadData()
    }

    updateInfo(id, firstName, lastName, phone, email, position, birthday, hometown, address, identification, avatar) {
        this.setState({ loading: true }, async () => {
            var thumbnailImage = ''
            if (String(avatar).substr(0, 4) !== 'http') {
                await importImage.uploadImage(avatar)
                    .then(image => {
                        thumbnailImage = image
                    })
            }
            else {
                thumbnailImage = avatar
            }
            console.log(thumbnailImage);
            const user = {
                'id': id,
                'firstName': firstName,
                'lastName': lastName,
                'phone': phone,
                'email': email,
                'position': position,
                'birthday': birthday,
                'hometown': hometown,
                'address': address,
                'identification': identification,
                'avatar': thumbnailImage
            }
            const data = {
                'user': user,
                callback: () => {
                    NavigationService.goBack()
                }
            }
            this.setState({ loading: false });
            this.props.actions.updateProfileUserRequest(data)
        })
    }

    loadData() {
        const data = {
            'userId': this.props.user.id,
            callback: () => {
                this.setState({
                    firstName: this.props.user.firstName || '',
                    lastName: this.props.user.lastName || '',
                    phone: this.props.user.phone || '',
                    email: this.props.user.email || '',
                    position: this.props.user.position || '',
                    birthday: this.props.user.birthday || '',
                    hometown: this.props.user.hometown || '',
                    address: this.props.user.address || '',
                    identification: this.props.user.identification || '',
                    avatar: this.props.user.avatar
                })
            }
        }
        this.props.actions.fetchProfileRequest(data)
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

    _togglePopupInput = () => this.setState({ isPopupInputVisible: !this.state.isPopupInputVisible });

    selectImage() {
        this._togglePopupUploadImage();
        importImage.selectImage()
            .then(url => {
                this.setState({
                    avatar: url.path,
                    isChange: true
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
                    avatar: url.path,
                    isChange: true
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    _togglePopupUploadImage() {
        console.log('onPress', !this.state.isVisiblePopupUploadImage)
        this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
    }

    render() {
        const {
            lastName,
            firstName,
            position,
            phone,
            email,
            birthday,
            hometown,
            address,
            identification,
            isChange,
            avatar
        } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => this.props.navigation.goBack()}
                    centerComponent={'Thông tin cá nhân'}
                    rightPress={this.state.isChange ? () => {
                        this.updateInfo(
                            this.props.user.id,
                            firstName,
                            lastName,
                            phone,
                            email,
                            position,
                            birthday,
                            hometown,
                            address,
                            identification,
                            avatar
                        )
                    } : null}
                    rightDisabled={
                        !firstName
                        || firstName == ''
                        || !phone
                        || phone == ''
                        || !validateName(firstName.normalize('NFC'))
                        //|| !validateName(lastName.normalize('NFC'))
                        //|| email && !validateEmail(email)
                        || !validatePhoneNumber(phone)
                        // || birthday && !validateYoB(birthday)
                        // || identification && !validateIdentification(identification)
                    }
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.containerBody}>
                        <View style={styles.blockImage}>
                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Avatar
                                        rounded
                                        size={Layout.window.width * 0.3}
                                        source={{ uri: avatar || DefaultImages.AVATAR }}
                                        showEditButton
                                        onPress={this._togglePopupUploadImage}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.displayInlineBlock}>
                            <View style={{ width: '47.5%' }}>
                                <FormInput
                                    label={'Tên'}
                                    textBox
                                    require
                                    line
                                    onChangeText={(text) => this.setState({ firstName: text, isChange: true })}
                                    value={firstName}
                                    errorMessage={!firstName || firstName == '' ? null : (validateName(firstName.normalize('NFC')) ? null : 'Tên không hợp lệ')}
                                />
                            </View>
                            <View style={{ width: '47.5%', marginLeft: '5%' }}>
                                <FormInput
                                    label={'Họ'}
                                    textBox
                                    line
                                    onChangeText={(text) => this.setState({ lastName: text, isChange: true })}
                                    value={lastName}
                                    // placeholder={'Nhập họ của bạn'}
                                    errorMessage={!lastName || lastName == '' ? null : (validateName(lastName.normalize('NFC')) ? null : 'Họ không hợp lệ')}
                                />
                            </View>
                        </View>
                        <FormInput
                            label={'Chức vụ'}
                            textBox
                            line
                            // placeholder={'Nhập chức vụ'}
                            onChangeText={(text) => this.setState({ position: text, isChange: true })}
                            value={position} />
                        <FormInput
                            label={'Điện thoại'}
                            textBox
                            line
                            require
                            keyboardType={'phone-pad'}
                            onChangeText={(text) => this.setState({ phone: text, isChange: true })}
                            value={`${!phone ? '' : phone}`}
                            // placeholder={'Nhập số điện thoại'}
                            errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                        />
                        <FormInput
                            label={'Email'}
                            textBox
                            line
                            keyboardType={'email-address'}
                            onChangeText={(text) => this.setState({ email: text, isChange: true })}
                            value={email}
                            // placeholder={'Nhập địa chỉ email (nếu có)'}
                            errorMessage={!email || email == '' ? null : (validateEmail(email) ? null : 'Email không hợp lệ')}
                        />
                        <FormInput
                            label={'Năm sinh'}
                            textBox
                            line
                            maxLength={4}
                            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                            onChangeText={(text) => this.setState({ birthday: text, isChange: true })}
                            value={birthday}
                            errorMessage={!birthday || birthday == '' ? null : (validateYoB(birthday) ? null : 'Năm sinh không hợp lệ')}
                        />
                        <FormInput
                            label={'Quê quán'}
                            textBox
                            line
                            onChangeText={(text) => this.setState({ hometown: text, isChange: true })}
                            value={hometown} />
                        <FormInput
                            label={'Chỗ ở hiện tại'}
                            textBox
                            line
                            onChangeText={(text) => this.setState({ address: text, isChange: true })}
                            value={address} />
                        <FormInput
                            label={'Căn cước/ CMND'}
                            textBox
                            line
                            keyboardType={Platform.OS == 'ios' ? 'number-pad' : 'numeric'}
                            onChangeText={(text) => this.setState({ identification: text, isChange: true })}
                            value={identification}
                            errorMessage={!identification || identification == '' ? null : (validateIdentification(identification) ? null : 'Số CMND/ Số căn cước không hợp lệ')}
                        />
                    </View>
                </ScrollView>
                {isChange ||
                    <ButtonGradient
                        onPress={() => this._togglePopupInput()}
                        content='Đặt lại mật khẩu'
                    />
                }
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
                <PopUpUploadImage
                    isVisible={this.state.isVisiblePopupUploadImage}
                    takeImage={() => this.takeImage()}
                    selectImage={() => this.selectImage()}
                    pressCancel={this._togglePopupUploadImage}
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
        marginBottom: 40,
    },
    text: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 17,
        marginTop: 3,
    },
    formLabel: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
    },
    formInput: {
        height: 40,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingBottom: 10,
        paddingLeft: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
    },
    blockImage: {
        width: '100%',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
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
        ...state[nameOfProfileReducers],
        ...state[nameOfEmployeeDetailReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...employeeActions, ...profileActions, }, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountInfoScreen)
