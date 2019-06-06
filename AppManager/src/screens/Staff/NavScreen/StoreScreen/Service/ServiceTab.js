import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Image,
    ScrollView,
    TouchableOpacity,
    Text,
    RefreshControl,
    AsyncStorage
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { Card10, Loading, Notification, PopUpSelectService, Card8, CustomButtonGradient } from '../../../../../components/react-native-teso';
import NavigationService from '../../../../../navigation/NavigationService';

import * as storeService from '../../../../../sagas/storeService'
import { nameOfStoreDetailReducers, nameOfServiceReducers, nameOfLoadingReducers, nameOfDetailOrderReducers } from '../../../../../reducers';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { serviceActions, optionActions, orderActions } from '../../../../../actions/index';
import { connect } from 'react-redux';
import { serviceChildActions } from '../../../../../actions';
import _ from 'lodash'

class ServiceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceData: [],
            refreshing: false,
            isVisiblePopupOrder: false
        };
    }

    componentDidMount = () => {
        this._onRefresh();
    }

    _onRefresh = () => {
        const data = {
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            callback: () => {
                console.log(this.props, this.state)
                this.setState({
                    serviceData: [...this.props.serviceData],
                })
            }
        }
        this.props.actions.fetchServiceRequest(data);
    }

    getServiceChilds(id, displayName) {
        const data = {
            serviceId: id,
            displayName: displayName
        }
        storeService.dispatch(serviceChildActions.setServiceChild(data))
        NavigationService.navigate('ServiceChilds');
    }

    _togglePopupOrder = () => {
        this.setState({ isVisiblePopupOrder: !this.state.isVisiblePopupOrder });
    }

    render() {
        const { serviceData } = this.props;

        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <View style={styles.container}>
                {serviceData.length <= 0 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>Cửa hàng này chưa có dịch vụ nào.</Text>
                        <Text style={styles.text}>Hãy liên hệ quản lý</Text>
                        <Text style={styles.text}>để tạo dịch vụ cho cửa hàng nhé!</Text>
                    </View>
                }
                {serviceData.length >= 1 &&
                    <FlatList showsVerticalScrollIndicator={false}
                        numColumns={3}
                        data={_.filter(serviceData, function (item) {
                            return (Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0)
                        })}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isLoading}
                                onRefresh={this._onRefresh}
                            />
                        }
                        style={{ backgroundColor: Colors.bg, height: '100%', marginLeft: Layout.window.width * 0.015 }}
                        renderItem={({ item }) => {
                            return <Card10
                                nonChild={_.findIndex(this.props.detail.service, function (serviceItem) {
                                    return serviceItem.id === item.id
                                }) === -1}
                                onPress={() => this.getServiceChilds(item.id, item.displayName)} url={item.thumbnail} title={item.displayName}
                            />
                        }}
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
                                            storeService.dispatch(orderActions.removeServiceChild({
                                                'id': item.id
                                            }))
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
                                        removeIcon
                                        icon={!item.done}
                                        modelStyle={{ alignSelf: 'center' }}
                                        addPress={() => {
                                            storeService.dispatch(orderActions.removePromotion({
                                                'newPromotion': { 'id': item.id }
                                            }))
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
        backgroundColor: Colors.bg,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    addService: {
        width: Layout.window.width * 0.25,
        height: Layout.window.width * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        backgroundColor: Colors.lightBg
    },
    serviceCard: {
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        marginLeft: Layout.window.width * 0.035,
        marginRight: Layout.window.width * 0.035,
        marginTop: 10,
        marginBottom: Layout.window.width * 0.07,
        position: 'relative',
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
        ...state[nameOfServiceReducers],
        ...state[nameOfDetailOrderReducers],
        ...state[nameOfLoadingReducers][serviceActions.FETCH_SERVICE]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(serviceActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceTab)
