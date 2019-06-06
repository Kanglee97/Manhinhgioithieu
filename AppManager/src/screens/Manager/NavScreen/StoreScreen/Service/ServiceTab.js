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
    SafeAreaView
} from 'react-native';
import { nameOfStoreDetailReducers, nameOfServiceReducers, nameOfLoadingReducers, nameOfAccountPackageReducers, nameOfProfileReducers } from '../../../../../reducers';
import { Card10, Loading, ButtonGradient, MaterialIcon, PopUpRemind } from '../../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { serviceActions, optionActions } from '../../../../../actions/index';
import NavigationService from '../../../../../navigation/NavigationService';
import * as storeService from '../../../../../sagas/storeService'
import { serviceChildActions } from '../../../../../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _, { get } from 'lodash'

class ServiceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceData: [],
            refreshing: false,
            numberOfServiceChild: 0,
            numberOfState: 0,
            isVisibleUpgradeService: false,
        };
        this.user = get(storeService.getSpecificState(nameOfProfileReducers), 'user');
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        this._onRefresh();
        this.getBanned();
    }

    getBanned = () => {
        this.setState({
            numberOfServiceChild: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentPackage.designLimit'),
            numberOfState: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentState.designCount')
        })
    }

    _toggleLimitPopup = () => {
        this.setState({
            isVisibleUpgradeService: !this.state.isVisibleUpgradeService
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.serviceData === this.props.serviceData)
            return
        this.setState({
            serviceData: _.concat({ id: '0' }, this.props.serviceData)
        })
    }

    _onRefresh = () => {
        const data = {
            'storeId': this.user.isManager ? this.user.storeId : get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            callback: () => {
                console.log(this.props, this.state)
                this.setState({
                    serviceData: _.concat({ id: '0' }, this.props.serviceData)
                })
            }
        }
        this.props.actions.fetchServiceRequest(data);
    }

    getServiceChilds(id, displayName, thumbnail) {
        const data = {
            'serviceId': id,
            'displayName': displayName,
            'thumbnail': thumbnail
        }
        storeService.dispatch(serviceChildActions.setServiceChild(data))
        NavigationService.navigate('ServiceChilds', {
            onGoBack: () => {
                console.log('onGoBack')
                this._onRefresh()
            }
        });
    }

    render() {
        let { serviceData, numberOfState } = this.state
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                {serviceData.length <= 1 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>{'Bạn chưa có dịch vụ nào.'}</Text>
                        <Text style={styles.text}>{'Hãy tạo dịch vụ cho cửa hàng của mình nhé!'}</Text>
                        <View style={{ marginTop: 30 }}>
                            <ButtonGradient
                                content={'Tạo dịch vụ'}
                                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                                onPress={() =>
                                    NavigationService.navigate('CreateService', {
                                        onGoBack: () => {
                                            console.log('onGoBack')
                                            this._onRefresh();
                                        }
                                    })

                                }
                            />
                        </View>
                    </View>
                }
                {serviceData.length > 1 &&
                    <FlatList showsVerticalScrollIndicator={false}
                        numColumns={3}
                        data={_.concat({ id: 0 }, this.props.serviceData)}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh}
                            />
                        }
                        style={{ backgroundColor: Colors.bg, height: '100%', marginLeft: Layout.window.width * 0.015, marginTop: 10 }}
                        renderItem={({ item, index }) => {
                            return (!item.displayName && !item.thumbnail ?
                                (<View style={styles.serviceCard}>
                                    <TouchableOpacity style={styles.addService}
                                        onPress={() => {
                                            if (this.state.numberOfServiceChild <= this.state.numberOfState)
                                                this._toggleLimitPopup()
                                            else
                                                NavigationService.navigate('CreateService', {
                                                    onGoBack: () => {
                                                        console.log('onGoBack')
                                                        this._onRefresh();
                                                    }
                                                })
                                        }}>
                                        <MaterialIcon name={'add-to-photos'} size={30} color={Colors.functionColorDark} />
                                        <Text style={{ color: Colors.functionColorLight, fontSize: FontStyle.smallText, marginTop: 3, fontFamily: FontStyle.mainFont, textAlign: 'center' }}>Thêm dịch vụ</Text>
                                    </TouchableOpacity>
                                </View>) :
                                (<Card10
                                    onPress={() => this.getServiceChilds(item.id, item.displayName, item.thumbnail)}
                                    url={item.thumbnail}
                                    title={item.displayName}
                                    nonChild={(Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0)}
                                />))
                        }}
                        keyExtractor={(item, index) => `${index}`}
                    />}
                <PopUpRemind
                    isVisibleUpgradeStore={this.state.isVisibleUpgradeService}
                    onBackdropPress={this._toggleLimitPopup}
                    limitContent={`Bạn đã tạo ${numberOfState} dịch vụ và đã đạt giói hạn tạo thêm dịch vụ, hãy nâng cấp tài khoản để được sử dụng nhiều dịch vụ hơn!`}
                    onPressNo={this._toggleLimitPopup}
                    onPressOk={() => {
                        this._toggleLimitPopup();
                        NavigationService.navigate('UpgradeAccount');
                    }}
                />
            </SafeAreaView>
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
        marginHorizontal: Layout.window.width * 0.035,
        marginBottom: Layout.window.width * 0.07,
        position: 'relative',
        marginTop: 5,
    },
    img: {
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        borderRadius: 5,
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
        ...state[nameOfLoadingReducers][serviceActions.FETCH_SERVICE],
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(serviceActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceTab)
