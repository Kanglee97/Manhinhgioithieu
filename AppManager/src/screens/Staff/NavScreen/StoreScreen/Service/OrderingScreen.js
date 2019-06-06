import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    Platform,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    Text,
    SafeAreaView,
    TouchableWithoutFeedback
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { AddItem, ButtonGradient, ButtonOutline, FormInput, PopUpInput, MainHeader, Loading, UserAvatar, MaterialIcon } from '../../../../../components/react-native-teso';
import { validate } from '../../../../../helper';
import NavigationService from '../../../../../navigation/NavigationService';
import _, { get } from 'lodash';
import * as storeService from '../../../../../sagas/storeService'
import { nameOfDetailOrderReducers, nameOfProfileReducers, nameOfStoreDetailReducers, nameOfLoadingReducers } from '../../../../../reducers'
import Feather from 'react-native-vector-icons/Feather';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { bindActionCreators } from 'redux';
import { orderActions, customerActions } from '../../../../../actions/index';
import { connect } from 'react-redux';
import numeral from 'numeral';
import { validateName, validatePhoneNumber } from '../../../../../helper/validationHelper';
import Moment from 'moment'

class OrderingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceData: [],
            refreshing: false,
            user: undefined,
            readyToCheckOut: false,
            firstName: '',
            phone: '',
            email: '',
            discountCode: '',
            case: 'typeCustomer',
            avatar: null,
            isFindCustomer: false,
            typePaymentSelected: 'BYMONEY',
        };
        this._toggleFindCustomer = this._toggleFindCustomer.bind(this)
        this._onRefresh = this._onRefresh.bind(this)
        this.createOrder = this.createOrder.bind(this)
        this.onSuccess = this.onSuccess.bind(this)
        this.checkUpdateRender = this.checkUpdateRender.bind(this)
        this.createCustomer = this.createCustomer.bind(this)
        this.findCustomer = this.findCustomer.bind(this)
        this.putInQuere = this.putInQuere.bind(this)
        this.renderItemService = this.renderItemService.bind(this)
        this.renderItemPromotion = this.renderItemPromotion.bind(this)
        this.renderItemOrderCheckout = this.renderItemOrderCheckout.bind(this)
    }

    _toggleFindCustomer = () => { this.setState({ isFindCustomer: !this.state.isFindCustomer }) }

    componentDidMount = () => {
        //this._onRefresh();
        if (this.props.detail.userId !== "")
            this.setState({
                case: 'ordering'
            }, () => {
                this.checkUpdateRender(this.props, this.state)
            })
        else this.checkUpdateRender(this.props, this.state)

    }

    _onRefresh = () => {
        const data = {
            'id': 1,
            callback: () => {
                console.log(this.props, this.state)
            }
        }
        this.props.actions.fetchDetailOrderRequest(data);
    }

    createOrder = () => {
        let _service = []
        let totalPrice = 0
        _.forEach(this.props.detail.service, function (serviceItem) {
            let _option = []
            totalPrice = totalPrice + Number(serviceItem.price)
            _.forEach(serviceItem.data, function (itemOrder) {
                _option.push(itemOrder.data.id)
                totalPrice = totalPrice + Number(itemOrder.data.price)
            })
            _service = _.concat(_service, { 'id': serviceItem.id, 'options': _option })
        })
        const order = {
            'empId': get(storeService.getSpecificState(nameOfProfileReducers).user, 'id'),
            'totalPrice': JSON.stringify(totalPrice),
            'services': _service,
            'promotions': this.props.detail.promotion.map(item => item.id),
            'payment': this.state.typePaymentSelected,
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            'managerId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.ownerId') || get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
            'userId': this.props.detail.userId,
            'phone': this.props.detail.phone,
            'cusName': this.props.detail.cusName,
            'storeName': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.displayName'),
            'address': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.address'),
            'startTime': this.props.detail.startTime,
            'endTime': Moment().format()
        }
        console.log('order ', order)
        const data = {
            'id': this.props.detail.id,
            'order': order,
            callback: (id) => {
                this.props.actions.removeOrder({ 'id': id })
                this.setState({
                    case: 'return'
                })
            }
        }
        this.props.actions.createDetailOrderRequest(data)

    }

    onSuccess(e) {
        console.log(e)
        const data = {
            'user': e.data,
            callback: (user) => {
                console.log(user)
                this.props.actions.setCustomer({ 'user': user })
                this.setState({
                    user: user,
                })
            }
        }
        storeService.dispatch(customerActions.getCustomerRequest(data))
        // Linking
        //     .openURL(e.data)
        //     .catch(err => console.error('An error occured', err));
    }

    checkUpdateRender = (props, state) => {
        switch (state.case) {
            case 'typeCustomer':

                break;
            case 'QRCode':
                if (this.props.detail.userId)
                    this.setState({
                        case: 'ordering'
                    })
                break;
            case 'ordering':
                const { service, promotion } = props.detail
                console.log(service)
                let countDoneService = 0
                _.forEach(service, function (item) {
                    if (item.done) countDoneService = countDoneService + 1
                })
                let countDonePromotion = 0
                _.forEach(promotion, function (item) {
                    if (item.done) countDonePromotion = countDonePromotion + 1
                })

                console.log('countDoneService', countDoneService)
                if (countDonePromotion == promotion.length && countDoneService == service.length) {
                    if (countDoneService + countDonePromotion > 0) {
                        if (!this.state.readyToCheckOut)
                            this.setState({
                                readyToCheckOut: true,
                            })
                        break;
                    }
                }

                if (this.state.readyToCheckOut)
                    this.setState({
                        readyToCheckOut: false
                    })
                break;
            case 'ordering':

                break;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.checkUpdateRender(prevProps, prevState)
    }

    createCustomer = (displayName, phoneNumber, email) => {
        const user = {
            'firstName': displayName,
            'email': email,
            'phone': phoneNumber,
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId')
        }
        const data = {
            'user': user,
            callback: (user) => {
                this.props.actions.setCustomer({ 'user': user, 'isNewCustomer': true })
                this.setState({
                    user: user,
                    case: 'ordering'
                })
            }
        }
        storeService.dispatch(customerActions.createCustomerRequest(data))
    }

    findCustomer = phone => {
        const user = {
            'phone': phone,
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId')
        }
        const data = {
            'user': user,
            callback: (user) => {
                this.props.actions.setCustomer({ 'user': user })
                this.setState({
                    user: user,
                })
            }
        }
        storeService.dispatch(customerActions.findCustomerRequest(data))
    }

    putInQuere = () => {
        const data = {
            'order': this.props.detail
        }
        this.props.actions.putInQuereDetailOrder(data)
        this.props.actions.clearDetailOrder()
        NavigationService.goBack()
    }

    renderItemService = ({ item, index }) => {
        console.log(item)
        if (item.none == 1)
            return (
                <AddItem label={'Thêm dịch vụ'} onPress={() => { NavigationService.navigate('Store') }} />
            )
        else return (
            <View style={[styles.displayInlineBlock, styles.itemContainer, { alignSelf: 'center', marginBottom: 10, opacity: item.done ? 0.5 : 1 }]}>
                <View style={{ width: '25%', height: '100%', }}>
                    <Image source={{ uri: `${item.thumbnail[0]}` }} style={[styles.img]} />
                </View>
                <View style={{
                    flex: 1, padding: 6, shadowColor: Colors.functionColorDark,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 5,
                    elevation: 10,
                }}>
                    <View style={{
                        width: (item.done || item.processing) ? 80 : 60,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        backgroundColor: item.done ? '#004D86' : item.processing ? '#058600' : '#B29700',
                    }}>
                        <Text style={{ fontSize: FontStyle.miniText, fontFamily: FontStyle.mainFont, color: Colors.lightText }}>
                            {item.done ? 'Đã hoàn thành' : item.processing ? 'Đang tiến hành' : 'Chờ đợi'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold' }}>
                        {item.displayName}
                    </Text>
                    <View style={[styles.displayInlineBlock, { justifyContent: 'space-between' }]}>
                        <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                            {`${item.price + _.sumBy(item.data, 'data.price')} đ`}
                        </Text>
                        {item.done ? <View /> : item.processing ?
                            <ButtonGradient
                                style={{ height: 25, width: 100, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    this.props.actions.doneService({ 'serviceId': item.id })
                                }}
                                content={'Hoàn thành'}
                                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }} />
                            :
                            <View style={[styles.displayInlineBlock, { alignItems: 'center' }]}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        const data = {
                                            'id': item.id
                                        }
                                        await this.props.actions.removeServiceChild(data)
                                        if (_.isEmpty(await this.props.detail.service)) {
                                            this.props.actions.clearDetailOrder()
                                            NavigationService.goBack()
                                        }
                                    }}
                                    style={{ marginRight: 10 }}>
                                    <Text style={{ color: Colors.functionColorLight }}>
                                        Huỷ
                                    </Text>
                                </TouchableOpacity>
                                <ButtonGradient
                                    style={{ height: 25, width: 80, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        this.props.actions.startProcessingService({
                                            'serviceId': item.id
                                        })
                                    }}
                                    content={'Bắt đầu'}
                                    labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }} />
                            </View>
                        }
                    </View>
                </View>
            </View>
        )
    }

    renderItemPromotion = ({ item, index }) => {
        console.log(item)
        if (item.none == 1)
            return (
                <AddItem label={'Thêm Khuyến mãi'} onPress={() => { NavigationService.navigate('Store') }} />
            )
        else return (
            <View style={[styles.displayInlineBlock, styles.itemContainer, { alignSelf: 'center', marginVertical: 0, marginBottom: 10, opacity: item.done ? 0.5 : 1 }]}>
                <View style={{ width: '25%', height: '100%', }}>
                    <Image source={{ uri: `${item.thumbnail}` }} style={[styles.img]} />
                </View>
                <View style={{
                    flex: 1, padding: 6, shadowColor: Colors.functionColorDark,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 5,
                    elevation: 10,
                }}>
                    <View style={{
                        width: (item.done || item.processing) ? 80 : 60,
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 5,
                        backgroundColor: item.done ? '#004D86' : item.processing ? '#058600' : '#B29700',
                    }}>
                        <Text style={{ fontSize: FontStyle.miniText, fontFamily: FontStyle.mainFont, color: Colors.lightText }}>
                            {item.done ? 'Đã hoàn thành' : item.processing ? 'Đang tiến hành' : 'Chờ đợi'}
                        </Text>
                    </View>
                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold' }}>
                        {item.displayName}
                    </Text>
                    <View style={[styles.displayInlineBlock, { justifyContent: 'space-between' }]}>
                        <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                            {`${item.price} đ`}
                        </Text>
                        {item.done ? <View /> : item.processing ?
                            <ButtonGradient
                                style={{ height: 25, width: 100, justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => {
                                    this.props.actions.donePromotion({ 'promotionId': item.id })
                                }}
                                content={'Hoàn thành'}
                                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }} />
                            :
                            <View style={[styles.displayInlineBlock, { alignItems: 'center' }]}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        const data = {
                                            'id': item.id
                                        }
                                        await this.props.actions.removePromotion(data)
                                        if (_.isEmpty(await this.props.detail.service))
                                            NavigationService.goBack()
                                    }}
                                    style={{ marginRight: 10 }}>
                                    <Text style={{ color: Colors.functionColorLight }}>
                                        Huỷ
                                    </Text>
                                </TouchableOpacity>
                                <ButtonGradient
                                    style={{ height: 25, width: 80, justifyContent: 'center', alignItems: 'center' }}
                                    onPress={() => {
                                        this.props.actions.startProcessingPromotion({
                                            'promotionId': item.id
                                        })
                                    }}
                                    content={'Bắt đầu'}
                                    labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }} />
                            </View>
                        }
                    </View>
                </View>
            </View>
        )
    }

    renderItemOrderCheckout = ({ item, index }) => {
        let totalPriceService = Number(item.price)
        _.forEach(item.data, function (orderItem) {
            totalPriceService = totalPriceService + Number(orderItem.data.price)
        })
        return (
            <View style={[styles.displayInlineBlock, { width: Layout.window.width * 0.9, justifyContent: 'space-between', alignSelf: 'center', marginBottom: 5 }]}>
                <Text style={{ fontSize: FontStyle.mdText, fontWeight: 'bold', fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                    {item.displayName}
                </Text>
                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorLight }}>
                    {`${numeral(totalPriceService).format('0,0')} đ`}
                </Text>
            </View>
        )
    }


    renderCase = Case => {
        const { displayName = '', phone = '', email = '', discountCode = '', user = '', avatar } = this.state
        const { service = [], cusName = '', isNewCustomer = false, promotion = [] } = this.props.detail
        switch (Case) {
            case 'typeCustomer':
                return (
                    <View style={{ height: Layout.window.height * 0.85, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <View style={{ margin: 15 }}>
                            <ButtonGradient
                                onPress={() => {
                                    this.setState({
                                        case: 'QRCode'
                                    })
                                }}
                                content={'Scan code'}
                                labelStyle={{ fontSize: FontStyle.mdText }} />
                        </View>
                        <View style={{ margin: 15 }}>
                            <ButtonGradient
                                onPress={() => { this._toggleFindCustomer() }}
                                content={'Nhập số điện thoại'}
                                labelStyle={{ fontSize: FontStyle.mdText }} />
                        </View>
                        <View style={{ margin: 15 }}>
                            <ButtonOutline
                                onPress={() => { this.setState({ case: 'newCustomer' }) }}
                                label={'Khách hàng mới'}
                                labelStyle={{ fontSize: FontStyle.mdText }} />
                        </View>
                    </View>
                )
                break;
            case 'newCustomer':
                return (
                    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 30, }}>
                        <UserAvatar source={avatar && { uri: avatar }} style={{ marginVertical: 30 }} />
                        <Text style={{ marginBottom: 30 }}>Thông tin khách hàng mới</Text>
                        <FormInput
                            textBox
                            line
                            formStyle={{ width: Layout.window.width * 0.8 }}
                            onChangeText={(text) => this.setState({ displayName: text })}
                            value={displayName}
                            placeholder={'Nhập họ tên...'}
                            errorMessage={!displayName || displayName == '' ? null : (validateName(displayName.normalize('NFC')) ? null : 'Tên không hợp lệ')}
                        />
                        <FormInput
                            textBox
                            line
                            formStyle={{ width: Layout.window.width * 0.8 }}
                            onChangeText={(text) => this.setState({ phone: text })}
                            value={phone}
                            keyboardType={'phone-pad'}
                            placeholder={'Nhập số điện thoại...'}
                            errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
                        />
                        <FormInput
                            textBox
                            line
                            formStyle={{ width: Layout.window.width * 0.8 }}
                            onChangeText={(text) => this.setState({ email: text })}
                            value={email}
                            keyboardType={'email-address'}
                            placeholder={'Nhập email (nếu có)...'} />
                        <View style={{ marginTop: 50 }}>
                            <ButtonGradient
                                disabled={
                                    !validate.validateName(displayName.normalize('NFC'))
                                    || !validate.validatePhoneNumber(phone)
                                }
                                style={{ justifyContent: 'center', alignItems: 'center' }}
                                onPress={() => { this.createCustomer(displayName, phone, email) }}
                                content={'Tiếp theo'}
                                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }} />
                        </View>
                    </View>
                )
                break;
            case 'QRCode':
                return (
                    <QRCodeScanner
                        showMarker
                        cameraStyle={{ height: '100%', width: Layout.window.width }}
                        customMarker={
                            <View style={styles.containerMarker}>
                                <Image source={require('../../../../../assets/img/maker.gif')} style={{
                                    width: Layout.window.width * 0.6,
                                    height: Layout.window.width * 0.7,
                                    marginBottom: '20%'
                                }} />
                            </View>
                        }
                        onRead={this.onSuccess.bind(this)} />
                )
            case 'ordering':
                return (
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{ alignSelf: 'flex-start', marginLeft: Layout.window.width * 0.05 }}>
                            Thông tin khách hàng
                        </Text>
                        <View style={[styles.displayInlineBlock, styles.itemContainer]} >
                            <View style={{ width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <UserAvatar source={avatar && { uri: avatar }} size={50} />
                            </View>
                            <View style={[styles.displayInlineBlock, styles.itemContainerNonShadow, { flex: 1, padding: 6, justifyContent: 'space-between' }]} >
                                <Text style={{ color: Colors.darkText, fontSize: FontStyle.bigText, fontFamily: FontStyle.mainFont, width: '50%' }} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {cusName || 'Khách hàng'}
                                </Text>
                                <Text style={{ color: Colors.darkText, fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>
                                    {isNewCustomer && 'Khách mới'}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ alignSelf: 'flex-start', marginBottom: 10, marginLeft: Layout.window.width * 0.05 }}>
                            Thông tin đơn hàng
                        </Text>
                        <FlatList showsVerticalScrollIndicator={false}
                            style={{ width: Layout.window.width }}
                            data={_.concat(service, { none: 1 })}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={this.renderItemService}
                        />
                        {promotion.length >= 1 &&
                            <Text style={{ alignSelf: 'flex-start', marginTop: 20, marginBottom: 10, marginLeft: Layout.window.width * 0.05 }}>Thông tin khuyến mãi</Text>
                        }
                        <FlatList showsVerticalScrollIndicator={false}
                            style={{ width: Layout.window.width }}
                            data={promotion}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={this.renderItemPromotion}
                        />
                    </View>
                )
                break;
            case 'checkOrder':
                return (
                    <View style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={{ alignSelf: 'flex-start', marginLeft: Layout.window.width * 0.05 }}>
                            Thông tin khách hàng
                        </Text>
                        <View style={[styles.displayInlineBlock, styles.itemContainer]} >
                            <View style={{ width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <UserAvatar source={avatar && { uri: avatar }} size={50} />
                            </View>
                            <View style={[styles.displayInlineBlock, styles.itemContainerNonShadow, { flex: 1, padding: 6, justifyContent: 'space-between' }]} >
                                <Text style={{ color: Colors.darkText, fontSize: FontStyle.bigText, fontFamily: FontStyle.mainFont, width: '50%' }} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {cusName || 'Khách hàng'}
                                </Text>
                                <Text style={{ color: Colors.darkText, fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>
                                    {isNewCustomer && 'Khách mới'}
                                </Text>
                            </View>
                        </View>
                        <FlatList showsVerticalScrollIndicator={false}
                            data={service}
                            //contentContainerStyle={{ maxHeight: Layout.window.height * 0.5, marginTop: 30 }}
                            style={{ paddingBottom: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: Colors.lightGreyColor }}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={this.renderItemOrderCheckout}
                        />
                        <View style={[styles.displayInlineBlock, { width: Layout.window.width * 0.9, justifyContent: 'space-between', alignSelf: 'center' }]}>
                            <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                Tổng cộng
                            </Text>
                            <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorLight }}>
                                {`${numeral(this.props.detail.totalPrice).format('0,0')} đ`}
                            </Text>
                        </View>
                        {/* <View style={[styles.displayInlineBlock, { width: Layout.window.width * 0.9, justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', marginBottom: 5 }]}>
                            <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                Mã giảm giá
                            </Text>
                            <FormInput
                                textBox
                                line
                                formStyle={{ width: Layout.window.width * 0.2 }}
                                onChangeText={(text) => this.setState({ discountCode: text })}
                                value={discountCode} />
                        </View> */}
                        {/* <View style={[styles.displayInlineBlock, { width: Layout.window.width * 0.9, justifyContent: 'space-between', alignSelf: 'center' }]}>
                            <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                Thành tiền
                            </Text>
                            <Text style={{ fontSize: FontStyle.mdText, fontWeight: 'bold', fontFamily: FontStyle.mainFont, color: Colors.functionColorLight }}>
                                {this.props.detail.totalPrice}
                            </Text>
                        </View> */}
                        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, alignSelf: 'flex-start', paddingLeft: Layout.window.width * 0.05, marginTop: 20 }}>
                            Hình thức thanh toán
                        </Text>
                        <View style={[styles.displayInlineBlock, { height: 60, width: Layout.window.width * 0.9, alignItems: 'center', justifyContent: 'space-around' }]}>
                            <TouchableWithoutFeedback onPress={() => {
                                this.setState({
                                    typePaymentSelected: 'BYMONEY'
                                })
                            }}>
                                <Text>
                                    <Feather
                                        name={this.state.typePaymentSelected == 'BYMONEY' ? 'check-circle' : 'circle'}
                                        color={this.state.typePaymentSelected == 'BYMONEY' ? Colors.functionColorDark : Colors.lightGreyColor}
                                        size={FontStyle.md + 3}
                                        style={{ paddingRight: 5 }}
                                    />
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                        Tiền mặt
                                    </Text>
                                </Text>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={() => {
                                this.setState({
                                    typePaymentSelected: 'BYTRANFER'
                                })
                            }}>
                                <Text>
                                    <Feather
                                        name={this.state.typePaymentSelected == 'BYTRANFER' ? 'check-circle' : 'circle'}
                                        color={this.state.typePaymentSelected == 'BYTRANFER' ? Colors.functionColorDark : Colors.lightGreyColor}
                                        size={FontStyle.md + 3}
                                        style={{ paddingRight: 5 }}
                                    />
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                        Chuyển khoản
                                    </Text>
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>
                        <ButtonGradient
                            onPress={() => {
                                this.createOrder()
                            }}
                            content={'Thanh toán'}
                            labelStyle={{ fontSize: FontStyle.mdText }} />
                    </View>
                )
                break;
            case 'return':
                return (
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: Layout.window.height }}>
                        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, marginBottom: 30 }}>
                            Khách hàng đã thanh toán thành công!
                        </Text>
                        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                            Hãy cảm ơn khách hàng nhé!
                        </Text>
                        <View style={{ marginTop: 30 }}>
                            <ButtonGradient
                                onPress={() => {
                                    NavigationService.goBack()
                                }}
                                content={'Màn hình chính'}
                                labelStyle={{ fontSize: FontStyle.mdText }} />
                            {/* {<View style={{ margin: 15 }}>
                                <ButtonOutline
                                    onPress={() => {
                                        importImage.takeImage()
                                            .then(image => {
                                                importImage.uploadImage(image.path)
                                                    .then(image => {
                                                        NavigationService.goBack()
                                                    })
                                            })
                                    }}
                                    content={'Chụp ảnh'}
                                    labelStyle={{ fontSize: FontStyle.mdText }} />
                            </View>} */}
                        </View>
                    </View>
                )
                break;
        }
    }



    render() {

        console.log(this.state)
        const { phone } = this.state
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    rounded={this.state.case != 'ordering'}
                    containerStyle={{
                        backgroundColor: Colors.transparent,
                        width: Layout.window.width,
                        zIndex: 1,
                    }}
                    backgroundColor={Colors.bg}
                    leftPress={() => { this.putInQuere() }}
                    centerComponent={this.state.case == 'QRCode' ? 'Quét mã QR' : (this.state.case == 'typeCustomer' ? 'Nhập thông tin khách hàng' : 'Đơn hàng')}
                    textCenterColor={this.state.case == 'Quét mã QR' && Colors.lightText}
                    rightComponent={
                        this.state.readyToCheckOut ?
                            this.state.case != 'return' &&
                            this.state.case != 'checkOrder' &&
                            < MaterialIcon button
                                name={'payment'}
                                size={25}
                                color={Colors.functionColorDark} />
                            :
                            <MaterialIcon button
                                name={'person-add'}
                                size={25}
                                color={Colors.functionColorDark} />
                    }
                    rightPress={
                        this.state.readyToCheckOut ?
                            this.state.case != 'return' &&
                            this.state.case != 'checkOrder' &&
                            (() => {
                                if (this.state.readyToCheckOut)
                                    this.setState({
                                        case: 'checkOrder'
                                    })
                            })
                            :
                            (() => { this.putInQuere() })
                    }
                />
                {this.props.isLoading ?
                    <Loading />
                    : <ScrollView showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        style={styles.body}>
                        {this.renderCase(this.state.case)}
                    </ScrollView>
                }
                <PopUpInput
                    onBackdropPress={() => {
                        this.setState({
                            user: undefined
                        })
                        this.props.actions.removeCustomer()
                        if (!this.state.user) {
                            this._toggleFindCustomer()
                        }
                    }}
                    isVisible={this.state.isFindCustomer}>
                    <View style={{ flex: 1, justifyContent: 'space-around' }}>
                        <MainHeader
                            containerStyle={{ paddingTop: 0, height: 40, marginTop: 0 }}
                            backgroundColor={Colors.lightBg}
                            leftComponent={<MaterialIcon name={'keyboard-arrow-down'} size={20} color={Colors.functionColorLight} />}
                            leftPress={() => {
                                this.setState({
                                    user: undefined
                                })
                                this.props.actions.removeCustomer()
                                if (!this.state.user) {
                                    this._toggleFindCustomer()
                                }
                            }}
                            centerComponent={
                                <Text style={{
                                    color: Colors.functionColorDark, fontWeight: 'bold',
                                    fontSize: FontStyle.mdText, textAlign: 'center', width: '90%'
                                }} numberOfLines={1} ellipsizeMode={'tail'}>Nhập số điện thoại</Text>
                            }
                        />
                        {this.state.user ?
                            <View style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                                <View style={[styles.displayInlineBlock, styles.formInput]}>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                                        {this.state.user.firstName}
                                    </Text>
                                    <Text>
                                        {this.state.user.phone}
                                    </Text>
                                </View>
                                <View style={{ margin: 15, alignItems: 'center' }}>
                                    <ButtonGradient
                                        onPress={() => {
                                            this._toggleFindCustomer()
                                            this.setState({
                                                phone: '',
                                                case: 'ordering'
                                            })
                                        }}
                                        content={'Tiếp tục'}
                                        labelStyle={{ fontSize: FontStyle.mdText }} />
                                </View>
                            </View> :
                            <View>
                                <FormInput
                                    textBox
                                    line
                                    inputStyle={{ alignItems: 'center' }}
                                    formStyle={{ width: '90%', alignSelf: 'center' }}
                                    onChangeText={(text) => this.setState({ phone: text })}
                                    value={phone}
                                    keyboardType={'phone-pad'}
                                    placeholder={'Nhập số điện thoại'}
                                    autoFocus />
                                <View style={{ margin: 15, alignItems: 'center' }}>
                                    <ButtonGradient
                                        onPress={() => { this.findCustomer(phone) }}
                                        disabled={!validate.validatePhoneNumber(phone)}
                                        content={'Tìm khách hàng'}
                                        labelStyle={{ fontSize: FontStyle.mdText }} />
                                </View>
                            </View>
                        }
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
    body: {
        height: Layout.window.height,
    },
    text: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    itemContainer: {
        width: Layout.window.width * 0.9,
        height: 80,
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 20,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },
    itemContainerNonShadow: {
        width: Layout.window.width * 0.9,
        height: 80,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Colors.lightBg,
    },
    img: {
        height: 80,
        width: 80,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        borderRadius: 10,
    },
    formInput: {
        height: 40,
        width: Layout.window.width * 0.6,
        borderBottomWidth: 1,
        borderColor: Colors.darkBlur,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    containerMarker: {
        width: Layout.window.width,
        height: Layout.window.height,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfDetailOrderReducers],
        ...state[nameOfLoadingReducers][orderActions.CREATE_DETAIL_ORDER]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(orderActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderingScreen)
