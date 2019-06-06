import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    TextInput,
    SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader, IconImage, CustomerNameCard, Loading, SearchBar } from '../../../../components/react-native-teso';
import { nameOfStoreDetailReducers, nameOfLoadingReducers, nameOfCustomerReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { customerActions } from '../../../../actions/index';
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'
import { get } from 'lodash'
import NavigationService from '../../../../navigation/NavigationService';
import { ScrollView } from 'react-native-gesture-handler';

class CustomerScreen extends Component {
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
            searchText: '',
            searchFilter: [],
            customer: [
                { firstName: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem', type: 'khách mới' },
                { firstName: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { firstName: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
            ]
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = async () => {
        const { navigation } = this.props;
        this._onRefresh()
        console.log('store screen did mount props', this.props)
        // await this.setState({ serverToken: this.props.facebookToken || this.props.googleToken || this.props.phoneToken });
        // this.setState({
        //     storeId: this.props.storeId,
        //     firstName: this.props.data.firstName || '',
        //     address: this.props.data.address || ''
        // })
    }

    _onRefresh = () => {
        const data = {
            'user': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
            callback: () => {

            }
        }
        this.props.actions.getAllCustomerRequest(data)
    }

    onSelectCustomer = async (storeId, firstName, address) => {
        const data = {
            'storeId': storeId,
            'firstName': firstName,
            'address': address,
        }
        await storeService.dispatch(storeDetailActions.saveStoreDetail(data))
        this.loadData()
    }

    searchFilterFunction = text => {
        const newData = this.props.customers.filter(item => {
            const itemData = `${item.firstName.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        console.log(newData)
        this.setState({ searchFilter: newData });
    };

    render() {
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <View style={styles.container}>
                <View style={{ paddingTop: 10, backgroundColor: Colors.lightBg }}>
                    <SearchBar
                        inputStyle={{ backgroundColor: Colors.lightGreyColor }}
                        onChangeText={(text) => {
                            this.searchFilterFunction(text)
                            this.setState({ searchText: text })
                        }}
                        value={this.state.searchText}
                        onClear={() => this.setState({ searchText: '' })}
                    />
                </View>
                {this.props.customers.length <= 0 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>{'Cửa hàng này chưa có bất kỳ khách hàng nào.'}</Text>
                        <Text style={styles.text}>{'Khuyến khích khách hàng sử dụng dịch vụ của bạn qua Salozo nhé!'}</Text>
                    </View>
                }
                <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
                    <FlatList showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ backgroundColor: Colors.bg }}
                        data={this.state.searchText == '' ? this.props.customers : this.state.searchFilter}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.props.isLoading}
                                onRefresh={this._onRefresh}
                            />
                        }
                        numColumns={1}
                        renderItem={({ item }) =>
                            <CustomerNameCard
                                cardStyle={{ alignSelf: 'center', borderWidth: 0, marginTop: 10, }}
                                title={`${item.firstName}`}
                                type={`${item.phone == null ? '' : item.phone}`}
                                onPress={() => {
                                    console.log('navigate to customerDetail')
                                    NavigationService.navigate('CustomerDetail', {
                                        id: item.id,
                                        callback: () => {
                                            this.loadData()
                                        }
                                    })
                                }}
                            />
                        }
                        keyExtractor={(item, index) => `${index}`}
                    />
                </ScrollView>
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
    name: {
        fontSize: FontStyle.smallText,
        color: Colors.functionColorDark,

    },
    address: {
        fontSize: FontStyle.smallText,
        color: Colors.lightGreyColor,
    },
    noContainer: {
        height: '80%',
        backgroundColor: Colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        width: Layout.window.width * 0.9,
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfCustomerReducers],
        ...state[nameOfLoadingReducers][customerActions.GET_ALL_CUSTOMER]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(customerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerScreen)