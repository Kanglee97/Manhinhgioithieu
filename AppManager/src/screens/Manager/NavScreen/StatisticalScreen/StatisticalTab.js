import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    TouchableWithoutFeedback,
    SafeAreaView,
    RefreshControl
} from 'react-native';
import Modal from 'react-native-modal';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader, FormInput, Wrapper, EmployeeRecord, Loading, MaterialIcon } from '../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BarChart, PieChart } from 'react-native-chart-kit';

import Moment from 'moment'
import numeral from 'numeral';
import { nameOfStatiticReducers, nameOfProfileReducers, nameOfStoreDetailReducers, nameOfLoadingReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { statisticActions } from '../../../../actions/index';
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'
import _, { get } from 'lodash';

const serviceColor = [
    // { color: '#F44336', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText, },
    // { color: '#E91E63', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    // { color: '#9C27B0', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    // { color: '#673AB7', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    // { color: '#3F51B5', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    // { color: '#2196F3', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    // { color: '#03A9F4', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    // { color: '#00BCD4', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#009688', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#4CAF50', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#8BC34A', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#CDDC39', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#FFEB3B', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#FFC107', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#FF9800', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#FF5722', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#795548', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#9E9E9E', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
    { color: '#607D8B', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
]

class StatisticalTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openSwithStore: false,
            selectedTypeService: [],
            openServiceDetail: false,
            dropDownStores: [
                { id: '1', title: 'Tất cả cửa hàng' },
                { id: '2', title: 'Cửa hàng A' },
                { id: '3', title: 'Cửa hàng B' },
                { id: '4', title: 'Cửa hàng C' },
            ],
            checkStoreId: 0,
            toDayList: [
                { id: '1', title: 'Hôm nay' },
                { id: '2', title: 'Tuần' },
                { id: '3', title: 'Tháng' },
                { id: '4', title: 'Năm' },
            ],
            store: null,
            totalRevenue: 'Hôm nay',
            compareRevenue: 'Hôm nay',
            employeeRevenue: 'Hôm nay',
            serviceRevenue: 'Hôm nay',
            employees: [
                { title: 'Hậu', content: 'Boss', price: '500 000' },
                { title: 'Tú', content: 'Lính', price: '100 000' },
                { title: 'Tú', content: 'Lính', price: '100 000' },
            ],
            service1: [
                { name: "20000", revenue: 42222218 },
                { name: "Aaa", revenue: 15555541 },
                { name: 'Duỗi tóc', revenue: 10500000 },
                { name: 'Duỗi', revenue: 10500000 },
                { name: "Aaa", revenue: 15555541 },
                { name: 'Duỗi tóc', revenue: 10500000 },
                { name: 'Duỗi', revenue: 10500000 },
                { name: "Aaa", revenue: 15555541 },
                { name: 'Duỗi tóc', revenue: 10500000 },
                { name: 'Duỗi', revenue: 10500000 },
                { name: "Aaa", revenue: 15555541 },
                { name: 'Duỗi tóc', revenue: 10500000 },
                { name: 'Duỗi', revenue: 10500000 },
                { name: "Aaa", revenue: 15555541 },
                { name: 'Duỗi tóc', revenue: 10500000 },
                { name: 'Duỗi', revenue: 10500000 },
            ],

            service2: [
                { name: 'Cắt tóc', revenue: Math.random() * 1000, color: '#428E00', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText, },
                { name: 'Uốn tóc', revenue: Math.random() * 1000, color: '#E54C24', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
                { name: 'Duỗi tóc', revenue: Math.random() * 1000, color: '#2A73C7', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
            ],
            serviceColor: [
                { color: '#428E00', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText, },
                { color: '#E54C24', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
                { color: '#2A73C7', legendFontColor: '#7F7F7F', legendFontSize: FontStyle.smallText },
            ]
        };

        this._toggleDropdownStore = this._toggleDropdownStore.bind(this)
        this._toggleServiceDetail = this._toggleServiceDetail.bind(this)
        this.filterType = this.filterType.bind(this)
        this.filterMomentType = this.filterMomentType.bind(this)
        this.loadData = this.loadData.bind(this)
        this.loadDataTotal = this.loadDataTotal.bind(this)
        this.loadDataCompare = this.loadDataCompare.bind(this)
        this.loadDataEmployee = this.loadDataEmployee.bind(this)
        this.loadDataService = this.loadDataService.bind(this)
        this.onSelectStore = this.onSelectStore.bind(this)
        this.renderCenterComponent = this.renderCenterComponent.bind(this)
        this.renderTopAreaTotalRevenueComponent = this.renderTopAreaTotalRevenueComponent.bind(this)
        this.renderTopAreaCompareRevenueComponent = this.renderTopAreaCompareRevenueComponent.bind(this)
        this.renderCompareRevenueBarChart = this.renderCompareRevenueBarChart.bind(this)
        this.renderTopAreaEmployeeRevenueComponent = this.renderTopAreaEmployeeRevenueComponent.bind(this)
        this.renderTopAreaServiceRevenueComponent = this.renderTopAreaServiceRevenueComponent.bind(this)
        this.parse = this.parse.bind(this)
        this.renderDay = this.renderDay.bind(this)
        this.renderServiceRevenuePieChart = this.renderServiceRevenuePieChart.bind(this)
        this.user = get(storeService.getSpecificState(nameOfProfileReducers), 'user')
        this.store = get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data')
    }
    static navigationOptions = {
        header: null
    };

    _toggleDropdownStore = () => this.setState({ openSwithStore: !this.state.openSwithStore });

    _toggleServiceDetail = () => this.setState({ openServiceDetail: !this.state.openServiceDetail })

    componentDidMount() {
        this.setState({
            dropDownStores: _.concat({ id: '0', displayName: 'Tất cả cửa hàng' }, get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')),
            totalRevenue: 'Hôm nay',
            compareRevenue: 'Hôm nay',
            employeeRevenue: 'Hôm nay',
            serviceRevenue: 'Hôm nay',
        }, () => {
            this.loadData()
        })

    }

    filterType = (caseType) => {
        switch (caseType) {
            case 'Hôm nay':
                return 'date'
            case 'Tuần':
                return 'week'
            case 'Tháng':
                return 'month'
            case 'Năm':
                return 'year'
        }
    }

    filterMomentType = (caseType) => {
        switch (caseType) {
            case 'Hôm nay':
                return 'days'
            case 'Tuần':
                return 'weeks'
            case 'Tháng':
                return 'months'
            case 'Năm':
                return 'years'
        }
    }

    loadData = () => {
        var a;
        if (this.user.isManager) {
            a = [this.user.storeId]
        } else {
            a = (this.state.checkStoreId == 0) ?
                get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id) :
                [get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')[this.state.checkStoreId - 1].id]
        }
        this.loadDataTotal(a)
        this.loadDataCompare(a)
        this.loadDataEmployee(a)
        this.loadDataService(a)
    }

    loadDataTotal = (a) => {
        this.props.actions.statiticByTotalRequest({
            'user': {
                'storeIds': a,
                'type': this.filterType(this.state.totalRevenue)
            }
        })
    }

    loadDataCompare = (a) => {
        this.props.actions.statiticByCompareRequest({
            'user': {
                'storeIds': a,
                'type': this.filterType(this.state.compareRevenue)
            }
        })
    }

    loadDataEmployee = (a) => {
        this.props.actions.statiticByEmployeeRequest({
            'user': {
                'storeIds': a,
                'type': this.filterType(this.state.employeeRevenue)
            }
        })
    }

    loadDataService = (a) => {
        this.props.actions.statiticByServiceRequest({
            'user': {
                'storeIds': a,
                'type': this.filterType(this.state.serviceRevenue)
            }
        })
    }

    onSelectStore = (storeId) => {
        this.setState({
            checkStoreId: storeId
        }, () =>
                this.loadData()
        )
    }


    renderCenterComponent() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.lightText, fontWeight: 'bold' }}>
                    Thống kê
              </Text>
            </View>
        );
    }

    renderTopAreaTotalRevenueComponent() {
        const { toDayList, totalRevenue } = this.state;
        return (
            <View style={[styles.displayInlineBlock]}>
                <View style={styles.toDayBlock}>
                    <Text style={styles.leftTitle}>{this.renderDay(this.state.totalRevenue)}</Text>
                </View>
                <View style={{ width: '30%' }}>
                    <FormInput
                        dropDown
                        data={toDayList}
                        value={toDayList[_.findIndex(toDayList, function (item) { return item.title === totalRevenue })].title}
                        valueExtractor={({ title }) => title}
                        onChangeText={(value) => {
                            this.setState({ totalRevenue: value }, () => {
                                this.loadDataTotal((this.state.checkStoreId == 0) ?
                                    get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id) :
                                    [get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')[this.state.checkStoreId - 1].id])
                            })
                        }}
                        rightComponent={
                            <FontAwesome5 name='sort-down' size={20} color={Colors.functionColorDark} />
                        }
                        rightComponentStyle={{ top: '15%' }}
                        containerDropdownStyle={{ backgroundColor: Colors.lightBg, borderColor: Colors.transparent, top: -6.2 }}
                        formStyle={{ marginTop: 0 }}
                    />
                </View>
            </View>
        )
    }

    renderTopAreaCompareRevenueComponent = () => {
        const { toDayList, compareRevenue } = this.state;
        return (
            <View style={[styles.displayInlineBlock]}>
                <View style={styles.toDayBlock}>
                    <Text style={styles.leftTitle}>So sánh doanh thu</Text>
                </View>
                <View style={{ width: '30%' }}>
                    <FormInput
                        dropDown
                        data={toDayList}
                        value={toDayList[_.findIndex(toDayList, function (item) { return item.title === compareRevenue })].title}
                        valueExtractor={({ title }) => title}
                        onChangeText={(value) => {
                            this.setState({ compareRevenue: value }, () => {
                                let a = (this.state.checkStoreId == 0) ?
                                    get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id) :
                                    [get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')[this.state.checkStoreId - 1].id]
                                this.loadDataCompare(a)
                            })
                        }}
                        rightComponent={
                            <FontAwesome5 name='sort-down' size={20} color={Colors.functionColorDark} />
                        }
                        rightComponentStyle={{ top: '15%' }}
                        containerDropdownStyle={{ backgroundColor: Colors.lightBg, borderColor: Colors.transparent, top: -6.2 }}
                        formStyle={{ marginTop: 0 }}
                    />
                </View>
            </View>
        )
    }

    renderCompareRevenueBarChart() {
        let label = ''
        switch (this.filterMomentType(this.state.compareRevenue)) {
            case 'days':
                label = ['Hôm qua', 'Hôm nay']
                break;
            case 'weeks':
                label = ['Tuần trước', 'Tuần này']
                break;
            case 'months':
                label = ['Tháng trước', 'Tháng này']
                break;
            case 'years':
                label = ['Năm trước', 'Năm nay']
                break;
        }
        return (
            <View>
                <BarChart
                    data={{
                        labels: [...label],
                        datasets: [{
                            data: [
                                this.props.byCompare.previous,
                                this.props.byCompare.now,
                            ]
                        }]
                    }}
                    // data={{
                    //     datasets: [{
                    //         data: this.state.employees
                    //     }]
                    // }}
                    width={Layout.window.width * 0.9} // from react-native
                    height={220}
                    chartConfig={{
                        backgroundColor: Colors.lightBg,
                        backgroundGradientFrom: Colors.lightBg,
                        backgroundGradientTo: Colors.lightBg,
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(45, 92, 129, ${opacity})`,
                    }}
                    bezier
                    style={{ marginVertical: 10, backgroundColor: 'red' }}
                />
            </View>
        )
    }

    renderTopAreaEmployeeRevenueComponent() {
        const { toDayList, employeeRevenue } = this.state;
        return (
            <View style={[styles.displayInlineBlock]}>
                <View style={styles.toDayBlock}>
                    <Text style={styles.leftTitle}>Doanh thu mỗi nhân viên</Text>
                </View>
                <View style={{ width: '30%' }}>
                    <FormInput
                        dropDown
                        data={toDayList}
                        value={toDayList[_.findIndex(toDayList, function (item) { return item.title === employeeRevenue })].title}
                        valueExtractor={({ title }) => title}
                        onChangeText={(value) => {
                            this.setState({ employeeRevenue: value }, () => {
                                let a = (this.state.checkStoreId == 0) ?
                                    get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id) :
                                    [get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')[this.state.checkStoreId - 1].id]
                                this.loadDataEmployee(a)
                            })
                        }}
                        rightComponent={
                            <FontAwesome5 name='sort-down' size={20} color={Colors.functionColorDark} />
                        }
                        rightComponentStyle={{ top: '15%' }}
                        containerDropdownStyle={{ backgroundColor: Colors.lightBg, borderColor: Colors.transparent, top: -6.2 }}
                        formStyle={{ marginTop: 0 }}
                    />
                </View>
            </View>
        )
    }

    renderTopAreaServiceRevenueComponent() {
        const { toDayList, serviceRevenue } = this.state;
        return (
            <View style={[styles.displayInlineBlock]}>
                <View style={styles.toDayBlock}>
                    <Text style={styles.leftTitle}>Doanh thu theo dịch vụ</Text>
                </View>
                <View style={{ width: '30%' }}>
                    <FormInput
                        dropDown
                        data={toDayList}
                        value={toDayList[_.findIndex(toDayList, function (item) { return item.title === serviceRevenue })].title}
                        valueExtractor={({ title }) => title}
                        onChangeText={(value) => {
                            this.setState({ serviceRevenue: value }, () => {
                                let a = (this.state.checkStoreId == 0) ?
                                    get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id) :
                                    [get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')[this.state.checkStoreId - 1].id]
                                this.loadDataService(a)
                            })
                        }}
                        rightComponent={
                            <FontAwesome5 name='sort-down' size={20} color={Colors.functionColorDark} />
                        }
                        rightComponentStyle={{ top: '15%' }}
                        containerDropdownStyle={{ backgroundColor: Colors.lightBg, borderColor: Colors.transparent, top: -6.2 }}
                        formStyle={{ marginTop: 0 }}
                    />
                </View>
            </View>
        )
    }

    parse = (array) => {
        let newArray = []
    }

    renderDay = (day, subDays) => {
        console.log(day)
        switch (this.filterMomentType(day)) {
            case 'days':
                return `${Moment().subtract(subDays ? 1 : 0, 'days').format('DD-MM-YYYY')}`
                break;
            case 'weeks':
                return `${Moment().subtract(subDays ? 14 : 7, 'days').format('DD-MM-YYYY')} - ${Moment().subtract(subDays ? 8 : 0, 'days').format('DD-MM-YYYY')}`
                break;
            case 'months':
                return `${Moment().subtract(subDays ? 1 : 0, 'months').format('MM-YYYY')}`
                break;
            case 'years':
                return `${Moment().subtract(subDays ? 1 : 0, 'years').format('YYYY')}`
                break;
        }
    }

    renderServiceRevenuePieChart = () => {
        //const { service1, service2 } = this.state;
        const service1 = this.props.byService.previous
        const service2 = this.props.byService.now

        const sumAllPrevious = _.sumBy(service1, 'revenue')
        const sumAllNow = _.sumBy(service2, 'revenue')
        var lesSumAllPrevious = sumAllPrevious
        var lesSumAllNow = sumAllNow
        return (
            <View>
                {_.isEmpty(service1) ?
                    <View style={{ height: 50, justifyContent: 'center' }}>
                        <Text>Chưa có doanh thu cho {this.renderDay(this.state.serviceRevenue, true)}</Text>
                    </View>
                    : <View>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    selectedTypeService: service1
                                }, () => {
                                    this._toggleServiceDetail()
                                    console.log('onPress', this.state)
                                })
                            }}
                        >
                            <PieChart
                                data={_.map(service1.slice(0, 7), function (item, index) {

                                    if (index == 6)
                                        return {
                                            'name': 'Còn lại',
                                            'revenue': lesSumAllPrevious,
                                            ...serviceColor[index]
                                        }
                                    lesSumAllPrevious -= item.revenue
                                    return { ...item, ...serviceColor[index] }
                                })}
                                width={Layout.window.width * 0.85} // from react-native
                                height={220}
                                chartConfig={{
                                    backgroundColor: Colors.lightBg,
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(45, 92, 129, ${opacity})`,
                                }}
                                bezier
                                style={{
                                    marginBottom: -8,
                                }}
                                accessor="revenue"
                                backgroundColor="transparent"
                                paddingLeft="15"
                            />
                        </TouchableOpacity>
                        <View style={[styles.displayInlineBlock, { marginBottom: 8, justifyContent: 'space-around' }]}>
                            <Text >{this.renderDay(this.state.serviceRevenue, true)}</Text>
                            <Text style={{ fontWeight: 'bold', color: Colors.functionColorDark }}>{numeral(sumAllPrevious).format('0,0')} đ</Text>
                        </View>
                    </View>}
                {_.isEmpty(service2) ?
                    <View style={{ height: 50, justifyContent: 'center' }}>
                        <Text>Chưa có doanh thu cho {this.renderDay(this.state.serviceRevenue, false)}</Text>
                    </View> :
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    selectedTypeService: service2
                                }, () => {
                                    this._toggleServiceDetail()
                                    console.log('onPress', this.state)
                                })
                            }}
                        >
                            <PieChart
                                data={_.map(service2.slice(0, 7), function (item, index) {
                                    if (index == 6)
                                        return {
                                            'name': 'Còn lại',
                                            'revenue': lesSumAllNow,
                                            ...serviceColor[index]
                                        }
                                    lesSumAllNow -= item.revenue
                                    return { ...item, ...serviceColor[index] }
                                })}
                                width={Layout.window.width * 0.85} // from react-native
                                height={220}
                                chartConfig={{
                                    backgroundColor: Colors.lightBg,
                                    decimalPlaces: 2, // optional, defaults to 2dp
                                    color: (opacity = 1) => `rgba(45, 92, 129, ${opacity})`,
                                }}
                                bezier
                                style={{
                                    marginBottom: -8,
                                }}
                                accessor="revenue"
                                backgroundColor="transparent"
                                paddingLeft="15"
                            />
                        </TouchableOpacity>
                        <View style={[styles.displayInlineBlock, { marginBottom: 8, justifyContent: 'space-around' }]}>
                            <Text >{this.renderDay(this.state.serviceRevenue, false)}</Text>
                            <Text style={{ fontWeight: 'bold', color: Colors.functionColorDark }}>{numeral(sumAllNow).format('0,0')}  đ</Text>
                        </View>
                    </View>}
            </View>
        )
    }

    render() {
        console.log(this.state)
        const { dropDownStores, employees, openSwithStore, checkStoreId } = this.state;
        const displayName = ''
        const storeList = [
            { 'displayName': 'Tất cả cửa hàng' },
            ...get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')
        ]
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                {!this.user.isManager ?
                    <TouchableWithoutFeedback
                        onPress={this._toggleDropdownStore}>
                        <View style={[styles.dropDownStores]}>
                            <Text style={{
                                color: Colors.functionColorDark, fontWeight: 'bold',
                                fontSize: FontStyle.mdText, textAlign: 'center',
                                maxWidth: '90%'
                            }} numberOfLines={1} ellipsizeMode={'tail'}>{storeList[checkStoreId].displayName}</Text>
                            <FontAwesome5 name={'sort-down'} color={Colors.functionColorDark} size={FontStyle.mdText} style={{ marginTop: -5, marginLeft: 5 }} />
                        </View>
                    </TouchableWithoutFeedback>
                    :
                    <View style={[styles.dropDownStores]}>
                        <Text style={{
                            color: Colors.functionColorDark, fontWeight: 'bold',
                            fontSize: FontStyle.mdText, textAlign: 'center',
                            maxWidth: '90%'
                        }} numberOfLines={1} ellipsizeMode={'tail'}>{this.store.displayName}</Text>
                    </View>
                }
                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    {!this.props.totalLoading.isLoading && <Wrapper
                        topAreaComponent={this.renderTopAreaTotalRevenueComponent()}>
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Tổng doanh thu</Text>
                            <Text style={{ fontSize: FontStyle.bigText, fontFamily: FontStyle.mainFont, color: Colors.functionColorDark, fontWeight: 'bold' }}>{numeral(this.props.byTotal.total).format('0,0')} đ</Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { justifyContent: 'center' }]}>
                            <View style={[{ alignItems: 'center', margin: 20 }]}>
                                <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Tiền mặt</Text>
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorDark, fontWeight: 'bold' }}>{numeral(this.props.byTotal.byMoney).format('0,0')} đ</Text>
                            </View>
                            <View style={[{ alignItems: 'center', margin: 20 }]}>
                                <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Chuyển khoản</Text>
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorDark, fontWeight: 'bold' }}>{numeral(this.props.byTotal.byTranfer).format('0,0')} đ</Text>
                            </View>
                        </View>
                    </Wrapper>}
                    {!this.props.compareLoading.isLoading && <Wrapper
                        topAreaComponent={this.renderTopAreaCompareRevenueComponent()}>
                        <View style={{ alignItems: 'flex-end', padding: 10 }}>
                            <Text style={{ fontSize: FontStyle.smallText }}>({this.renderDay(this.state.compareRevenue, true)}) -> ({this.renderDay(this.state.compareRevenue, false)})</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            {this.renderCompareRevenueBarChart()}
                        </View>
                    </Wrapper>}
                    {!this.props.employeeLoading.isLoading && <Wrapper
                        topAreaComponent={this.renderTopAreaEmployeeRevenueComponent()}>
                        <View style={{ alignItems: 'center' }}>
                            {_.isEmpty(this.props.byEmployee) ?
                                <View style={{ height: 50, justifyContent: 'center' }}>
                                    <Text>Chưa có doanh thu</Text>
                                </View>
                                : <FlatList showsVerticalScrollIndicator={false}
                                    data={this.props.byEmployee}
                                    numColumns={1}
                                    // contentContainerStyle={styles.messageBlock}
                                    renderItem={({ item, index }) =>
                                        <EmployeeRecord
                                            title={`${String(item.name).replace(/null/g, '')}`}
                                            content={item.position}
                                            price={`${numeral(item.revenue).format('0,0')} đ`}
                                            recordStyle={index == employees.length - 1 ? { borderBottomColor: Colors.transparent, borderBottomWidth: 0 } : null}
                                        />
                                    }
                                    keyExtractor={(item, index) => `${index}`}
                                />
                            }
                        </View>
                    </Wrapper>}
                    {!this.props.serviceLoading.isLoading && <Wrapper
                        containerStyle={{ marginBottom: 20 }}
                        topAreaComponent={this.renderTopAreaServiceRevenueComponent()}>
                        <View style={{ alignItems: 'center' }}>
                            {this.renderServiceRevenuePieChart()}
                        </View>
                    </Wrapper>}
                </ScrollView>
                <Modal isVisible={openSwithStore}
                    backdropColor={Colors.transparent}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleDropdownStore}
                    style={styles.dropdownBlock}>
                    <FlatList showsVerticalScrollIndicator={false}
                        data={storeList}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        numColumns={1}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity style={[styles.displayInlineBlock, styles.storeRecord, { justifyContent: 'space-between', alignItems: 'center' }]} onPress={() => {
                                this._toggleDropdownStore();
                                this.onSelectStore(index)
                            }}>
                                <View style={{ width: '80%' }}>
                                    <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                                    <Text style={styles.address} numberOfLines={1} ellipsizeMode={'tail'}>{item.address}</Text>
                                </View>
                                {(index === checkStoreId) && <MaterialIcons name={'check-circle'} size={17} color={Colors.functionColorDark} />}
                            </TouchableOpacity>
                        }
                        keyExtractor={(item, index) => `${index}`}
                    />
                </Modal>
                <Modal
                    isVisible={this.state.openServiceDetail}
                    backdropColor={Colors.darkBlur}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    swipeToClose
                    onBackdropPress={this._toggleServiceDetail}
                    style={styles.dropdownBlock}>
                    <MainHeader
                        backgroundColor={Colors.lightBg}
                        centerComponent={'Dịch vụ'}
                        rightComponent={
                            <MaterialIcon name={'close'} color={'red'} size={20} />
                        }
                        rightPress={this._toggleServiceDetail}
                        containerStyle={{ marginTop: -15, marginBottom: 20, marginLeft: 0, height: 50, width: '100%' }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: Layout.window.height * 0.65 }}>
                        <FlatList showsVerticalScrollIndicator={false}
                            data={this.state.selectedTypeService}
                            numColumns={1}
                            renderItem={({ item, index }) =>
                                <View style={[styles.displayInlineBlock, styles.storeRecord, { width: '90%', marginLeft: '5%', justifyContent: 'space-between', alignItems: 'center' }]}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.address}>{item.revenue}</Text>
                                </View>
                            }
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </ScrollView>
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
    leftTitle: {
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        fontSize: FontStyle.smallText,
        color: Colors.dark1
    },
    toDayBlock: {
        width: '70%',
        height: 40,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    dropdownBlock: {
        position: 'absolute',
        top: 100,
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
    storeRecord: {
        width: '100%',
        height: 50,
        borderBottomColor: Colors.secondaryColor,
        borderBottomWidth: 1
    },
    name: {
        fontSize: FontStyle.smallText,
        color: Colors.functionColorDark,
        maxWidth: '90%',
        marginVertical: 3,
    },
    address: {
        fontSize: FontStyle.smallText,
        color: Colors.functionColorLight,
        maxWidth: '90%'
    },
    checkStore: {
        position: 'absolute',
        right: 10,
        top: 15
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfStatiticReducers],
        totalLoading: {
            ...state[nameOfLoadingReducers][
            statisticActions.STATISTIC_BY_TOTAL
            ]
        },
        compareLoading: {
            ...state[nameOfLoadingReducers][
            statisticActions.STATISTIC_BY_COMPARE
            ]
        },
        employeeLoading: {
            ...state[nameOfLoadingReducers][
            statisticActions.STATISTIC_BY_EMPLOYEE
            ]
        },
        serviceLoading: {
            ...state[nameOfLoadingReducers][
            statisticActions.STATISTIC_BY_SERVICE
            ]
        },
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(statisticActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatisticalTab)
