import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { nameOfDetailModalReducers, nameOfStoreDetailReducers, nameOfServiceChildReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers/index';
import { ButtonText, ButtonSolid, FormInput, PopUpUploadImage, MainHeader, ImageProgress, PopUpConfirm } from '../../../../../components/react-native-teso';
import { detailModalActions, serviceActions, serviceChildActions, accountPackageActions } from '../../../../../actions/index';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { Loading } from '../../../../../components/react-native-teso/Loading/index';
import { convertPriceToFloat } from '../../../../../helper/validationHelper';
import NavigationService from '../../../../../navigation/NavigationService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as storeService from '../../../../../sagas/storeService';
import { importImage } from '../../../../../helper';
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import _, { get } from 'lodash';
import numeral from 'numeral';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class EditModelScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: '',
      price: '',
      desc: '',
      imgs: [],
      isEdit: false,
      isChange: false,
      loading: false,
      isVisiblePopupUploadImage: false,
      isModalVisible: false,
      isModalBackVisible: false,
    };

    this.addModal = this.addModal.bind(this)
    this.updateModal = this.updateModal.bind(this)
    this.selectImage = this.selectImage.bind(this)
    this.takeImage = this.takeImage.bind(this)
    this.addImgToList = this.addImgToList.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.endcodingImage = this.endcodingImage.bind(this)
    this.renderLeftComponent = this.renderLeftComponent.bind(this)
    this.renderCenterComponent = this.renderCenterComponent.bind(this)
    this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this)
    this.checkExistInArray = this.checkExistInArray.bind(this)
    this.deleteObj = this.deleteObj.bind(this)
    this.deleteUploadImage = this.deleteUploadImage.bind(this)
    this._renderUploadImage = this._renderUploadImage.bind(this)
    this.addPlus = this.addPlus.bind(this)
    this.renderItem = this.renderItem.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
    this._toggleModalBack = this._toggleModalBack.bind(this)
    this.deleteModal = this.deleteModal.bind(this)
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.setState({
      isEdit: navigation.getParam('isEdit') || false,
    }, () => {
      if (this.state.isEdit) {
        this.setState({
          displayName: this.props.displayName,
          price: this.props.price,
          imgs: this.props.thumbnail,
          desc: this.props.description
        })
      }
    })
  }

  addModal = async (modelFromState) => {
    this.setState({
      loading: true
    })
    console.log('modelFromState', modelFromState)
    this.endcodingImage(modelFromState.imgs)
      .then(dataImage => {
        console.log('dataImage ', dataImage)
        const model = {
          'displayName': modelFromState.displayName,
          'price': convertPriceToFloat(modelFromState.price),
          'description': modelFromState.desc,
          'thumbnail': dataImage,
          'type': 'detail',
          'serviceId': this.props.navigation.getParam('serviceId'),
          'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }
        const data = {
          'model': model,
          callback: (model) => {
            storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
              'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
            }))
            this.setState({ loading: false })
            this.props.navigation.state.params.onGoBack()
            this.props.actions.setModalDetail({ 'model': model });
            NavigationService.navigate('ModalDetail', {
              modalId: model.id
            })
          },
          fallback: () => {
            this.setState({ loading: false })
          }
        }
        this.props.actions.addDetailModalServiceRequest(data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  updateModal(modelFromState) {
    this.setState({ loading: true })
    console.log('modelFromState', modelFromState)
    console.log('modelFromState', modelFromState)
    this.endcodingImage(modelFromState.imgs)
      .then(dataImage => {
        const model = {
          'id': this.props.modalId,
          'displayName': modelFromState.displayName,
          'price': convertPriceToFloat(modelFromState.price),
          'description': modelFromState.desc,
          'thumbnail': dataImage,
          'type': 'detail',
          'serviceId': this.props.navigation.getParam('serviceId'),
          'managerId': get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
        }
        const data = {
          'model': model,
          callback: (model) => {
            const data = {
              'serviceId': get(storeService.getSpecificState(nameOfServiceChildReducers), 'serviceId'),
              callback: () => {
                this.setState({ loading: false })
              }
            }
            this.props.actions.fetchModelServiceChildRequest(data)
            this.props.actions.setModalDetail({ 'model': model })
            NavigationService.goBack()
          },
          fallback: () => {
            this.setState({ loading: false })
          }
        }
        this.props.actions.updateDetailModalServiceRequest(data)
      })
  }

  selectImage = async () => {
    this._togglePopupUploadImage();
    importImage.selectImage()
      .then(url => {
        this.addImgToList(url.path)
        this.setState({ isChange: true });
      })
  }

  takeImage = () => {
    this._togglePopupUploadImage();
    importImage.takeImage()
      .then(url => {
        this.addImgToList(url.path)
        this.setState({ isChange: true });
      })
  }



  addImgToList(urlImg) {
    let imgObj = urlImg
    this.setState({ imgs: [...this.state.imgs, imgObj] }, () => {
      console.log('addImgToList', this.state)
    });
  }

  uploadImage = item => {
    importImage.uploadImage(item)
      .then(image => {
        return image
      })
  }

  endcodingImage = (listImage = []) => {
    return new Promise((resolve, reject) => {
      try {
        var rs = ''
        var i = 0
        listImage.forEach((itemImage) => {
          if (itemImage.substr(itemImage.length - 4) == '.jpg')
            importImage.uploadImage(itemImage)
              .then(image => {
                // rs += image + '_'
                rs += `${image}_`
                i++
                if (i === listImage.length)
                  resolve(rs.slice(0, -1))
                console.log("tung rs:", image)
              })
          else {
            rs += `${itemImage}_`
            i++
            if (i === listImage.length)
              resolve(rs.slice(0, -1))
          }
        }
        )
        console.log("result cuoi", rs)
      } catch {
        err => {
          reject(err)
        }
      }
    })
  }

  renderLeftComponent() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{ width: 50, height: 25, justifyContent: 'center' }} onPress={() => NavigationService.navigate('ServiceChilds')}>
          <FontAwesome5
            name='chevron-left'
            size={FontStyle.mdText}
            color={Colors.dark9}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderCenterComponent() {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText, fontWeight: 'bold', marginLeft: -40 }}>
          Thêm kiểu dáng
        </Text>
      </View>
    );
  }


  componentWillUpdate(nextProps, nextState) {
    console.log('EditModelScreen will update', nextProps)
  }

  _togglePopupUploadImage = () => {
    this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
  }

  checkExistInArray(id, arr) {
    console.log('checkExistInArray', id, arr)
    if (!(typeof arr !== 'undefined' && arr.length > 0))
      return false
    return (_.findIndex(arr, function (item) { return item == id }) == -1) ? false : true
  }

  deleteObj(id, arr) {
    const index = arr.indexOf(id);
    if (index !== -1) {
      arr.splice(index, 1);
    }
  }

  deleteUploadImage = (url) => {
    console.log('deleteUploadImage', url, this.state)
    this.setState({
      imgs: _.filter(this.state.imgs, function (item) { return item != url })
    })
  }

  _toggleModal = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  _toggleModalBack = () => this.setState({ isModalBackVisible: !this.state.isModalBackVisible });

  deleteModal() {
    const data = {
      'modalId': this.props.modalId,
      callback: () => {
        storeService.dispatch(serviceChildActions.fetchModelServiceChildRequest({ 'serviceId': get(storeService.getSpecificState(nameOfServiceChildReducers), 'serviceId') }))
        storeService.dispatch(serviceActions.fetchServiceRequest({ 'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId') }))
        NavigationService.navigate('ServiceChilds');
      }
    }
    this.props.actions.deleteDetailModalServiceRequest(data)
  }

  _renderUploadImage = () => {
    if (this.state.imgs.length < 4) {
      return <TouchableOpacity style={styles.imageCard} onPress={this._togglePopupUploadImage}>
        <FontAwesome5 name='file-image' size={27.46} color={Colors.functionColorLight} />
        <Text style={{ color: Colors.functionColorLight, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Tải ảnh lên</Text>
      </TouchableOpacity>
    } else {
      return null
    }
  }

  addPlus = (img = []) => {
    if (img.length == 4)
      return img
    return _.concat(img, { none: 1 })
  }

  renderItem = ({ item, index }) => {
    if (item.none) {
      return (
        <TouchableOpacity style={[styles.imageCard, {
          borderColor: Colors.functionColorLight,
          borderWidth: 1,
          borderStyle: 'dashed',
        }]} onPress={this._togglePopupUploadImage}>
          <FontAwesome5 name='file-image' size={27.46} color={Colors.functionColorLight} />
          <Text style={{ color: Colors.functionColorLight, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Tải ảnh lên</Text>
        </TouchableOpacity>
      )
    }
    else {
      return (
        <View style={styles.imageCard}>
          {item ?
            <ImageProgress source={{ uri: item.slice(0, 4) !== 'http' ? item : `${item}` }} style={{
              width: Layout.window.width * 0.22,
              height: Layout.window.width * 0.22,
              marginTop: Layout.window.width * 0.025,
              position: 'absolute',
              zIndex: -1,

            }} borderRadius={10}
            />
            :
            <Image source={require('../../../../../assets/img/default-service-blue.png')}
              style={{
                width: Layout.window.width * 0.22,
                height: Layout.window.width * 0.22,
                marginTop: Layout.window.width * 0.025,
                borderRadius: 10,
                position: 'absolute',
                zIndex: -1
              }} />
          }
          <TouchableOpacity style={styles.delImage} onPress={() => this.deleteUploadImage(item)}>
            <FontAwesome5 name='times' size={12} color={Colors.functionColorLight} />
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    console.log('EditModelScreen ', this.props, this.state)
    const { displayName, price, desc, imgs } = this.state;
    if (this.props.isLoading || this.state.loading) {
      return (
        <Loading />
      )
    }
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          <MainHeader
            backgroundColor={Colors.lightBg}
            leftPress={() => {
              if (this.state.isChange)
                this._toggleModalBack()
              else 
                NavigationService.navigate('ServiceChilds')
            }}
            centerComponent={`${!this.state.isEdit ? 'Thêm' : 'Chỉnh sửa'} kiểu dáng`}
          />
          <PopUpUploadImage
            isVisible={this.state.isVisiblePopupUploadImage}
            takeImage={() => this.takeImage()}
            selectImage={() => this.selectImage()}
            pressCancel={this._togglePopupUploadImage}
          />
          <View style={styles.containerBody}>
            <FormInput
              label={'Tên kiểu dáng'}
              textBox
              line
              require
              inputStyle={[styles.blackText]}
              onChangeText={(text) => this.setState({ displayName: text, isChange: true })}
              value={displayName}
              placeholder={'Nhập tên kiểu dáng'}
            />
            <FormInput
              label={'Giá tiền'}
              textBox
              line
              require
              inputStyle={[styles.blueText]}
              onChangeText={(text) => this.setState({ price: text, isChange: true })}
              value={numeral(price).format('0,0')}
              keyboardType={Platform.OS == 'ios' ? 'number-pad' : 'numeric'}
              placeholder={'Nhập tên giá tiền'}
            />
            <FormInput
              label={'Mô tả'}
              richText
              inputStyle={[styles.blackText, { backgroundColor: Colors.lightBg }]}
              value={desc}
              onChangeText={(text) => this.setState({ desc: text, isChange: true })}
              placeholder={'Nhập mô tả kiểu dáng'}
              count={
                <Text>{`${desc.length}/${200}`}</Text>
              }
            />
            <View style={[styles.form, styles.displayInlineBlock]}>
              <FlatList showsVerticalScrollIndicator={false}
                numColumns={1}
                horizontal={true}
                data={this.addPlus(imgs)}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => `${index}`} />
            </View>
            <View style={[{ justifyContent: 'flex-start', alignItems: 'center', height: 100, marginTop: 20 }]}>
              {!this.state.isEdit ?
                <ButtonSolid label={'THÊM'}
                  onPress={() => this.addModal(this.state)}
                  backgroundColor={Colors.primaryButton}
                  disable={displayName == '' ||
                    price == '' ||
                    imgs.length <= 0}
                />
                :
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <ButtonSolid label={'LƯU'}
                    onPress={() => this.updateModal(this.state)}
                    backgroundColor={Colors.primaryButton}
                    disable={displayName == '' ||
                      price == '' ||
                      imgs.length <= 0 ||
                      !this.state.isChange}
                  />
                  <ButtonText label={'XÓA'} onPress={this._toggleModal} />
                </View>
              }
            </View>
          </View>
        </ScrollView>
        <PopUpConfirm isVisible={this.state.isModalVisible}
          modalText={'Bạn chắc chắn muốn xóa kiểu dáng này?'}
          confirmText={'Xóa'}
          confirmPress={() => {
            this._toggleModal()
            this.deleteModal()
          }}
          confirmCancel={'Hủy bỏ'}
          confirmCancelPress={this._toggleModal}
        />
        <PopUpConfirm isVisible={this.state.isChange && this.state.isModalBackVisible}
          modalText={'Bạn chắc chắn muốn trở lại?'}
          confirmText={'Trở lại'}
          confirmPress={() => {
            this._toggleModalBack()
            NavigationService.navigate('ServiceChilds')
          }}
          confirmCancel={'Hủy bỏ'}
          confirmCancelPress={this._toggleModalBack}
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
    backgroundColor: Colors.bg,
    marginTop: 3,
    paddingLeft: 10,
    paddingRight: 10,
    height: Layout.window.height - 73,
  },
  displayInlineBlock: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  form: {
    marginTop: 20,
    width: '100%'
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    paddingBottom: 10,
    paddingLeft: 10,
    borderColor: Colors.bestBlur,
    borderRadius: 5,
    marginTop: 6.2,
    fontSize: FontStyle.mdText,
  },
  blackText: {
    color: Colors.darkText,
  },
  blueText: {
    color: Colors.functionColorLight
  },
  imageCard: {
    width: Layout.window.width * 0.23,
    height: Layout.window.width * 0.23,
    borderRadius: 10,
    marginRight: Layout.window.width * 0.005,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightBg,
    zIndex: 55,
    position: 'relative',
  },
  delImage: {
    position: 'absolute',
    top: 3,
    right: 3,
    height: 15,
    width: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.lightBg
  },
  cancelBtn: {
    backgroundColor: Colors.transparent,
    height: 40,
    marginRight: 30,
    width: Layout.window.width * 0.3,
    borderColor: Colors.functionColorLight,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    fontWeight: 'bold'
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
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state[nameOfDetailModalReducers],
    ...state[nameOfLoadingReducers][
    detailModalActions.ADD_DETAIL_MODAL_SERVICE,
    detailModalActions.UPDATE_DETAIL_MODAL_SERVICE
    ]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    actions: bindActionCreators({ ...detailModalActions, ...serviceChildActions, ...serviceActions }, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditModelScreen)
