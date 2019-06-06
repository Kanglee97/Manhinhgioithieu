import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { FormInput, ButtonGradient, MainHeader } from '../../../../components/react-native-teso';
import Moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

import DateTimePicker from 'react-native-modal-datetime-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NavigationService from '../../../../navigation/NavigationService';

import { get } from 'lodash'
import { bindActionCreators } from 'redux'
import { messengerActions } from '../../../../actions'
import { nameOfProfileReducers, nameOfMessengerReducers, nameOfStoreDetailReducers } from '../../../../reducers'
import * as storeService from '../../../../sagas/storeService'
import { connect } from 'react-redux'

class AccountBreakScheduleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDay: '',
      endDay: '',
      content: '',
      createState: null,
      isOpenTimeVisible: false,
      isCloseTimeVisible: false,
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      createState: navigation.getParam('createState') || false,
    }, () => {
    })
  }

  _toggleOpenTimePicker = () => this.setState({ isOpenTimeVisible: !this.state.isOpenTimeVisible });

  _handleOpenTimePicked = (time) => {
    console.log('A date has been picked: ', time);
    this.setState({ startDay: Moment(time).format('DD-MM-YYYY') });
    this._toggleOpenTimePicker();
  };

  _toggleCloseTimePicker = () => this.setState({ isCloseTimeVisible: !this.state.isCloseTimeVisible });

  _handleCloseTimePicked = (time) => {
    console.log('A date has been picked: ', time);
    this.setState({ endDay: Moment(time).format('DD-MM-YYYY') });
    this._toggleCloseTimePicker();
  };

  sendMessage = () => {
    const form = {
      'empId': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
      'empName': get(storeService.getSpecificState(nameOfProfileReducers), 'user.firstName'),
      'empPosition': get(storeService.getSpecificState(nameOfProfileReducers), 'user.position'),
      'toManagerId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.ownerId'),
      'startDate': this.state.startDay,
      'endDate': this.state.endDay,
      'leaveReason': this.state.content,
    }
    const data = {
      'form': form,
      callback: () => {
        NavigationService.goBack()
      }
    }
    this.props.actions.sendAbsentformRequest(data)
  }

  render() {
    const {
      startDay,
      endDay,
      content,
      createState,
      isOpenTimeVisible,
      isCloseTimeVisible, } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <MainHeader
            backgroundColor={Colors.lightBg}
            leftPress={() => NavigationService.goBack()}
            centerComponent={this.state.createState ? 'Form xin nghỉ phép' : null}
          />
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '90%' }}>
              <Text style={styles.formLabel}>Ngày bắt đầu<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
              <TouchableWithoutFeedback onPress={() => this._toggleOpenTimePicker()}>
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                  <Text style={{ flex: 4 }}>{startDay}</Text>
                  <AntDesign
                    name={'calendar'}
                    size={20}
                    iconStyle={styles.timepicker}
                    onPress={() => { this._toggleOpenTimePicker() }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <View style={{ width: '90%' }}>
              <Text style={styles.formLabel}>Ngày kết thúc<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
              <TouchableWithoutFeedback onPress={() => this._toggleCloseTimePicker()}>
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                  <Text style={{ flex: 4 }}>{endDay}</Text>
                  <AntDesign
                    name={'calendar'}
                    size={20}
                    iconStyle={styles.timepicker}
                    onPress={() => { this._toggleCloseTimePicker() }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            <FormInput
              label={'Nội dung'}
              richText
              inputStyle={[styles.richText, { width: Layout.window.width * 0.9 }]}
              onChangeText={(text) => this.setState({ content: text })}
              value={content}
              count={
                <Text>{`${content.length}/200`}</Text>
              }
            />
            <View
              style={{ marginTop: 20, paddingBottom: 20 }}>
              <ButtonGradient
                labelStyle={{ fontWeight: 'bold', }}
                onPress={() => this.sendMessage()}
                content='Gửi'
              />
            </View>
          </View>
          <DateTimePicker
            mode={'date'}
            isVisible={isOpenTimeVisible}
            onConfirm={this._handleOpenTimePicked}
            onCancel={this._toggleOpenTimePicker}
          />
          <DateTimePicker
            mode={'date'}
            isVisible={isCloseTimeVisible}
            onConfirm={this._handleCloseTimePicked}
            onCancel={this._toggleCloseTimePicker}
          />
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
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  formInput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.darkBlur,
    paddingHorizontal: 10,
    color: Colors.darkText,
    borderRadius: 5,
    marginTop: 6.2,
    alignItems: 'center',
    justifyContent: 'center'
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
    ...state[nameOfMessengerReducers]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(messengerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountBreakScheduleScreen)
