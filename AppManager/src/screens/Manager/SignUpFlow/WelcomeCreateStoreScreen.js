import React from 'react'

import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { ButtonGradient } from '../../../components/react-native-teso';
import { logoutFacebook, logoutGoogle, logoutPhone } from '../../../helper/logoutHelper';
import { nameOfAuthReducers, nameOfProfileReducers } from '../../../reducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { profileActions, storeDetailActions } from '../../../actions';
import { dispatch } from '../../../sagas/storeService';
import NavigationService from '../../../navigation/NavigationService';

class WelcomeCreateStoreScreen extends React.Component {
    redirectCreateOwnerScreen() {
        console.log('create owner', this.props)
        return this.props.navigation.navigate('CreateOwner',
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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                        <View style={styles.XinChaoBlock}>
                    <Image source={require('../../../assets/img/XinChaoTitle.png')} style={styles.xinchao} />
                </View>
                <View style={styles.ContentBlock}>
                    <Text style={styles.content}>
                        Chào mừng bạn đến với Salozo!
                    </Text>
                    <Text style={styles.content}>
                        Hãy tạo cửa hàng cho mình, để biến việc quản lý trở nên đơn giản hơn.
                    </Text>
                </View>
                <View style={{ marginTop: Layout.window.height * 0.1 }}>
                    <ButtonGradient
                        onPress={() => this.redirectCreateOwnerScreen()}
                        content='Tiếp theo'
                    />
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}
                        onPress={() => {
                            if (this.props.isAuthorized) {
                                if (this.props.phoneToken != '') {
                                    logoutPhone({
                                        logout: () => {
                                            NavigationService.navigate('SelectRole')
                                        }
                                    });
                                } else if (this.props.facebookToken != '') {
                                    logoutFacebook({
                                        logout: () => {
                                            NavigationService.navigate('SelectRole')
                                        }
                                    });
                                } else if (this.props.googleToken != '') {
                                    logoutGoogle({
                                        logout: () => {
                                            NavigationService.navigate('SelectRole')
                                        }
                                    });
                                }
                            }
                        }}>
                        <Text style={{
                            fontSize: FontStyle.mdText, color: Colors.functionColorLight,
                            textDecorationColor: Colors.functionColorLight, textDecorationLine: "underline"
                        }}>Trở về</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
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
        height: 38.25,
        width: 204.6
    },
    ContentBlock: {
        position: 'absolute',
        top: '30%',
    },
    content: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 30,
        width: Layout.window.width / 1.15,
        fontFamily: FontStyle.mainFont,
    },
})

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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeCreateStoreScreen)