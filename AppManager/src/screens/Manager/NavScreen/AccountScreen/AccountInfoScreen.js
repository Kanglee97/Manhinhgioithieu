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
    AsyncStorage,
    SafeAreaView
} from 'react-native';

import { validateEmail, validatePhoneNumber, validateName, validateIdentification, validateYoB } from '../../../../helper/validationHelper';
import { FormInput, MainHeader, PopUpUploadImage, Loading } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService'
import { DefaultImages } from '../../../../assets/styles/Constant';
import { nameOfProfileReducers } from '../../../../reducers'
import { profileActions } from '../../../../actions/index';
import { importImage } from '../../../../helper';
import { Avatar } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
            avatar: null,
            isChange: false,
            isVisiblePopupUploadImage: false,
            loading: false,
        };
        this.renderCenterComponent = this.renderCenterComponent.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.loadData = this.loadData.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.takeImage = this.takeImage.bind(this);
        this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    renderCenterComponent() {
        return (
            <View style={[styles.container]}>
                <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold', marginLeft: -40 }}>
                    Thông tin cá nhân
                </Text>
            </View>
        );
    }

    componentDidMount() {
        this.loadData()
    }

    updateInfo(id, firstName, lastName, phone, email, position, birthday, hometown, address, identification, avatar) {
        this.setState({ loading: true },
            async () => {
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
                    avatar: this.props.user.avatar || DefaultImages.AVATAR
                })
            }
        }
        this.props.actions.fetchProfileRequest(data)
    }

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
            avatar
        } = this.state;
        if (this.state.loading) return <Loading />
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
                        !validateName(firstName.normalize('NFC'))
                        || !validatePhoneNumber(phone)
                        || lastName != '' && !validateName(lastName.normalize('NFC'))
                        || email != '' && !validateEmail(email)
                        || birthday != '' && !validateYoB(birthday)
                        || identification != '' && !validateIdentification(identification)}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.containerBody}>
                        <View style={styles.blockImage}>
                            <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                    <Avatar
                                        rounded
                                        size={Layout.window.width * 0.3}
                                        source={{ uri: avatar }}
                                        showEditButton
                                        onPress={this._togglePopupUploadImage}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                            <Text style={{
                                fontSize: FontStyle.mdText,
                                color: Colors.darkText,
                                paddingLeft: 2
                            }}>{this.props.user.portal}</Text>
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
                                    errorMessage={!lastName || lastName == '' ? null : (validateName(lastName.normalize('NFC')) ? null : 'Họ không hợp lệ')}
                                />
                            </View>
                        </View>
                        <FormInput
                            label={'Chức vụ'}
                            textBox
                            line
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
                            errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                        />
                        <FormInput
                            label={'Email'}
                            textBox
                            line
                            keyboardType={'email-address'}
                            onChangeText={(text) => this.setState({ email: text, isChange: true })}
                            value={email}
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
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfProfileReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...profileActions }, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountInfoScreen)
