import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    SafeAreaView
} from 'react-native';
import _ from 'lodash';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { nameOfStoreDetailReducers, nameOfServiceReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers'
import { Card9, Notification } from '../../../../../components/react-native-teso';
import NavigationService from '../../../../../navigation/NavigationService';
import * as storeService from '../../../../../sagas/storeService'
import { serviceActions, accountPackageActions } from '../../../../../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { get } from 'lodash'


class SampleServiceTab extends Component {
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
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = async () => {
        const data = {
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            callback: () => {
                console.log(this.props, this.state)
                this.setState({
                    serviceData: [...this.state.serviceData, ...this.props.sampleServiceData]
                })
            }
        }
        this.props.actions.fetchSampleServiceRequest(data)
    }

    selectedItem(id) {
        var tmpArr = this.state.selectedService;
        if (this.checkExistInArray(id, tmpArr) == false) {
            tmpArr.push(id);
        } else {
            this.deleteObj(id, tmpArr);
        }
        this.setState({ selectedService: tmpArr });
    }

    checkExistInArray(id, arr) {
        console.log('checkExistInArray', id, arr)
        if (!(typeof arr !== 'undefined' && arr.length > 0))
            return false
        return (_.findIndex(arr, function (item) { return item == id }) == -1) ? false : true
    }

    deleteObj(id, arr) {
        const index = arr.indexOf(id);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    addServiceFromSampleService = () => {
        // var arr = this.state.selectedService;
        // callApi(`/api/store/service-addmulti/${storeId}`, 'POST', JSON.stringify(arr));
        // return NavigationService.navigate('Main');
        const data = {
            'storeId': this.props.storeId,
            'selectedService': this.state.selectedService,
            callback: () => {
                console.log(this.props)
                storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
                    'managerId':
                        get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
                }))
                console.log(this.props)
                this.props.screenProps.onGoBack()
                NavigationService.goBack()
            }
        }

        this.props.actions.addServiceFromSampleServiceRequest(data)
    }

    renderItem(item, tmpArr) {
        return (
            <Card9 onPress={() => this.selectedItem(item.id)}
                url={item.thumbnail}
                title={item.displayName}
                checkCondition={this.checkExistInArray(item.id, tmpArr)}
            />
        )
    }


    render() {
        console.log('SampleServiceTab render', this.props)
        var tmpArr = this.state.selectedService;
        console.log(_.isEmpty(tmpArr))
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ marginLeft: Layout.window.width * 0.0375 }}>
                    <FlatList showsVerticalScrollIndicator={false}
                        data={this.state.serviceData}
                        numColumns={3}
                        renderItem={({ item, index }) => this.renderItem(item, tmpArr)}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </ScrollView>
                {!_.isEmpty(tmpArr) && <Notification
                    number={(typeof tmpArr !== 'undefined' && tmpArr.length > 0) ? tmpArr.length : 0}
                    content='Dịch vụ được chọn'
                    style={{ translateY: (typeof tmpArr !== 'undefined' && tmpArr.length > 0) ? 0 : 70 }}
                    onPress={() => this.addServiceFromSampleService()} />}
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
    form: {
        marginTop: 20,
        position: 'relative',
    },
    containerDropdownStyle: {
        height: 40,
        zIndex: -10,
        width: Layout.window.width * 0.9,
        paddingLeft: 10,
        shadowColor: Colors.darkBlur,
        backgroundColor: Colors.lightBg,
        borderRadius: 10,
        shadowColor: Colors.darkBlur,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    downIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 10
    },
    gridView: {
        flex: 1,
    },
    serviceTags: {
        maxWidth: Layout.window.width * 0.3,
        backgroundColor: Colors.lightBg,
        borderRadius: 5,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    blur: {
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 5,
        backgroundColor: "rgba(0,0,0,.3)",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfServiceReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(serviceActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SampleServiceTab)


