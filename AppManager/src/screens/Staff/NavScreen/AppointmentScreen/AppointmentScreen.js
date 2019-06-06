import React, { Component } from 'react';
import {
    View, Text, SafeAreaView, SectionList, StyleSheet, FlatList, RefreshControl, TouchableOpacity
} from 'react-native';
import { BookingCard, Loading, EmployeeCard, MaterialIcon, FloatingButton, MainHeader } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService';
import { bindActionCreators } from 'redux';
import { authActions, bookingActions } from '../../../../actions';
import {
    nameOfBookingReducers, nameOfLoadingReducers,
    nameOfProfileReducers,
} from '../../../../reducers';
import { connect } from 'react-redux';
import * as storeService from '../../../../sagas/storeService'
import _, { get } from 'lodash';

class AppointmentScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBooking: [],
        };
    }

    componentDidMount = () => {
        this.loadData();
    }

    loadData = () => {
        this.props.actions.clearListBooking()
        let booking = {
            empIds: [get(storeService.getSpecificState(nameOfProfileReducers).user, 'id')]
        }
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
        this.props.actions.getEmployeesBookingRequest(data);
    }

    renderItem = ({ item, index }) => {
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
        const { listBooking } = this.state;
        console.log(this.props);
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    centerComponent={'Lịch hẹn'}
                    rightComponent={
                        <MaterialIcon button name={'sync'} size={25} color={Colors.functionColorDark} />
                    }
                    rightPress={() => this.loadData()}
                    containerStyle={{
                        borderBottomColor: Colors.lightGreyColor,
                        borderBottomWidth: 1,
                    }}
                />
                <View style={styles.container}>
                    {listBooking.length <= 0 &&
                        <View style={styles.noContainer}>
                            <Text style={[styles.text, { fontSize: FontStyle.mdText }]}>{'Không có bất kỳ lịch hẹn nào.'}</Text>
                        </View>
                    }
                    {listBooking.length > 0 &&
                        <Text style={[styles.title, { marginLeft: '5%' }]}>{'Lịch hẹn của bạn'}</Text>
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
                        sections={_.sortBy(this.props.listBooking, ['title'])}
                    />
                </View>
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
    title: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.smallText,
        fontFamily: FontStyle.mainFont,
        lineHeight: 20,
    },
    noContainer: {
        height: '100%',
        backgroundColor: Colors.lightBg,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfBookingReducers],
        ...state[nameOfLoadingReducers][
        bookingActions.GET_EMPLOYEES_BOOKING
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...bookingActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentScreen);
