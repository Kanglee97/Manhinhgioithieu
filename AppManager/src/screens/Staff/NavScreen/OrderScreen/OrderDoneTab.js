import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView } from 'react-native';

import { OrderCard, Loading } from '../../../../components/react-native-teso'
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { nameOfOrderReducers, nameOfLoadingReducers, nameOfProfileReducers } from '../../../../reducers'
import { orderActions } from '../../../../actions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as storeService from '../../../../sagas/storeService'
import { get } from 'lodash'

class OrderDoneTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { title: 'abc', startTime: 'hom nay', content: 'abc', price: '1000' }
      ]
    };
  }

  componentDidMount = () => {
    this.loadData()
  }

  loadData = () => {
    const employee = {
      'fromDate': '',
      'toDate': '',
      'empId': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id')

    }
    const data = {
      'employee': employee
    }
    this.props.actions.fetchOrderByEmployeeRequest(data)
  }

  renderItem = ({ item, index }) => {
    return (
      <OrderCard
        image={item.image}
        title={item.cusName}
        startTime={item.startTime}
        content={item.content}
        price={item.totalPrice}
        style={{
          marginTop: 15,
          alignSelf: 'center'
          // marginBottom: 0
        }}
      />
    )
  }

  render() {
    const { listDoneOrder } = this.props;
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <View style={styles.container}>
        {listDoneOrder.length <= 0 &&
          <View style={styles.noContainer}>
            <Text style={styles.text}>{'Không có bất kỳ đơn hàng đã thực hiện nào.'}</Text>
          </View>
        }
        <FlatList showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.loadData}
            />
          }
          data={listDoneOrder}
          keyExtractor={(item, index) => `${index}`}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bg
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
})

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfOrderReducers],
    ...state[nameOfLoadingReducers][orderActions.FETCH_ORDER_BY_EMPLOYEE]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(orderActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderDoneTab)
