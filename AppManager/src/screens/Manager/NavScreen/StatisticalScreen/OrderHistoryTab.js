import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, ScrollView } from 'react-native';
import { Card12, Loading, OrderCard } from '../../../../components/react-native-teso'

import { nameOfOrderReducers, nameOfLoadingReducers, nameOfProfileReducers } from '../../../../reducers'
import { orderActions } from '../../../../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import * as storeService from '../../../../sagas/storeService'
import _, { get } from 'lodash'
import Layout from '../../../../assets/styles/Layout';
import NavigationService from '../../../../navigation/NavigationService';
import Moment from 'moment';

class OrderHistoryTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount = () => {
    console.log('component willmount')
  }

  componentDidMount = () => {
    console.log('component didmount')
    this.loadData()
  }

  loadData = (fromDate, toDate) => {
    const data = {
      'store': {
        'storeIds': get(storeService.getSpecificState(nameOfProfileReducers), 'storeList').map(item => item.id),
        'fromDate': fromDate || '',
        'toDate': toDate || ''
      }
    }
    console.log(data);
    this.props.actions.fetchOrderByStoreRequest(data)
  }

  renderItem = ({ item, index }) => {
    return (
      <OrderCard
        title={item.cusName == 'null' ? 'Khách hàng' : item.cusName}
        address={item.address || 'Địa chỉ chưa xác định'}
        orderId={item.id}
        style = {{alignSelf: 'center'}}
        price={item.totalPrice}
      />
    )
  }

  render() {
    console.log('component Render', this.props)
    if (this.props.isLoading)
      return (
        <Loading />
      )
    if (_.isEmpty(this.props.listDoneOrder))
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, height: Layout.window.height * 0.5, justifyContent: 'center', alignItems: 'center' }}>
            <Text>
              Bạn chưa có đơn hàng nào
            </Text>
          </View>
        </ScrollView>
      )
    return (
      <FlatList showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoading}
            onRefresh={this.loadData}
          />
        }
        data={this.props.listDoneOrder}
        keyExtractor={(item, index) => `${index}`}
        renderItem={this.renderItem}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfOrderReducers],
    ...state[nameOfLoadingReducers][orderActions.FETCH_ORDER_BY_STORE]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...orderActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistoryTab)
