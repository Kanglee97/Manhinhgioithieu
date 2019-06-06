import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, SectionList, FlatList, SafeAreaView } from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import { CustomButtonGradient, PopUpSelectService, ButtonGradient, MainHeader, Notification, Card8 } from '../../../../../components/react-native-teso';
import _ from 'lodash';
import numeral from 'numeral';
import { bindActionCreators } from 'redux';
import { detailModalActions, orderActions, serviceChildActions, detailOptionActions } from '../../../../../actions/index';
import {
  nameOfDetailModalReducers,
  nameOfServiceChildReducers,
  nameOfDetailOrderReducers,
  nameOfLoadingReducers
} from '../../../../../reducers';
import { connect } from 'react-redux'
import NavigationService from '../../../../../navigation/NavigationService';
import { convertPriceToFloat } from '../../../../../helper/validationHelper';
import { Loading } from '../../../../../components/react-native-teso/Loading/index';

class ModelDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modals: [],
      isVisiblePopupSelectService: false,
      selectedOption: [],
      isVisiblePopupOrder: false,
    };
  }

  static navigationOptions = {
    header: null
  };

  _togglePopupSelectService = () => {
    this.setState({ isVisiblePopupSelectService: !this.state.isVisiblePopupSelectService });
  }

  componentDidMount() {
    const data = {
      'modalId': this.props.navigation.getParam('modalId'),
    }
    this.props.actions.fetchDetailModalServiceRequest(data)
  }

  componentWillMount() {
    console.log('ModelDetailScreen will mount')
  }

  renderImageItem = ({ item, index }) => {
    console.log('renderImageItem', item)
    return (
      <View style={{ width: Layout.window.width, height: Layout.window.height * 0.5 }}>
        <Image style={{ width: Layout.window.width, height: Layout.window.height * 0.5 }} source={item !== '' ?
          { uri: `${item}` } :
          require('../../../../../assets/img/default-avatar-blue.png')} />
      </View>
    )
  }
  findChecked = (item) => {
    return !(_.findIndex(this.state.selectedOption, function (findItem) {
      return (findItem.data.id == item.id)
    }) == -1)
  }

  _togglePopupOrder = () => {
    this.setState({ isVisiblePopupOrder: !this.state.isVisiblePopupOrder });
  }


  render() {
    const { modalId, displayName, price, description, thumbnail } = this.props.detailModal
    const { option } = this.props
    console.log(this.props)
    if (this.props.isLoading)
      return (
        <Loading />
      )
    else
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <MainHeader rounded
              darkBar
              backgroundColor={Colors.lightBg}
              leftPress={() => NavigationService.navigate('ServiceChilds')}
              containerStyle={{
                backgroundColor: Colors.transparent,
                position: 'absolute',
                top: 0, left: 0,
                width: Layout.window.width,
                zIndex: 1,
              }}
            />
            <Carousel
              autoplay
              autoplayDelay={750}
              loop
              ref={(c) => { this._carousel = c; }}
              data={thumbnail}
              renderItem={this.renderImageItem}
              sliderWidth={Layout.window.width}
              itemWidth={Layout.window.width}
              contentContainerStyle={styles.carousel} />
            <View style={styles.informationBlock}>
              <Text style={[styles.text, styles.title]}>{displayName}</Text>
              <Text style={[styles.text, styles.price]}>{numeral(price).format('0,0')} đ</Text>
              {description != '' ?
                <View>
                  <Text style={[styles.text, styles.title]}>Mô tả:</Text>
                  <ScrollView showsVerticalScrollIndicator={false} style={[styles.scrollDesc]}>
                    <Text style={[styles.desc]}>
                      {description}
                    </Text>
                  </ScrollView>
                </View> : null}
            </View>
            <View style={styles.btnBlock}>
              <ButtonGradient
                onPress={this._togglePopupSelectService}
                content={'Chọn'}
              />
            </View>
          </ScrollView>
          <PopUpSelectService
            isVisible={this.state.isVisiblePopupSelectService}
            onSwipe={() => this._togglePopupSelectService()}
            swipeThreshold={50}
            onClose={() => this._togglePopupSelectService()}
            url={(thumbnail != undefined) ? thumbnail[0] : ''}
            title={displayName || ''}
            price={numeral(price + _.sumBy(this.state.selectedOption, 'data.price')).format('0,0') || ''}
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
                      'serviceChild': {
                        'id': modalId,
                        'displayName': displayName,
                        'price': convertPriceToFloat(price),
                        'description': description,
                        'thumbnail': thumbnail,
                      },
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
                      url={item.thumbnail}
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
  headerIcon: {
    textAlign: 'center',
    backgroundColor: Colors.transparent
  },
  headerRightComponent: {
    position: 'absolute',
    right: 10,
    top: '65%'
  },
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  informationBlock: {
    flex: 1,
    width: Layout.window.width * 0.9,
    marginLeft: Layout.window.width * 0.05,
    backgroundColor: Colors.lightBg,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    marginTop: -25,
  },
  text: {
    fontWeight: 'bold',
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    lineHeight: 40,
  },
  title: {
  },
  price: {
    color: Colors.functionColorLight
  },
  scrollDesc: {
    width: '100%',
    flexWrap: 'wrap'
  },
  desc: {
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    textAlign: Platform.OS == 'ios' ? 'justify' : 'left',
    lineHeight: 25
  },
  btnBlock: {
    marginTop: 25,
    marginBottom: 45,
    alignItems: 'center',
  },
  delBtn: {
    backgroundColor: Colors.dangerColor,
    height: 40,
    width: Layout.window.width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
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
});

const mapStateToProps = (state, ownProps) => {
  return {
    detailModal: { ...state[nameOfDetailModalReducers] },
    ...state[nameOfServiceChildReducers],
    ...state[nameOfDetailOrderReducers],
    ...state[nameOfLoadingReducers][detailModalActions.FETCH_DETAIL_MODAL_SERVICE, serviceChildActions.FETCH_OPTION_SERVICE_CHILD]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...detailModalActions, ...orderActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModelDetailScreen)