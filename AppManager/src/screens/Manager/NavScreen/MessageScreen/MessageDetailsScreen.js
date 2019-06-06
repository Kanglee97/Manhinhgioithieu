import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { FormInput, ButtonGradient, MainHeader, MaterialIcon } from '../../../../components/react-native-teso';
import { nameOfMessengerReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService';
import { messengerActions } from '../../../../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _, { get } from 'lodash';

class MessageDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toObjects: '',
      title: '',
      content: '',
      createState: null,
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
      if (this.state.createState != true) {
        this.setState({
          toObjects: this.props.navigation.getParam('receiveInfo') || false,
          title: this.props.navigation.getParam('title') || false,
          content: this.props.navigation.getParam('content') || false,
        })
      }
    })
  }

  renderPlus() {
    return <TouchableOpacity style={{ width: 50, height: 25, justifyContent: 'center' }} onPress={() => NavigationService.navigate('SelectObject')}>
      <MaterialIcon name={'group-add'} size={25} color={Colors.functionColorDark} />
    </TouchableOpacity>
  }

  sendMessenger = (toObjects, lstReceiver) => {
    const messenger = {
      'title': this.state.title,
      'content': this.state.content,
      'managerId': get(storeService.getSpecificState(nameOfProfileReducers).user, 'id'),
      'receiverInfo': toObjects,
      'isAll': false,
      'lstReceiver': lstReceiver
    }
    const data = {
      'messenger': messenger,
      callback: () => {
        storeService.dispatch(messengerActions.getMessengerManagerRequest({ 'managerId': get(storeService.getSpecificState(nameOfProfileReducers).user, 'id') }))
        NavigationService.goBack()
      }
    }
    this.props.actions.sendMessengerRequest(data)
  }

  render() {
    const { title, content, createState } = this.state;
    let toObjects = ''
    let lstReceiver = []
    if (createState) {

      _.forEach(this.props.lstReceiver, function (item) {
        lstReceiver.push(item.id)
        toObjects = toObjects + `${item.firstName} ${item.lastName || ''},`
      })
      toObjects.slice(0, -1)
    } else {
      toObjects = this.state.toObjects
    }
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <MainHeader
            backgroundColor={Colors.lightBg}
            leftPress={() => NavigationService.navigate('Message')}
            centerComponent={this.state.createState ? 'Tạo thư mới' : null}
          />
          <View style={{ alignItems: 'center' }}>
            <View>
              <Text style={styles.formLabel}>
                {'Đến'} <Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text>
              </Text>
              <TouchableOpacity style={[styles.formInput]} onPress={() => NavigationService.navigate('SelectObject')}>
                <Text>{toObjects}</Text>
                <View style={[styles.rightComponent]}>
                  {this.renderPlus()}
                </View>
              </TouchableOpacity>
            </View>
            <FormInput
              label={'Tiêu đề'}
              textBox
              line
              require
              inputStyle={{ width: Layout.window.width * 0.9 }}
              onChangeText={(text) => this.setState({ title: text })}
              value={title}
            />
            <FormInput
              label={'Nội dung'}
              richText
              require
              maxLength={400}
              inputStyle={[{ width: Layout.window.width * 0.9 }]}
              onChangeText={(text) => this.setState({ content: text })}
              value={content}
              count={
                <Text>{`${content.length}/${400}`}</Text>
              }
            />
            <View style={{ margin: 20 }}>
              <ButtonGradient
                labelStyle={{ fontWeight: 'bold', }}
                onPress={() => this.sendMessenger(toObjects, lstReceiver)}
                disabled={
                  !toObjects ||
                  !content ||
                  !title}
                content={'Gửi'}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView >
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
  formInput: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.functionColorLight,
    width: Layout.window.width * 0.9,
    paddingBottom: 5,
    paddingLeft: 5,
    justifyContent: 'flex-end'
  },
  rightComponent: {
    position: 'absolute',
    top: '50%',
    height: '100%',
    right: 0,
    marginRight: -15,
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetailsScreen)
