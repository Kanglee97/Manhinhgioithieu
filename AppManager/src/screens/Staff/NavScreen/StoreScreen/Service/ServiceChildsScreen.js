import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  SectionList,
  SafeAreaView,
  RefreshControl,
  ScrollView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { Card8, SearchBar, Notification, ButtonGradient, PopUpSelectService, MainHeader, Loading, CustomButtonGradient } from '../../../../../components/react-native-teso';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import NavigationService from '../../../../../navigation/NavigationService';

import _ from 'lodash';
import { nameOfServiceChildReducers, nameOfDetailOrderReducers, nameOfLoadingReducers } from '../../../../../reducers/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { serviceChildActions, orderActions } from '../../../../../actions/index';
import numeral from 'numeral'

class ServiceChildsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      searchText: '',
      searchFilter: [],
      selectedOption: [],
      selectedItem: {},
      isVisiblePopupSelectService: false,
      isVisiblePopupOrder: false,
      checked: false,
    };
  }

  // static navigationOptions = ({ navigation }) => ({
  //   tabBarVisible: (navigation.state.params && navigation.state.params.hideTabBar) === true,
  //   animationEnabled: true
  // })

  // componentWillMount() {
  //   const setParamsAction = NavigationActions.setParams({
  //     params: { hideTabBar: true }
  //   });
  //   this.props.navigation.dispatch(setParamsAction);
  // }

  // componentWillUnmount() {
  //   const setParamsAction = NavigationActions.setParams({
  //     params: { hideTabBar: false }
  //   });
  //   this.props.navigation.dispatch(setParamsAction);
  // }

  _togglePopupSelectService = () => {
    this.setState({ isVisiblePopupSelectService: !this.state.isVisiblePopupSelectService });
  }

  _togglePopupOrder = () => {
    this.setState({ isVisiblePopupOrder: !this.state.isVisiblePopupOrder });
  }

  componentDidMount = () => {
    this.loadData()
  }

  loadData = () => {
    this.props.actions.fetchModelServiceChildRequest({ 'serviceId': this.props.serviceId })
    this.props.actions.fetchOptionServiceChildRequest({ 'serviceId': this.props.serviceId })
    console.log('ServiceChildsScreen componentDidMount', this.props)
  }

  viewModalDetail(item) {
    NavigationService.navigate('ModalDetail', {
      modalId: item.id,
    })
  }

  renderItem = ({ item, index }) => {
    console.log('renderItem ServiceChildsScreen', item)
    return (
      // item.thumbnail[0] ||
      <Card8 url={item.thumbnail[0] || ''}
        modelStyle={{
          height: 93.11,
        }}
        title={item.displayName}
        price={item.price}
        addPress={() => {
          let tmpData = []
          _.forEach(this.props.detail.service, function (serviceChildItem) {
            if (serviceChildItem.id == item.id) {
              tmpData = serviceChildItem.data
            }
          })
          this.setState({
            selectedItem: item,
            selectedOption: tmpData
          })
          this._togglePopupSelectService()
        }}
        onPress={() => this.viewModalDetail(item)}
      />
    )
  }

  findChecked = (item) => {
    return !(_.findIndex(this.state.selectedOption, function (findItem) {
      return (findItem.data.id == item.id)
    }) == -1)
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


  render() {
    const { searchText } = this.state;
    const listData = this.props.model
    const { option = [] } = this.props
    console.log(this.state.searchFilter)
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => NavigationService.navigate('StoreStaff')}
          centerComponent={this.props.displayName}
        />
        <View>
          <SearchBar
            onChangeText={(text) => {
              this.searchFilterFunction(text)
              this.setState({ searchText: text })
            }}
            value={searchText}
            onClear={() => this.setState({ searchText: '' })}
          />
          {listData.length <= 0 &&
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.text, { marginTop: 50 }]}>Chưa có dịch vụ nào</Text>
            </View>}
          <FlatList showsVerticalScrollIndicator={false}
            numColumns={1}
            data={this.state.searchText == '' ? listData : this.state.searchFilter}
            refreshControl={
              <RefreshControl
                refreshing={this.props.isLoading}
                onRefresh={this.loadData}
              />
            }
            style={{ height: Layout.window.height * 0.75 }}
            contentContainerStyle={{ alignItems: 'center' }}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => `${index}`}
          />
        </View>
        <PopUpSelectService
          isVisible={this.state.isVisiblePopupSelectService}
          onSwipe={() => this._togglePopupSelectService()}
          swipeThreshold={50}
          onClose={() => this._togglePopupSelectService()}
          url={(this.state.selectedItem.thumbnail != undefined) ? this.state.selectedItem.thumbnail[0] : ''}//'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fu%E1%BB%91n%2Fkieu-toc-dep-2018-8.png?alt=media&token=3e458ddc-7ca3-48b7-9912-6d39de98a78d'}
          title={this.state.selectedItem.displayName || ''}
          price={this.state.selectedItem.price + _.sumBy(this.state.selectedOption, 'data.price') || ''}
          bottomBlock={
            <View style={{ width: Layout.window.width, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 10 }}>
              <ButtonGradient
                onPress={() => {
                  this._togglePopupSelectService()
                  const data = {
                    'serviceParrent': {
                      'id': this.props.serviceId,
                      'displayName': this.props.displayName
                    },
                    'serviceChild': this.state.selectedItem,
                    'listOption': this.state.selectedOption
                  }
                  this.props.actions.updateOption(data)
                }}
                content={'Thêm vào giỏ hàng'}
              />
            </View>
          }>
          {option.length <= 0 &&
            <View style={styles.noContainer}>
              <Text style={styles.text}>{'Dịch vụ này không có tùy chọn nào.'}</Text>
            </View>
          }
          <SectionList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ width: Layout.window.width * 0.9, marginLeft: Layout.window.width * 0.05 }}
            style={{
              height: option.length > 0 ? Layout.window.height * 0.35 : 0,
              marginBottom: option.length > 0 ? 50 : 0,
            }}
            renderItem={({ item, index, section }) => {
              return (
                <TouchableOpacity
                  style={[styles.displayInlineBlock, { flex: 1, alignItems: 'center', marginBottom: 4 }]}
                  onPress={() => {
                    console.log('item click')
                    //Lấy danh sách các tuỳ chọn đã được chọn ra
                    let listData = this.state.selectedOption;
                    //Tìm kiếm nếu danh sách tuỳ chọn od94 dã tồn tại serviceId
                    if ((_.isEmpty(listData) || _.findIndex(
                      listData,
                      function (findItem) {
                        // Nếu tìm thấy dịch vụ đó đã được chọn trong danh sách thì sẽ kiểm tra, 
                        // nếu trùng thì sẽ xoá tuỳ chọn đó ra khỏi dịch vụ (double click)
                        // nếu không thì thêm tuỳ chọn đó vào listDAta
                        if (findItem.id == section.id) {
                          if (findItem.data.id == item.id) {
                            findItem.data = {}
                          }
                          else {
                            findItem.data = item
                          }
                          return true;
                        }
                        return false;
                      }) == -1)) {
                      //nếu không tìm thấy tuỳ chọn dịch vụ đó thì them dịch vụ đó vào danh sách listdata và lưu vào state
                      listData = _.concat(
                        listData,
                        {
                          'id': section.id,
                          'displayName': section.displayName,
                          'data': item
                        })
                    }
                    // xoá cách dịch vụ không có tuỳ chọn không có tuỳ chọn con (không có tuỳ chọn) - note(không thể chọn tuỳ chọn cha)
                    listData = _.remove(listData, function (item) { return item.data.id != undefined })
                    this.setState({
                      selectedOption: listData
                    }, () => {
                      console.log(this.state.selectedOption)
                    })
                  }}>
                  {this.findChecked(item) ?
                    <FontAwesome
                      name={'dot-circle-o'}
                      size={20}
                      color={Colors.functionColorLight}
                      style={{ marginRight: 5 }}
                    />
                    : <FontAwesome
                      name={'circle-o'}
                      size={20}
                      color={Colors.functionColorLight}
                      style={{ marginRight: 5 }}
                    />
                  }
                  <View style={{ flex: 2, alignItems: 'flex-start' }}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 5 }}>
                    <Text>{numeral(item.price).format('0,0')} đ</Text>
                  </View>
                </TouchableOpacity>)
            }}
            renderSectionHeader={({ section: { displayName } }) => (
              <Text style={{ fontSize: FontStyle.mdText - 2, marginVertical: 10, fontWeight: 'bold', color: Colors.darkText }}>{displayName}</Text>
            )}
            sections={option}
            keyExtractor={(item, index) => item + index}
          />
        </PopUpSelectService>
        <PopUpSelectService
          isVisible={this.state.isVisiblePopupOrder}
          onSwipe={() => this._togglePopupOrder()}
          onlyList
          swipeThreshold={50}
          onClose={() => this._togglePopupOrder()}
          bottomBlock={(!_.isEmpty(this.props.detail.service) || !_.isEmpty(this.props.detail.promotion)) &&
            <View style={{ width: Layout.window.width, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: 10 }}>
              <CustomButtonGradient
                width={130}
                content={'Bắt đầu dịch vụ'}
                onPress={() => {
                  this._togglePopupOrder()
                  this.props.navigation.navigate('Ordering')
                }}
              />
            </View>
          }>
          <ScrollView showsVerticalScrollIndicator={false} style={{ height: Layout.window.height * 0.6 }}>
            {_.isEmpty(this.props.detail.service) && _.isEmpty(this.props.detail.promotion) &&
              <View style={{ height: Layout.window.height * 0.5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'normal', color: Colors.darkText }}>Không có dịch vụ hay khuyến mãi được chọn</Text>
              </View>}
            {!_.isEmpty(this.props.detail.service) && <Text style={{ marginLeft: Layout.window.width * 0.0375, marginTop: 4, fontWeight: 'bold', color: Colors.darkText }}>
              Dịch vụ được chọn
            </Text>}
            <FlatList showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${index}`}
              data={this.props.detail.service}
              contentContainerStyle={{ alignItems: 'center' }}
              renderItem={({ item, index }) => {
                console.log('FlatList', item)
                return (
                  <Card8
                    url={item.thumbnail[0]}
                    title={item.displayName}
                    price={item.price + _.sumBy(item.data, 'data.price')}
                    icon={!item.done}
                    removeIcon
                    addPress={() => {
                      this.props.actions.removeServiceChild({
                        'id': item.id
                      })
                    }}
                  />
                )
              }}
            />
            {!_.isEmpty(this.props.detail.promotion) && <Text style={{ marginLeft: Layout.window.width * 0.0375, marginTop: 4, fontWeight: 'bold', color: Colors.darkText }}>
              Khuyến mãi được chọn
            </Text>}
            <FlatList showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => `${index}`}
              data={this.props.detail.promotion}
              renderItem={({ item, index }) => {
                console.log('FlatList', item)
                return (
                  <Card8
                    url={item.thumbnail}//'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fu%E1%BB%91n%2Fkieu-toc-dep-2018-8.png?alt=media&token=3e458ddc-7ca3-48b7-9912-6d39de98a78d'}//item.thumbnail[0] || ''}
                    title={`[KHUYẾN MÃI] ${item.displayName}`}
                    icon={!item.done}
                    price={item.price}
                    removeIcon
                    isPopup
                    addPress={() => {
                      this.props.actions.removePromotion({
                        'newPromotion': { 'id': item.id }
                      })
                    }}
                  />
                )
              }}
            />
          </ScrollView>
        </PopUpSelectService>
        {!((_.isEmpty(this.props.detail.service)) && (_.isEmpty(this.props.detail.promotion))) &&
          <Notification
            notificationPress={this._togglePopupOrder}
            number={!(_.isEmpty(this.props.detail.service)) ? this.props.detail.service.length : 0}
            content='Dịch vụ được chọn'
            label={'Bắt đầu dịch vụ'}
            btnWidth={130}
            style={{ translateY: !(_.isEmpty(this.props.detail.service)) ? 0 : 70 }}
            onPress={() => this.props.navigation.navigate('Ordering')}
          />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
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
  },
  noContainer: {
    backgroundColor: Colors.bg,
    alignItems: 'center',
    paddingTop: '20%',
    borderLeftColor: Colors.functionColorLight,
    borderRightColor: Colors.functionColorLight,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    height: Layout.window.height * 0.35
  },
  text: {
    color: Colors.darkText,
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfServiceChildReducers],
    ...state[nameOfDetailOrderReducers],
    ...state[nameOfLoadingReducers][serviceChildActions.FETCH_MODEL_SERVICE_CHILD, serviceChildActions.FETCH_OPTION_SERVICE_CHILD]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...serviceChildActions, ...orderActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServiceChildsScreen) 