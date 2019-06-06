import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader, MaterialIcon, PopUpRemind } from '../../../../components/react-native-teso';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import StoreTabNavigator from '../../../../navigation/Manager/StoreTabNavigator';
import { nameOfStoreDetailReducers, nameOfProfileReducers, nameOfLoadingReducers, nameOfAccountPackageReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { storeDetailActions, serviceActions, profileActions, discountActions, employeeActions, orderActions } from '../../../../actions/index';
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'
import NavigationService from '../../../../navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';
import { get } from 'lodash'

class StoreScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            storeId: '',
            ownerId: null,
            openSwithStore: false,
            user: null,
            storeList: [],
            load1: false,
            welcome: true,
            key: '1',
            serverToken: '',
            refreshing: false,
            storeLimit: 0,
            numberOfState: 0,
            isVisibleUpgradeStore: false,
            displayName: '',
            address: ''
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = async () => {
        const { navigation } = this.props;
        console.log('store screen did mount props', this.props)
        await this.setState({ serverToken: this.props.facebookToken || this.props.googleToken || this.props.phoneToken });
        this.setState({
            storeId: this.props.storeId,
            displayName: this.props.data.displayName || '',
            address: this.props.data.address || ''
        })
        this.getBanned()
    }

    getBanned = () => {
        this.setState({
            storeLimit: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentPackage.storeLimit'),
            numberOfState: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentState.storeCount')
        })
    }

    _toggleLimitPopup = () => { this.setState({ isVisibleUpgradeStore: !this.state.isVisibleUpgradeStore }) }

    redirectCreateStoreScreen() {
        console.log('create store', this.props)
        return NavigationService.navigate('CreateStore', {
            ownerId: this.props.user.id,
            back: true
        });
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        const data = {
            'token': this.state.serverToken,
            callback: () => {
                console.log(this.props, this.props.storeList, this.props.storeList.length)
                if (this.props.storeList.length != 0) {
                    this.setState({
                        storeList: [...this.props.storeList],
                        refreshing: false
                    })
                }
            }
        }
        this.props.actions.fetchProfileWithTokenRequest(data)
    }

    onSelectStore = async (storeId, displayName, address) => {
        if (storeId != this.props.storeId) {
            this.props.actions.clearStore()
            storeService.dispatch(employeeActions.clearEmployee())
        }
        const data = {
            'storeId': storeId,
            'displayName': displayName,
            'address': address,
        }
        await storeService.dispatch(storeDetailActions.saveStoreDetail(data))
        this.loadData()
    }

    loadData = () => {
        const data = {
            'storeId': this.props.storeId,
        }
        // this.props.actions.fetchStoreDetailRequest(data)
        storeService.dispatch(serviceActions.fetchServiceRequest(data))
        storeService.dispatch(discountActions.fetchDiscountRequest(data))
        storeService.dispatch(employeeActions.fetchAllEmployeeRequest(data))
        storeService.dispatch(orderActions.clearDetailOrder())
    }

    _toggleDropdownStore = () => this.setState({ openSwithStore: !this.state.openSwithStore });

    render() {
        const { storeId, displayName, address } = this.state;
        const { storeList, user } = this.props;
        const { openSwithStore, isVisibleUpgradeStore, numberOfState } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    centerComponent={
                        user.isManager ? displayName :
                            <View style={styles.displayInlineBlock}>
                                <Text style={{
                                    color: Colors.functionColorDark, fontWeight: 'bold',
                                    fontSize: FontStyle.bigText, textAlign: 'center',
                                    maxWidth: '90%'
                                }} numberOfLines={1} ellipsizeMode={'tail'}>{this.props.data.displayName}</Text>
                                <FontAwesome5 name={'sort-down'} color={Colors.functionColorDark} size={FontStyle.mdText} style={{ marginTop: 2.5, marginLeft: 5 }} />
                            </View>
                    }
                    centerPress={!user.isManager && this._toggleDropdownStore}
                    rightComponent={!user.isManager && <MaterialIcon button name={'create'} size={20} color={Colors.functionColorDark} />}
                    rightPress={!user.isManager && (() => NavigationService.navigate('EditStore', { onGoBack: () => { } }))}
                />
                <StoreTabNavigator ref={nav => {
                    this.navigator = nav;
                }} />
                <Modal isVisible={openSwithStore}
                    backdropColor={Colors.transparent}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleDropdownStore}
                    style={styles.dropdownBlock}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: Layout.window.height * 0.4 }}>
                        <FlatList showsVerticalScrollIndicator={false}
                            data={storeList}
                            numColumns={1}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    style={[styles.displayInlineBlock, styles.storeRecord, { justifyContent: 'space-between', alignItems: 'center' }]}
                                    onPress={() => {
                                        this._toggleDropdownStore();
                                        this.onSelectStore(item.id, item.displayName, item.address)
                                    }}>
                                    <View style={{ width: '80%' }}>
                                        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                                        <Text style={styles.address} numberOfLines={1} ellipsizeMode={'tail'}>{item.address}</Text>
                                    </View>
                                    {(item.id === this.props.storeId) && <MaterialIcon name={'check-circle'} size={15} color={Colors.functionColorDark} />}
                                </TouchableOpacity>
                            }
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </ScrollView>
                    <TouchableOpacity style={[styles.displayInlineBlock, styles.createBtn]} onPress={() => {
                        if (this.state.storeLimit <= this.state.numberOfState) {
                            this._toggleDropdownStore()
                            setTimeout(() => {
                                this._toggleLimitPopup()
                            }, 375);
                        }
                        else
                            this.redirectCreateStoreScreen()
                    }}>
                        <MaterialIcon name={'add-circle-outline'} size={16} color={Colors.functionColorDark} />
                        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorLight, fontWeight: 'bold' }}>  Tạo cửa hàng mới</Text>
                    </TouchableOpacity>
                </Modal>
                <PopUpRemind
                    isVisibleUpgradeStore={isVisibleUpgradeStore}
                    onBackdropPress={this._toggleLimitPopup}
                    limitContent={`Bạn đã tạo ${numberOfState} cửa hàng và đã đạt giói hạn tạo thêm chi nhánh, hãy nâng cấp tài khoản để được sử dụng nhiều dịch vụ hơn!`}
                    onPressNo={this._toggleLimitPopup}
                    onPressOk={() => {
                        this._toggleLimitPopup();
                        NavigationService.navigate('UpgradeAccount');
                    }}
                />
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightBg,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
    },
    marginTop10: {
        marginTop: 10
    },
    scene: {
        flex: 1,
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
    createBtn: {
        height: 50,
        width: '100%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.functionColorDark,
        borderRadius: 5,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedBackBlock: {
        position: 'absolute',
        top: '35%',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderRadius: 10,
        padding: 15,
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
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfStoreDetailReducers],
        ...state[nameOfProfileReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...storeDetailActions, ...profileActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreScreen)