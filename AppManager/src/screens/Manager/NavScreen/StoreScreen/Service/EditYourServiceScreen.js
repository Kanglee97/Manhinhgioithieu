import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ImageBackground
} from 'react-native';
import { PopUpUploadImage, FormInput, MainHeader, ImageProgress, PopUpConfirm, MaterialIcon, Loading, ButtonSolid, ButtonText } from '../../../../../components/react-native-teso';
import { nameOfStoreDetailReducers, nameOfServiceChildReducers, nameOfLoadingReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { serviceChildActions, accountPackageActions } from '../../../../../actions/index';
import NavigationService from '../../../../../navigation/NavigationService';
import * as storeService from '../../../../../sagas/storeService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { importImage } from '../../../../../helper'
import { bindActionCreators } from 'redux';
import RNFetchBlob from 'rn-fetch-blob';
import { connect } from 'react-redux';
import _, { get } from 'lodash';


// More info on all the options is below in the README...just some common use cases shown here
// // Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class EditYourServiceScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            availableImage: [
                { id: 0 },
            ],
            selected: '',
            isVisiblePopupUploadImage: false,
            isVisibleDelete: false,
            isEdit: false,
        };
        this.addService = this.addService.bind(this)
        this.selectImage = this.selectImage.bind(this)
        this.takeImage = this.takeImage.bind(this)
        this._togglePopupUploadImage = this._togglePopupUploadImage.bind(this)
        this._toggleModal = this._toggleModal.bind(this)
        this.deleteService = this.deleteService.bind(this)
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.setState({
            selected: this.props.thumbnail,
            displayName: this.props.displayName
        })
    }

    addService() {
        this.setState({
            loading: true
        }, async () => {
            var thumbnailImage = ''
            if (this.state.selected.substr(this.state.selected.length - 4) == '.jpg') {
                await importImage.uploadImage(this.state.selected)
                    .then(image => {
                        thumbnailImage = image
                    })
            }
            else {
                thumbnailImage = this.state.selected
            }

            const service = {
                'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
                'id': this.props.serviceId,
                'displayName': this.state.displayName,
                'thumbnail': thumbnailImage,
            }
            const data = {
                'service': service,
                callback: () => {
                    this.setState({
                        loading: false
                    }, () => {
                        console.log(this.props)
                        this.props.navigation.state.params.onGoBack()
                        NavigationService.navigate('Store')
                    })
                },
                fallback: () => {
                    this.setState({
                        loading: false
                    })
                }
            }
            this.props.actions.updateServiceChildRequest(data)
        }
        )
    }

    selectImage() {
        this._togglePopupUploadImage();
        importImage.selectImage()
            .then(url => {
                this.setState({
                    selected: url.path
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    takeImage() {
        this._togglePopupUploadImage();
        importImage.takeImage()
            .then(url => {
                this.setState({
                    selected: url.path
                }, () => {
                    console.log('selectImage', this.state, url)
                })
            })
    }

    _togglePopupUploadImage() {
        this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
    }

    _toggleModal() { this.setState({ isVisibleDelete: !this.state.isVisibleDelete }) }

    deleteService() {
        this._toggleModal()
        this.props.actions.deleteServiceChildRequest({
            'serviceId': this.props.serviceId,
            callback: () => {
                storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
                    'managerId':
                        get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                            get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                            get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')
                }))
                this.props.navigation.state.params.onGoBack()
                this.props.navigation.navigate('Store')
            }
        })
    }


    render() {
        console.log('EditYourServiceScreen render', this.props)
        const { availableImage } = this.state;
        const image = _.concat(availableImage, this.props.yourServiceData)
        if (this.props.isLoading || this.state.loading)
            return (
                <Loading />
            )
        else
            return (
                <SafeAreaView style={styles.container}>
                    <MainHeader
                        backgroundColor={Colors.lightBg}
                        leftPress={() => NavigationService.goBack()}
                        centerComponent={'Sửa dịch vụ'}
                    />
                    <View style={styles.form}>
                        <FormInput
                            inputStyle={{ width: Layout.window.width * 0.85, marginLeft: Layout.window.width * 0.075, }}
                            textBox
                            require
                            onChangeText={(text) => this.setState({ displayName: text, isEdit: true })}
                            value={this.state.displayName}
                            placeholder={'Nhập tên dịch vụ...'}
                        />
                        <View style={styles.uploadImage}>
                            {this.state.selected ?
                                <ImageProgress source={{ uri: `${this.state.selected}` }}
                                    style={[styles.uploadImage, { borderWidth: 0, }]}
                                />
                                :
                                <TouchableOpacity
                                    onPress={() => { this._togglePopupUploadImage() }}
                                >
                                    <Image source={require('../../../../../assets/img/default-service-blue.png')}
                                        style={styles.uploadImage}

                                    />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles.delImage} onPress={() => { this.setState({ selected: '' }) }}>
                                <FontAwesome5 name='times' size={12} color={Colors.functionColorLight} />
                            </TouchableOpacity>
                        </View>
                        <ButtonSolid
                            style={{ alignSelf: 'center', }}
                            disable={!(this.state.displayName !== '' && this.state.selected !== '') || this.state.isEdit == false}
                            width={'85%'}
                            onPress={this.addService}
                            label={'LƯU'}
                        />
                        <ButtonText label={'XÓA'} onPress={this._toggleModal} />
                    </View>
                    <PopUpUploadImage
                        isVisible={this.state.isVisiblePopupUploadImage}
                        takeImage={() => this.takeImage()}
                        selectImage={() => this.selectImage()}
                        pressCancel={this._togglePopupUploadImage}
                    />
                    <PopUpConfirm
                        isVisible={this.state.isVisibleDelete}
                        modalText={'Bạn chắc chắn muốn xóa dịch vụ này?'}
                        confirmText={'Xóa'}
                        confirmPress={this.deleteService}
                        confirmCancel={'Hủy bỏ'}
                        confirmCancelPress={this._toggleModal}
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
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    marginTop20: {
        marginTop: 20
    },
    form: {
        marginTop: 20
    },
    formLabel: {
        fontSize: FontStyle.smallText,
        color: Colors.darkText,
    },
    formInput: {
        color: Colors.darkText,
        backgroundColor: Colors.lightBg,
        borderRadius: 5,
        alignSelf: 'center',
        width: Layout.window.width * 0.85,
        fontStyle: 'italic',
        fontSize: FontStyle.smallText
    },
    uploadImage: {
        width: Layout.window.width * 0.85,
        height: Layout.window.width * 0.85,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderColor: Colors.functionColorLight,
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: Colors.lightBg
    },
    addButton: {
        height: 40,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 25,
        backgroundColor: Colors.functionColorLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchBlock: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
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
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfServiceChildReducers],
        ...state[nameOfLoadingReducers][
        serviceChildActions.DELETE_SERVICE_CHILD,
        serviceChildActions.UPDATE_SERVICE_CHILD
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(serviceChildActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditYourServiceScreen)
