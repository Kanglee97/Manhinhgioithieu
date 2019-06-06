import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Platform,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    RefreshControl,
    FlatList
} from 'react-native'

import { RadioGroup, UserAvatar, MainHeader, IconImage, MaterialIcon, Loading, EmployeeCard, CustomButtonGradient, ButtonSolid } from '../../../../../components/react-native-teso'
import { nameOfEmployeeReducers, nameOfBookingReducers, nameOfLoadingReducers, nameOfStoreDetailReducers } from '../../../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic'
import NavigationService from '../../../../../navigation/NavigationService';
import { sendSMS } from '../../../../../helper/functionHelper';
import { bindActionCreators } from 'redux';
import { bookingActions, messengerActions } from '../../../../../actions/index';
import { connect } from 'react-redux';
import * as storeService from '../../../../../sagas/storeService';
import _, { get } from 'lodash';
import numeral from 'numeral'


class AppointmentDetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    static navigationOptions = {
        header: null
    };


    componentDidMount() {
        this.loadData()
    }

    loadData() {
        const data = {
            'user': this.props.navigation.state.params.id
        }
        this.props.actions.getDetailBookingRequest(data)
    }

    updateStatus = (status) => {
        const { detail } = this.props;
        const booking = {
            address: detail.address,
            bookDate: detail.bookDate,
            bookTime: detail.bookTime,
            cusName: detail.cusName,
            empId: detail.empId,
            gender: detail.gender,
            guestCount: detail.guestCount,
            id: detail.id,
            note: detail.note,
            phone: detail.phone,
            status: status,
            storeId: detail.storeId,
            userId: detail.userId
        }
        const data = {
            'booking': booking,
            callback: () => {
                storeService.dispatch(bookingActions.getDetailBookingRequest({ 'user': detail.id }));
                this.props.navigation.state.params.callback()
            }
        }
        this.props.actions.updateBookingRequest(data);
    }

    render() {
        const { detail } = this.props;
        console.log(this.props);
        console.log(this.props.employees.map(item => item.id == detail.id));
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => {
                        NavigationService.goBack()
                    }}
                    centerComponent={`Mã đặt lịch: #${detail.id}`}
                    rightComponent={
                        <MaterialIcon button name={'edit'} size={25} color={Colors.functionColorDark} />
                    }
                    rightPress={() => NavigationService.navigate('CreateBooking', {
                        id: detail.id,
                        isUpdate: true,
                        callback: () => {
                            this.props.navigation.state.params.callback()
                            this.loadData()
                        }
                    })}
                />
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <UserAvatar
                        source={detail.avatar && { uri: detail.avatar }}
                        size={140}
                        style={{ margin: 10, elevation: 10, }}
                    />
                    <View style={{
                        width: '90%',
                        justifyContent: 'space-between',
                        marginTop: -75, zIndex: -1,
                        borderRadius: 10,
                        backgroundColor: Colors.lightBg,
                        marginBottom: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 2.65,
                        elevation: 3,
                    }}>
                        <View style={{ marginTop: 75, width: '100%', alignItems: 'center' }}>
                            <Text style={{ fontSize: FontStyle.bigText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                {detail.cusName}
                            </Text>
                            <View style={[styles.displayInlineBlock, { paddingTop: 10, paddingBottom: 10 }]}>
                                <View style={[styles.displayInlineBlock, { width: '100%', alignItems: 'center', justifyContent: 'center' }]}>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>{detail.phone}</Text>
                                </View>
                            </View>
                            <View style={[styles.displayInlineBlock, { width: '100%', height: 60, paddingTop: 5, justifyContent: 'center' }]}>
                                <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => Linking.openURL(`tel:${detail.phone}`)}>
                                    <MaterialIcon button name={'local-phone'} color={Colors.functionColorDark} size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => sendSMS(detail.phone, `Xin chào ${detail.cusName}! Tôi có thể giúp gì cho bạn?`)}>
                                    <MaterialIcon button name={'message'} color={Colors.functionColorDark} size={30} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    width: '90%',
                    maxHeight: '40%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                    padding: 10,
                    paddingHorizontal: 20,
                    borderRadius: 10,
                    backgroundColor: Colors.lightBg,
                    marginBottom: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.15,
                    shadowRadius: 2.65,
                    elevation: 3,
                }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'space-between', marginBottom: 10, }]}>
                            <Text>Trạng thái</Text>
                            <Text style={[styles.text, {
                                color: detail.status == 'CONFIRMED' ? '#4cccff' :
                                    (detail.status == 'PROCESSING' ? '#058600' :
                                        (detail.status == 'DONE' ? '#004D86' : Colors.dangerColor))
                            }]} numberOfLines={1} ellipsizeMode={'tail'}>
                                {detail.status == 'CONFIRMED' ? 'Đã xác nhận' :
                                    (detail.status == 'PROCESSING' ? 'Đang xử lý' :
                                        (detail.status == 'DONE' ? 'Hoàn tất' : 'Hủy bỏ'))}</Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'space-between', marginBottom: 10, }]}>
                            <Text>Ngày hẹn</Text>
                            <Text style={styles.text}>{detail.bookDate}</Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'space-between', marginBottom: 10, }]}>
                            <Text>Thời gian</Text>
                            <Text style={styles.text}>{detail.bookTime}</Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'space-between', marginBottom: 10, }]}>
                            <Text>Số lượng khách</Text>
                            <Text style={styles.text}>{detail.guestCount}</Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'space-between', marginBottom: 10, }]}>
                            <Text>Ghi chú</Text>
                            <Text style={styles.text}>{detail.note || '#'}</Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'space-between' }]}>
                            <Text>Nhân viên</Text>
                            {this.props.employees.map(item => { if (item.id == detail.empId) return item.firstName; }) != '' &&
                                <TouchableOpacity onPress={() => NavigationService.navigate('SelectEmployee')} style={styles.displayInlineBlock}>
                                    <Text style={styles.text}>{this.props.employees.map(item => { if (item.id == detail.empId) return item.firstName; })}</Text>
                                    {/* <MaterialIcon name={'edit'} size={20} color={Colors.functionColorDark} /> */}
                                </TouchableOpacity>}
                            {/* {this.props.employees.map(item => { if (item.id == detail.empId) return item.firstName; }) == '' &&
                                <MaterialIcon onPress={() => NavigationService.navigate('SelectEmployee')} button name={'person-add'} size={20} color={Colors.functionColorDark} />
                            } */}
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.displayInlineBlock, { justifyContent: 'center' }]}>
                    {detail.status != 'CANCEL' && detail.status != 'DONE' &&
                        <View style={{ width: '40%', alignItems: 'center' }}>
                            <ButtonSolid onPress={() => {
                                this.updateStatus('CANCEL')
                                storeService.dispatch(messengerActions.pushNotificationRequest({
                                    "data": {
                                        "title": `${detail.empName}`,
                                        "content": `Huỷ lịch hẹn được chỉ định tiếp nhận cho đơn hàng mã #${detail.id} bở nhân viên ${detail.empName}`,
                                        "id": get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.ownerId')
                                    },
                                }));
                            }} style={{ width: '100%' }} content={'Hủy bỏ'} />
                        </View>
                    }
                    {detail.status != 'DONE' && detail.status != 'CANCEL' && detail.status != 'PROCESSING' &&
                        < View style={{ width: '40%', marginTop: 10, alignItems: 'center' }}>
                            <CustomButtonGradient onPress={() => {
                                this.updateStatus('DONE')
                                storeService.dispatch(messengerActions.pushNotificationRequest({
                                    "data": {
                                        "title": `${detail.empName}`,
                                        "content": `Lịch hẹn được chỉ định tiếp nhận cho đơn hàng mã #${detail.id} bở nhân viên ${detail.empName} đã được hoàn thành`,
                                        "id": get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.ownerId')
                                    },
                                }));
                            }} width={'100%'} content={'Đã đến'} />
                        </View>
                    }
                    {(detail.status == 'DONE' || detail.status == 'CANCEL') &&
                        <View style={{ width: '40%', marginTop: 10, alignItems: 'center' }}>
                            <CustomButtonGradient onPress={() => {
                                this.updateStatus('CONFIRMED')
                                storeService.dispatch(messengerActions.pushNotificationRequest({
                                    "data": {
                                        "title": `${detail.empName}`,
                                        "content": `Lịch hẹn được chỉ định tiếp nhận cho đơn hàng mã #${detail.id} bở nhân viên ${detail.empName} đã được Hoàn tác`,
                                        "id": get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.ownerId')
                                    },
                                }));
                            }} width={'100%'} content={'Hoàn tác'} />
                        </View>
                    }
                </View>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        lineHeight: 20,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    demoItem: {
        height: 30,
        width: "100%",
        marginVertical: 15,
    },
    formInput: {
        height: 40,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: Colors.darkBlur,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfBookingReducers],
        ...state[nameOfEmployeeReducers],
        ...state[nameOfLoadingReducers][
        bookingActions.GET_DETAIL_BOOKING
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...bookingActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentDetailScreen)
