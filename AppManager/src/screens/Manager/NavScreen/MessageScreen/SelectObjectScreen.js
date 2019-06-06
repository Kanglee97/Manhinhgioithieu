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
    SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import _, { get } from 'lodash';
import { EmployeeCard, MainHeader } from '../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { SearchBar, FormInput, ButtonGradient } from '../../../../components/react-native-teso';
import NavigationService from '../../../../navigation/NavigationService';
import SelectObjectTabNavigator from '../../../../navigation/Manager/SelectObjectTabNavigator';
import * as storeService from '../../../../sagas/storeService'

import { bindActionCreators } from 'redux'
import { employeeActions, messengerActions } from '../../../../actions/index';
import { nameOfEmployeeReducers, nameOfProfileReducers, nameOfMessengerReducers } from '../../../../reducers';
import { connect } from 'react-redux'

class SelectObjectScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toObjects: '',
            title: '',
            content: '',
            createState: null,
            searchText: '',
            searchFilter: [],
            refreshing: false,
            employees: [
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
            ]
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        const data = {
            'ownerId': get(storeService.getSpecificState(nameOfProfileReducers).user, 'id'),
        }
        this.props.actions.fetchAllEmployeeByManagerRequest(data)
    }

    selectedEmployee = employee => {
        this.props.actions.addReceivedMessengerEmployee({ 'employee': employee })
    }

    checkAll = employees => {

        this.props.actions.addAllReceivedMessengerEmployee({ 'employees': employees })
        // this.setState({
        //     refreshing: true
        // }, () => {
        //     this.setState({ refreshing: false })
        // })
        //NavigationService.goBack()
    }


    searchFilterFunction = text => {
        const newData = this.props.employees.filter(item => {
            const itemData = `${item.firstName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        console.log(newData)
        this.setState({ searchFilter: newData });
    };


    render() {
        const { searchText } = this.state;
        const { employees } = this.props
        console.log('render')
        return (
            <SafeAreaView style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    <MainHeader
                        backgroundColor={Colors.lightBg}
                        leftPress={() => NavigationService.goBack()}
                    />
                    <SearchBar
                        onChangeText={(text) => {
                            this.searchFilterFunction(text)
                            this.setState({ searchText: text })
                        }}
                        value={searchText}
                        onClear={() => this.setState({ searchText: '' })}
                        placeholder={'Tên cửa hàng, tên nhân viên'}
                    />
                    {/* <SelectObjectTabNavigator ref={nav => {
                        this.navigator = nav;
                    }} /> */}
                    <TouchableOpacity
                        style={{ alignSelf: 'flex-end', alignItems: 'flex-end', paddingRight: Layout.window.width * 0.05 }}
                        onPress={() => {
                            this.checkAll(employees)
                            NavigationService.goBack()
                        }}>
                        <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.functionColorLight }}>
                            Chọn tất cả
                        </Text>
                    </TouchableOpacity>
                    <FlatList showsVerticalScrollIndicator={false}
                        data={this.state.searchText == '' ? this.props.employees : this.state.searchFilter}
                        numColumns={1}
                        contentContainerStyle={styles.messageBlock}
                        extraData={this.props.lstReceiver}
                        renderItem={({ item }) => {
                            console.log(item, ((_.findIndex(this.props.lstReceiver, function (lstItem) {
                                return (lstItem.id == item.id)
                            })) != -1))
                            return (
                                <EmployeeCard
                                    cardStyle={{
                                        alignSelf: 'center'
                                    }}
                                    check={((_.findIndex(this.props.lstReceiver, function (lstItem) {
                                        return (lstItem.id == item.id)
                                    })) != -1)}
                                    title={`${item.firstName} ${item.lastName || ''}`}
                                    time={item.time}
                                    content={item.position || 'Quản lý'}
                                    onPress={() => {
                                        this.selectedEmployee(item)
                                    }}
                                />)
                        }} />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    headerIcon: {
        textAlign: 'center',
        backgroundColor: Colors.transparent
    },
    richText: {
        backgroundColor: Colors.lightBg,
        borderWidth: 0,
        borderColor: Colors.transparent,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.15,
        shadowRadius: 2.65,
        elevation: 2,
        height: 150,
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfEmployeeReducers],
        ...state[nameOfMessengerReducers]
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...employeeActions, ...messengerActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectObjectScreen)
