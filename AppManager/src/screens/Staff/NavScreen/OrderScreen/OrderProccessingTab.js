import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import { Card12 } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService';
import { nameOfOrderReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { orderActions } from '../../../../actions/index';
import { connect } from 'react-redux'
import _ from 'lodash'

class OrderProccessingTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { title: 'abc', startTime: 'hom nay', content: 'abc', price: '1000' },
        { title: 'abc', startTime: 'hom nay', content: 'abc', price: '1000' }
      ]
    };
  }

  renderItem = ({ item, index }) => {
    return (
      <Card12
        image={item.image}
        title={item.cusName ||
          <Text style={{ fontStyle: "italic", color: Colors.dark1, fontSize: FontStyle.smallText }}>(Khách hàng chưa xác định)</Text>}
        startTime={item.startTime}
        orderId={item.id}
        content={item.isNewCustomer && 'Khách mới'}
        service={item.service}
        promotion={item.promotion}
        detail={_.map(item.service, function (item) { return item.displayName }).join(', ')}
        onPress={() => {
          this.props.actions.getFromQuereDetailOrder({ 'detail': item })
          NavigationService.navigate('Ordering')
        }}
        price={item.totalPrice}
      />
    )
  }

  render() {
    const { listOrder } = this.props
    console.log(this.props)
    return (
      <View style={styles.container}>
        {listOrder.length <= 0 &&
          <View style={styles.noContainer}>
            <Text style={styles.text}>{'Không có bất kỳ đơn hàng đang thực hiện nào'}</Text>
          </View>
        }
        <FlatList showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          data={listOrder}
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
    ...state[nameOfOrderReducers]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(orderActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderProccessingTab)
