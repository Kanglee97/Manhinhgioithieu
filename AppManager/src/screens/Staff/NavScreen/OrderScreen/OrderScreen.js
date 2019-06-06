import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';

import OrderTabStaffNavigator from '../../../../navigation/Staff/OrderTabStaffNavigator';
import { MainHeader, MaterialIcon } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';

class OrderScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderCenterComponent() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.lightText, fontWeight: 'bold' }}>
          Cửa hàng
        </Text>
      </View>
    );
  }

  renderRightComponent() {
    return (
      <TouchableOpacity style={styles.container} onPress={() => NavigationService.navigate('Welcome')}>
        <MaterialIcon name={'store'} size={16} color={Colors.lightText} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          centerComponent={'Đơn hàng'}
        />
        <OrderTabStaffNavigator
          ref={nav => {
            this.navigator = nav;
          }}
          fartheProps={this.props.navigation}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
})

export default OrderScreen;
