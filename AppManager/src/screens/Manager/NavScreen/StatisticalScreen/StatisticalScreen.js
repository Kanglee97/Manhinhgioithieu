import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import StatisticalTabNavigator from '../../../../navigation/Manager/StatisticalTabNavigator';
import { MainHeader } from '../../../../components/react-native-teso';

class StatisticalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          centerComponent={'Báo cáo'}
        />
        <StatisticalTabNavigator ref={nav => {
          this.navigator = nav;
        }} />
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
  dropDownStores: {
    backgroundColor: Colors.lightBg,
    width: Layout.window.width,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default StatisticalScreen
