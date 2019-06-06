import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, AsyncStorage, SafeAreaView, StatusBar, } from 'react-native';
import { Colors, FontStyle, Layout } from '../../components/react-native-teso/Magic';
import { FormInput, ButtonGradient, MainHeader, Logo, Loading } from '../../components/react-native-teso';
import NavigationService from '../../navigation/NavigationService';
import { bindActionCreators } from 'redux';
import { authActions, profileActions, storeDetailActions, messengerActions } from '../../actions/index';
import { nameOfAuthReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../reducers'
import { connect } from 'react-redux'
import { dispatch } from '../../sagas/storeService';
import _ from 'lodash'
import SimpleToast from 'react-native-simple-toast';

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      portal: '',
      email: '',
      password: '',
      loading: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = () => {
    this.setState({
      portal: '',
    })
  }

  signInStaff(portal, email, password) {
    const user = {
      'portal': `${portal}.salozo.com`,
      'username': email,
      'password': password,
    }
    this.setState({ loading: true }, async () => {
      const data = {
        'user': user,
        callback: (responseUser) => {
          console.log(responseUser)
          this.props.actions.setProfile(responseUser);
          dispatch(storeDetailActions.fetchStoreDetailRequest({
            'storeId': responseUser.user.storeId,
            callback: () => {
              this._retrieveData()
            }
          }))
          this.setState({ loading: false })
          //dispatch(storeDetailActions.saveStoreDetail({ 'storeId': responseUser.user.storeId }))
        },
        fallback: () => {
          this.setState({ loading: false })
        }
      }
      this.props.actions.loginEmployeeAccountRequest(data)
    })
  }

  _retrieveData = async () => {
    try {
      dispatch(messengerActions.fetchDeviceRequest({
        'deviceId': this.props.user.id,
        callback: async (data) => {
          const value = await AsyncStorage.getItem('fcmToken');
          if (value !== null) {
            // We have data!!
            if (_.findIndex(data, function (item) {
              return (item.type === 'EMPLOYEE' && item.keyPush === value)
            }) == -1) {
              console.log(value);
              const device = {
                'deviceId': '',
                'userId': this.props.user.id,
                'keyPush': value,
                'deviceOs': '',
                'deviceInfo': '',
                'type': 'EMPLOYEE'
              }
              const deviceData = {
                'device': device,
                callback: () => {
                }
              }
              dispatch(messengerActions.addDeviceRequest(deviceData))
            }
          }
          if (this.props.user.isManager) {
            return NavigationService.navigate('MainManager');
          } else {
            return NavigationService.navigate('MainStaff');
          }
        }
      }))
    } catch (error) {
      console.log(error)
      // Error retrieving data
    }
  };

  render() {
    const { portal, email, password } = this.state;
    if (this.state.loading) return <Loading />
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => NavigationService.navigate('SelectRole')}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.backgroundBody}>
            <Logo />
            <View style={{ backgroundColor: Colors.lightBg }}>
              <View style={{ width: Layout.window.width * 0.8, alignSelf: 'center' }}>
                <FormInput
                  textBox
                  onChangeText={(text) => this.setState({ portal: text })}
                  autoCapitalize='none'
                  rightComponent={<Text style={{ color: Colors.functionColorLight }}>.salozo.com</Text>}
                  rightComponentStyle={{ top: '30%' }}
                  inputStyle={{ paddingRight: '30%', backgroundColor: Colors.lightBg, borderRadius: 10, }}
                  value={portal}
                  placeholder={'Tên miền địa chỉ Salon'}
                // notes={'Dùng để đăng nhập vào Salon. Ví dụ: hoanghon.salozo.com'}
                />
                <FormInput
                  textBox
                  inputStyle={{ backgroundColor: Colors.lightBg, borderRadius: 10, }}
                  onChangeText={(text) => this.setState({ email: text })}
                  value={email}
                  placeholder={'Username'}
                />
                <FormInput
                  textBox
                  inputStyle={{ backgroundColor: Colors.lightBg, borderRadius: 10, }}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={password}
                  secureTextEntry
                  placeholder={'Password'}
                />
              </View>
              <View style={{ width: Layout.window.width, alignItems: 'center', marginTop: 30 }}>
                <ButtonGradient
                  content={'Đăng nhập'}
                  onPress={() => this.signInStaff(portal, email, password)}
                />
              </View>
              <View style={{ width: Layout.window.width, alignItems: 'center', marginTop: 20 }}>
                <TouchableOpacity style={{ height: 30 }} onPress={() => SimpleToast.show('Tính năng này đang được phát triển', SimpleToast.SHORT)}>
                  <Text style={{ color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.smallText }}>Quên mật khẩu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center'
  },
  backgroundBody: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Layout.window.height * 0.85,
    backgroundColor: Colors.lightBg
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfAuthReducers],
    ...state[nameOfProfileReducers],
    ...state[nameOfLoadingReducers]
    [authActions.LOGIN_EMPLOYEE_ACCOUNT,
    profileActions.FETCH_PROFILE],
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...authActions, ...profileActions }, dispatch)
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
