
import { nameOfServiceChildReducers, nameOfLoadingReducers, nameOfAccountPackageReducers } from '../../../../../reducers/index';
import { AddItem, SearchBar, Card8, Loading, PopUpRemind } from '../../../../../components/react-native-teso';
import { View, SafeAreaView, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { FETCH_MODEL_SERVICE_CHILD } from '../../../../../actions/serviceChildActions';
import NavigationService from '../../../../../navigation/NavigationService';
import * as storeService from '../../../../../sagas/storeService'
import { serviceChildActions } from '../../../../../actions';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import _, { get } from 'lodash';


class ModelTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelList: [
        { nope: '0' },
      ],
      searchText: '',
      searchFilter: [],
      // listData: [],
      // tempData: [],
      numberOfServiceChild: 0,
      numberOfState: 0,
      isVisibleUpgradeService: false,
      refreshing: false
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount = async () => {
    this.loadData();
    this.getBanned();
  }

  getBanned = () => {
    this.setState({
      numberOfServiceChild: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentPackage.designLimit'),
      numberOfState: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentState.designCount')
    })
  }

  _toggleLimitPopup = () => {
    this.setState({
      isVisibleUpgradeService: !this.state.isVisibleUpgradeService
    })
  }

  loadData = () => {
    this.setState({ refreshing: true })
    const data = {
      'serviceId': this.props.serviceId,
      callback: () => {
        this.setState({ refreshing: false })
      }
    }
    this.props.actions.fetchModelServiceChildRequest(data)
  }

  searchFilterFunction = (searchText, listData, tempData) => {
    if (searchText !== '') {
      const newData = listData.filter(item => {
        const itemData = `${String(item.id).toUpperCase()}
        ${String(item.displayName).toUpperCase()}
        ${String(item.price).toUpperCase()}`;
        const textData = searchText.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      listData = newData;
    } else if (searchText === '') {
      listData = tempData;
    }
  };

  renderItem = ({ item, index }) => {
    if (!item.id)
      return (
        <AddItem
          label={'Thêm kiểu dáng'}
          onPress={() => NavigationService.navigate('EditModal', {
            serviceId: this.props.serviceId,
            onGoBack: () => {
              this.props.screenProps.onGoBack()
              setTimeout(() => this.loadData(), 500)
            }
          })}
        />
      )
    else {
      return (
        <Card8
          modelStyle={{ height: 93.11, }}
          url={item.thumbnail[0] || ''}
          title={item.displayName}
          price={item.price}
          onPress={() => NavigationService.navigate('ModalDetail', {
            modalId: item.id,
            onGoBack: () => {
              this.props.screenProps.onGoBack()
              this.loadData()
            }
          })}
        />
      )
    }
  }

  searchFilterFunction = text => {
    const newData = this.props.model.filter(item => {
      const itemData = `${item.displayName.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    console.log(newData)
    this.setState({ searchFilter: newData });
  };

  render = () => {
    const { searchText } = this.state;
    if (this.props.isLoading)
      return (
        <Loading />
      )
    else return (
      <SafeAreaView style={styles.container}>
        {this.props.model.length <= 0 &&
          <View style={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Text style={[styles.text]}>Hãy tạo các kiểu dáng cho dịch vụ này</Text>
            <Text style={[styles.text, { marginBottom: 10 }]}>để người dùng lựa chọn nhé!</Text>
            <AddItem
              label={'Thêm kiểu dáng'}
              onPress={() => NavigationService.navigate('EditModal', {
                serviceId: this.props.serviceId,
                onGoBack: () => {
                  this.props.screenProps.onGoBack()
                  setTimeout(() => this.loadData(), 500)
                }
              })}
            />
          </View>}
        <FlatList showsVerticalScrollIndicator={false}
          numColumns={1}
          data={(this.state.searchText == '') ? _.concat({ none: 0 }, this.props.model) : this.state.searchFilter}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.loadData}
            />
          }
          style={{ height: Layout.window.height * 0.7 }}
          contentContainerStyle={{ alignItems: 'center' }}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `${index}`}
        />
        <PopUpRemind
          isVisibleUpgradeStore={this.state.isVisibleUpgradeService}
          onBackdropPress={this._toggleLimitPopup}
          limitContent={`Bạn đã tạo ${this.state.numberOfState} dịch vụ và đã đạt giói hạn tạo thêm dịch vụ, hãy nâng cấp tài khoản để được sử dụng nhiều dịch vụ hơn!`}
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
    backgroundColor: Colors.bg,
    flex: 1,
  },
  displayInlineBlock: {
    flexWrap: 'wrap',
    flexDirection: 'row',
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
    ...state[nameOfLoadingReducers][FETCH_MODEL_SERVICE_CHILD]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(serviceChildActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelTab)
