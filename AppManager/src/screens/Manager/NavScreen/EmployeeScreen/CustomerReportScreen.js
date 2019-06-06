import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    SafeAreaView
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader } from '../../../../components/react-native-teso';
import { Rating } from 'react-native-elements';
import { FlatList } from 'react-native-gesture-handler';
import NavigationService from '../../../../navigation/NavigationService';
import { nameOfEmployeeDetailReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { employeeActions } from '../../../../actions/index';
import { connect } from 'react-redux'

class CustomerReportScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    customerName: 'nameOfCustomer',
                    rate: 5,
                    report: 'Mauris aliquam interdum bibendum. Praesent lobortis dignissim mauris, at tristique augue posuere eget. Nullam eget nibh dui. Aenean mi justo, pharetra in ornare at, laoreet at enim. Vivamus sit amet condimentum leo, sed placerat nulla. In imperdiet suscipit sapien, eget consectetur eros. Suspendisse potenti. Morbi nec viverra eros. Vivamus semper, felis non scelerisque tempor, felis ex sodales mi, sit amet accumsan tortor ligula nec ligula. Aliquam feugiat viverra pharetra. Maecenas interdum elementum neque. Duis at tincidunt est. Fusce non convallis nisl, volutpat aliquam neque. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
                    date: '10/10/2018'
                },
                {
                    customerName: 'nameOfCustomer',
                    rate: 5,
                    report: ' Nulla malesuada mauris massa, quis ultricies nibh finibus sit amet. Donec venenatis sapien ac fermentum gravida. Nulla facilisi.',
                    date: '10/10/2018'
                }
            ]
        };
    }

    static navigationOptions = {
        header: null
    };

    renderItem = ({ item, index }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemHeaderContainer}>
                    <View style={styles.itemNameContainer}>
                        <Text style={[styles.text, styles.textNameCustomer]}>
                            {item.customerName}
                        </Text>
                    </View>
                    <View style={styles.itemRateContainer}>
                        <Rating readonly imagesize={FontStyle.mdText} startingValue="{item.rate}" />
                    </View>
                </View>
                <View style={styles.itemBodyContainer}>
                    <Text style={[styles.text]}>
                        {item.report}
                    </Text>
                    <View style={styles.itemFooter}>
                        <Text style={[styles.text, { fontSize: FontStyle.smallText, color: Colors.darkBlur }]}>
                            {item.date}
                        </Text>
                    </View>
                </View>

            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                        <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.navigate('DetailEmployee')}
                    centerComponent={'Thêm nhân viên'}
                />
                <FlatList showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.containerBody}
                    data={this.state.data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderItem}
                />
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
    containerBody: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    text: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        color: Colors.darkText,
        lineHeight: 17,
        marginTop: 3,
    },
    textNameCustomer: {
        color: Colors.dark1,
    },
    itemContainer: {
        backgroundColor: 'black',
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },
    itemHeaderContainer: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemNameContainer: {
        alignSelf: 'center'
    },
    itemRateContainer: {
        alignSelf: 'center'
    },
    itemBodyContainer: {
        flexWrap: 'wrap',
    },
    itemFooter: {
        marginTop: 4,
        alignItems: 'flex-end'
    }
});


const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfEmployeeDetailReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(employeeActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerReportScreen)