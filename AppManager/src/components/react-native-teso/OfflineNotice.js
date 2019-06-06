import React, { PureComponent } from 'react';
import { View, Text, NetInfo, Dimensions, StyleSheet } from 'react-native';

import { nameOfConnectionReducers } from '../../reducers/index';
import { bindActionCreators } from 'redux';
import { connectionActions } from '../../actions/index';
import {connect} from 'react-redux'

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.props.actions.changeConnectionOn()
    } else {
        this.props.actions.changeConnectionOff()
    }
  };

  render() {
    if (!this.props.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    position: 'absolute',
    top: 30,
    zIndex: 5,
  },
  offlineText: { color: '#fff' }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfConnectionReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(connectionActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice)