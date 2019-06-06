import React from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Platform,
    FlatList,
    StatusBar,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import Modal from 'react-native-modal';

import { connect } from 'react-redux'
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import _, { get } from 'lodash'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BarChart, PieChart } from 'react-native-chart-kit';

import Moment from 'moment'
import numeral from 'numeral';
import * as storeService from '../../../../sagas/storeService'
import { nameOfStatiticReducers, nameOfProfileReducers } from '../../../../reducers'
import { statisticActions } from '../../../../actions'
import { bindActionCreators } from 'redux';
import { MainHeader, Wrapper, FormInput } from '../../../../components/react-native-teso/index';

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


class AccountStatiticScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            openServiceDetail: false,
            selectedTypeService: [],
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
            totalRevenue: null,
            compareRevenue: null,
            employeeRevenue: null,
            serviceRevenue: null,

        };
    }

    componentDidMount() {
        this.setState({
            totalRevenue: 'Hôm nay',
            serviceRevenue: 'Hôm nay',
        }, () => {
            this.loadData()
        })

    }

    loadData = () => {
        this.loadDataTotal()
        this.loadDataService()
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

    _toggleServiceDetail = () => this.setState({ openServiceDetail: !this.state.openServiceDetail })

    loadDataTotal = () => {
        this.props.actions.statiticByTotalOfEmployeeRequest({
            'user': {
                'id': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
                'type': this.filterType(this.state.totalRevenue)
            }
        })
    }


    loadDataService = () => {
        this.props.actions.statiticByServiceOfEmployeeRequest({
            'user': {
                'id': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
                'type': this.filterType(this.state.serviceRevenue)
            }
        })
    }

    renderTopAreaTotalRevenueComponent() {
        const { toDayList } = this.state;
        return (
            <View style={[styles.displayInlineBlock]}>
                <View style={styles.toDayBlock}>
                    <Text style={styles.leftTitle}>08/10/2018</Text>
                </View>
                <View style={{ width: '30%' }}>
                    <FormInput
                        dropDown
                        data={toDayList}
                        value={toDayList[0].title}
                        valueExtractor={({ title }) => title}
                        onChangeText={(value) => {
                            this.setState({ totalRevenue: value }, () => {
                                this.loadDataTotal()
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
        const { toDayList } = this.state;
        return (
            <View style={[styles.displayInlineBlock]}>
                <View style={styles.toDayBlock}>
                    <Text style={styles.leftTitle}>Doanh thu theo dịch vụ</Text>
                </View>
                <View style={{ width: '30%' }}>
                    <FormInput
                        dropDown
                        data={toDayList}
                        value={toDayList[0].title}
                        valueExtractor={({ title }) => title}
                        onChangeText={(value) => {
                            this.setState({ serviceRevenue: value }, () => {
                                this.loadDataService()
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
        return (
            <SafeAreaView style={styles.container}>
                        <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => this.props.navigation.goBack()}
                    centerComponent={'Thống kê'}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    <Wrapper
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
                    </Wrapper>
                    <Wrapper
                        containerStyle={{ marginBottom: 20 }}
                        topAreaComponent={this.renderTopAreaServiceRevenueComponent()}>
                        <View style={{ alignItems: 'center' }}>
                            {this.renderServiceRevenuePieChart()}
                        </View>
                    </Wrapper>
                </ScrollView>

                <Modal
                    isVisible={this.state.openServiceDetail}
                    backdropColor={Colors.transparent}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    swipeToClose
                    onBackdropPress={this._toggleServiceDetail}
                    style={styles.dropdownBlock}>
                    <SafeAreaView>
                        <MainHeader
                            backgroundColor={Colors.lightBg}
                            centerComponent={'Dịch vụ'}
                            rightComponent={
                                <FontAwesome name={'close'} color={'red'} size={20} />
                            }
                            rightPress={this._toggleServiceDetail}
                        />
                        <FlatList showsVerticalScrollIndicator={false}
                            data={this.state.selectedTypeService}
                            numColumns={1}
                            renderItem={({ item, index }) =>
                                <View style={[styles.displayInlineBlock, styles.storeRecord, { width: '90%', justifyContent: 'space-between' }]}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.address}>{item.revenue}</Text>
                                </View>
                            }
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </SafeAreaView>
                </Modal>
            </SafeAreaView>
        )
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
        backgroundColor: Colors.lightBg,
        width: Layout.window.width,
        alignItems: 'center'
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
        top: 30,
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
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
        ...state[nameOfStatiticReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(statisticActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountStatiticScreen)