import React, { Component } from 'react';
import {
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { MainHeader, MaterialIcon } from '../../../../../components/react-native-teso';
import ServiceChildsTabNavigator from '../../../../../navigation/Manager/ServiceChildsTabNavigator';
import NavigationService from '../../../../../navigation/NavigationService';
import { nameOfServiceChildReducers } from '../../../../../reducers/index';
import { connect } from 'react-redux';
import { serviceChildActions } from '../../../../../actions'
import { bindActionCreators } from 'redux';

class ServiceChildsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      searchText: '',
    };
  }


  static navigationOptions = {
    header: null
  };

  render() {
    const { searchText } = this.state;
    console.log('ServiceChildsScreen render', this.props)
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => NavigationService.navigate('Store')}
          // rightComponent={<AntDesign name='delete' size={20} color= {Colors.dangerColor} />}
          // rightPress={() => this.props.actions.deleteServiceChildRequest({
          //   'serviceId': this.props.serviceId,
          //   callback: () => {
          //     this.props.navigation.state.params.onGoBack()
          //     NavigationService.goBack()
          //   }
          // })}
          centerComponent={this.props.displayName}
          rightComponent={<MaterialIcon button name={'create'} size={20} color={Colors.functionColorDark} />}
          rightPress={() => NavigationService.navigate('EditYourService', {
            'id': this.props.serviceId,
            onGoBack: () => {
              this.props.navigation.state.params.onGoBack()
            }
          })}
        // rightPress={() => this.props.actions.deleteServiceChildRequest({
        //   'serviceId': this.props.serviceId,
        //   callback: () => {
        //     this.props.navigation.state.params.onGoBack()
        //     NavigationService.goBack()
        //   }
        // })}
        />
        <ServiceChildsTabNavigator
          ref={nav => {
            this.navigator = nav;
          }}
          screenProps={{ 'onGoBack': this.props.navigation.state.params.onGoBack }}
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
  containerBody: {
    flex: 1,
    backgroundColor: Colors.bg,
    marginTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfServiceChildReducers]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(serviceChildActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceChildsScreen) 