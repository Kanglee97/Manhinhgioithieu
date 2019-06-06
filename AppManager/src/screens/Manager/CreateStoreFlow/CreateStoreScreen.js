import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    ActivityIndicator,
    PermissionsAndroid,
    Alert,
    SafeAreaView
} from 'react-native';

import { ButtonGradient, FormInput, MainHeader, PopUpUploadImage, CoverImage, Loading } from '../../../components/react-native-teso';
import { nameOfProfileReducers, nameOfAccountPackageReducers } from '../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { profileActions, accountPackageActions } from '../../../actions/index';
import { validatePhoneNumber } from '../../../helper/validationHelper';
import NavigationService from '../../../navigation/NavigationService';
import { DefaultImages } from '../../../assets/styles/Constant';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as storeService from '../../../sagas/storeService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LocationSwitch from 'react-native-location-switch';
import RNGooglePlaces from 'react-native-google-places';
import OpenSettings from 'react-native-open-settings';
import Permissions from 'react-native-permissions';
import { importImage } from '../../../helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import Moment from 'moment';
import "unorm";

class CreateStoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            portal: '',
            phone: '',
            email: '',
            latitude: '',
            longitude: '',
            openTime: '',
            closeTime: '',
            address: '',
            ownerId: '',
            thumbnail: null,
            back: null,
            isOpenTimeVisible: false,
            isCloseTimeVisible: false,
            openTime: '08:00',
            closeTime: '17:00',
            loading: false,
            openMapLoading: false,
            locationEnabled: false,
            changePortal: false,
            isVisiblePopupUploadImage: false
        };
        this.selectImage = this.selectImage.bind(this);
        this.takeImage = this.takeImage.bind(this);
        this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this);
        this.createNewStore = this.createNewStore.bind(this);
    }

    componentWillMount() {
        console.log('createstorescreen will mount')
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({
            ownerId: navigation.getParam('ownerId', this.props.user.id),
            phone: navigation.getParam('phone', String(this.props.user.phone).replace('+84', '0')), //Server sẽ add +84 vào
            back: navigation.getParam('back', false),
            portal: String(this.props.user.portal).replace('.salozo.com', ''),
            //kiểm tra nếu portal có thể thay đổi
            changePortal: !this.props.user.portal ? true : false,
            thumbnail: DefaultImages.COVER,
        });
    }

    onEnableLocationPress() {
        LocationSwitch.enableLocationService(1000, true,
            () => { this.setState({ locationEnabled: true }); },
            () => { this.setState({ locationEnabled: false }); },
        );
    }

    _requestLocationPermissionOnAndroid() {
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]).then((granted) => {
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the location');
            } else {
                console.log('Location permission denied');
            }
        }).catch(err => {
            console.warn(err);
        });
    }

    _checkLocationPermission = () => {
        Permissions.check('location').then(res => {
            this.setState({ locationPermission: res });
        })
    }

    _requestLocationPermission = () => {
        console.log('request permission')
        Permissions.request('location').then(res => {
            this.setState({ locationPermission: res });
        })
    }

    _alertForPhotosPermission() {
        Alert.alert(
            'Chúng tôi có thể truy cập vị trí của bạn không?',
            'Điều này sẽ giúp chúng tôi xác định địa chỉ chính xác của cửa hàng',
            [
                {
                    text: 'No way',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                this.state.photoPermission == 'undetermined'
                    ? { text: 'OK', onPress: this._requestLocationPermission() }
                    : { text: 'Open Settings', onPress: Platform.OS == 'ios' ? Permissions.openSettings : OpenSettings.openSettings },
            ],
        )
    }

    _openAutocompleteModal() {
        if (!this.state.locationEnabled) {
            this.onEnableLocationPress();
        }
        this.setState({ openMapLoading: true });
        RNGooglePlaces.getCurrentPlace().then((results) => {
            console.log(results);
            RNGooglePlaces.openAutocompleteModal({
                type: 'address',
                country: 'VN',
                latitude: results[0].latitude || 10.7675719,
                longitude: results[0].longitude || 106.6978481,
                radius: 50,
                useOverlay: true
            }).then((place) => {
                console.log(place);
                this.setState({
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    openMapLoading: false
                });
            }).catch(error => { console.log(error.message); this.setState({ openMapLoading: false }) });  // error is a Javascript Error object
        }).catch((error) => { console.log(error.message); this.setState({ openMapLoading: false }) });
    }

    _openPlacePickerModal() {
        if (!this.state.locationEnabled) {
            this.onEnableLocationPress();
        }
        this.setState({ openMapLoading: true });
        RNGooglePlaces.getCurrentPlace().then((results) => {
            console.log(results);
            RNGooglePlaces.openPlacePickerModal({
                latitude: results[0].latitude || 10.7675719,
                longitude: results[0].longitude || 106.6978481,
                radius: 1,
            }).then((place) => {
                console.log(place);
                this.setState({
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    openMapLoading: false
                });
            }).catch(error => { console.log(error.message); this.setState({ openMapLoading: false }) });  // error is a Javascript Error object
        }).catch((error) => { console.log(error.message); this.setState({ openMapLoading: false }) });
    }

    _toggleOpenTimePicker = () => this.setState({ isOpenTimeVisible: !this.state.isOpenTimeVisible });

    _handleOpenTimePicked = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ openTime: Moment(time).format('HH:mm') });
        this._toggleOpenTimePicker();
    };

    _toggleCloseTimePicker = () => this.setState({ isCloseTimeVisible: !this.state.isCloseTimeVisible });

    _handleCloseTimePicked = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ closeTime: Moment(time).format('HH:mm') });
        this._toggleCloseTimePicker();
    };

    createNewStore(thumbnail) {
        this.setState({ loading: true }, async () => {
            var thumbnailImage = ''
            if (thumbnail) {
                if (String(thumbnail).substr(0, 4) !== 'http') {
                    await importImage.uploadImage(thumbnail)
                        .then(image => {
                            thumbnailImage = image
                        })
                }
                else {
                    thumbnailImage = thumbnail
                }
            } else {
                thumbnailImage = DefaultImages.COVER
            }
            this.setState({ thumbnail: thumbnailImage }, async () => {
                this.state.changePortal ?
                    this.props.actions.updateProfileUserRequest({
                        'user': {
                            ...this.props.user,
                            'portal': this.state.portal,
                        },
                        callback: () => {
                            const store = {
                                ownerId,
                                displayName,
                                portal,
                                address,
                                phone,
                                email,
                                latitude,
                                longitude,
                                openTime,
                                closeTime,
                                thumbnail
                            } = this.state
                            const data = {
                                'store': store,
                                callback: () => {
                                    storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({ 'managerId': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') }))
                                    this.setState({ loading: false });
                                    return NavigationService.navigate('CreateSuccess');
                                }
                            }
                            this.props.actions.createProfileStoreListRequest(data)
                        }
                    })
                    :
                    this.props.actions.updateProfileUserRequest({
                        'user': {
                            ...this.props.user,
                        },
                        callback: () => {
                            const store = {
                                ownerId,
                                displayName,
                                address,
                                portal,
                                phone,
                                email,
                                latitude,
                                longitude,
                                openTime,
                                closeTime,
                                thumbnail
                            } = this.state
                            const data = {
                                'store': store,
                                callback: () => {
                                    this.setState({ loading: false });
                                    return NavigationService.navigate('CreateSuccess');
                                }
                            }
                            this.props.actions.createProfileStoreListRequest(data)
                        }
                    })
                this.setState({ loading: false })
            })
        });
    }

    selectImage() {
        this._togglePopupUploadImage();
        importImage.selectImage(600, 360)
            .then(url => {
                this.setState({
                    thumbnail: url.path
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    takeImage() {
        this._togglePopupUploadImage();
        importImage.takeImage(600, 360)
            .then(url => {
                this.setState({
                    thumbnail: url.path
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    _togglePopupUploadImage() {
        this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
    }

    render() {
        const { bizData, staffNumberData, isOpenTimeVisible, isCloseTimeVisible } = this.state;
        const { displayName, portal, address, phone, email, openTime, closeTime, back, thumbnail } = this.state;
        console.log(this.state)
        if (this.state.loading) return (<Loading />)
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => {
                        back ?
                            NavigationService.navigate('Store') :
                            NavigationService.navigate('CreateOwner', {
                                firstName: this.props.user.firstName,
                                lastName: this.props.user.lastName
                            })
                    }}
                    centerComponent={'Khởi tạo cửa hàng'}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <CoverImage
                        onPress={this._togglePopupUploadImage}
                        thumbnail={thumbnail}
                    />
                    <View style={styles.containerBody}>
                        <FormInput
                            label={'Tên cửa hàng'}
                            require
                            textBox
                            line
                            onChangeText={(text) =>
                                this.setState({
                                    displayName: text,
                                    portal: this.state.changePortal ? String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(' ').join('').toLowerCase() : this.state.portal
                                })}
                            value={displayName}
                        // placeholder={'Nhập tên cửa hàng'} 
                        />
                        <FormInput
                            label={'Tên miền địa chỉ Salon của bạn'}
                            require
                            textBox
                            line
                            editable={this.state.changePortal}
                            onChangeText={(text) => {
                                this.setState({ portal: this.state.changePortal ? text : this.state.portal })
                            }}
                            autoCapitalize='none'
                            rightComponent={
                                <View style={{ justifyContent: 'center', alignItems: 'center', height: '50%' }}>
                                    <Text style={{ color: Colors.functionColorLight }}>.salozo.com</Text>
                                </View>
                            }
                            rightComponentStyle={{ alignItems: 'center' }}
                            inputStyle={{ paddingRight: '30%' }}
                            value={portal == 'null' ? '' : portal}
                        // placeholder={'Tên miền địa chỉ Salon của bạn'}
                        // notes={'Dùng để đăng nhập vào Salon. Ví dụ: hoanghon.salozo.com'} 
                        />
                        <FormInput
                            label={'Địa chỉ'}
                            require
                            textBox
                            line
                            inputStyle={{ paddingRight: 30 }}
                            //onFocus={() => this._openAutocompleteModal()}
                            value={address}
                            onChangeText={(text) => { this.setState({ address: text }) }}
                        // rightComponent={
                        //     this.state.openMapLoading ?
                        //         <ActivityIndicator size="small" color={Colors.functionColorDark} />
                        //         :
                        //         <TouchableOpacity onPress={() => this._openPlacePickerModal()}>
                        //             <FontAwesome5 name='search-location' size={20} color={Colors.functionColorDark} />
                        //         </TouchableOpacity>
                        // }
                        />
                        <FormInput
                            label={'Số điện thoại chi nhánh'}
                            require
                            textBox
                            line
                            onChangeText={(text) => this.setState({ phone: text })}
                            keyboardType={'phone-pad'}
                            value={phone}
                            errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                        />
                        <View style={[styles.form, styles.displayInlineBlock]}>
                            <View style={{ width: '45%', marginRight: '10%' }}>
                                <Text style={styles.formLabel}>Giờ mở cửa<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                                <TouchableWithoutFeedback onPress={() => this._toggleOpenTimePicker()}>
                                    <View style={[styles.displayInlineBlock, styles.formInput]}>
                                        <Text style={{ flex: 4 }}>{openTime}</Text>
                                        <AntDesign
                                            name={'clockcircleo'}
                                            size={20}
                                            color={Colors.functionColorDark}
                                            iconStyle={styles.timepicker}
                                            onPress={() => { this._toggleOpenTimePicker() }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.formLabel}>Giờ đóng cửa<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                                <TouchableWithoutFeedback onPress={() => this._toggleCloseTimePicker()}>
                                    <View style={[styles.displayInlineBlock, styles.formInput]}>
                                        <Text style={{ flex: 4 }}>{closeTime}</Text>
                                        <AntDesign
                                            name={'clockcircleo'}
                                            size={20}
                                            color={Colors.functionColorDark}
                                            iconStyle={styles.timepicker}
                                            onPress={() => { this._toggleOpenTimePicker() }}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={[styles.form, styles.formSubmit]}>
                            <ButtonGradient
                                disabled={
                                    // (email || email != '') && !validateEmail(email)
                                    !displayName && displayName == ''
                                    || !address && address == ''
                                    || !portal && portal == ''
                                    || !validatePhoneNumber(phone)
                                    || !openTime && openTime == ''
                                    || !closeTime && closeTime == ''}
                                onPress={() => this.createNewStore()}
                                content='Tạo cửa hàng'
                            />
                        </View>
                        {this.state.loading ? <ActivityIndicator size="small" color={Colors.functionColorDark} /> : null}
                        <DateTimePicker
                            mode={'time'}
                            datePickerContainerStyleIOS={Colors.functionColorLight}
                            isVisible={isOpenTimeVisible}
                            onConfirm={this._handleOpenTimePicked}
                            onCancel={this._toggleOpenTimePicker}
                        />
                        <DateTimePicker
                            mode={'time'}
                            datePickerContainerStyleIOS={Colors.functionColorLight}
                            isVisible={isCloseTimeVisible}
                            onConfirm={this._handleCloseTimePicked}
                            onCancel={this._toggleCloseTimePicker}
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
        marginTop: 20,
    },
    formLabel: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
    },
    formInput: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.functionColorLight,
        paddingHorizontal: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formSubmit: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 22,
    },
    downIcon: {
        position: 'absolute',
        top: '50%',
        right: 8,
    },
    localIcon: {
        position: 'absolute',
        top: '50%',
        right: 8,
        height: 25.02,
        width: 17.79
    },
    btnLinear: {
        width: Layout.window.width / 1.1,
        height: 40,
        borderRadius: 20,
    },
    btnLinearText: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.lightText,
        textAlign: 'center',
        backgroundColor: 'transparent',
        marginTop: 10,
    },
    addIcon: {
        height: 18.46,
        width: 18.46
    },
    timepicker: {
        position: 'absolute',
        top: '55%',
        right: 8,
        height: 20,
        width: 20
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfProfileReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(profileActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateStoreScreen)