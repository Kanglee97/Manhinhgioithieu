import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { AddItem, ButtonGradient, Card7, Loading, PopUpRemind } from '../../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../../navigation/NavigationService';
import _, { get } from 'lodash';
import numeral from 'numeral';
import { nameOfDiscountReducers, nameOfStoreDetailReducers, nameOfLoadingReducers, nameOfAccountPackageReducers, nameOfProfileReducers } from '../../../../../reducers'
import { bindActionCreators } from 'redux';
import { discountActions } from '../../../../../actions/index';
import { connect } from 'react-redux'
import * as storeService from '../..//../../../sagas/storeService'

class DiscountTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountData:
                [{ id: '0' },
                { id: 'k01', title: 'Sale 91%', users: '100', startDay: '02-01-2019', expiredDay: '10-01-2019', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { id: 'k02', title: 'Sale 91%', users: '100', startDay: '02-01-2019', expiredDay: '10-01-2019', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                ],
            refreshing: false,
            promotionLimit: 0,
            numberOfState: 0,
            isVisibleUpgradeDiscount: false,
        };
        this.getBanned = this.getBanned.bind(this)
        this._onRefresh = this._onRefresh.bind(this)
        this._toggleLimitPopup = this._toggleLimitPopup.bind(this)
        this.user = get(storeService.getSpecificState(nameOfProfileReducers), 'user');
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this._onRefresh()
    }

    getBanned = () => {
        this.setState({
            promotionLimit: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentPackage.promotionLimit'),
            numberOfState: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentState.promotionCount'),
        })
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        const data = {
            'storeId': this.user.isManager ? this.user.storeId : get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            callback: () => {
                console.log(this.props, this.state)
                this.setState({
                    refreshing: false
                })
            }
        }
        this.props.actions.fetchDiscountRequest(data);
    }

    _toggleLimitPopup = () => { this.setState({ isVisibleUpgradeDiscount: !this.state.isVisibleUpgradeDiscount }) }

    render() {
        const discountData = _.concat({ key: 0 }, this.props.listDiscount)
        console.log('DiscountTab render', discountData)
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <View style={styles.container}>
                {discountData.length <= 1 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>{'Bạn chưa có khuyến mãi nào.'}</Text>
                        <Text style={styles.text}>{'Hãy tạo khuyến mãi cho cửa hàng của mình nhé!'}</Text>
                        <View style={{ marginTop: 30 }}>
                            <ButtonGradient
                                onPress={() => NavigationService.navigate('CreateDiscount')}
                                content={'Tạo khuyến mãi'}
                                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                            />
                        </View>
                    </View>
                }
                {discountData.length > 1 &&
                    <FlatList showsVerticalScrollIndicator={false}
                        numColumns={1}
                        data={discountData}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        renderItem={({ item }) =>
                            !item.displayName ?
                                (<AddItem
                                    label={'Thêm khuyến mãi'}
                                    onPress={() => {
                                        if (this.state.promotionLimit <= this.state.numberOfState) {
                                            this._toggleLimitPopup()
                                            return;
                                        }
                                        NavigationService.navigate('CreateDiscount', {
                                            onCallBack: () => {
                                                this._onRefresh()
                                            }
                                        })
                                    }}
                                />)
                                :
                                (< Card7
                                    onPress={() => {
                                        this.props.actions.setDiscountDetail({ 'discount': item })
                                        NavigationService.navigate('DiscountDetail', {
                                            onCallBack: () => {
                                                this._onRefresh()
                                            }
                                        })
                                    }}
                                    url={item.thumbnail}
                                    style={styles.boxShadow}>
                                    <Text style={{ fontWeight: 'bold', fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorDark }}>{item.displayName}</Text>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>Giá: <Text style={{ color: Colors.functionColorDark }}>{numeral(item.price).format('0,0')} đ</Text></Text>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>Thời gian bắt đầu: <Text style={{ color: Colors.functionColorDark }}>{item.startDate}</Text></Text>
                                    <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>Thời gian kết thúc: <Text style={{ color: Colors.functionColorDark }}>{item.endDate}</Text></Text>
                                </Card7>)
                        }
                        keyExtractor={(item, index) => `${index}`}
                    />}
                <PopUpRemind
                    isVisibleUpgradeStore={this.state.isVisibleUpgradeDiscount}
                    onBackdropPress={this._toggleLimitPopup}
                    limitContent={
                        this.state.promotionLimit == 0 ?
                            'Bạn chưa thể tạo khuyến mãi với tài khoản này, hãy nâng cấp tài khoản để được sử dụng nhiều dịch vụ hơn!' :
                            `Bạn đã tạo ${this.state.numberOfState} khuyến mãi cho tháng này và đã đạt giới hạn tạo thêm khuyến mãi`
                    }
                    onPressNo={this._toggleLimitPopup}
                    onPressOk={() => {
                        this._toggleLimitPopup();
                        NavigationService.navigate('UpgradeAccount');
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: Colors.bg,
        height: '100%'
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
        ...state[nameOfLoadingReducers][discountActions.FETCH_DISCOUNT]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(discountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscountTab)