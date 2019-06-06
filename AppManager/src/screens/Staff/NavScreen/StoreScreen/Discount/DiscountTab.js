import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
    RefreshControl
} from 'react-native';
import { nameOfDiscountReducers, nameOfStoreDetailReducers, nameOfLoadingReducers, nameOfDetailOrderReducers } from '../../../../../reducers/index';
import { Card7, AddItem, CustomButtonGradient, Loading, PopUpSelectService, Notification, Card8 } from '../../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import * as storeService from '../../../../../sagas/storeService'
import { discountActions } from '../../../../../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _, { get } from 'lodash'
import NavigationService from '../../../../../navigation/NavigationService';

class DiscountTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisiblePopupOrder: false,
            discountData:
                [
                    { id: 'k01', title: 'Sale 91%', users: '100', startDay: '02-01-2019', expiredDay: '10-01-2019', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                    { id: 'k02', title: 'Sale 91%', users: '100', startDay: '02-01-2019', expiredDay: '10-01-2019', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                ]
        };
    }

    componentDidMount = () => {
        this.loadData()
    }

    loadData() {
        const data = {
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId')
        }
        this.props.actions.fetchDiscountRequest(data)
    }


    _togglePopupOrder = () => {
        this.setState({ isVisiblePopupOrder: !this.state.isVisiblePopupOrder });
    }


    render() {
        const discountData = this.props.listDiscount
        console.log('DiscountTab render', discountData)
        return (
            <View style={styles.container}>
                {discountData.length <= 0 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>Cửa hàng này chưa có bất kỳ khuyến mãi nào.</Text>
                        <Text style={styles.text}>Hãy liên hệ quản lý</Text>
                        <Text style={styles.text}>để tạo khuyến mãi cho cửa hàng nhé!</Text>
                    </View>
                }
                {discountData.length >= 1 &&
                    <FlatList showsVerticalScrollIndicator={false}
                        numColumns={1}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isLoading}
                                onRefresh={this.loadData}
                            />
                        }
                        data={discountData}
                        renderItem={({ item }) =>
                            < Card7
                                onPress={() => {
                                    this.props.actions.setDiscountDetail({ 'discount': item })
                                    NavigationService.navigate('DiscountDetail')
                                }}
                                url={item.thumbnail}
                                style={styles.boxShadow}>
                                <Text style={{ fontWeight: 'bold', fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>{item.displayName}</Text>
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>Số người sử dụng: <Text style={{ color: Colors.darkText }}>{item.users || 0}</Text></Text>
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>Thời gian bắt đầu: <Text style={{ color: Colors.darkText }}>{item.startDate}</Text></Text>
                                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont }}>Thời gian kết thúc: <Text style={{ color: Colors.darkText }}>{item.endDate}</Text></Text>
                            </Card7>
                        }
                        keyExtractor={(item, index) => `${index}`}
                    />
                }
                <PopUpSelectService
                    isVisible={this.state.isVisiblePopupOrder}
                    onSwipe={() => this._togglePopupOrder()}
                    onlyList
                    swipeThreshold={50}
                    onClose={() => this._togglePopupOrder()}
                    bottomBlock={(!_.isEmpty(this.props.detail.service) || !_.isEmpty(this.props.detail.promotion)) &&
                        <View style={{ width: Layout.window.width, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 10 }}>
                            <CustomButtonGradient
                                width={130}
                                content={'Bắt đầu dịch vụ'}
                                onPress={() => {
                                    this._togglePopupOrder()
                                    NavigationService.navigate('Ordering')
                                }}
                            />
                        </View>
                    }>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ height: Layout.window.height * 0.6 }}>
                        {_.isEmpty(this.props.detail.service) && _.isEmpty(this.props.detail.promotion) &&
                            <View style={{ height: Layout.window.height * 0.5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'normal', color: Colors.darkText }}>Không có dịch vụ hay khuyến mãi được chọn</Text>
                            </View>}
                        {!_.isEmpty(this.props.detail.service) && <Text style={{ marginLeft: Layout.window.width * 0.0375, marginTop: 4, fontWeight: 'bold', color: Colors.darkText }}>
                            Dịch vụ được chọn
                        </Text>}
                        <FlatList showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                            data={this.props.detail.service}
                            renderItem={({ item, index }) => {
                                console.log('FlatList', item)
                                return (
                                    <Card8
                                        url={item.thumbnail[0]}//'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fu%E1%BB%91n%2Fkieu-toc-dep-2018-8.png?alt=media&token=3e458ddc-7ca3-48b7-9912-6d39de98a78d'}//item.thumbnail[0] || ''}
                                        title={item.displayName}
                                        price={item.price}
                                        icon={!item.done}
                                        removeIcon
                                        modelStyle={{ alignSelf: 'center' }}
                                        addPress={() => {
                                            this.props.actions.removeServiceChild({
                                                'id': item.id
                                            })
                                        }}
                                    />
                                )
                            }}
                        />
                        {!_.isEmpty(this.props.detail.promotion) && <Text style={{ marginLeft: Layout.window.width * 0.0375, marginTop: 4, fontWeight: 'bold', color: Colors.darkText }}>
                            Khuyến mãi được chọn
                        </Text>}
                        <FlatList showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                            data={this.props.detail.promotion}
                            renderItem={({ item, index }) => {
                                console.log('FlatList', item)
                                return (
                                    <Card8
                                        url={item.thumbnail}//'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fu%E1%BB%91n%2Fkieu-toc-dep-2018-8.png?alt=media&token=3e458ddc-7ca3-48b7-9912-6d39de98a78d'}//item.thumbnail[0] || ''}
                                        title={`[KHUYẾN MÃI] ${item.displayName}`}
                                        price={item.price}
                                        icon={!item.done}
                                        removeIcon
                                        modelStyle={{ alignSelf: 'center' }}
                                        addPress={() => {
                                            this.props.actions.removePromotion({
                                                'newPromotion': { 'id': item.id }
                                            })
                                        }}
                                    />
                                )
                            }}
                        />
                    </ScrollView>
                </PopUpSelectService>
                {!((_.isEmpty(this.props.detail.service)) && (_.isEmpty(this.props.detail.promotion))) && <Notification
                    notificationPress={this._togglePopupOrder}
                    number={!(_.isEmpty(this.props.detail.service)) ? this.props.detail.service.length : 0}
                    content='Dịch vụ được chọn'
                    label={'Bắt đầu dịch vụ'}
                    btnWidth={130}
                    style={{ translateY: !(_.isEmpty(this.props.detail.service)) ? 0 : 70 }}
                    onPress={() => NavigationService.navigate('Ordering')}
                />}
            </View>
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
    marginTop20: {
        marginTop: 20
    },
    boxShadow: {
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 10,
        elevation: 7,
    },
    noContainer: {
        backgroundColor: Colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    text: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfDiscountReducers],
        ...state[nameOfDetailOrderReducers],
        ...state[nameOfLoadingReducers][discountActions.FETCH_DISCOUNT]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(discountActions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DiscountTab)