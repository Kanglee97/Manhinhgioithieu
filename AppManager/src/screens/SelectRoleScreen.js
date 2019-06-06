import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    BackHandler,
    TouchableOpacity,
    SafeAreaView,
    StatusBar
} from 'react-native';

import { nameOfAuthReducers, nameOfProfileReducers, nameOfStoreDetailReducers } from '../reducers/index';
import { Colors, FontStyle, Layout } from '../components/react-native-teso/Magic';
import { profileActions, storeDetailActions, serviceActions } from '../actions/index';
import { Loading, Logo } from '../components/react-native-teso';
import NavigationService from '../navigation/NavigationService';
import * as storeService from '../sagas/storeService'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import callApi from '../api/helper'
import _, { get } from 'lodash'

class SelectRoleScreen extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            console.log('back pressing')
            NavigationService.goBack()
            return true
        })
        console.log('componentDidMount', this.props.isAuthorized, this.props.isOwner)
        if (this.props.isAuthorized) {
            if (this.props.isOwner) {
                const storeId = get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId')
                if (storeId === '')
                    this.getUserAndNavigate()
                else
                    this.props.navigation.navigate('MainManager')
            }
            else {
                console.log('NavigationService MainStaff')
                this.props.navigation.navigate('MainStaff')
            }
        }
        this.setState({
            isLoading: false
        })
    }

    componentWillUnmount = () => {
        this.setState({
            isLoading: true
        })
        BackHandler.removeEventListener('hardwareBackPress');
    }

    getUserAndNavigate = () => {
        let serverToken = '';
        if (this.props.isAuthorized) {
            if (this.props.facebookToken != '')
                serverToken = this.props.facebookToken
            else if (this.props.googleToken != '')
                serverToken = this.props.googleToken
            else if (this.props.phoneToken != '')
                serverToken = this.props.phoneToken
            const data = {
                'token': serverToken,
                callback: () => {
                    console.log(this.props, this.props.storeList, this.props.storeList.length)
                    if (this.props.storeList.length == 0)
                        this.props.navigation.navigate('WelcomeCreateStore', {
                        })
                    else
                        this.onSelectStore(this.props.storeList[0].id, this.props.storeList[0].displayName, this.props.storeList[0].address)
                }
            }
            this.props.actions.fetchProfileWithTokenRequest(data)
        }
        else
            this.props.navigation.navigate('SelectLoginMethod')
    }

    onSelectStore = async (storeId, displayName, address) => {
        const data = {
            'storeId': storeId,
            'displayName': displayName,
            'address': address,
        }
        storeService.dispatch(storeDetailActions.saveStoreDetail(data))
        this.setState({
            welcome: true
        }, () =>
                NavigationService.navigate('Store')
        )
    }


    getStaffAndNavigate = () => {
        this.props.navigation.navigate('SignIn');
    }
    getdemo = () => {
        this.props.navigation.navigate('Intro');
    }

    onClick = () => {
        const a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 1, 2, 3, 4, 5, 5, 2, 3, 6, 7, 8, 9, 0, 3, 2, 1, 2, 3, 5, 2]
        a.forEach(item => {
            callApi('/storess/1')
        })
        a.forEach(item => {
            callApi('/storess/1')
        })
        a.forEach(item => {
            callApi('/storess/1')
        })
    }

    render() {
        console.log(this.state)
        if (this.state.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.backgroundImage}>
                <StatusBar
                    backgroundColor={Colors.lightBg}
                    barStyle={'dark-content'} />
                <Logo />
                <View>
                    <Text style={styles.questionText}>Đăng nhập với vai trò</Text>
                    <TouchableOpacity
                        onPress={() => this.getUserAndNavigate()}
                        style={[styles.buttonManager, styles.button]}>
                        <Text style={{
                            fontSize: FontStyle.mdText,
                            color: Colors.lightText,
                            fontWeight: 'bold',
                            fontFamily: FontStyle.mainFont,
                        }}>Quản lý</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.getStaffAndNavigate()}
                        style={[styles.buttonEmp, styles.button]}>
                        <Text style={{
                            fontSize: FontStyle.mdText,
                            color: Colors.lightText,
                            fontWeight: 'bold',
                            fontFamily: FontStyle.mainFont,
                        }}>Nhân viên</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.getdemo()}
                        style={[styles.buttonEmp, styles.button]}>
                        <Text style={{
                            fontSize: FontStyle.mdText,
                            color: Colors.lightText,
                            fontWeight: 'bold',
                            fontFamily: FontStyle.mainFont,
                        }}>Demo IntroScreen</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.bg
    },
    blockHeader: {
        justifyContent: 'center',
        height: 70,
        borderBottomColor: Colors.transparent,
        borderBottomWidth: 1,
    },
    logoBlock: {
        position: 'absolute',
        top: '5%',
    },
    logo: {
        width: 133.44,
        height: 123.36
    },
    questionText: {
        fontSize: FontStyle.mdText,
        fontWeight: 'bold',
        fontFamily: FontStyle.mainFont,
        color: Colors.functionColorLight,
        marginBottom: 35,
        textAlign: 'center'
    },
    buttonManager: {
        backgroundColor: Colors.functionColorDark,
        height: 40,
        borderRadius: 20,
    },
    buttonEmp: {
        backgroundColor: Colors.functionColorLight,
        height: 40,
        borderRadius: 20,
        marginTop: 17,
    },
    button: {
        width: Layout.window.width * 0.8,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAuthReducers],
        ...state[nameOfProfileReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(profileActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectRoleScreen)
