import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, FlatList, SafeAreaView, RefreshControl, StatusBar, } from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { PopUpConfirm, FormInput, MainHeader, Loading } from '../../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Carousel from 'react-native-snap-carousel';
import { ScrollView } from 'react-native-gesture-handler';
import numeral from 'numeral';
import NavigationService from '../../../../../navigation/NavigationService';
import { bindActionCreators } from 'redux';
import { discountActions } from '../../../../../actions/index';
import { connect } from 'react-redux'
import { nameOfDetailDiscountReducers, nameOfLoadingReducers } from '../../../../../reducers';

class DiscountDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false
    };
    this.loadData = this.loadData.bind(this)
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    console.log('DiscountDetailScreen ', this.props)
    //this.loadData()
  }


  loadData = () => {
    const data = {
      'discountId': this.props.id
    }
    this.props.actions.fetchDetailDiscountRequest(data)
  }

  render() {
    const {
      displayName = '',
      description = '',
      startDate = '',
      endDate = '',
      thumbnail = '',
      price = '',
      promotion = '',
      services,
    } = this.props
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
          <MainHeader
            rounded
            darkBar
            backgroundColor={Colors.lightBg}
            leftPress={() => NavigationService.goBack()}
            rightComponent={<FontAwesome5
              name='edit'
              size={20}
              color={Colors.functionColorDark}
            />}
            rightPress={() =>
              NavigationService.navigate('CreateDiscount', {
                isEdit: true,
                onGoBack: () => {
                  this.props.navigation.state.params.onCallBack()
                  this.loadData()
                }
              })}
            containerStyle={{
              backgroundColor: Colors.transparent,
              position: 'absolute',
              top: 0, left: 0,
              width: Layout.window.width,
              zIndex: 1,
            }}
          />
          <Image
            source={{ uri: `${thumbnail}` }}
            style={{ height: Layout.window.height * 0.5, width: Layout.window.width }}
          />
          <View style={[styles.informationBlock]}>
            <Text style={[styles.text, styles.title]}>{displayName}</Text>
            <Text style={[styles.text]}>Ngày bắt đầu: <Text style={{ color: Colors.functionColorDark }}>{startDate}</Text></Text>
            <Text style={[styles.text]}>Ngày kết thúc: <Text style={{ color: Colors.functionColorDark }}>{endDate}</Text></Text>
            <Text style={[styles.text, styles.price]}>Giá: {numeral(price).format('0,0')} đ</Text>
            {/* <Text style={[styles.text, styles.price]}>Giá khuyến mãi: {numeral(promotion).format('0,0')} đ</Text> */}
            <View style={[{ borderTopWidth: 1, borderBottomWidth: 1, borderBottomColor: Colors.lightGreyColor, borderTopColor: Colors.lightGreyColor, justifyContent: 'center', paddingVertical: 10, },
            styles.displayInlineBlock]}>
              <Text style={[styles.text]}>Dịch vụ: </Text>
              <FlatList showsVerticalScrollIndicator={false}
                numColumns={3}
                data={services}
                renderItem={({ item }) =>
                  <View style={[styles.discountService, { width: '31%', justifyContent: 'center', alignItems: 'center' }]} >
                    <Text style={{ color: Colors.lightText, fontSize: FontStyle.smallText }} numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                  </View>
                } keyExtractor={(item, index) => `${index}`}
              />
            </View>
            {description != '' ?
              <View style={{ width: '100%' }}>
                <Text style={[styles.text]}>Mô tả:</Text>
                <ScrollView showsVerticalScrollIndicator={false} style={[styles.scrollDesc]}>
                  <Text style={[styles.desc]}>
                    {description}
                  </Text>
                </ScrollView>
              </View> : null}
          </View>
        </ScrollView >
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

  discountService: {
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.functionColorLight,
    borderRadius: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginRight: 10,
  },
  informationBlock: {
    flex: 1,
    flexWrap: 'wrap',
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
    marginBottom: 20,
  },
  text: {
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    lineHeight: 40,
  },
  title: {
    fontWeight: 'bold',
  },
  price: {
    color: Colors.functionColorDark
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
    marginTop: 20,
    marginBottom: 20,
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
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfDetailDiscountReducers],
    ...state[nameOfLoadingReducers][
    discountActions.FETCH_DISCOUNT,
    discountActions.DELETE_DETAIL_DISCOUNT
    ]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(discountActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscountDetailScreen)