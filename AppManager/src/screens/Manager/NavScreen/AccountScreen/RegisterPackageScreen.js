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
import { nameOfAccountPackageReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers';
import { FormInput, MainHeader, Card11, MaterialIcon, Loading, ButtonGradient } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { validatePhoneNumber, validateEmail } from '../../../../helper/validationHelper';
import NavigationService from '../../../../navigation/NavigationService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { accountPackageActions } from '../../../../actions/index';
import * as storeService from '../../../../sagas/storeService';
import LocationSwitch from 'react-native-location-switch';
import Feather from 'react-native-vector-icons/Feather';
import RNGooglePlaces from 'react-native-google-places';
import { findWithAttr } from '../../../../helper/functionHelper';
import Permissions from 'react-native-permissions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _, { get } from 'lodash';
import numeral from 'numeral';
import "unorm";

class RegisterPackageScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isChange: false,
            email: '',
            phone: '',
            address: '',
            latitude: '',
            longitude: '',
            note: '',
            type: 'BYTRANFER',
            packageValue: '',
            packageTime: 0,
            paidMoney: 0,
            tempMoney: 0,
            userId: 0,
            openMapLoading: false,
            locationEnabled: false,
            borderColor: Colors.bestBlur,
            packages: [
                { id: '1', title: 'Gold Zone', value: 'gold_pack' },
                { id: '2', title: 'Platinum Zone', value: 'platinum_pack' },
                { id: '3', title: 'Diamond Zone', value: 'diamond_pack' }
            ],
            packageTimes: [
                { id: '1', title: '6 tháng', value: 6 },
                { id: '2', title: '1 năm', value: 12 },
                { id: '3', title: '2 năm', value: 24 }
            ],
            paymentTypes: [
                { id: '1', title: 'Chuyển khoản', value: 'BYTRANFER' },
                { id: '2', title: 'Ship COD', value: 'BYCOD' },
                { id: '3', title: 'Đến nhà thu tiền', value: 'BYHOME' }
            ],
            indexOfpackageValue: 0,
            indexOfpackageTime: 0,
            indexOfpackageList: 0,
        };
    }

    componentDidMount = () => {
        console.log('user', this.props.user);
        const { user, storeList, navigation } = this.props;
        this.setState({
            email: user.email || storeList[0].email,
            phone: user.phone || storeList[0].phone,
            address: user.address || storeList[0].address,
            packageValue: navigation.getParam('packageValue', 'gold_pack'),
            packageTime: navigation.getParam('packageTime', 6),
            userId: user.id
        }, () => {
            this.setState({
                tempMoney: Number(navigation.getParam('paidMoney', 249000)),
                paidMoney: Number(navigation.getParam('paidMoney', 249000)) * Number(this.state.packageTime),
                indexOfpackageValue: findWithAttr(this.state.packages, 'value', this.state.packageValue),
                indexOfpackageTime: findWithAttr(this.state.packageTimes, 'value', this.state.packageTime),
                indexOfpackageList: findWithAttr(this.props.listPackages, 'name', this.state.packageValue)
            })
        });
        // (Platform.OS == 'android') && this._requestLocationPermissionOnAndroid();
        // (Platform.OS == 'ios') && this._requestLocationPermission()
        // LocationSwitch.isLocationEnabled(
        //     () => { this.setState({ locationEnabled: true }); },
        //     () => { },
        // );
    }

    addPayment(email, phone, address, note, type, packageValue, packageTime, paidMoney, userId) {
        const ojb = {
            'email': email,
            'phone': phone,
            'address': address,
            'note': note,
            'type': type,
            'package': packageValue,
            'packageTime': packageTime,
            'paidMoney': paidMoney,
            'userId': userId,
        }
        const data = {
            'package': ojb,
            callback: () => {
                NavigationService.goBack();
            }
        }
        this.props.actions.addRegisterPaymentRequest(data)
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
            email,
            phone,
            address,
            latitude,
            longitude,
            tempMoney,
            note,
            type,
            packageValue,
            packageTime,
            paidMoney,
            userId,
            packages,
            packageTimes,
            borderColor,
            indexOfpackageValue,
            indexOfpackageTime,
            indexOfpackageList
        } = this.state;
        console.log(this.state);
        console.log('price', this.props.listPackages[indexOfpackageList].price);
        console.log('package', findWithAttr(packageTimes, 'value', packageTime));
        const { user } = this.props;
        return (
            <SafeAreaView>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => { NavigationService.goBack() }}
                    centerComponent={'Nâng cấp tài khoản'}
                />
                <ScrollView style={{ maxHeight: Layout.window.height * 0.85 }} contentContainerStyle={[styles.containerBody]}
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Thông tin của bạn</Text>
                    <FormInput
                        label={'Email'}
                        textBox
                        line
                        keyboardType={'email-address'}
                        onChangeText={(text) => this.setState({ email: text, isChange: true })}
                        value={`${email}`}
                        errorMessage={!email || email == '' ? null : (validateEmail(email) ? null : 'Email không hợp lệ')}
                    />
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
                    <FormInput
                        label={'Địa chỉ'}
                        require
                        textBox
                        line
                        inputStyle={{ paddingRight: 30, borderColor: borderColor }}
                        onFocus={() => {
                            //this._openAutocompleteModal();
                            this.setState({ borderColor: Colors.functionColorLight, borderWidth: 1 });
                        }}
                        value={address}
                        onChangeText={(text) => { this.setState({ address: text, isChange: true }) }}
                    // rightComponent={
                    //     this.state.openMapLoading ?
                    //         <ActivityIndicator size="small" color={Colors.functionColorDark} />
                    //         :
                    //         <TouchableOpacity onPress={() => this._openPlacePickerModal()}>
                    //             <FontAwesome5 name='search-location' size={20} color={Colors.functionColorDark} />
                    //         </TouchableOpacity>
                    // }
                    />
                    <View style={styles.displayInlineBlock}>
                        <View style={{ width: '50%' }}>
                            <FormInput
                                label={'Gói dịch vụ'}
                                dropDown
                                data={packages}
                                value={packages[indexOfpackageValue].title}
                                valueExtractor={({ title }) => title}
                                onChangeText={(value) => {
                                    console.log(value);
                                    switch (value) {
                                        case 'Gold Zone':
                                            this.setState({
                                                packageValue: 'gold_pack',
                                                tempMoney: this.props.listPackages[findWithAttr(this.props.listPackages, 'name', 'gold_pack')].price,
                                                paidMoney: Number(this.props.listPackages[findWithAttr(this.props.listPackages, 'name', 'gold_pack')].price) * Number(packageTime)
                                            });
                                            break;
                                        case 'Platinum Zone':
                                            this.setState({
                                                packageValue: 'platinum_pack',
                                                tempMoney: this.props.listPackages[findWithAttr(this.props.listPackages, 'name', 'platinum_pack')].price,
                                                paidMoney: Number(this.props.listPackages[findWithAttr(this.props.listPackages, 'name', 'platinum_pack')].price) * Number(packageTime)
                                            });
                                            break;
                                        case 'Diamond Zone':
                                            this.setState({
                                                packageValue: 'diamond_pack',
                                                tempMoney: this.props.listPackages[findWithAttr(this.props.listPackages, 'name', 'diamond_pack')].price,
                                                paidMoney: Number(this.props.listPackages[findWithAttr(this.props.listPackages, 'name', 'diamond_pack')].price) * Number(packageTime)
                                            });
                                            break;
                                    }
                                }}
                                rightComponent={
                                    <FontAwesome5 name='sort-down' size={20} color={Colors.functionColorLight} />
                                }
                                rightComponentStyle={{ bottom: '15%' }}
                                containerDropdownStyle={{ borderColor: Colors.functionColorLight }}
                            />
                        </View>
                        <View style={{ width: '40%', marginLeft: '10%' }}>
                            <FormInput
                                label={'Thời gian'}
                                dropDown
                                data={packageTimes}
                                value={packageTimes[indexOfpackageTime].title}
                                valueExtractor={({ title }) => title}
                                onChangeText={(value) => {
                                    console.log(value);
                                    switch (value) {
                                        case '6 tháng':
                                            this.setState({ packageTime: 6, paidMoney: tempMoney * 6 });
                                            break;
                                        case '1 năm':
                                            this.setState({ packageTime: 12, paidMoney: tempMoney * 12 });
                                            break;
                                        case '2 năm':
                                            this.setState({ packageTime: 24, paidMoney: tempMoney * 24 });
                                            break;
                                    }
                                }}
                                rightComponent={
                                    <FontAwesome5 name='sort-down' size={20} color={Colors.functionColorLight} />
                                }
                                rightComponentStyle={{ bottom: '15%' }}
                                containerDropdownStyle={{ borderColor: Colors.functionColorLight }}
                            />
                        </View>
                    </View>
                    <View style={[styles.displayInlineBlock]}>
                        <View style={{ width: '50%' }}>
                            <FormInput
                                label={'Giá tiền'}
                                textBox
                                line
                                value={`${numeral(tempMoney).format('0,0')} VNĐ/ 1 tháng`}
                                editable={false}
                                inputStyle={{ borderBottomColor: Colors.functionColorLight }}
                            />
                        </View>
                        <View style={{ width: '40%', marginLeft: '10%' }}>
                            <FormInput
                                label={'Tặng thêm'}
                                textBox
                                line
                                value={packageTime == 6 ? '1 tháng' : (packageTime == 12 ? '3 tháng' : '6 tháng')}
                                editable={false}
                                inputStyle={{ borderBottomColor: Colors.functionColorLight }}
                            />
                        </View>
                    </View>
                    <FormInput
                        label={'Tổng tiền thanh toán'}
                        textBox
                        line
                        value={`${numeral(paidMoney).format('0,0')} VNĐ`}
                        editable={false}
                        inputStyle={{ borderBottomColor: Colors.functionColorLight }}
                    />
                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, alignSelf: 'flex-start', marginTop: 20 }}>
                        Hình thức thanh toán
                        </Text>
                    <View style={[styles.displayInlineBlock, { height: 40, width: Layout.window.width * 0.9, alignItems: 'center', justifyContent: 'space-between' }]}>
                        <TouchableWithoutFeedback onPress={() => {
                            this.setState({
                                type: 'BYTRANFER'
                            })
                        }}>
                            <Text>
                                <Feather
                                    name={this.state.type == 'BYTRANFER' ? 'check-circle' : 'circle'}
                                    color={this.state.type == 'BYTRANFER' ? Colors.functionColorDark : Colors.lightGreyColor}
                                    size={FontStyle.md + 3}
                                    style={{ paddingRight: 5 }}
                                />
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                    Chuyển khoản
                                    </Text>
                            </Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {
                            this.setState({
                                type: 'BYCOD'
                            })
                        }}>
                            <Text>
                                <Feather
                                    name={this.state.type == 'BYCOD' ? 'check-circle' : 'circle'}
                                    color={this.state.type == 'BYCOD' ? Colors.functionColorDark : Colors.lightGreyColor}
                                    size={FontStyle.md + 3}
                                    style={{ paddingRight: 5 }}
                                />
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                    Ship COD
                                </Text>
                            </Text>
                        </TouchableWithoutFeedback>
                    </View>
                    {/* {type == 'BYTRANFER' &&
                        <View style={styles.infoBlock}>
                            <Text style={[styles.text]}>Thông tin chuyển khoản</Text>
                            <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                                <Text style={[styles.text, { alignSelf: 'flex-start', fontSize: FontStyle.smallText }]}>{`Tên tài khoản`}</Text>
                                <Text style={[styles.text, {
                                    alignSelf: 'flex-end', textAlign: 'left', width: '70%',
                                    fontSize: FontStyle.smallText, color: Colors.functionColorLight
                                }]}>{`CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ L-TECH VIỆT NAM`}
                                </Text>
                            </View>
                            <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                                <Text style={[styles.text, { alignSelf: 'flex-start', fontSize: FontStyle.smallText }]}>{`Số tài khoản`}</Text>
                                <Text style={[styles.text, {
                                    alignSelf: 'flex-end', textAlign: 'left', width: '70%',
                                    fontSize: FontStyle.smallText, color: Colors.functionColorLight
                                }]}>{`0240 7458 101`}
                                </Text>
                            </View>
                            <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                                <Text style={[styles.text, { alignSelf: 'flex-start', fontSize: FontStyle.smallText }]}>{`Ngân hàng`}</Text>
                                <Text style={[styles.text, {
                                    alignSelf: 'flex-end', textAlign: 'left', width: '70%',
                                    fontSize: FontStyle.smallText, color: Colors.functionColorLight
                                }]}>{`Ngân hàng TMCP Tiên Phong (TPBank) – chi nhánh TP.HCM`}
                                </Text>
                            </View>
                            <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                                <Text style={[styles.text, { alignSelf: 'flex-start', fontSize: FontStyle.smallText }]}>{`Nội dung`}</Text>
                                <Text style={[styles.text, {
                                    alignSelf: 'flex-end', textAlign: 'left', width: '70%',
                                    fontSize: FontStyle.smallText, color: Colors.functionColorLight
                                }]}>{`[Nâng cấp tài khoản] - ${user.firstName} ${user.lastName || ''} - ${userId} - đóng tiền nâng cấp tài khoản [${packages[indexOfpackageValue].title}] - [${packageTime} tháng] - [${user.phone || 'Số điện thoại người chuyển'}]`}
                                </Text>
                            </View>
                            <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                                <Text style={[styles.text, { alignSelf: 'flex-start', fontSize: FontStyle.smallText }]}>{`Phí chuyển tiền`}</Text>
                                <Text style={[styles.text, {
                                    alignSelf: 'flex-end', textAlign: 'left', width: '70%',
                                    fontSize: FontStyle.smallText, color: Colors.functionColorLight
                                }]}>{`Do người chuyển chịu`}
                                </Text>
                            </View>
                        </View>
                    } */}
                    <FormInput
                        label={'Ghi chú'}
                        richText
                        value={note}
                        onChangeText={(text) => this.setState({ note: text, isChange: true })}
                        count={
                            <Text>{`${note.length}/200`}</Text>
                        }
                    />
                </ScrollView>
                <ButtonGradient content={'Đăng ký'} onPress={this.state.isChange ? () => {
                    this.addPayment(email, phone, address, note, type, packageValue, packageTime, paidMoney, userId)
                } : null}
                    disabled={
                        email != '' && validateEmail(email)
                        || !validatePhoneNumber(phone)
                        || address == ''
                        || packageValue != ''
                        || packageTime > 0
                        || paidMoney > 0} />
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
        backgroundColor: Colors.bg,
        paddingHorizontal: 20,
        marginBottom: 40,
        paddingBottom: 20,
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
    infoBlock: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        paddingVertical: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAccountPackageReducers],
        ...state[nameOfProfileReducers],
        ...state[nameOfLoadingReducers][accountPackageActions.ADD_REGISTER_PAYMENT]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(accountPackageActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPackageScreen);