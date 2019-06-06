import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
    RefreshControl
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { UserAvatar, ButtonGradient, ButtonOutline, Loading, PopUpConfirm, ImageProgress } from '../../../../components/react-native-teso';
import NavigationService from '../../../../navigation/NavigationService';

import { nameOfMessengerReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers'
import { messengerActions } from '../../../../actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'
import _, { get } from 'lodash'

class BreakScheduleTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            discountData: [],
            seletedItem: {},
            refreshing: false,
            popUpAcceptVisible: false,
            popUpCancelVisible: false,
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        this._onRefresh()
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        const data = {
            'userId': get(storeService.getSpecificState(nameOfProfileReducers).user, 'id'),
            callback: () => {
                console.log(this.props, this.state)
                this.setState({
                    refreshing: false
                })
            }
        }
        this.props.actions.getAbsentformManagerRequest(data)
    }

    _toggleAcceptPopup = () => this.setState({ popUpAcceptVisible: !this.state.popUpAcceptVisible });

    _toggleCancelPopup = () => this.setState({ popUpCancelVisible: !this.state.popUpCancelVisible });

    renderItem = ({ item, index }) => {
        console.log(item, item.isAccept === null, item.isAccept)
        return (
            <View style={styles.itemContainer}>

                <View style={styles.itemBody}>
                    <View style={styles.itemBodyWrapper}>
                        <View style={styles.itemImageContainer}>
                            <UserAvatar source={{ uri: `${item.avatar}` }} size={60} />
                        </View>
                        <View style={styles.itemInfo}>
                            <View style={styles.itemNameContainer}>
                                <Text style={[styles.textBold, { marginRight: 5 }]}>
                                    Name
                                </Text>
                                <Text style={styles.text}>
                                    {item.empName}
                                </Text>
                            </View>
                            <Text style={styles.text}>
                                Ngày bắt đầu nghỉ: {item.startDate}
                            </Text>
                            <Text style={styles.text}>
                                Ngày kết thúc nghỉ: {item.endDate}
                            </Text>
                            <Text style={styles.textBold}>
                                Lí do: {item.leaveReason}
                            </Text>
                            <Text style={[styles.text, { colors: (item.isAccept == 'ACCEPT' ? 'green' : item.isAccept == 'DISACCEPT' ? 'red' : 'black') }]}>
                                {(item.isAccept == 'ACCEPT' ? 'Bạn đã đồng ý' : item.isAccept == 'DISACCEPT' ? 'Bạn đã không đồng ý' : '')}
                            </Text>
                        </View>
                    </View>
                </View>
                {(item.isAccept == 'NOT_MODIFY') ? <View style={styles.itemFooter}>
                    <View />
                    <ButtonOutline
                        style={{ width: Layout.window.width * 0.25, }}
                        labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                        onPress={() => {
                            this.setState({
                                seletedItem: item
                            })
                            this._toggleCancelPopup()
                        }}
                        content='Từ Chối'
                    />
                    <View style={{ marginBottom: 10, }}>
                        <ButtonGradient
                            style={{ width: Layout.window.width * 0.25, justifyContent: 'center' }}
                            labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                            onPress={() => {
                                this.setState({
                                    seletedItem: item
                                })
                                this._toggleAcceptPopup()
                            }}
                            content='Đồng ý'
                        />
                    </View>
                    <View />
                </View> : (item.isAccept == 'true') ? <View style={{ height: 5, backgroundColor: 'green' }} /> : <View style={{ height: 5, backgroundColor: 'red' }} />}
            </View>
        )
    }

    reverseArray = (arr = []) => {
        if (_.isEmpty(arr))
            return []
        _.reverse(arr)
        return arr
    }

    render() {
        const { messengers } = this.props;
        console.log(this.props)
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <View style={styles.container}>
                {messengers.length < 1 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>Không có nhân viên xin nghỉ phép</Text>
                    </View>
                }
                {messengers.length >= 1 &&
                    <View style={styles.marginTop20}>
                        <FlatList showsVerticalScrollIndicator={false}
                            numColumns={1}
                            data={messengers}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                />
                            }
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </View>
                }
                <PopUpConfirm
                    approve
                    isVisible={this.state.popUpAcceptVisible}
                    modalText={'Bạn chắc chắn đồng ý?'}
                    confirmText={'Đồng ý yêu cầu'}
                    confirmPress={() => {
                        this._toggleAcceptPopup()
                        const data = {
                            'form': {
                                ...this.state.seletedItem,
                                'isAccept': true
                            },
                            callback: () => {
                                this._onRefresh()
                                this.setState({
                                    seletedItem: {}
                                })
                            }
                        }
                        this.props.actions.updateAbsentformRequest(data)
                    }}
                    confirmCancel={'Hủy bỏ'}
                    confirmCancelPress={this._toggleAcceptPopup}
                />
                <PopUpConfirm
                    isVisible={this.state.popUpCancelVisible}
                    modalText={'Bạn chắc chắn muốn huỷ bỏ?'}
                    confirmText={'Huỷ bỏ yêu cầu'}
                    confirmPress={() => {
                        this._toggleCancelPopup()
                        const data = {
                            'form': {
                                ...this.state.seletedItem,
                                'isAccept': false
                            },
                            callback: () => {
                                this._onRefresh()
                                this.setState({
                                    seletedItem: {}
                                })
                            }
                        }
                        this.props.actions.updateAbsentformRequest(data)
                    }}
                    confirmCancel={'Hủy bỏ'}
                    confirmCancelPress={this._toggleCancelPopup}
                />
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
        color: Colors.darkText,
        marginTop: 2,
        marginBottom: 2,
    },
    textBold: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
    },
    itemContainer: {
        width: Layout.window.width * 0.925,
        marginVertical: 10,
        marginLeft: Layout.window.width * 0.03,
        backgroundColor: Colors.lightBg,
        borderRadius: 10,

        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },
    itemBody: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    itemBodyWrapper: {
        paddingTop: 15,
        paddingBottom: 15,
        margin: 5,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
    itemImageContainer: {
        height: Layout.window.width * 0.25,
        width: '30%',
        alignItems: 'center'
    },
    image: {
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        borderRadius: Layout.window.width * 0.125,
    },
    itemInfo: {
        paddingLeft: 5,
        width: '70%',
        height: Layout.window.width * 0.25,
    },
    itemNameContainer: {
        flexDirection: 'row',
        marginBottom: 2,
        borderBottomWidth: 0.5,
    },
    itemFooter: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderTopWidth: 0.5,
        margin: 5,
        marginTop: 0,
        paddingTop: 15,
        marginBottom: -5
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfMessengerReducers],
        ...state[nameOfLoadingReducers][messengerActions.GET_ABSENTFORM_MANAGER]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(messengerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BreakScheduleTab)