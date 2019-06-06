import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { AddItem, InfoItem, FormInput, PopUpConfirm, PopUpDownToTop, ButtonGradient, MainHeader, Loading, MaterialIcon, PopUpRemind } from '../../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../../navigation/NavigationService';
import _, { get } from 'lodash'
import { nameOfServiceChildReducers, nameOfDetailOptionReducers, nameOfDetailOptionChildReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAccountPackageReducers, nameOfAuthReducers } from '../../../../../reducers/index';
import numeral from 'numeral';
import * as storeService from '../../../../../sagas/storeService'
import { bindActionCreators } from 'redux';
import { detailOptionActions, accountPackageActions } from '../../../../../actions';
import { connect } from 'react-redux';
import { convertPriceToFloat } from '../../../../../helper/validationHelper';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';

class OptionChildsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditTitle: false,
      isPopupDeleteBigOption: false,
      isAddNewItem: false,
      isPopupEditItem: false,
      isPopupDeleteSmallOption: false,
      title: 'Thuốc Uốn',
      idSelected: '',
      displayName: '',
      price: '',
      desc: '',
      options: [
        // { key: 0 },  
      ],
      isChange: false,
      numberOfOption: 0,
      numberOfState: 0,
      isVisibleUpgradeOption: false,
    };

    this.getBanned = this.getBanned.bind(this)
    this.loadData = this.loadData.bind(this)
    this.updateNameOfOption = this.updateNameOfOption.bind(this)
    this.deleteOption = this.deleteOption.bind(this)
    this.createOptionChild = this.createOptionChild.bind(this)
    this.updateOptionChild = this.updateOptionChild.bind(this)
    this._toggleEditTitle = this._toggleEditTitle.bind(this)
    this._toggleDeleteBigOption = this._toggleDeleteBigOption.bind(this)
    this._toggleAddNewItem = this._toggleAddNewItem.bind(this)
    this._togglePopupEditItem = this._togglePopupEditItem.bind(this)
    this._toggleDeleteSmallOption = this._toggleDeleteSmallOption.bind(this)
    this.deleteBigOption = this.deleteBigOption.bind(this)
    this.deleteSmallOption = this.deleteSmallOption.bind(this)
    this.renderRightComponent = this.renderRightComponent.bind(this)
    this._toggleLimitPopup = this._toggleLimitPopup.bind(this)
    this.renderSaveButton = this.renderSaveButton.bind(this)
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.loadData();
    this.getBanned();
  }

  getBanned = () => {
    this.setState({
      numberOfOption: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentPackage.optionLimit'),
      numberOfState: get(storeService.getSpecificState(nameOfAccountPackageReducers), 'currentState.optionCount')
    })
  }

  loadData = () => {
    const data = {
      'optionId': this.props.navigation.getParam('optionId'),
      'displayName': this.props.navigation.getParam('displayName'),
      'serviceId': this.props.navigation.getParam('serviceId'),
      'data': this.props.navigation.getParam('data')
    }
    this.props.actions.setOption(data)
    ///this.props.actions.fetchOptionChildRequest({'optionId': this.props.navigation.getParam('optionId')})
    this.setState({
      title: this.props.navigation.getParam('displayName')
    }, () => {
      console.log('OptionChild willmount: ', this.props, this.state)
    })
    this.props.actions.fetchOptionChildRequest({ 'optionId': this.props.navigation.getParam('optionId') })
  }

  updateNameOfOption = (optionId, displayName, serviceId) => {
    const option = {
      'id': optionId,
      'displayName': displayName,
      'serviceId': serviceId,
      'type': 'option'
    }
    const data = {
      'option': option,
      callback: () => {
        this.props.navigation.state.params.onGoBack()
      }
    }
    this.props.actions.updateOptionServiceChildRequest(data)
  }

  deleteOption = optionId => {
    const data = {
      'optionId': this.props.optionId,
      callback: () => {
        navigation.goBack()
      }
    }
    this.props.actions.handleDeleteOptionServiceChildRequest(data)
  }

  createOptionChild = (displayName, price, description, optionId) => {
    const option = {
      'displayName': displayName,
      'type': 'option',
      'description': description,
      'price': convertPriceToFloat(price),
      'parentId': optionId,
      'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
    }
    const data = {
      'option': option,
      callback: () => {
        storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
          'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }))

        this.props.actions.fetchOptionChildRequest({ 'optionId': this.props.navigation.getParam('optionId') });
        this.setState({
          idSelected: '',
          displayName: '',
          price: '',
          desc: '',
        })
      }
    }
    this.props.actions.createOptionChildRequest(data)
  }

  updateOptionChild = (id, displayName, price, description, optionId) => {
    const option = {
      'id': id,
      'displayName': displayName,
      'type': 'option',
      'description': description,
      'price': convertPriceToFloat(price),
      parentId: optionId,
      'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
        get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
    }
    const data = {
      'option': option,
      callback: () => {
        this.props.actions.fetchOptionChildRequest({ 'optionId': this.props.navigation.getParam('optionId') })
      }
    }
    this.props.actions.updateOptionChildRequest(data)
  }
  _toggleEditTitle = () => { this.setState({ isEditTitle: !this.state.isEditTitle }) }

  _toggleDeleteBigOption = () => { this.setState({ isPopupDeleteBigOption: !this.state.isPopupDeleteBigOption }) }

  _toggleAddNewItem = () => { this.setState({ isAddNewItem: !this.state.isAddNewItem }) }

  _togglePopupEditItem = (item = {}) => {
    console.log(item, this.state)
    this.setState({
      idSelected: item.id,
      displayName: item.displayName,
      price: convertPriceToFloat(item.price),
      desc: item.description,
      isPopupEditItem: !this.state.isPopupEditItem,
    }, () => {
      console.log('_togglePopupEditItem setState', this.state)
    })
  }

  _toggleDeleteSmallOption = (item = {}) => {
    this.setState({
      idSelected: item.id,
      isPopupDeleteSmallOption: !this.state.isPopupDeleteSmallOption
    }, () => {
      console.log('_toggleDeleteSmallOption', this.state)
    })
  }


  deleteBigOption = () => {
    this._toggleDeleteBigOption()
    Toast.show('Xóa thành công', Toast.SHORT);
    console.log(this.props.navigation)
    this.props.navigation.state.params.onGoBack()
    this.props.navigation.goBack()
  }

  deleteSmallOption = () => {
    this._toggleDeleteSmallOption()
    this._toggleDeleteSuccess()
  }

  renderRightComponent() {
    return (
      <View style={[styles.displayInlineBlock, { backgroundColor: Colors.transparent, marginRight: -10 }]}>
        <TouchableOpacity style={{ width: '50%', height: 45, justifyContent: 'center', alignItems: 'center' }} onPress={this._toggleDeleteBigOption}>
          <MaterialIcon
            button
            name='delete'
            size={FontStyle.largeText}
            color={Colors.darkText}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ width: '50%', height: 45, justifyContent: 'center', alignItems: 'center' }} onPress={this._toggleEditTitle}>
          <MaterialIcon
            button
            name='create'
            size={FontStyle.largeText}
            color={Colors.functionColorDark}
          />
        </TouchableOpacity>
      </View>
    );
  }

  _toggleLimitPopup = () => { this.setState({ isVisibleUpgradeOption: !this.state.isVisibleUpgradeOption }) }

  renderSaveButton = () => {
    return (
      <TouchableOpacity
        style={{ width: '50%', height: 45, justifyContent: 'center', alignItems: 'center' }}
        onPress={() => {
          this.updateNameOfOption(this.props.optionId, this.state.title, this.props.serviceId)
          this._toggleEditTitle()
        }}>
        <Text style={{ fontSize: Layout.isSmallDevice ? FontStyle.smallText : FontStyle.mdText, color: Colors.functionColorLight, fontFamily: FontStyle.mainFont }}>LƯU</Text>
      </TouchableOpacity>
    )
  }


  render() {
    const { isEditTitle } = this.state;
    const { displayName, price, desc, imgs, isAddNewItem, isPopupEditItem, numberOfState } = this.state;

    const options = _.concat({ none: 0 }, this.props.data || [])
    console.log('render', this.props, options)
    var swipeToDelete = [
      {
        component:
          <TouchableOpacity
            style={{ marginTop: Layout.window.width * 0.035, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => {
              console.log(item)
              this._toggleDeleteSmallOption()
            }}>
            <MaterialIcon name={'close'} size={30} color={Colors.dangerColor} />
          </TouchableOpacity>,
        backgroundColor: Colors.bg
      }
    ]
    if (this.props.isLoading)
      return (
        <Loading />
      )
    return (
      <SafeAreaView style={styles.container}>
        <MainHeader
          backgroundColor={Colors.lightBg}
          leftPress={() => NavigationService.navigate('ServiceChilds')}
          reRenderRightComponent={!isEditTitle ? this.renderRightComponent() : this.renderSaveButton()}
        />
        {!isEditTitle ?
          (<View style={{ alignItems: 'center', }}>
            <Text style={styles.text}>{this.state.title}</Text>
          </View>)
          :
          (<FormInput
            textBox
            autoFocus
            inputStyle={[styles.editText, { textAlign: 'center' }]}
            onChangeText={(text) => this.setState({ title: text })}
            value={this.state.title}
          />)
        }
        {options.length > 0 &&
          <View>
            <FlatList showsVerticalScrollIndicator={false}
              style={{ height: Layout.window.height * 0.75 }}
              data={options}
              refreshControl={
                <RefreshControl
                  refreshing={this.props.isLoading}
                  onRefresh={this.loadData}
                />
              }
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item, index }) => {
                console.log(item)
                return (item.none == 0) ?
                  (<AddItem
                    label={'Thêm tùy chọn'}
                    onPress={() => {
                      if (this.state.numberOfOption <= this.state.numberOfState)
                        this._toggleLimitPopup()
                      else
                        this._toggleAddNewItem()
                    }} />) :
                  (<InfoItem label={item.displayName}
                    price={item.price}
                    swipe
                    right={[{
                      component:
                        <TouchableOpacity
                          style={{ alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}
                          onPress={() => { this._toggleDeleteSmallOption(item) }}>
                          <MaterialIcon button name={'close'} size={30} color={Colors.dangerColor} />
                        </TouchableOpacity>,
                      backgroundColor: Colors.bg
                    }]}
                    onPress={() => this._togglePopupEditItem(item)} />)
              }
              }
            />
          </View>
        }
        <PopUpConfirm
          isVisible={this.state.isPopupDeleteBigOption}
          modalText={`Bạn chắc chắn muốn xóa tùy chọn "${this.state.title}"?`}
          confirmPress={() => {
            const data = {
              'optionId': this.props.optionId,
              callback: () => {
                this.deleteBigOption()

              }
            }
            this.props.actions.deleteOptionServiceChildRequest(data)
          }}
          confirmText={'Xóa'}
          confirmCancelPress={this._toggleDeleteBigOption}
          confirmCancel={'Hủy bỏ'}
        />
        <PopUpConfirm
          height={180}
          isVisible={this.state.isPopupDeleteSmallOption}
          modalText={`Bạn chắc chắn muốn xóa tùy chọn "${this.state.title}"?`}
          confirmPress={() => {
            this.deleteSmallOption()
            const data = {
              'optionId': this.state.idSelected,
              callback: () => {
                storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
                  'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                    get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                    get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
                }))
                this.props.actions.fetchOptionChildRequest({ 'optionId': this.props.navigation.getParam('optionId') })
              }
            }
            this.props.actions.deleteOptionChildRequest(data)
          }}
          confirmText={'Xóa'}
          confirmCancelPress={this._toggleDeleteSmallOption}
          confirmCancel={'Hủy bỏ'}
        />
        <PopUpDownToTop
          isVisible={isAddNewItem}
          onClose={this._toggleAddNewItem}>
          <View style={{ justifyContent: 'space-around' }}>
            <FormInput
              label={'Tên tùy chọn'}
              textBox
              line
              require
              inputStyle={[styles.blackText]}
              onChangeText={(text) => this.setState({ displayName: text })}
              value={displayName}
              placeholder={'Nhập tên tùy chọn...'}
            />
            <FormInput
              label={'Giá tiền'}
              textBox
              line
              require
              inputStyle={[styles.blueText]}
              keyboardType={Platform.OS == 'ios' ? 'number-pad' : 'numeric'}
              onChangeText={(text) => this.setState({ price: text })}
              value={numeral(price).format('0,0')}
              placeholder={'Nhập tên giá tiền...'}
            />
            <FormInput
              label={'Mô tả'}
              richText
              inputStyle={[styles.blackText, { maxHeight: 150 }]}
              value={desc}
              onChangeText={(text) => this.setState({ desc: text })}
              placeholder={'Nhập mô tả kiểu dáng...'}
              count={
                <Text>{`${desc.length}/200`}</Text>
              }
            />
            <View style={{ alignItems: 'center', marginTop: 15 }}>
              <ButtonGradient
                disabled={
                  !(
                    displayName !== '' &&
                    price !== ''
                  )
                }
                onPress={() => {
                  this.createOptionChild(this.state.displayName, this.state.price, this.state.desc, this.props.optionId)
                  this._toggleAddNewItem()
                }}
                content={'Thêm'}
                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
              />
            </View>
          </View>
        </PopUpDownToTop>
        <PopUpDownToTop
          isVisible={isPopupEditItem}
          onClose={this._togglePopupEditItem}>
          <View style={{ justifyContent: 'space-around' }}>
            <FormInput
              label={'Tên tùy chọn'}
              textBox
              line
              require
              inputStyle={[styles.blackText]}
              onChangeText={(text) => this.setState({ displayName: text, isChange: true })}
              value={displayName}
              placeholder={'Nhập tên tùy chọn...'}
            />
            <FormInput
              label={'Giá tiền'}
              textBox
              line
              require
              inputStyle={[styles.blueText]}
              keyboardType={Platform.OS == 'ios' ? 'number-pad' : 'numeric'}
              onChangeText={(text) => this.setState({ price: text, isChange: true })}
              value={numeral(price).format('0,0')}
              placeholder={'Nhập tên giá tiền...'}
            />
            <FormInput
              label={'Mô tả'}
              richText
              inputStyle={[styles.blackText, { maxHeight: 150 }]}
              value={desc}
              onChangeText={(text) => this.setState({ desc: text, isChange: true })}
              placeholder={'Nhập mô tả kiểu dáng...'}
              count={
                <Text>{`${desc.length}/200`}</Text>
              }
            />
            <View style={{ alignItems: 'center', marginTop: 15 }}>
              <ButtonGradient
                onPress={() => {
                  console.log('state onPress', this.state)
                  this.updateOptionChild(this.state.idSelected, this.state.displayName, this.state.price, this.state.desc, this.props.optionId)
                  this._togglePopupEditItem()
                }}
                disabled={!this.state.isChange}
                content={'Lưu'}
                labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
              />
            </View>
          </View>
        </PopUpDownToTop>
        <PopUpRemind
          isVisibleUpgradeStore={this.state.isVisibleUpgradeOption}
          onBackdropPress={this._toggleLimitPopup}
          limitContent={this.state.numberOfOption == 0 ?
            'Bạn chưa thể tạo tùy chọn với tài khoản này, hãy nâng cấp tài khoản để được sử dụng nhiều dịch vụ hơn!' :
            `Bạn đã tạo ${numberOfState} tùy chọn và đã đạt giói hạn tạo thêm tùy chọn, hãy nâng cấp tài khoản để được sử dụng nhiều dịch vụ hơn!`
          }
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
  text: {
    fontWeight: 'bold',
    fontSize: FontStyle.mdText,
    fontFamily: FontStyle.mainFont,
    lineHeight: 40,
    color: Colors.darkText,
    marginBottom: 10,
  },
  editText: {
    marginBottom: 20,
    marginLeft: Layout.window.width * 0.03,
    backgroundColor: Colors.lightBg,
    width: Layout.window.width * 0.925,
    borderWidth: 0,
  },
  blackText: {
    color: Colors.darkText,
  },
  blueText: {
    color: Colors.functionColorLight
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfDetailOptionReducers],
    ...state[nameOfDetailOptionChildReducers],
    ...state[nameOfLoadingReducers][detailOptionActions.FETCH_OPTION_CHILD]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators(detailOptionActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OptionChildsScreen);
