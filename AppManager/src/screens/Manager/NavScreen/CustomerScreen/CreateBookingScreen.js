import React, { Component } from 'react';

import {
    View,
    StyleSheet,
    Platform,
    Image,
    ScrollView,
    SafeAreaView,
    Switch,
    ActivityIndicator,
    PermissionsAndroid,
    StatusBar,
    Alert,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    RefreshControl,
    FlatList
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { FormInput, MainHeader, Card11, MaterialIcon } from '../../../../components/react-native-teso';
import NavigationService from '../../../../navigation/NavigationService';
import { connect } from 'react-redux';
import { validatePhoneNumber, validateName } from '../../../../helper/validationHelper';
import RNGooglePlaces from 'react-native-google-places';
import Permissions from 'react-native-permissions';
import LocationSwitch from 'react-native-location-switch';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { bookingActions, profileActions } from '../../../../actions';
import { nameOfBookingReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers';
import * as storeService from '../../../../sagas/storeService';
import { Slider } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import _, { get } from 'lodash';
import Moment from 'moment';
import "unorm";

class CreateBookingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeId: '',
            cusName: '',
            firstName: '',
            lastName: '',
            phone: '',
            gender: false,
            status: 'PROCESSING',
            bookDate: Moment(new Date()).format('DD-MM-YYYY'),
            bookTime: Moment(new Date()).add(1, 'hours').format('HH:mm'),
            guestCount: 0,
            note: '',
            address: '',
            latitude: '',
            longitude: '',
            storeName: '',
            storeAddress: '',
            openTime: '',
            closeTime: '',
            checkStoreId: 0,
            isDateVisible: false,
            isTimeVisible: false,
            openMapLoading: false,
            locationEnabled: false,
            openSwithStore: false,
            isChange: false,
            isUpdate: false,
            borderColor: Colors.bestBlur
        };
    }

    componentDidMount = () => {
        console.log('user', this.props.user);
        const { navigation, user } = this.props;
        this.setState({
            empId: 0,
            isUpdate: navigation.getParam('isUpdate', false),
            storeId: [...get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')][0].id,
            storeName: navigation.getParam('storeName', 'Cửa hàng'),
            storeAddress: navigation.getParam('storeAddress', 'Địa chỉ chưa xác định'),
            openTime: navigation.getParam('openTime', '8:00'),
            closeTime: navigation.getParam('closeTime', '17:00')
        }, () => {
            if (this.state.isUpdate) {
                this.loadData();
            }
        });
        // (Platform.OS == 'android') && this._requestLocationPermissionOnAndroid();
        // (Platform.OS == 'ios') && this._requestLocationPermission()
        // LocationSwitch.isLocationEnabled(
        //     () => { this.setState({ locationEnabled: true }); },
        //     () => { },
        // );
    }

    loadData() {
        const data = {
            'user': this.props.navigation.state.params.id,
            callback: () => {
                this.setState({
                    firstName: this.props.detail.cusName,
                    lastName: '',
                    phone: this.props.detail.phone,
                    address: this.props.detail.address,
                    gender: 2,//this.props.detail.gender == 'Nam' ? true : false,
                    bookDate: this.props.detail.bookDate,
                    bookTime: this.props.detail.bookTime,
                    guestCount: this.props.detail.guestCount,
                    note: this.props.detail.note,
                })
            }
        }
        this.props.actions.getDetailBookingRequest(data)
    }

    updateBooking(address, firstName, lastName, phone, gender, bookDate, bookTime, guestCount, note) {
        const booking = {
            address: address,
            bookDate: bookDate,
            bookTime: bookTime,
            cusName: `${firstName} ${lastName || ''}`,
            empId: this.props.detail.empId,
            gender: gender,
            guestCount: guestCount,
            id: this.props.navigation.state.params.id,
            note: note,
            phone: phone,
            status: this.props.detail.status,
            storeId: this.props.detail.storeId,
            userId: this.props.detail.userId
        }
        const data = {
            'booking': booking,
            callback: () => {

                this.props.navigation.state.params.callback()
                //storeService.dispatch(bookingActions.getDetailBookingRequest({ 'user': this.props.navigation.state.params.id }));
                NavigationService.goBack();
            }
        }
        this.props.actions.updateBookingRequest(data);
    }

    addBooking(firstName, lastName, phone, gender, status, bookDate, bookTime, guestCount, note, storeId, empId) {
        const booking = {
            'userId': 0,
            'cusName': `${firstName} ${lastName || ''}`,
            'phone': phone,
            'gender': 2, //gender === 0 ? 'Nam' : gender === 1 ? 'Nữ' : 'Khác',
            'status': status,
            'bookDate': bookDate,
            'bookTime': bookTime,
            'guestCount': guestCount,
            'note': note,
            'storeId': storeId,
            'empId': empId,
        }
        const data = {
            'booking': booking,
            callback: () => {
                this.props.navigation.state.params.onCallback()
                // storeService.dispatch(bookingActions.getStoreBookingRequest({ 'booking': this.loadData() }));
                NavigationService.goBack();
            }
        }
        this.props.actions.createBookingRequest(data)
    }

    _toggleDropdownStore = () => this.setState({ openSwithStore: !this.state.openSwithStore });

    _toggleDatePicker = () => this.setState({ isDateVisible: !this.state.isDateVisible, isChange: true });

    _handleDatePicker = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ bookDate: Moment(time).format('DD-MM-YYYY') });
        this._toggleDatePicker();
    };

    _toggleTimePicker = () => this.setState({ isTimeVisible: !this.state.isTimeVisible, isChange: true });

    _handleTimePicker = (time) => {
        console.log('A date has been picked: ', time);
        this.setState({ bookTime: Moment(time).format('HH:mm') });
        this._toggleTimePicker();
    };

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

    _requestLocationPermission = () => {
        console.log('request permission')
        Permissions.request('location').then(res => {
            this.setState({ locationPermission: res });
        })
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
                    openMapLoading: false,
                    isChange: true
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
                    openMapLoading: false,
                    isChange: true
                });
            }).catch(error => { console.log(error.message); this.setState({ openMapLoading: false }) });  // error is a Javascript Error object
        }).catch((error) => { console.log(error.message); this.setState({ openMapLoading: false }) });
    }

    render() {
        const {
            storeId,
            empId,
            lastName,
            firstName,
            cusName,
            phone,
            gender,
            bookDate,
            bookTime,
            guestCount,
            status,
            note,
            address,
            borderColor,
            isTimeVisible,
            isDateVisible,
            checkStoreId,
            openSwithStore
        } = this.state;
        const storeList = [
            ...get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')
        ]
        console.log(storeList);
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => { NavigationService.goBack() }}
                    centerComponent={'Đặt chỗ trước'}
                    rightPress={this.state.isChange ? () => {
                        if (this.state.isUpdate) {
                            this.updateBooking(
                                address,
                                firstName,
                                lastName,
                                phone,
                                gender,
                                bookDate,
                                bookTime,
                                guestCount,
                                note)
                        } else {
                            this.addBooking(
                                firstName,
                                lastName,
                                phone,
                                gender,
                                status,
                                bookDate,
                                bookTime,
                                guestCount,
                                note,
                                storeId,
                                empId)
                        }
                    } : null}
                    rightDisabled={
                        !validateName(firstName.normalize('NFC'))
                        || lastName != '' && !validateName(lastName.normalize('NFC'))
                        || !validatePhoneNumber(phone)
                        || !address
                        || guestCount < 1}
                />
                <TouchableWithoutFeedback
                    onPress={this._toggleDropdownStore}>
                    <View style={[styles.dropDownStores]}>
                        <Text style={{
                            color: Colors.functionColorDark, fontWeight: 'bold',
                            fontSize: FontStyle.mdText, textAlign: 'center',
                            maxWidth: '90%'
                        }} numberOfLines={1} ellipsizeMode={'tail'}>{
                                this.props.detail.storeId ? storeList.map(item => { if (item.id == this.props.detail.storeId) return item.displayName; }) :
                                    storeList[checkStoreId].displayName
                            }</Text>
                        <FontAwesome5 name={'sort-down'} color={Colors.functionColorDark} size={FontStyle.mdText} style={{ marginTop: -5, marginLeft: 5 }} />
                    </View>
                </TouchableWithoutFeedback>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.containerBody}>
                        <Text style={styles.title}>Thông tin khách hàng</Text>
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
                        <View style={styles.displayInlineBlock}>
                            <View style={{ width: '70%' }}>
                                <FormInput
                                    label={'Điện thoại'}
                                    textBox
                                    line
                                    require
                                    keyboardType={'phone-pad'}
                                    onChangeText={(text) => this.setState({ phone: text, isChange: true })}
                                    value={`${phone}`}
                                    errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                                />
                            </View>
                            {/* <View style={[{ width: '25%', marginLeft: '5%', alignSelf: 'flex-end' }, styles.displayInlineBlock]}>
                                <Text style={[styles.text, { color: Colors.functionColorLight }]} onPress={() => { this.setState({ gender: (gender + 1) % 3 }) }}>{gender === 0 ? 'Nam' : gender === 1 ? 'Nữ' : 'Khác'} </Text>
                                <MaterialIcon name={'sync'} style={styles.text} size={20} color={Colors.functionColorLight} onPress={() => { this.setState({ gender: (gender + 1) % 3 }) }} />
                                {/* <Switch thumbColor={Colors.functionColorDark}
                                    onValueChange={() => this.setState({ gender: !gender })} value={gender} /> 
                            </View> */}
                        </View>
                        <FormInput
                            label={'Địa chỉ'}
                            require
                            textBox
                            line
                            inputStyle={{ paddingRight: 30, borderColor: borderColor }}
                            onFocus={() => {
                                // this._openAutocompleteModal();
                                this.setState({ borderColor: Colors.functionColorLight, borderWidth: 1 });
                            }}
                            value={address}
                            onChangeText={(text) => { this.setState({ address: text, isChange: true }) }}
                        // placeholder={'Nhập địa chỉ cửa hàng'}
                        // rightComponent={
                        //     this.state.openMapLoading ?
                        //         <ActivityIndicator size="small" color={Colors.functionColorDark} />
                        //         :
                        //         <TouchableOpacity onPress={() => this._openPlacePickerModal()}>
                        //             <FontAwesome5 name='search-location' size={20} color={Colors.functionColorDark} />
                        //         </TouchableOpacity>
                        // }
                        />
                        <View style={styles.form}>
                            <Text style={styles.formLabel}>{'Thời gian'}<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                            <View style={[styles.displayInlineBlock, { justifyContent: 'space-between' }]}>
                                <View style={{ width: '45%' }}>
                                    <TouchableWithoutFeedback onPress={() => this._toggleDatePicker()}>
                                        <View style={[styles.displayInlineBlock, styles.formInput, { borderColor: Colors.functionColorLight }]}>
                                            <Text style={{ flex: 4 }}>{bookDate}</Text>
                                            <AntDesign
                                                name={'calendar'}
                                                size={20}
                                                color={Colors.functionColorDark}
                                                iconStyle={styles.timepicker}
                                                onPress={() => { this._toggleDatePicker() }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{ width: '45%' }}>
                                    <TouchableWithoutFeedback onPress={() => this._toggleTimePicker()}>
                                        <View style={[styles.displayInlineBlock, styles.formInput, { borderColor: Colors.functionColorLight }]}>
                                            <Text style={{ flex: 4 }}>{bookTime}</Text>
                                            <AntDesign
                                                name={'clockcircleo'}
                                                size={20}
                                                color={Colors.functionColorDark}
                                                iconStyle={styles.timepicker}
                                                onPress={() => { this._toggleTimePicker() }}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                        <View style={styles.displayInlineBlock}>
                            <View style={{ width: '85%' }}>
                                <FormInput
                                    label={'Số lượng khách'}
                                    require>
                                    <Slider
                                        maximumValue={20}
                                        minimumValue={1}
                                        step={1}
                                        thumbTintColor={Colors.functionColorDark}
                                        maximumTrackTintColor={Colors.lightGreyColor}
                                        minimumTrackTintColor={Colors.functionColorLight}
                                        value={guestCount}
                                        onValueChange={value => this.setState({ guestCount: value, isChange: true })} />
                                </FormInput>
                            </View>
                            <View style={[{
                                width: '10%', marginLeft: '5%', height: 40,
                                alignSelf: 'flex-end', justifyContent: 'center', alignItems: 'center',
                                borderColor: guestCount > 1 ? Colors.functionColorDark : Colors.lightGreyColor, borderWidth: 1,
                                borderRadius: 10,
                            }]}>
                                <Text style={styles.text}>{guestCount}</Text>
                            </View>
                        </View>
                        <FormInput
                            label={'Ghi chú'}
                            richText
                            value={note}
                            onChangeText={(text) => this.setState({ note: text, isChange: true })}
                            count={
                                <Text>{`${note.length}/200`}</Text>
                            }
                        />

                    </View>
                    <DateTimePicker
                        mode={'date'}
                        datePickerContainerStyleIOS={Colors.functionColorLight}
                        minimumDate={new Date()}
                        isVisible={isDateVisible}
                        onConfirm={this._handleDatePicker}
                        onCancel={this._toggleDatePicker}
                    />
                    <DateTimePicker
                        mode={'time'}
                        datePickerContainerStyleIOS={Colors.functionColorLight}
                        isVisible={isTimeVisible}
                        onConfirm={this._handleTimePicker}
                        onCancel={this._toggleTimePicker}
                    />
                </ScrollView>
                <Modal isVisible={openSwithStore}
                    backdropColor={Colors.transparent}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleDropdownStore}
                    style={styles.dropdownBlock}>
                    <FlatList showsVerticalScrollIndicator={false}
                        data={storeList}
                        numColumns={1}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity style={[styles.displayInlineBlock, styles.storeRecord, { justifyContent: 'space-between', alignItems: 'center' }]}
                                onPress={() => {
                                    this._toggleDropdownStore();
                                    this.setState({ checkStoreId: index }, () => this.setState({ storeId: storeList[checkStoreId].id }));
                                }}>
                                <View style={{ width: '80%' }}>
                                    <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                                    <Text style={styles.address} numberOfLines={1} ellipsizeMode={'tail'}>{item.address}</Text>
                                </View>
                                {(index === checkStoreId) && <MaterialIcon name={'check-circle'} size={17} color={Colors.functionColorDark} />}
                            </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => `${index}`}
                    />
                </Modal>
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
        borderColor: Colors.darkBlur,
        paddingHorizontal: 10,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timepicker: {
        position: 'absolute',
        top: '55%',
        right: 8,
        height: 20,
        width: 20,
    },
    containerBody: {
        flex: 1,
        backgroundColor: Colors.bg,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 40,
    },
    title: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    text: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 17,
        marginTop: 3,
    },
    dropDownStores: {
        backgroundColor: Colors.lightGreyColor,
        width: Layout.window.width * 0.925,
        height: 40,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        flexDirection: 'row',
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.lightGreyColor,
        borderRadius: 5,
    },
    dropdownBlock: {
        position: 'absolute',
        top: 90,
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfBookingReducers],
        ...state[nameOfProfileReducers],
        ...state[nameOfLoadingReducers][
        profileActions.FETCH_PROFILE,
        profileActions.FETCH_STORELIST
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...profileActions, ...bookingActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateBookingScreen);
