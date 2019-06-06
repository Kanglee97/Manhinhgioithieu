import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    SectionList,
    StyleSheet,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { BookingCard, Loading, EmployeeCard, MaterialIcon, FloatingButton } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService';
import { bindActionCreators } from 'redux';
import { authActions, bookingActions } from '../../../../actions';
import {
    nameOfBookingReducers, nameOfLoadingReducers,
    nameOfProfileReducers, nameOfStoreDetailReducers
} from '../../../../reducers';
import { connect } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import * as storeService from '../../../../sagas/storeService'
import _, { get } from 'lodash';

class AppointmentTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBooking: [
                {
                    "userId": 12,
                    "cusName": "Phong",
                    "phone": "0123456789",
                    "gender": "Nam",
                    "status": "PROCESSING",
                    "bookDate": "13/12/2012",
                    "bookTime": "12/12/2013",
                    "guestCount": 2,
                    "note": "Bay màu",
                    "storeId": 1,
                    "empId": 1
                },
                {
                    "userId": 12,
                    "cusName": "Hiep",
                    "phone": "0123456789",
                    "gender": "Nam",
                    "status": "PROCESSING",
                    "bookDate": "12/12/2012",
                    "bookTime": "12/12/2013",
                    "guestCount": 2,
                    "note": "Bay màu",
                    "storeId": 1,
                    "empId": 1
                }
            ],
            dropDownStores: [],
            checkStoreId: 0,
            openSwithStore: false,
            openSwithEmployee: false,
        };
        this.loadData = this.loadData.bind(this)
        this._onRefresh = this._onRefresh.bind(this)
        this._toggleDropdownStore = this._toggleDropdownStore.bind(this)
        this.onSelectStore = this.onSelectStore.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.user = get(storeService.getSpecificState(nameOfProfileReducers), 'user')
        this.store = get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data')
    }

    componentDidMount = () => {
        this.loadData();
    }

    loadData = () => {
        var a;
        if (this.user.isManager) {
            a = [this.user.storeId]
        } else {
            this.props.actions.clearListBooking()
            a = (this.state.checkStoreId == 0) ?
                get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id) :
                [get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')[this.state.checkStoreId - 1].id]
        }
        const booking = { storeIds: a }
        this._onRefresh(booking)
    }

    _onRefresh = (booking) => {
        const data = {
            'booking': booking,
            callback: () => {
                console.log(this.props, this.state)
                this.setState({
                    listBooking: [...this.props.listBooking]
                })
            }
        }
        this.props.actions.getStoreBookingRequest(data);
    }

    _toggleDropdownStore = () => this.setState({ openSwithStore: !this.state.openSwithStore });

    onSelectStore = (storeId) => {
        this.setState({
            checkStoreId: storeId
        }, () =>
                this.loadData()
        )
    }

    renderItem = ({ item, index }) => {
        console.log(item)
        return (
            <BookingCard
                time={item.bookTime}
                title={`#${item.id} - ${item.cusName}`}
                status={item.status}
                content={item.guestCount}
                style={{
                    marginTop: 10,
                    alignSelf: 'center'
                }}
                onPress={() => NavigationService.navigate('AppointmentDetail', {
                    id: item.id,
                    callback: () => {
                        this.loadData()
                    }
                })}
            />
        )
    }

    render() {
        const { listBooking, openFunction, openSwithStore, openSwithEmployee, checkStoreId } = this.state;
        const displayName = ''
        const storeList = [
            { 'displayName': 'Tất cả cửa hàng' },
            ...get(storeService.getSpecificState(nameOfProfileReducers), 'storeList')
        ]
        console.log(this.props, this.state);
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
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: '100%' }}>
                    <View style={[styles.container]}>
                        {listBooking.length <= 0 &&
                            <View style={styles.noContainer}>
                                <Text>{'Không có bất kỳ lịch hẹn nào.'}</Text>
                            </View>
                        }
                        <SectionList
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => item + index}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.props.isLoading}
                                    onRefresh={() => {
                                        this.loadData()
                                    }}
                                />
                            }
                            renderItem={this.renderItem}
                            renderSectionHeader={({ section: { title } }) => (
                                <Text style={{ fontSize: FontStyle.mdText - 2, marginLeft: Layout.window.width * 0.05, marginVertical: 10, fontWeight: 'bold', color: Colors.darkText }}>{title}</Text>
                            )}
                            sections={_.reverse(_.sortBy(this.props.listBooking, ['title']))}
                        />
                    </View>
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
                <FloatingButton onPress={() => NavigationService.navigate('CreateBooking', {
                    onCallback: () => {
                        this.loadData()
                    }
                })} />
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    header: {
        height: 80,
    },
    userBlock: {
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
        width: '142%',
        height: '100%',
        marginLeft: '-33.5%',
        paddingLeft: Layout.window.width * 0.05,
        backgroundColor: Colors.transparent,
    },
    title: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    storeBlock: {
        width: Layout.window.width,
        alignItems: 'center',
    },
    body: {
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    noContainer: {
        height: '90%',
        backgroundColor: Colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
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
    dropdownBlock: {
        position: 'absolute',
        top: 90,
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
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfBookingReducers],
        ...state[nameOfLoadingReducers][
        bookingActions.GET_STORE_BOOKING
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...bookingActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentTab);
