import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    Image,
    Platform,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Linking
} from 'react-native'

import { RadioGroup, UserAvatar, MainHeader, IconImage, MaterialIcon, Loading, PopUpRemind } from '../../../../components/react-native-teso'
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic'
import CustomerDetailTabNavigator from '../../../../navigation/Manager/CustomerDetailTabNavigator'
import NavigationService from '../../../../navigation/NavigationService';
import { sendSMS } from '../../../../helper/functionHelper';
import { nameOfCustomerReducers, nameOfLoadingReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { customerActions } from '../../../../actions/index';
import { connect } from 'react-redux';
import * as storeService from '../../../../sagas/storeService'
import _, { get } from 'lodash'
import numeral from 'numeral'


class CustomerDetailScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisibleRemindPhone: false,
            isVisibleRemindSMS: false
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
        this.props.actions.getCustomerRequest(data)
        const dataTransaction = {
            "managerId": get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
            "customerId": this.props.navigation.state.params.id
        }
        this.props.actions.getDetailTransactionCustomerRequest(data)
    }

    _toggleRemindPhonePopup = () => this.setState({ isVisibleRemindPhone: !this.state.isVisibleRemindPhone });

    _toggleRemindSMSPopup = () => this.setState({ isVisibleRemindSMS: !this.state.isVisibleRemindSMS });


    render() {
        const { info } = this.props.detail;
        const { isVisibleRemindSMS, isVisibleRemindPhone } = this.state;
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => {
                        this.props.actions.clearDetailCustomer()
                        NavigationService.goBack()
                    }}
                    rightComponent={<MaterialIcon button name={'create'} size={25} color={Colors.functionColorDark} />}
                />
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <UserAvatar
                        size={140}
                        source={info.avatar && { uri: info.avatar }}
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
                                {info.firstName}
                            </Text>
                            <View style={[styles.displayInlineBlock, { paddingTop: 10, paddingBottom: 10 }]}>
                                {/* <View style={{ width: '40%', alignItems: 'center', justifyContent: 'space-around', height: 50, borderRightWidth: 0.4 }} >
                                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                        Hạng mức
                                        </Text>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                        Rănk vàng
                                        </Text>
                                </View> */}
                                <View style={[styles.displayInlineBlock, { width: '100%', alignItems: 'center', justifyContent: 'center' }]} >
                                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>Điểm</Text>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}> {numeral(info.point).format(0, 0)}</Text>
                                </View>
                            </View>
                            {/* {info.phone != null && info.email != null && */}
                            <View style={[styles.displayInlineBlock, { width: '100%', height: 60, paddingTop: 5, justifyContent: 'center' }]}>
                                {/* <TouchableOpacity style={{ marginHorizontal: 5 }}> 
                                            <MaterialIcon button name={'event-note'} color={Colors.functionColorDark} size={30} />
                                        </TouchableOpacity> */}
                                <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                    if (info.phone) {
                                        Linking.openURL(`tel:${info.phone}`)
                                    } else {
                                        this._toggleRemindPhonePopup();
                                    }
                                }}>
                                    <MaterialIcon button name={'local-phone'} color={Colors.functionColorDark} size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                                    if (info.phone) {
                                        sendSMS(info.phone, `Xin chào ${info.firstName || 'Khách hàng'}! Tôi có thể giúp gì cho bạn?`)
                                    } else {
                                        this._toggleRemindSMSPopup();
                                    }
                                }}>
                                    <MaterialIcon button name={'message'} color={Colors.functionColorDark} size={30} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() =>
                                    NavigationService.navigate('CustomerChat', {
                                        displayName: info.firstName || 'Khách hàng'
                                    })}>
                                    <MaterialIcon button name={'chat-bubble-outline'} color={Colors.functionColorDark} size={30} />
                                </TouchableOpacity>
                            </View>
                            {/* } */}
                            {/* {info.phone == null && info.email == null &&
                                <View style={[styles.displayInlineBlock, { width: '100%', alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }]} >
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}> {'Khách mới'}</Text>
                                </View>} */}
                        </View>
                    </View>
                </View>
                <View style={{
                    width: Layout.window.width * 0.9,
                    height: Layout.window.height * 0.5,
                    marginLeft: Layout.window.width * 0.05,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>
                    <CustomerDetailTabNavigator ref={nav => {
                        this.navigator = nav;
                    }} />
                </View>
                <PopUpRemind
                    isVisibleUpgradeStore={isVisibleRemindPhone}
                    onBackdropPress={this._toggleRemindPhonePopup}
                    limitContent={`Khách hàng này chưa có số điện thoại, nhắc nhỡ họ cập nhật để tiện liên lạc nhé!`}
                    onPressNo={this._toggleRemindPhonePopup}
                    okLabel={'Tiếp tục gọi'}
                    onPressOk={() => {
                        this._toggleRemindPhonePopup();
                        Linking.openURL(`tel:${info.phone || ''}`)
                    }}
                />
                <PopUpRemind
                    isVisibleUpgradeStore={isVisibleRemindSMS}
                    onBackdropPress={this._toggleRemindSMSPopup}
                    limitContent={`Khách hàng này chưa có số điện thoại, nhắc nhỡ họ cập nhật để tiện liên lạc nhé!`}
                    onPressNo={this._toggleRemindSMSPopup}
                    okLabel={'Mở tin nhắn'}
                    onPressOk={() => {
                        this._toggleRemindSMSPopup();
                        sendSMS(info.phone || '', `Xin chào ${info.firstName || 'Khách hàng'}! Tôi có thể giúp gì cho bạn?`)
                    }}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        ...state[nameOfCustomerReducers],
        ...state[nameOfLoadingReducers][
        customerActions.GET_CUSTOMER
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(customerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetailScreen)
