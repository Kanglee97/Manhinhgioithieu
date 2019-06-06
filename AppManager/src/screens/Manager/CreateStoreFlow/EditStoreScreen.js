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
    PermissionsAndroid,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';

import { ButtonText, ButtonSolid, ButtonGradient, FormInput, MainHeader, PopUpConfirm, PopUpUploadImage, CoverImage, Loading } from '../../../components/react-native-teso';
import { profileActions, storeDetailActions, accountPackageActions } from '../../../actions/index'
import { nameOfProfileReducers, nameOfStoreDetailReducers } from '../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { validateEmail, validatePhoneNumber } from '../../../helper/validationHelper';
import NavigationService from '../../../navigation/NavigationService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { DefaultImages } from '../../../assets/styles/Constant';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as storeService from '../../../sagas/storeService'
import LocationSwitch from 'react-native-location-switch';
import RNGooglePlaces from 'react-native-google-places';
import OpenSettings from 'react-native-open-settings';
import Permissions from 'react-native-permissions';
import { importImage } from '../../../helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash'
import Moment from 'moment';

class EditStoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId: '',
            displayName: '',
            portal: '',
            phone: '',
            email: '',
            latitude: '',
            longitude: '',
            openTime: '',
            closeTime: '',
            address: '',
            thumbnail: DefaultImages.COVER,//null,
            ownerId: '',
            bizData: [
                { value: 'Salon tóc nam' },
                { value: 'Salon tóc nữ' },
                { value: 'Salon tóc cả nam và nữ' },
            ],
            staffNumberData: [
                { label: 'Từ 1 đến 5', value: '1 to 5' },
                { label: 'Từ 6 đến 10', value: '6 to 10' },
                { label: 'Từ 11 đến 25', value: '11 to 25' },
                { label: 'Từ 26 đến 50', value: '26 to 50' },
                { label: 'Trên 50', value: 'over 50' },
            ],
            isOpenTimeVisible: false,
            isCloseTimeVisible: false,
            openTime: '',
            closeTime: '',
            initialStartDay: new Date('Mon Feb 11 2019 08:00:00 GMT+0700 (Indochina Time)'),
            initialEndDay: new Date('Mon Feb 11 2019 17:00:00 GMT+0700 (Indochina Time)'),
            isChange: false,
            openMapLoading: false,
            loading: false,
            locationEnabled: false,
            isVisibleDelete: false,
            changePortal: false,
            isVisiblePopupUploadImage: false
        };
        this.selectImage = this.selectImage.bind(this);
        this.takeImage = this.takeImage.bind(this);
        this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this);
        this.updateStoreInfo = this.updateStoreInfo.bind(this);
        this.loadStoreInfo = this.loadStoreInfo.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;
        console.log('EditStoreScreen componentDidMount', this.props, this.state)
        const user = get(storeService.getSpecificState(nameOfProfileReducers), 'user')
        console.log(user)
        this.setState({
            loading: true,
            ownerId: navigation.getParam('ownerId', user.id),
            storeId: navigation.getParam('storeId', this.props.storeId),
            portal: String(user.portal).replace('.salozo.com', ''),
            //kiểm tra nếu portal có thể thay đổi
            changePortal: !user.portal ? true : false,
        }, async () => {
            this.loadStoreInfo()
        });
        // (Platform.OS === 'android') && this._requestLocationPermissionOnAndroid();
        // LocationSwitch.isLocationEnabled(
        //     () => { this.setState({ locationEnabled: true }); },
        //     () => { },
        // );
    }

    _toggleModal = () => this.setState({ isVisibleDelete: !this.state.isVisibleDelete });

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
                console.log('You can use the camera');
            } else {
                console.log('Camera permission denied');
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
        this.setState({ openMapLoading: true });
        RNGooglePlaces.openAutocompleteModal({
            type: 'address',
            country: 'VN',
            latitude: parseFloat(this.state.latitude),
            longitude: parseFloat(this.state.longitude),
            radius: 14,
            useOverlay: true
        })
            .then((place) => {
                console.log(place);
                this.setState({
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    openMapLoading: false
                });
            })
            .catch(error => { console.log(error.message); this.setState({ openMapLoading: false }) });  // error is a Javascript Error object
    }

    _openPlacePickerModal() {
        this.setState({ openMapLoading: true });
        RNGooglePlaces.openPlacePickerModal({
            latitude: parseFloat(this.state.latitude),
            longitude: parseFloat(this.state.longitude),
            radius: 50,
        })
            .then((place) => {
                console.log(place);
                this.setState({
                    address: place.address,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    openMapLoading: false
                });
            })
            .catch(error => { console.log(error.message); this.setState({ openMapLoading: false }) });  // error is a Javascript Error object
    }

    _toggleOpenTimePicker = () => this.setState({ isOpenTimeVisible: !this.state.isOpenTimeVisible })

    _handleOpenTimePicked = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ openTime: Moment(time).format('HH:mm'), isChange: true });
        this._toggleOpenTimePicker();
    };

    _toggleCloseTimePicker = () => this.setState({ isCloseTimeVisible: !this.state.isCloseTimeVisible })

    _handleCloseTimePicked = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ closeTime: Moment(time).format('HH:mm'), isChange: true });
        this._toggleCloseTimePicker();
    };


    loadStoreInfo() {
        const data = {
            storeId: this.state.storeId,
            callback: () => {
                this.setState({
                    displayName: this.props.data.displayName,
                    address: this.props.data.address,
                    phone: this.props.data.phone,
                    email: this.props.data.email,
                    latitude: this.props.data.latitude || parseFloat('10.7691058'),
                    longitude: this.props.data.longitude || parseFloat('106.685113'),
                    openTime: this.props.data.openTime,
                    closeTime: this.props.data.closeTime,
                    thumbnail: this.props.data.thumbnail || DefaultImages.COVER,
                    loading: false
                });
                // console.log(Moment(this.props.data.openTime), typeof Moment(this.props.data.openTime));
            }
        }
        this.props.actions.fetchStoreDetailRequest(data);
    }

    updateStoreInfo() {
        this.setState({ loading: true },
            async () => {
                var thumbnailImage = ''
                if (String(this.state.thumbnail).substr(0, 4) !== 'http') {
                    await importImage.uploadImage(this.state.thumbnail)
                        .then(image => {
                            thumbnailImage = image
                        })
                }
                else {
                    thumbnailImage = this.state.thumbnail
                }
                console.log(thumbnailImage);

                const store = {
                    'id': this.state.storeId,
                    'displayName': this.state.displayName,
                    'address': this.state.address,
                    'phone': this.state.phone,
                    'email': this.state.email,
                    'latitude': this.state.latitude,
                    'longitude': this.state.longitude,
                    'openTime': this.state.openTime,
                    'closeTime': this.state.closeTime,
                    'thumbnail': thumbnailImage,
                    'ownerId': this.state.ownerId
                }
                const data = {
                    'storeId': this.state.storeId,
                    'store': store,
                    callback: () => {
                        storeService.dispatch(profileActions.fetchStoreByProfleRequest({ 'userId': this.state.ownerId }));
                        this.props.navigation.navigate('Store')
                    }
                }
                this.setState({ loading: false })
                this.props.actions.updateStoreDetailRequest(data);
            })
    }

    ////note: need verify for this delete store for more safety
    deleteStore() {
        const data = {
            'storeId': this.state.storeId,
            callback: () => {
                storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({ 'managerId': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') }))
                storeService.dispatch(storeDetailActions.clearStore());
                NavigationService.navigate('SelectRole')
            }
        }
        this.props.actions.deleteStoreDetailRequest(data)
    }

    selectImage() {
        this._togglePopupUploadImage();
        importImage.selectImage(600, 360)
            .then(url => {
                this.setState({
                    thumbnail: url.path,
                    isChange: true
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
                    thumbnail: url.path,
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
        const { thumbnail, isOpenTimeVisible, isCloseTimeVisible, initialStartDay, initialEndDay } = this.state;
        const { displayName, portal, address, phone, email, openTime, closeTime } = this.state;
        if (this.state.loading) return (<Loading />)
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.navigate('Store')}
                    centerComponent={'Sửa thông tin cửa hàng'}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <CoverImage
                        onPress={this._togglePopupUploadImage}
                        thumbnail={thumbnail}
                    />
                    <View style={styles.containerBody}>
                        <FormInput
                            label={'Tên cửa hàng'}
                            textBox
                            require
                            line
                            onChangeText={(text) => this.setState({ displayName: text, isChange: true })}
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
                            rightComponentStyle={{ top: '42%' }}
                            inputStyle={{ paddingRight: '30%' }}
                            value={portal}
                        // placeholder={'Tên miền địa chỉ Salon của bạn'}
                        // notes={'Dùng để đăng nhập vào Salon. Ví dụ: hoanghon.salozo.com'} 
                        />
                        <FormInput
                            label={'Địa chỉ'}
                            textBox
                            require
                            line
                            inputStyle={{ paddingRight: 30 }}
                            //onFocus={() => this._openAutocompleteModal()}
                            value={address}
                            onChangeText={(text) => { this.setState({ address: text, isChange: true }) }}
                        // placeholder={'Nhập địa chỉ cửa hàng'}
                        // rightComponent={
                        //     this.state.openMapLoading ?
                        //         <ActivityIndicator size="small" color={Colors.functionColorLight} />
                        //         :
                        //         <TouchableOpacity onPress={() => this._openPlacePickerModal()}>
                        //             <FontAwesome5 name='search-location' size={20} color={Colors.functionColorDark} />
                        //         </TouchableOpacity>
                        // }
                        />
                        <FormInput
                            label={'Số điện thoại chi nhánh'}
                            textBox
                            require
                            line
                            onChangeText={(text) => this.setState({ phone: text, isChange: true })}
                            keyboardType={'phone-pad'}
                            value={String(phone)}
                            // placeholder={'Nhập số điện thoại'}
                            errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                        />
                        {/* <FormInput
                            label={'Email'}
                            textBox
                            line
                            onChangeText={(text) => this.setState({ email: text, isChange: true })}
                            keyboardType={'email-address'}
                            value={email}
                            // placeholder={'Nhập địa chỉ email'}
                            errorMessage={!email || email == '' ? null : (validateEmail(email) ? null : 'Email không hợp lệ')}
                        /> */}
                        <View style={[styles.form, styles.displayInlineBlock]}>
                            <View style={{ width: '45%', marginRight: '10%' }}>
                                <Text style={styles.formLabel}>Giờ mở cửa<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                                <TouchableWithoutFeedback onPress={() => this._toggleOpenTimePicker()}>
                                    <View style={[styles.displayInlineBlock, styles.formInput]}>
                                        <Text style={{ flex: 4 }}>{openTime}</Text>
                                        <FontAwesome5 name='clock' size={20} color={Colors.functionColorDark} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ width: '45%' }}>
                                <Text style={styles.formLabel}>Giờ đóng cửa<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                                <TouchableWithoutFeedback onPress={() => this._toggleCloseTimePicker()}>
                                    <View style={[styles.displayInlineBlock, styles.formInput]}>
                                        <Text style={{ flex: 4 }}>{closeTime}</Text>
                                        <FontAwesome5 name='clock' size={20} color={Colors.functionColorDark} />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={[styles.form, styles.formSubmit]}>
                            {this.state.isChange &&
                                <ButtonSolid label={'LƯU'}
                                    onPress={() => this.updateStoreInfo()}
                                    backgroundColor={Colors.primaryButton}
                                    disable={email && !validateEmail(email)
                                        || phone && !validatePhoneNumber(phone)
                                        || !displayName && displayName == ''
                                        || !address && address == ''
                                        || !portal && portal == ''
                                        || !phone && phone == ''
                                        || !openTime && openTime == ''
                                        || !closeTime && closeTime == ''}
                                />
                            }
                            <ButtonText label={'XÓA'} onPress={() => { this._toggleModal() }} />
                        </View>
                        <DateTimePicker
                            mode={'time'}
                            date={initialStartDay}
                            isVisible={isOpenTimeVisible}
                            onConfirm={this._handleOpenTimePicked}
                            onCancel={this._toggleOpenTimePicker}
                        />
                        <DateTimePicker
                            mode={'time'}
                            date={initialEndDay}
                            isVisible={isCloseTimeVisible}
                            onConfirm={this._handleCloseTimePicked}
                            onCancel={this._toggleCloseTimePicker}
                        />
                    </View>
                </ScrollView>
                {/* {this.state.loading && <Loading />} */}
                <PopUpUploadImage
                    isVisible={this.state.isVisiblePopupUploadImage}
                    takeImage={() => this.takeImage()}
                    selectImage={() => this.selectImage()}
                    pressCancel={this._togglePopupUploadImage}
                />
                <PopUpConfirm
                    isVisible={this.state.isVisibleDelete}
                    modalText={'Bạn chắc chắn muốn xóa cửa hàng này?'}
                    confirmText={'Xóa'}
                    confirmPress={() => {
                        this._toggleModal()
                        this.deleteStore()
                    }}
                    confirmCancel={'Hủy bỏ'}
                    confirmCancelPress={this._toggleModal}
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
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfStoreDetailReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(storeDetailActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditStoreScreen)