import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  RefreshControl,
  SafeAreaView
} from 'react-native';

import { AddItem, EmployeeCard, Loading, PopUpRemind } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { FlatList } from 'react-native-gesture-handler';
import NavigationService from '../../../../navigation/NavigationService';
import _, { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { employeeActions } from '../../../../actions/index';
import { nameOfEmployeeReducers, nameOfStoreDetailReducers, nameOfLoadingReducers, nameOfAccountPackageReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'

class EmployeeListTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelList: [
        { non: 1 },
      ],
      searchText: '',
      refreshing: false,
      employeeLimit: 0,
      numberOfState: 0,
      isVisibleUpgradeEmployee: false,
    };
    this.getBanned = this.getBanned.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._toggleLimitPopup = this._toggleLimitPopup.bind(this)
    this.user = get(storeService.getSpecificState(nameOfProfileReducers), 'user');
  }

  static navigationOptions = {
    header: null
  };

  getBanned = () => {
    this.setState({
      employeeLimit: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentPackage.employeeLimit'),
      numberOfState: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentState.employeeCount')
    })
  }

  renderItem = ({ item, index }) => {
    if (item.non) {
      return (
        <AddItem
          label={'Thêm nhân viên'}
          onPress={() => {
            if (this.state.employeeLimit <= (this.state.numberOfState - 1))
              this._toggleLimitPopup();
            else
              NavigationService.navigate('CreateEmployee', {
                callback: () => {
                  this._onRefresh()
                }
              })
          }}
          style={{ marginLeft: 0, marginVertical: 10, }}
        />
      )
    }
    else {
      return (
        <EmployeeCard
          title={`${item.firstName || 'Quản lý'} ${item.lastName || ''}`}
          content={item.position || 'Quản lý'}
          image={item.avatar}
          lockCheck
          onPress={() => {
            console.log('navigate to DetailEmployee')
            NavigationService.navigate('DetailEmployee', {
              employeeId: item.id,
              callback: () => {
                this._onRefresh()
              }
            })
          }}
        />
      )
    }
  }

  componentDidMount() {
    this._onRefresh()
    this.getBanned()
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    const data = {
      'storeId': this.user.isManager ? this.user.storeId : get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
      callback: () => {
        console.log(this.props, this.state)
        this.setState({
          refreshing: false
        })
      },
      fallback: () => {
        this.setState({ refreshing: false })
      }
    }
    this.props.actions.fetchAllEmployeeRequest(data)
  }

  _toggleLimitPopup = () => { this.setState({ isVisibleUpgradeEmployee: !this.state.isVisibleUpgradeEmployee }) }

  render() {
    const { searchText, isVisibleUpgradeEmployee } = this.state;
    const listData = _.concat(this.state.modelList, this.props.employees)
    console.log('EmployeeListTab render ', this.props, listData)
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        {listData.length <= 1 &&
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.text, { marginTop: 50 }]}>Hãy thêm nhân viên cho cửa hàng này nhé</Text>
          </View>}
        <FlatList showsVerticalScrollIndicator={false}
          numColumns={1}
          data={listData}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
        <PopUpRemind
          isVisibleUpgradeStore={isVisibleUpgradeEmployee}
          onBackdropPress={this._toggleLimitPopup}
          limitContent={`Bạn đã tạo ${this.state.numberOfState} nhân viên và đã đạt giói hạn. Bạn có muốn tạo thêm nhân viên nữa không? `}
          onPressNo={this._toggleLimitPopup}
          onPressOk={() => {
            this._toggleLimitPopup();
            NavigationService.navigate('UpgradeAccount');
          }}
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
  text: {
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    color: Colors.darkText,
    lineHeight: 17,
    marginTop: 3,
  },
  textNameCustomer: {
    color: Colors.darkText,
  },
  itemImageContainer: {
    height: Layout.window.width * 0.14,
    width: '20%',
    alignItems: 'center'
  },
  image: {
    height: Layout.window.width * 0.14,
    width: Layout.window.width * 0.14,
    borderRadius: Layout.window.width * 0.07,
  },
  itemBodyContainer: {
    marginLeft: 15,
    justifyContent: 'space-around'
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfEmployeeReducers],
    ...state[nameOfLoadingReducers][employeeActions.FETCH_ALL_EMPLOYEE]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(employeeActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeListTab)