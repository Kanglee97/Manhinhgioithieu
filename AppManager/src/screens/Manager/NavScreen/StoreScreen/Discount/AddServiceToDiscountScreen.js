import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { Card9, Notification, SearchBar, MainHeader } from '../../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { bindActionCreators } from 'redux';
import { serviceActions, discountActions } from '../../../../../actions/index';
import { nameOfStoreDetailReducers, nameOfServiceReducers, nameOfDetailDiscountReducers } from '../../../../../reducers';
import { connect } from 'react-redux'
import * as storeService from '../../../../../sagas/storeService'
import _, { get } from 'lodash';

import NavigationService from '../../../../../navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';

class AddServiceToDiscountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceData: [],
            serviceTypeData: [
                { value: 'Salon tóc nữ' },
                { value: 'Salon tóc nam' },
                { value: 'Salon tóc nam và nữ' },
                { value: 'Nail Bar' },
            ],
            selectedService: [],
            serviceType: null,
            isNoti: false,
            storeId: null,
            searchText: '',
            searchFilter: []
        };
        this.renderItem = this.renderItem.bind(this)
        this.selectedItem = this.selectedItem.bind(this)
        this.checkExistInArray = this.checkExistInArray.bind(this)
        this.deleteObj = this.deleteObj.bind(this)
        this.renderLeftComponent = this.renderLeftComponent.bind(this)
        this.renderCenterComponent = this.renderCenterComponent.bind(this)
        this.addingService = this.addingService.bind(this)
        this.searchFilterFunction = this.searchFilterFunction.bind(this)
    }

    static navigationOptions = {
        header: null
    };

    renderItem = ({ item }) => {
        const tmpArr = this.props.services
        console.log('renderItem', tmpArr)
        console.log('renderItem', (Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0))
        if (!(Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0))
            return null
        return (
            (Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0) &&
            <Card9
                onPress={() => this.selectedItem(item, tmpArr)}
                url={item.thumbnail}
                title={item.displayName}
                checkCondition={this.checkExistInArray(item.id, tmpArr)}
            />
        )
    }

    componentDidMount = () => {
        // const data = {
        // 'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
        // callback: () => {
        //     console.log(this.props, this.state)

        this.setState({
            serviceData: get(storeService.getSpecificState(nameOfServiceReducers), 'serviceData'),
            selectedService: this.props.navigation.getParam('discountService', [])
        }, () => {
            console.log('AddServiceToDiscountScreen componentDidMount', this.state)
        })
        //     }
        // }
        // this.props.actions.fetchSampleServiceRequest(data)
    }

    selectedItem(item, tmpArr) {
        if (this.checkExistInArray(item.id, tmpArr) == false) {
            this.props.actions.addService({ 'service': item })
        } else {
            this.props.actions.removeService({ 'service': item })
        }
    }

    checkExistInArray(id) {
        const arr = this.props.services
        console.log('checkExistInArray', id, arr)

        if (_.isEmpty(arr))
            return false
        return (_.findIndex(arr, ['id', id]) == -1) ? false : true
    }

    deleteObj(id, arr) {
        const index = _.findIndex(arr, ['id', id])
        if (index !== -1) {
            arr.splice(index, 1)
        }
    }
    renderLeftComponent() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={{ width: 50, height: 25, justifyContent: 'center' }} onPress={() => NavigationService.goBack()}>
                    <FontAwesome5
                        name='chevron-left'
                        size={FontStyle.mdText}
                        color={Colors.dark9}
                    />
                </TouchableOpacity>
            </View>
        );
    }

    renderCenterComponent() {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold', marginLeft: 40 }}>
                    Thêm dịch vụ khuyến mãi
                </Text>
            </View>
        );
    }

    addingService = (selectedService, propsValue) => {
        // _.forEach(selectedService, function (item) {
        //     propsValue.actions.addService({ 'service': item })
        // })
        propsValue.navigation.goBack()
    }


    searchFilterFunction = text => {
        const serviceData = get(storeService.getSpecificState(nameOfServiceReducers), 'serviceData')
        const newData = serviceData.filter(item => {
            const itemData = `${item.displayName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        console.log(newData)
        this.setState({ searchFilter: newData });
    };

    render() {
        var tmpArr = this.props.services;
        const { searchText } = this.state;

        const serviceData = get(storeService.getSpecificState(nameOfServiceReducers), 'serviceData')
        console.log('render: ', this.state, this.props)
        return (
            <SafeAreaView style={styles.container}>
                        <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.goBack()}
                    centerComponent={'Thêm dịch vụ khuyến mãi'}
                />
                <View style={{ marginTop: 15 }}>
                    <SearchBar
                        inputStyle={{ backgroundColor: Colors.lightGreyColor }}
                        onChangeText={(text) => {
                            this.setState({ searchText: text })
                            this.searchFilterFunction(text)
                        }}
                        value={searchText}
                        onClear={() => this.setState({ searchText: '' })}
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{height: '100%'}}>
                    <FlatList showsVerticalScrollIndicator={false}
                        data={_.filter(serviceData, function (item) { return Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0 })}
                        data = {
                            _.filter(searchText === '' ? 
                                serviceData : 
                                this.state.searchFilter, 
                            function (item) { 
                                return Number(item.highestPrice) > 0 && Number(item.lowestPrice) >= 0 
                            })
                        }
                        numColumns={3}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </ScrollView>
                <Notification
                    number={(_.isEmpty(tmpArr)) ? 0 : tmpArr.length}
                    content='Dịch vụ đã được thêm'
                    label='Trở về'
                    style={{ translateY: (!_.isEmpty(tmpArr)) ? 0 : 70 }}
                    onPress={() => this.addingService(this.state.selectedService, this.props)} />
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
        justifyContent: 'center'
    },
    marginTop20: {
        marginTop: 20
    },
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfDetailDiscountReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(discountActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddServiceToDiscountScreen)


