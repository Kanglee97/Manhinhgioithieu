import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Text
} from 'react-native';
import { nameOfOptionReducers, nameOfServiceChildReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers';
import { AddItem, PopUpInput, TitleItem, Loading } from '../../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { detailOptionActions, serviceChildActions } from '../../../../../actions';
import NavigationService from '../../../../../navigation/NavigationService';
import * as storeService from '../../../../../sagas/storeService'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _, { get } from 'lodash'

class OptionTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      optionAdded: '',
      isPopupInputVisible: false,
      options: [],
      refreshing: false
    };
    this.renderItem = this.renderItem.bind(this);
    this.loadData = this.loadData.bind(this);
    this.createOption = this.createOption.bind(this);
    this.navigationToOptionChild = this.navigationToOptionChild.bind(this);
    this._togglePopupInput = this._togglePopupInput.bind(this);
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.loadData()
  }

  loadData = () => {
    const data = {
      'serviceId': this.props.serviceId,
      callback: () => {
      }
    }
    this.props.actions.fetchOptionServiceChildRequest(data);
  }

  createOption = (optionDisplayName) => {
    const option = {
      'displayName': optionDisplayName,
      'type': 'option',
      'serviceId': this.props.serviceId,
      'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
    }
    const data = {
      'option': option,
      callback: () => {
        this.loadData();
        this._togglePopupInput();
      }
    }
    this.props.actions.createOptionServiceChildRequest(data);
  }

  navigationToOptionChild = (id, displayName, serviceId, data) => {
    NavigationService.navigate('OptionChilds', {
      optionId: id,
      displayName: displayName,
      serviceId: serviceId,
      data: data,
      onGoBack: () => {
        console.log('onGoBack')
        this.loadData()
      }
    })
  }

  _togglePopupInput = () => this.setState({ isPopupInputVisible: !this.state.isPopupInputVisible, optionAdded: '' });

  renderItem = ({ item, index }) => {
    if (!item.id) {
      return (
        <AddItem label={'Thêm mục tùy chọn'} onPress={this._togglePopupInput} />
      )
    } else {
      return (
        <TitleItem title={item.displayName} onPress={() => this.navigationToOptionChild(item.id, item.displayName, this.props.serviceId, item.data)} />
      )
    }
  }

  render() {
    const { searchText, options } = this.state;
    const option = _.concat(this.state.options, this.props.option)
    console.log('OptionTab ', this.props)
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        {option.length <= 0 &&
          <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Text style={[styles.text]}>Hãy tạo các tùy chọn cho dịch vụ này</Text>
            <Text style={[styles.text, { marginBottom: 10 }]}>để người dùng lựa chọn nhé!</Text>
            <AddItem label={'Thêm mục tùy chọn'} onPress={this._togglePopupInput} />
          </View>}
        <FlatList showsVerticalScrollIndicator={false}
          style={{ height: Layout.window.height * 0.70 }}
          data={_.concat({ none: 0 }, option)}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.loadData} />
          }
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
        <PopUpInput isVisible={this.state.isPopupInputVisible}
          title={'Thêm mục tùy chọn'}
          onChangeText={(text) => this.setState({ optionAdded: text })}
          value={this.state.optionAdded}
          placeholder={'Vd: Thuốc uốn, độ dài tóc...'}
          submitDisabled={!this.state.optionAdded}
          pressSubmit={() => this.createOption(this.state.optionAdded)}
          content={'Tạo'}
          pressCancel={this._togglePopupInput}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    height: '100%'
  },
  text: {
    color: Colors.darkText,
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    lineHeight: 25
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfServiceChildReducers],
    ...state[nameOfOptionReducers],
    ...state[nameOfLoadingReducers][serviceChildActions.FETCH_OPTION_SERVICE_CHILD]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...serviceChildActions, ...detailOptionActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionTab)