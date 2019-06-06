import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';

import { ButtonGradient, FormInput, MainHeader, PopUpUploadImage } from '../../../components/react-native-teso';
import { validateEmail, validatePhoneNumber, validateName } from '../../../helper/validationHelper';
import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import NavigationService from '../../../navigation/NavigationService';
import { nameOfProfileReducers } from '../../../reducers/index';
import { Avatar, CheckBox } from 'react-native-elements';
import { profileActions } from '../../../actions/index';
import { importImage } from '../../../helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DefaultImages } from '../../../assets/styles/Constant';

class CreateOwnerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      firstName: '',
      facebookId: '',
      emailId: '',
      email: '',
      phoneId: '',
      phone: '',
      birthday: '',
      gender: '',
      avatar: null,
      loading: false,
      callingCode: '+84',
      isVisiblePopupUploadImage: false,
    };
    this.createOwnerInfo = this.createOwnerInfo.bind(this);
    this.selectImage = this.selectImage.bind(this);
    this.takeImage = this.takeImage.bind(this);
    this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      id: navigation.getParam('id', this.props.user.id),
      lastName: this.props.user.lastName ? this.props.user.lastName : '',
      firstName: this.props.user.lastName ? this.props.user.firstName : '',
      phoneId: this.props.user.phoneId,
      phone: this.props.user.phone,
      emailId: this.props.user.emailId,
      email: this.props.user.email,
      facebookId: this.props.user.facebookId,
      birthday: this.props.user.birthday,
      gender: this.props.user.gender,
      position: 'Chủ sở hữu',
      avatar: DefaultImages.AVATAR,
    }, () => {
      console.log('create owner screen did mount: ', this.props, this.state)
    })
  }

  createOwnerInfo(avatar) {
    this.setState({ loading: true }, async () => {
      var thumbnailImage = ''
      if (avatar) {
        if (String(avatar).substr(0, 4) !== 'http') {
          await importImage.uploadImage(avatar)
            .then(image => {
              thumbnailImage = image
            })
        }
        else {
          thumbnailImage = avatar
        }
      } else {
        thumbnailImage = DefaultImages.AVATAR
      }

      console.log(thumbnailImage);
      const user = {
        'id': this.state.id,
        'lastName': this.state.lastName,
        'firstName': this.state.firstName,
        'phoneId': this.state.phoneId,
        'phone': this.state.phone,
        'emailId': this.state.emailId,
        'email': this.state.email,
        'facebookId': this.state.facebookId,
        'birthday': this.state.birthday,
        'gender': this.state.gender,
        'position': 'Chủ sở hữu',
        'avatar': thumbnailImage,
      }
      const data = {
        'user': user,
        callback: () => {
          this.setState({ loading: false });
          return NavigationService.navigate('CreateStore', {
            ownerId: this.props.user.id,
            phone: this.props.user.phone
          });
        }
      }
      this.props.actions.updateProfileUserRequest(data)
    });
  }

  selectImage() {
    this._togglePopupUploadImage();
    importImage.selectImage()
      .then(url => {
        this.setState({
          avatar: url.path
        }, () => {
          console.log('selectImage', this.state, url)
        })
      })
  }

  takeImage() {
    this._togglePopupUploadImage();
    importImage.takeImage()
      .then(url => {
        this.setState({
          avatar: url.path
        }, () => {
          console.log('selectImage', this.state, url)
        })
      })
  }

  _togglePopupUploadImage() {
    this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
  }

  render() {
    const {
      firstName,
      lastName,
      phone,
      email,
      avatar } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => NavigationService.navigate('WelcomeCreateStore')}
          centerComponent={'Khởi tạo tài khoản'}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.containerBody}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar
                rounded
                size={Layout.window.width * 0.3}
                source={{ uri: avatar }}
                showEditButton
                containerStyle={styles.imageCard}
                onPress={this._togglePopupUploadImage}
              />
            </View>
            <View style={styles.displayInlineBlock}>
              <View style={{ width: '47.5%' }}>
                <FormInput
                  label={'Tên'}
                  textBox
                  require
                  line
                  onChangeText={(text) => this.setState({ firstName: text })}
                  value={firstName}
                  placeholder={'Nhập tên của bạn'}
                />
              </View>
              <View style={{ width: '47.5%', marginLeft: '5%' }}>
                <FormInput
                  label={'Họ'}
                  textBox
                  line
                  require
                  onChangeText={(text) => this.setState({ lastName: text })}
                  value={lastName}
                  placeholder={'Nhập họ của bạn'}
                />
              </View>
            </View>
            <FormInput
              label={'Số điện thoại'}
              textBox
              require
              line
              onChangeText={(text) => this.setState({ phone: text })}
              keyboardType={'phone-pad'}
              value={`${!phone ? '' : phone}`}
              placeholder={'Nhập số điện thoại'}
              errorMessage={!phone || phone == '' ? null : (validatePhoneNumber(phone) ? null : 'Số điện thoại không hợp lệ')}
            />
            <FormInput
              label={'Email'}
              textBox
              line
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType={'email-address'}
              value={email}
              placeholder={'Nhập địa chỉ email (nếu có)'}
              errorMessage={!email || email == '' ? null : (validateEmail(email) ? null : 'Email không hợp lệ')}
            />
            <View style={[styles.form, styles.formSubmit]}>
              <ButtonGradient disabled={
                email && !validateEmail(email)
                || !validatePhoneNumber(phone)
                || !validateName(lastName.normalize('NFC'))
                || !validateName(firstName.normalize('NFC'))
              } onPress={() => this.createOwnerInfo()} content='Tiếp theo' />
            </View>
            {this.state.loading ? <ActivityIndicator size="small" color={Colors.functionColorLight} /> : null}
          </View>
        </ScrollView>
        <PopUpUploadImage
          isVisible={this.state.isVisiblePopupUploadImage}
          takeImage={() => this.takeImage()}
          selectImage={() => this.selectImage()}
          pressCancel={this._togglePopupUploadImage}
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
    paddingLeft: 20,
    paddingRight: 20,
  },
  imageCard: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.functionColorDark,
  },
  text: {
    fontSize: FontStyle.bigText,
    fontFamily: FontStyle.mainFont,
    color: Colors.darkText,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 3,
  },
  form: {
    marginTop: 20,
  },
  formSubmit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 22,
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfProfileReducers]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(profileActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOwnerScreen)