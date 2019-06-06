import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  FlatList,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MessageCard, MainHeader, Loading, MaterialIcon } from '../../../../components/react-native-teso';
import NavigationService from '../../../../navigation/NavigationService';
import Swipeout from 'react-native-swipeout'
import * as storeService from '../../../../sagas/storeService';

import { get } from 'lodash'
import { nameOfMessengerReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { storeDetailActions, messengerActions } from '../../../../actions/index';
import { connect } from 'react-redux';

class MessageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      storeId: '',
      ownerId: null,
      displayName: '',
      address: '',
      messages: [
        { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
        { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
      ]
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    const { navigation } = this.props;
    console.log('store screen did mount props', this.props)
    this.loadData()
    // this.setState({
    //   storeId: this.props.storeId,
    //   displayName: this.props.data.displayName || '',
    //   address: this.props.data.address || ''
    // })
  }

  loadData = () => {
    const data = {
      'managerId': get(storeService.getSpecificState(nameOfProfileReducers).user, 'id'),
    }
    this.props.actions.getMessengerManagerRequest(data)
  }

  render() {
    const { messengers } = this.props;
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.bg}
          centerComponent={'Tin nhắn'}
          leftPress={() => NavigationService.navigate('Account')}
          rightComponent={<MaterialIcon button name={'create'} size={25} color={Colors.functionColorDark} />}
          rightPress={() => NavigationService.navigate('MessageDetails', {
            createState: true
          })}
          containerStyle={{
            borderBottomColor: Colors.lightGreyColor,
            borderBottomWidth: 1,
          }}
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
          style={styles.messageBlock}
          renderItem={({ item }) =>
            // <Swipeout
            //   style={{ alignSelf: 'center', marginHorizontal: 20, paddingHorizontal: 10, backgroundColor: Colors.bg }}
            //   right={
            //     [{
            //       component:
            //         <TouchableOpacity
            //           style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', }}
            //           onPress={() => {
            //             this.props.actions.deleteMessengerManagerRequest({ 
            //               'item': item.id,
            //               callback: () => {
            //                 this.loadData()
            //               }
            //             })
            //           }}>
            //           <MaterialIcon button name={'close'} size={30} color={Colors.dangerColor} />
            //         </TouchableOpacity>,
            //       backgroundColor: Colors.bg
            //     }]}>
              <View style = {{padding: 2, width: Layout.window.width, alignItems: 'center'}}>
                < MessageCard
                  title={item.title}
                  time={item.time}
                  content={item.content}
                  cardStyle={{ paddingHoriziontal: 2 }}
                  onPress={() => NavigationService.navigate('MessageDetails', {
                    title: item.title,
                    content: item.content,
                    receiveInfo: item.receiveInfo
                  })}
                />
              </View>
            // </Swipeout>
          } keyExtractor={(item, index) => `${index}`}
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
  marginTop10: {
    marginTop: 10
  },
  scene: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: Colors.bg,
    position: 'absolute',
    top: 70
  },
  messageBlock: {
    width: Layout.window.width,
    paddingTop: 20,
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
    ...state[nameOfLoadingReducers][messengerActions.GET_MESSENGER_MANAGER]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(messengerActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen)
