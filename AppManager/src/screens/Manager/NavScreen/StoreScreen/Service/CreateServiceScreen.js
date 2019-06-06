import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  AsyncStorage,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { MainHeader, Notification, Card9, FloatingButton, Loading } from '../../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CreateServiceTabNavigator from '../../../../../navigation/Manager/CreateServiceTabNavigator';

import NavigationService from '../../../../../navigation/NavigationService';
import { bindActionCreators } from 'redux';
import { serviceActions, accountPackageActions } from '../../../../../actions/index';
import { nameOfStoreDetailReducers, nameOfServiceReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers'
import { connect } from 'react-redux'
import * as storeService from '../../../../../sagas/storeService'
import _, { get } from 'lodash'

class CreateServiceScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      serviceData: [],
      selectedService: [],
      storeId: null,
    };
  }

  static navigationOptions = {
    header: null
  };


  componentDidMount = async () => {
    this.loadData()
  }

  loadData = () => {
    const data = {
      'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
      callback: () => {
        console.log(this.props, this.state)
        this.setState({
          serviceData: [...this.props.sampleServiceData]
        })
      }
    }
    this.props.actions.fetchSampleServiceRequest(data)
  }

  selectedItem(id) {
    var tmpArr = this.state.selectedService;
    if (this.checkExistInArray(id, tmpArr) == false) {
      tmpArr.push(id);
    } else {
      this.deleteObj(id, tmpArr);
    }
    this.setState({ selectedService: tmpArr });
  }

  checkExistInArray(id, arr) {
    console.log('checkExistInArray', id, arr)
    if (!(typeof arr !== 'undefined' && arr.length > 0))
      return false
    return (_.findIndex(arr, function (item) { return item == id }) == -1) ? false : true
  }

  deleteObj(id, arr) {
    const index = arr.indexOf(id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  addServiceFromSampleService = () => {
    // var arr = this.state.selectedService;
    // callApi(`/api/store/service-addmulti/${storeId}`, 'POST', JSON.stringify(arr));
    // return NavigationService.navigate('Main');
    const data = {
      'storeId': this.props.storeId,
      'selectedService': this.state.selectedService,
      callback: () => {
        storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
          'managerId':
            get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
              get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
              get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }))

        this.props.navigation.state.params.onGoBack()
        NavigationService.goBack()

      }
    }

    this.props.actions.addServiceFromSampleServiceRequest(data)
  }

  renderItem(item, tmpArr) {
    return (
      <Card9 onPress={() => this.selectedItem(item.id)}
        url={item.thumbnail}
        title={item.displayName}
        checkCondition={this.checkExistInArray(item.id, tmpArr)}
      />
    )
  }

  render() {
    console.log('CreateServiceScreen ', this.props)
    var tmpArr = this.state.selectedService;
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => NavigationService.navigate('Store')}
          centerComponent={'Các dịch vụ mẫu'}
        />
        {/* <CreateServiceTabNavigator
          ref={nav => {
            this.navigator = nav;
          }}
          screenProps={this.props.navigation.state.params} /> */}
        <FlatList showsVerticalScrollIndicator={false}
          data={this.state.serviceData}
          numColumns={3}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.loadData}
            />
          }
          style={{ marginLeft: Layout.window.width * 0.02 }}
          renderItem={({ item, index }) => this.renderItem(item, tmpArr)}
          keyExtractor={(item, index) => `${index}`}
        />
        {_.isEmpty(this.state.selectedService) &&
          <FloatingButton
            onPress={() => {
              NavigationService.navigate('YourServiceTab', {
                onGoBack: () => {
                  this.props.navigation.state.params.onGoBack()
                }
              })
            }} />}
        {!_.isEmpty(this.state.selectedService) &&
          <Notification
            number={(typeof tmpArr !== 'undefined' && tmpArr.length > 0) ? tmpArr.length : 0}
            content='Dịch vụ được chọn'
            style={{ translateY: (typeof tmpArr !== 'undefined' && tmpArr.length > 0) ? 0 : 70 }}
            onPress={() => this.addServiceFromSampleService()} />}
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
    justifyContent: 'center'
  },
  form: {
    marginTop: 20,
    position: 'relative',
  },
});


const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfServiceReducers],
    ...state[nameOfLoadingReducers][serviceActions.FETCH_SAMPLE_SERVICE]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(serviceActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateServiceScreen)


