import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    StatusBar
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { MaterialIcon, NameBoard, Logo } from '../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { nameOfAuthReducers, nameOfProfileReducers } from '../../../reducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { profileActions, storeDetailActions } from '../../../actions';
import { dispatch } from '../../../sagas/storeService';
import NavigationService from '../../../navigation/NavigationService';
import { getSpecificState } from '../../../sagas/storeService';

///////////////////////////////////////!!!!!!!!!!!!!!!!!!!!!!!
class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            storeList: [],
            load1: false,
            welcome: true,
            key: '1',
            serverToken: '',
            refreshing: false,
        };
    }


    componentDidMount = async () => {
        await this.setState({ serverToken: this.props.facebookToken || this.props.googleToken || this.props.phoneToken })
    }


    redirectCreateOwnerScreen() {
        console.log('create owner', this.props)
        return NavigationService.navigate('CreateOwner',
            {
                id: this.props.user.id,
                displayName: this.props.user.displayName,
                phoneId: this.props.user.phoneId,
                phone: this.props.user.phone,
                emailId: this.props.user.emailId,
                email: this.props.user.email,
                facebookId: this.props.user.facebookId,
                birthday: this.props.user.birthday,
                gender: this.props.user.gender,
            });
    }

    redirectCreateStoreScreen() {
        console.log('create store', this.props)
        return NavigationService.navigate('CreateStore', {
            ownerId: this.props.user.id
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
        const data = {
            'storeId': storeId,
            'displayName': displayName,
            'address': address,
        }
        dispatch(storeDetailActions.saveStoreDetail(data))
        this.setState({
            welcome: true
        }, () =>
                NavigationService.navigate('Store')
        )
    }

    renderScreen(key, storeList, user) {
        switch (key) {
            case '1':
                setTimeout(() => {
                    if (this.state.key != '2')
                        this.setState({
                            key: '2'
                        })
                }, 1000)
                return (
                    <View style={styles.backgroundImage}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={() => {
                                this.setState({
                                    key: '2'
                                })
                            }}
                        >
                        </TouchableOpacity>
                    </View>
                )
                break;
            case '2':
                setTimeout(() => {
                    if (this.state.key != '3')
                        this.setState({
                            key: '3'
                        })
                }, 1000);
                return (
                    <View style={styles.backgroundImage}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                this.setState({
                                    key: '3'
                                })
                            }}>
                            <View style={styles.logoBlock}>
                                <Logo />
                            </View>
                            <View>
                                <Text style={{ fontWeight: 'bold', color: Colors.lightText, fontFamily: FontStyle.mainFont, textAlign: 'center', fontSize: FontStyle.mdText, lineHeight: 20 }}>
                                    Xin chào {!user.displayName ? 'Quản lý' : user.displayName}
                                </Text>
                                <Text style={{ color: Colors.lightText, fontFamily: FontStyle.mainFont, textAlign: 'center', fontSize: FontStyle.mdText, lineHeight: 20 }}>
                                    Cùng quản lý cửa hàng với Salozo nhé!
                                    </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                )
                break;
            case '3':
                return (
                    <View style={styles.backgroundImage}>
                        <View style={styles.logoBlock}>
                            <Logo />
                        </View>
                        <View style={styles.storeBlock}>
                            {this.props.storeList == 0 ?
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: Colors.lightText, fontFamily: FontStyle.mainFont, textAlign: 'center', fontSize: FontStyle.mdText, lineHeight: 20 }}>
                                        Bạn chưa tạo bất kỳ cửa hàng nào
                                        {/* {!user.displayName ? 'Quản lý' : user.displayName} */}
                                    </Text>
                                    <Text style={{ color: Colors.lightText, fontFamily: FontStyle.mainFont, textAlign: 'center', fontSize: FontStyle.mdText, lineHeight: 20 }}>
                                        Vui lòng tạo cửa hàng và quản lý cùng Salozo nhé!
                                    </Text>
                                </View>
                                : <FlatList showsVerticalScrollIndicator={false}
                                    style={{ height: Layout.window.height * 0.45 }}
                                    data={storeList}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh}
                                        />
                                    }
                                    numColumns={1}
                                    renderItem={({ item }) =>
                                        <NameBoard
                                            blockStyle={{
                                                width: Layout.window.width * 0.925,
                                                marginBottom: 10
                                            }}
                                            displayName={item.displayName}
                                            address={item.address}
                                            bar={false}
                                            onPress={() => this.onSelectStore(item.id, item.displayName, item.address)} />
                                    }
                                    keyExtractor={(item, index) => `${index}`}
                                />
                            }
                            <TouchableOpacity style={[styles.displayInlineBlock, styles.createBtn]} onPress={() => this.redirectCreateStoreScreen()}>
                                <MaterialIcon name={'add-circle-outline'} size={16} color={Colors.lightText} />
                                <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.lightText, fontWeight: 'bold' }}>  Tạo cửa hàng mới</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
                break;
        }
    }

    render() {
        const { load1, welcome } = this.state;
        const { storeList, user } = this.props;
        console.log('welcome screen render ', storeList, load1, welcome, user)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {this.renderScreen(this.state.key, storeList, user)}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bg
    },
    XinChaoBlock: {
        position: 'absolute',
        top: '20%',
    },
    xinchao: {
        height: 50.55,
        width: 196.44
    },
    ContentBlock: {
        position: 'absolute',
        top: '30%',
    },
    content: {
        fontSize: FontStyle.smallText,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 30,
        width: Layout.window.width * 0.9,
        fontFamily: FontStyle.mainFont,
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoBlock: {
        position: 'absolute',
        top: '12%',
    },
    logo: {
        width: 133.44,
        height: 123.36
    },
    storeBlock: {
        position: 'absolute',
        top: '32%',
        alignItems: 'center',
        width: Layout.window.width
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    createBtn: {
        height: 60,
        width: Layout.window.width * 0.925,
        marginTop: 10,
        borderWidth: 1,
        borderColor: Colors.lightBg,
        borderRadius: 5,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen)