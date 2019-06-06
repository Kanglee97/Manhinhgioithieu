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
  SafeAreaView
} from 'react-native';
import { MaterialIcon, FormInput, MainHeader } from '../../../../components/react-native-teso';
import { nameOfMessengerReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService'
import { messengerActions } from '../../../../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _, { get } from 'lodash'


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
      toObjects: this.props.navigation.getParam('toObject', ''),
      title: this.props.navigation.getParam('title', ''),
      content: this.props.navigation.getParam('content', ''),
    }, () => {
    })

  }

  renderPlus() {
    return <TouchableOpacity style={{ width: 50, height: 25, justifyContent: 'center' }} onPress={() => NavigationService.navigate('SelectObject')}>
      <MaterialIcon name={'create'} size={25} color={Colors.functionColorDark} />
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
        this.props.navigation.state.params.onGoBack()
        NavigationService.goBack()
      }
    }
    this.props.actions.sendMessengerRequest(data)
  }

  render() {
    const { toObjects, title, content, createState } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <MainHeader
            backgroundColor={Colors.lightBg}
            leftPress={() => NavigationService.goBack()}
            centerComponent={this.state.createState ? 'Tạo thư mới' : null}
          />
          <View style={{ alignItems: 'center', paddingBottom: 20 }}>
            <FormInput
              label={'Đến'}
              editable={false}
              textBox
              line
              inputStyle={{ width: Layout.window.width * 0.9 }}
              onChangeText={(text) => this.setState({ toObjects: text })}
              value={toObjects}
              rightComponent={createState ? this.renderPlus() : null}
              rightComponentStyle={{ right: -20 }}
            />
            <FormInput
              label={'Tiêu đề'}
              textBox
              editable={false}
              line
              inputStyle={{ width: Layout.window.width * 0.9 }}
              onChangeText={(text) => this.setState({ title: text })}
              value={title}
            />
            <FormInput
              label={'Nội dung'}
              richText
              editable={false}
              inputStyle={[{ width: Layout.window.width * 0.9 }]}
              onChangeText={(text) => this.setState({ content: text })}
              value={content}
              maxLength={400}
              count={
                <Text>{`${content.length}/400`}</Text>
              }
            />
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
  },
  headerIcon: {
    textAlign: 'center',
    backgroundColor: Colors.transparent
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetailsScreen)
