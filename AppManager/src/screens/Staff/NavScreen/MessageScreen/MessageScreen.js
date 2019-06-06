import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { nameOfMessengerReducers, nameOfProfileReducers, nameOfStoreDetailReducers, nameOfLoadingReducers } from '../../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MessageCard, MainHeader, MaterialIcon, Loading } from '../../../../components/react-native-teso';
import { storeDetailActions, messengerActions } from '../../../../actions/index';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash'

class MessageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      storeId: '',
      ownerId: null,
      displayName: '',
      address: '',
      messengers: []
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    const { navigation } = this.props;
    console.log('store screen did mount props', this.props)
    this.loadData();
  }

  loadData = () => {
    const user = {
      'managerId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.ownerId') || 0,
      'empId': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
    }
    const data = {
      'user': user,
      callback: () => {
        this.setState({
          messengers: [...this.props.messengers]
        })
      }
    }
    this.props.actions.getMessengerEmployeeRequest(data)
  }

  renderCenterComponent() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.lightText, fontWeight: 'bold' }}>
          Tin nhắn
        </Text>
      </View>
    );
  }
  renderRightComponent() {
    return (
      <TouchableOpacity style={styles.container} onPress={() => NavigationService.navigate('MessageDetails')}>
        <MaterialIcon name={'create'} size={16} color={Colors.lightText} />
      </TouchableOpacity>
    )
  }

  render() {
    const { messengers } = this.state;
    if (this.props.isLoading)
      return
    <Loading />
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          centerComponent={'Tin nhắn'}
          containerStyle={{
            borderBottomColor: Colors.lightGreyColor,
            borderBottomWidth: 1,
          }}
          rightComponent={
            <MaterialIcon button name={'sync'} size={25} color={Colors.functionColorDark} />
          }
          rightPress={() => this.loadData()}
        />
        {messengers.length <= 0 &&
          <View style={styles.noContainer}>
            <Text style={styles.text}>{'Không có bất kỳ tin nhắn nào.'}</Text>
          </View>
        }
        <FlatList showsVerticalScrollIndicator={false}
          data={messengers}
          numColumns={1}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.loadData}
            />
          }
          contentContainerStyle={styles.messageBlock}
          renderItem={({ item }) =>
            <MessageCard
              title={item.title}
              time={item.time}
              content={item.content}
              onPress={() => NavigationService.navigate('MessageDetails', {
                toObject: item.receiveInfo,
                title: item.title,
                content: item.content,
                onGoBack: () => {
                  this.loadData()
                }
              })}
            />
          }
          keyExtractor={(item, index) => `${index}`}
        />
      </SafeAreaView >
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
  messageBlock: {
    width: Layout.window.width,
    alignItems: 'center',
  },
  noContainer: {
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  text: {
    color: Colors.darkText,
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfMessengerReducers],
    ...state[nameOfLoadingReducers][
    messengerActions.GET_MESSENGER_MANAGER
    ]
    //Bug loading
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(messengerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen)
