import React, { Component } from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader } from '../../../../components/react-native-teso';
import StoreTabNavigator from '../../../../navigation/Staff/StoreTabNavigator';
import { nameOfStoreDetailReducers } from '../../../../reducers/index';
import { connect } from 'react-redux';

class StoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      storeId: '',
      ownerId: null,
      displayName: '',
      address: ''
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    const { navigation } = this.props;
    console.log('store screen did mount props', this.props)
    this.setState({
      storeId: this.props.storeId,
      displayName: this.props.data.displayName || 'Cửa hàng',
      address: this.props.data.address || ''
    })
    console.log(this.state.displayName);
  }

  render() {
    const { storeId, displayName, address } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          centerComponent={displayName}
        />
        <StoreTabNavigator ref={nav => {
          this.navigator = nav;
        }} />
      </SafeAreaView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
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
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfStoreDetailReducers]
  }
}

export default connect(mapStateToProps)(StoreScreen)