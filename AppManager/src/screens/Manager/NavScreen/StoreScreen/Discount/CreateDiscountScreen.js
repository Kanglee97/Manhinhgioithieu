import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { ButtonGradient, FormInput, MainHeader, Loading, MaterialIcon, ButtonSolid, ButtonText, PopUpConfirm } from '../../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { FlatList } from 'react-native-gesture-handler';
import NavigationService from '../../../../../navigation/NavigationService';
import * as storeService from '../../../../../sagas/storeService';
import { importImage } from '../../../../../helper';
import _, { get } from 'lodash';
import Moment from 'moment';
import numeral from 'numeral';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { nameOfServiceReducers, nameOfDetailDiscountReducers, nameOfStoreDetailReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAccountPackageReducers, nameOfAuthReducers } from '../../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { discountActions, accountPackageActions } from '../../../../../actions/index';
import { connect } from 'react-redux'
import { convertPriceToFloat } from '../../../../../helper/validationHelper';



class CreateDiscountScreen extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      loading: false,
      isEdit: false,
      displayName: '',
      description: '',
      discountService: [
        { id: '0' },
        { id: '1', title: 'Nối tóc' },
        { id: '2', title: 'Cắt tóc nữ' },
        { id: '3', title: 'Chăm sóc da' },
        { id: '4', title: 'Nối tóc' },
        { id: '5', title: 'Cắt tóc nữ' },
        { id: '6', title: 'Chăm sóc da' },
        { id: '7', title: 'Nối tóc' },
        { id: '8', title: 'Cắt tóc nữ' },
        { id: '9', title: 'Chăm sóc da' },
      ],
      beforeDiscount: '',
      discountPrice: '',
      startTime: '',
      endTime: '',
      isOpenTimeVisible: false,
      isCloseTimeVisible: false,
      availableImage: '',
      initialOpenTime: new Date('Mon Feb 11 2019 08:00:00 GMT+0700 (Indochina Time)'),
      initialCloseTime: new Date('Mon Feb 11 2019 17:00:00 GMT+0700 (Indochina Time)'),
      isModalVisible: false,
      isChange: false,
      isModalBackVisible: false
    };
    this._toggleOpenTimePicker = this._toggleOpenTimePicker.bind(this)
    this._handleOpenTimePicked = this._handleOpenTimePicked.bind(this)
    this._toggleCloseTimePicker = this._toggleCloseTimePicker.bind(this)
    this._handleCloseTimePicked = this._handleCloseTimePicked.bind(this)
    this.selectImage = this.selectImage.bind(this)
    this.getId = this.getId.bind(this)
    this.editDiscount = this.editDiscount.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
    this.deletePromotion = this.deletePromotion.bind(this)
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.setState({
      isEdit: this.props.navigation.getParam('isEdit', false),
      startTime: Moment().format('DD-MM-YYYY'),
      endTime: Moment().add(3, 'days').format('DD-MM-YYYY'),
    }, () => {
      if (this.state.isEdit) {
        this.setState({
          displayName: this.props.displayName,
          description: this.props.description,
          beforeDiscount: convertPriceToFloat(this.props.price),
          discountPrice: convertPriceToFloat(this.props.promotion),
          startTime: this.props.startDate,
          endTime: this.props.endDate,
          availableImage: this.props.thumbnail,
        })
      }
    })
  }

  _toggleOpenTimePicker = () => this.setState({ isOpenTimeVisible: !this.state.isOpenTimeVisible });

  _handleOpenTimePicked = (time) => {
    console.log('A date has been picked: ', time);
    this.setState({ startTime: Moment(time).format('DD-MM-YYYY') });
    this._toggleOpenTimePicker();
  };

  _toggleCloseTimePicker = () => this.setState({ isCloseTimeVisible: !this.state.isCloseTimeVisible });

  _handleCloseTimePicked = (time) => {
    console.log('A date has been picked: ', time);
    this.setState({ endTime: Moment(time).format('DD-MM-YYYY') });
    this._toggleCloseTimePicker();
  };

  _toggleModalBack = () => this.setState({ isModalBackVisible: !this.state.isModalBackVisible });

  selectImage = () => {
    importImage.selectImage()
      .then(url => {
        this.setState({
          availableImage: url.path
        }, () => {
          console.log('selectImage', this.state, url)
        })
      })
    // this.setState({
    //   availableImage: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fc%E1%BA%AFt%2Ftoc-duoi-phong-1.jpg?alt=media&token=78c78a35-5e61-4153-936c-964948cbfa70'
    // })
  }

  getId(list = []) {
    if (_.isEmpty(list)) {
      return []
    }
    let arr = []
    _.forEach(list, function (item) {
      arr.push(item.id)
    })
    return arr
  }

  createDiscount = async (displayName, description, startDate, endDate, thumbnail, price, promotion, storeId, services) => {
    this.setState({ loading: true })
    let thumbnailImage = ''
    if (thumbnail.substr(0, 4) !== 'http')
      await importImage.uploadImage(thumbnail)
        .then(image => {
          thumbnailImage = image
        })
    else {
      thumbnailImage = thumbnail
    }
    const discount = {
      'displayName': displayName,
      'description': description,
      'startDate': startDate,
      'endDate': endDate,
      'thumbnail': thumbnailImage,
      'price': convertPriceToFloat(price),
      'promotions': convertPriceToFloat(promotion),
      'storeId': storeId,
      'listServiceId': this.getId(services),
      'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
    }
    const data = {
      'discount': discount,
      callback: () => {
        storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
          'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }))
        //this.props.navigation.state.params.onCallBack()
        storeService.dispatch(discountActions.fetchDiscountRequest({
          'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
          callback: () => {

          }
        }))
        this.props.actions.clearDetailDiscount()
        this.setState({ loading: false }, () => {
          this.props.navigation.goBack()
        })
      },
      fallback: () => {
        this.setState({ loading: false })
      }
    }
    this.props.actions.createDiscountRequest(data)
  }

  editDiscount = async (id, displayName, description, startDate, endDate, thumbnail, price, promotion, storeId, services) => {
    this.setState({ loading: true })
    var thumbnailImage = ''
    if (thumbnail.substr(0, 4) !== 'http')
      await importImage.uploadImage(thumbnail)
        .then(image => {
          thumbnailImage = image
        })
    else {
      thumbnailImage = thumbnail
    }
    const discount = {
      'id': id,
      'displayName': displayName,
      'description': description,
      'startDate': startDate,
      'endDate': endDate,
      'thumbnail': thumbnailImage,
      'price': convertPriceToFloat(price),
      'promotions': convertPriceToFloat(promotion),
      'storeId': storeId,
      'listServiceId': this.getId(services),
      'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
    }
    const data = {
      'discount': discount,
      callback: () => {
        this.setState({ loading: false })
        this.props.navigation.state.params.onGoBack()
        NavigationService.goBack()
      },
      fallback: () => {
        this.setState({ loading: false })
      }
    }
    this.props.actions.updateDetailDiscountRequest(data)
  }

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  deletePromotion = () => {
    this.setState({ loading: true }, async () => {
      const data = {
        'discountId': this.props.id,
        callback: () => {
          this.setState({ loading: false })
          storeService.dispatch(discountActions.fetchDiscountRequest({ 'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId') }));
          NavigationService.navigate('DiscountTab')
        },
        fallback: () => {
          this.setState({ loading: false })
        }
      }
      this.props.actions.deleteDetailDiscountRequest(data)
    })
  }

  render() {
    const {
      displayName,
      description,
      beforeDiscount,
      discountPrice,
      startTime,
      endTime,
      isCloseTimeVisible,
      isOpenTimeVisible,
      availableImage,
      isChange
    } = this.state;

    const discountService = this.props.services || [];
    let estimatePrice = 0;
    discountService.forEach(item => { console.log('discountService', item.lowestPrice); estimatePrice = estimatePrice + Number(item.lowestPrice) })
    if (estimatePrice < 0) estimatePrice = 0
    let price = (numeral(beforeDiscount).value() - numeral(discountPrice).value() >= 0) ? numeral(beforeDiscount).value() - numeral(discountPrice).value() : 0
    console.log('CreateDiscountScreen render', 'estimatePrice', estimatePrice, 'beforeDiscount', beforeDiscount, 'price', price, 'discountPrice', discountPrice)
    console.log(this.props)
    if (this.props.isLoading || this.state.loading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => {
            if (this.state.isChange)
              this._toggleModalBack()
            else {
              if (!this.state.isEdit)
                this.props.actions.clearDetailDiscount()
              NavigationService.goBack()
            }
          }}
          centerComponent={this.state.isEdit ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi'}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.containerBody}>
            <FormInput
              line
              label={'Tiêu đề'}
              textBox
              require
              onChangeText={(text) => this.setState({ displayName: text, isChange: true })}
              value={displayName}
              placeholder={'Nhập tiêu đề...'}
            />
            <FormInput
              line
              label={'Mô tả'}
              richText
              onChangeText={(text) => this.setState({ description: text, isChange: true })}
              value={description}
              placeholder={'Nhập mô tả...'}
              count={
                <Text>{`${description.length}/200`}</Text>
              }
            />
            <FormInput
              label={'Dịch vụ khuyến mãi'}
              require>
              <FlatList showsVerticalScrollIndicator={false}
                numColumns={3}
                data={_.concat({ key: 0 }, discountService)}
                style={{ marginTop: 10 }}
                renderItem={({ item }) =>
                  !item.displayName ?
                    <TouchableOpacity
                      style={[styles.addDiscountService]}
                      onPress={() => {
                        this.setState({ isChange: true });
                        this.props.navigation.navigate('AddServiceToDiscount', { discountService: _.drop(discountService) })
                      }}>
                      <Text style={{ color: Colors.functionColorLight }}>Thêm</Text>
                      <FontAwesome5 name={'plus'} size={10} color={Colors.functionColorLight} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      style={[styles.discountService, { width: '31%' }]}
                      onPress={() => { this.props.actions.removeService({ 'service': item }) }}>
                      <Text style={{ color: Colors.lightText, width: '85%', fontSize: FontStyle.smallText }} numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                      <FontAwesome5 name={'times'} size={10} color={Colors.lightText} style={{ marginLeft: 1 }} />
                    </TouchableOpacity>
                }
                keyExtractor={(item, index) => `${index}`}
              />
            </FormInput>
            <View style={styles.finalPriceBlock}>
              <View style={[styles.displayInlineBlock, { marginBottom: -5 }]}>
                <View style={[styles.halfText]}>
                  <Text style={styles.leftText}>Ước tính</Text>
                </View>
                <View style={[styles.halfText, { alignItems: 'flex-end' }]}>
                  <Text style={styles.rightText}>{numeral(estimatePrice).format('0,0')} đ</Text>
                </View>
              </View>
              <View style={[styles.displayInlineBlock]}>
                <View style={[styles.halfText]}>
                  <Text style={styles.leftText}>{'Giá trước khi giảm'}{<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text>}</Text>
                </View>
                <View style={[styles.halfText, { alignItems: 'flex-end' }]}>
                  <FormInput
                    textBox
                    keyboardType={'number-pad'}
                    rightAlign
                    line
                    value={numeral(beforeDiscount).format('0,0')}
                    onChangeText={(text) => this.setState({ beforeDiscount: text, isChange: true })}
                    formStyle={{ marginTop: 0 }}
                    inputStyle={{ width: Layout.window.width * 0.3, paddingRight: 5 }} />
                </View>
              </View>
              <View style={[styles.displayInlineBlock]}>
                <View style={[styles.halfText]}>
                  <Text style={styles.leftText}>{'Số tiền giảm'}{< Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text>}</Text>
                </View>
                <View style={[styles.halfText, { alignItems: 'flex-end' }]}>
                  <FormInput
                    textBox
                    rightAlign
                    line
                    keyboardType={'number-pad'}
                    value={numeral(discountPrice).format('0,0')}
                    onChangeText={(text) => this.setState({ discountPrice: text, isChange: true })}
                    formStyle={{ marginTop: 0 }}
                    inputStyle={{ width: Layout.window.width * 0.3, paddingRight: 5 }} />
                </View>
              </View>
              <View style={[styles.displayInlineBlock]}>
                <View style={[styles.halfText]}>
                  <Text style={[styles.leftText, { fontWeight: 'bold' }]}>Thành tiền</Text>
                </View>
                <View style={[styles.halfText, { alignItems: 'flex-end' }]}>
                  <Text style={[styles.rightText, { fontWeight: 'bold', color: Colors.functionColorDark }]}>{numeral(price).format('0,0')} đ</Text>
                </View>
              </View>
            </View>
            <View style={styles.form}>
              <Text style={styles.formLabel}>{'Thời gian khuyến mãi'}</Text>
              <View style={[styles.displayInlineBlock, { justifyContent: 'space-between' }]}>
                <View style={{ width: '45%' }}>
                  <Text style={styles.formLabel}>Bắt đầu<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                  <TouchableWithoutFeedback onPress={() => {
                    this.setState({ isChange: true })
                    this._toggleCloseTimePicker()
                  }}>
                    <View style={[styles.displayInlineBlock, styles.formInput, { borderColor: Colors.functionColorLight }]}>
                      <Text style={{ flex: 4 }}>{startTime}</Text>
                      <AntDesign
                        name={'calendar'}
                        size={20}
                        color={Colors.functionColorDark}
                        iconStyle={styles.timepicker}
                        onPress={() => { this._toggleOpenTimePicker() }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{ width: '45%' }}>
                  <Text style={styles.formLabel}>Kết thúc<Text style={{ color: 'red', fontSize: FontStyle.smallText }}>*</Text></Text>
                  <TouchableWithoutFeedback onPress={() => {
                    this.setState({ isChange: true })
                    this._toggleCloseTimePicker()
                  }}>
                    <View style={[styles.displayInlineBlock, styles.formInput, { borderColor: Colors.functionColorLight }]}>
                      <Text style={{ flex: 4 }}>{endTime}</Text>
                      <AntDesign
                        name={'calendar'}
                        size={20}
                        color={Colors.functionColorDark}
                        iconStyle={styles.timepicker}
                        onPress={() => { this._toggleCloseTimePicker() }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
            <View style={[styles.form, { justifyContent: 'center', alignItems: 'center' }]}>
              {availableImage != '' ?
                <View>
                  <Image
                    source={{ uri: availableImage.slice(0, 4) !== 'http' ? availableImage : `${availableImage}` }}
                    style={[styles.uploadImage]}
                  />
                  <MaterialIcon
                    button
                    onPress={() => { this.setState({ availableImage: '' }) }}
                    style={{ position: 'absolute', alignSelf: 'flex-end' }}
                    name={'close'}
                    size={10}
                    color={'red'}
                  />
                </View>
                : <TouchableOpacity style={styles.uploadImage} onPress={() => {
                  this.setState({ isChange: true });
                  this.selectImage()
                }}>
                  <FontAwesome5 name='file-image' size={37.46} color={Colors.functionColorLight} />
                  <Text style={{ color: Colors.functionColorLight, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Tải ảnh lên</Text>
                </TouchableOpacity>
              }
            </View>
            <View style={{ alignItems: 'center', marginVertical: 20, }}>
              <ButtonSolid disable={!isChange || !displayName || !beforeDiscount || !startTime || !endTime || !availableImage || _.isEmpty(discountService)}
                backgroundColor={Colors.primaryButton}
                onPress={() => {
                  if (!this.state.isEdit)
                    this.createDiscount(
                      displayName,
                      description,
                      startTime,
                      endTime,
                      availableImage,
                      price,
                      discountPrice,
                      get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
                      discountService
                    )
                  else
                    this.editDiscount(
                      this.props.id,
                      displayName,
                      description,
                      startTime,
                      endTime,
                      availableImage,
                      price,
                      discountPrice,
                      get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
                      discountService
                    )
                }}
                backgroundColor={Colors.primaryButton}
                label={this.state.isEdit ? 'LƯU' : 'TẠO'}
              />
              <ButtonText label={'XÓA'} onPress={this._toggleModal} />
            </View>
          </View>
          <PopUpConfirm
            isVisible={this.state.isModalVisible}
            modalText={'Bạn chắc chắn muốn xóa khuyến mãi này?'}
            confirmText={'Xóa'}
            confirmPress={() => {
              this._toggleModal()
              this.deletePromotion()
            }}
            confirmCancel={'Hủy bỏ'}
            confirmCancelPress={this._toggleModal}
          />
          <DateTimePicker
            mode={'date'}
            minimumDate={new Date()}
            datePickerContainerStyleIOS={Colors.functionColorLight}
            isVisible={isOpenTimeVisible}
            onConfirm={this._handleOpenTimePicked}
            onCancel={this._toggleOpenTimePicker}
          />
          <DateTimePicker
            mode={'date'}
            minimumDate={new Date()}
            datePickerContainerStyleIOS={Colors.functionColorLight}
            isVisible={isCloseTimeVisible}
            onConfirm={this._handleCloseTimePicked}
            onCancel={this._toggleCloseTimePicker}
          />
        </ScrollView>
        <PopUpConfirm isVisible={this.state.isChange && this.state.isModalBackVisible}
          modalText={'Bạn chắc chắn muốn trở lại?'}
          confirmText={'Trở lại'}
          confirmPress={() => {
            if (!this.state.isEdit)
              this.props.actions.clearDetailDiscount()
            this._toggleModalBack()
            NavigationService.goBack()
          }}
          confirmCancel={'Hủy bỏ'}
          confirmCancelPress={this._toggleModalBack}
        />
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
  containerBody: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text: {
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    color: Colors.darkText,
    textAlign: 'center',
    lineHeight: 17,
    marginTop: 3,
  },
  addDiscountService: {
    width: 86.88,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.functionColorLight,
    borderStyle: 'dashed',
    borderRadius: 5,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginRight: 10,
    marginBottom: 10,
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
  finalPriceBlock: {
    borderTopWidth: 1,
    borderTopColor: Colors.functionColorLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.functionColorLight,
  },
  halfText: {
    width: '50%',
    height: 40,
    justifyContent: 'center',
    marginTop: 5
  },
  leftText: {
    fontSize: FontStyle.mdText,
  },
  rightText: {
    fontSize: FontStyle.mdText,
  },
  form: {
    marginTop: 20,
  },
  formLabel: {
    fontSize: FontStyle.mdText,
    color: Colors.darkText,
  },
  formInput: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.darkBlur,
    paddingHorizontal: 10,
    color: Colors.darkText,
    borderRadius: 5,
    marginTop: 6.2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timepicker: {
    position: 'absolute',
    top: '55%',
    right: 8,
    height: 20,
    width: 20,
  },
  uploadImage: {
    width: Layout.window.width * 0.35,
    height: Layout.window.width * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.functionColorLight,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.bg,
    borderStyle: 'dashed',
  },
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfDetailDiscountReducers],
    ...state[nameOfLoadingReducers][discountActions.CREATE_DISCOUNT, discountActions.UPDATE_DETAIL_DISCOUNT]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(discountActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiscountScreen)