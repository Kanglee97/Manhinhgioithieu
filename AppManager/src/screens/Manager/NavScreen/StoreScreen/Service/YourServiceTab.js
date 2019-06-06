import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ListView,
    ScrollView,
    Text,
    SafeAreaView,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    ImageBackground
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { PopUpUploadImage, MainHeader, FormInput, ButtonGradient, ImageProgress, MaterialIcon } from '../../../../../components/react-native-teso';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import callApi from '../../../../../api/helper';
import RNFetchBlob from 'rn-fetch-blob';
import { bindActionCreators } from 'redux';
import { serviceActions, accountPackageActions } from '../../../../../actions/index';
import { nameOfStoreDetailReducers, nameOfServiceReducers, nameOfLoadingReducers, nameOfStoreImageReducers, nameOfProfileReducers, nameOfAuthReducers } from '../../../../../reducers';
import { connect } from 'react-redux'
import { importImage } from '../../../../../helper';
import * as storeService from '../../../../../sagas/storeService';
import _, { get } from 'lodash'
import NavigationService from '../../../../../navigation/NavigationService';
import { Loading } from '../../../../../components/react-native-teso/Loading/index';
import uuid from 'react-native-uuid';

// More info on all the options is below in the README...just some common use cases shown here
// // Prepare Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

class YourServiceTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeName: '',
            availableImage: [
                { id: 0 },
            ],
            loading: false,
            selected: '',
            isVisiblePopupUploadImage: false,
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        const data = {
            'storeId': get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId'),
            callback: () => {
                this.render()
            }
        }
        this.props.actions.fetchSampleYourServiceRequest(data)
        this.getImageFromStore()
    }

    getImages() {
        const { availableImage } = this.state;
        callApi('api/store/service-bystore/1')
            .then(res => {
                arr = res;
                this.setState({ availableImage: availableImage.concat(res) });
                console.log(this.state.availableImage);
            }).catch((err) => {
                console.log(err);
            })
    }

    getImageFromStore = () => {
        this.setState({
            availableImage: [...this.state.availableImage, ...get(storeService.getSpecificState(nameOfStoreImageReducers), 'listImage')]
        })
    }

    addService = () => {
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
                'displayName': this.state.storeName,
                'thumbnail': thumbnailImage,
                'type': 'custom',
                'status': true,
            }
            const data = {
                'service': service,
                callback: () => {
                    this.setState({
                        loading: false
                    }, () => {
                        console.log(this.props)
                        storeService.dispatch(accountPackageActions.fetchCurrentAccountStateRequest({
                            'managerId':
                                get(storeService.getSpecificState(nameOfAuthReducers), 'isOwner') ?
                                    get(storeService.getSpecificState(nameOfProfileReducers), 'user.id') :
                                    get(storeService.getSpecificState(nameOfProfileReducers), 'user.managerId')

                        }))
                        this.props.navigation.state.params.onGoBack()
                        NavigationService.navigate('Store')
                    })
                }
            }
            this.props.actions.addYourServiceRequest(data)
        })
    }

    selectImage = () => {
        this._togglePopupUploadImage();
        importImage.selectImage()
            .then(url => {
                this.setState({
                    availableImage: _.concat(this.state.availableImage, url.path)
                }, () => {
                    this.chooseImage(url.path)
                    console.log('selectImage', this.state, url)
                });
            })
        // this.setState({
        //     availableImage: _.concat(this.state.availableImage,'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fc%E1%BA%AFt%2Ftoc-duoi-phong-1.jpg?alt=media&token=78c78a35-5e61-4153-936c-964948cbfa70')
        // })     
    }

    takeImage = () => {
        this._togglePopupUploadImage();
        importImage.takeImage()
            .then(url => {
                this.setState({
                    availableImage: _.concat(this.state.availableImage, url.path)
                }, () => {
                    this.chooseImage(url.path)
                    console.log('selectImage', this.state, url)
                })
            })
        // this.setState({
        //     availableImage: _.concat(this.state.availableImage,'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2FHairs%2Fc%E1%BA%AFt%2Ftoc-duoi-phong-1.jpg?alt=media&token=78c78a35-5e61-4153-936c-964948cbfa70')
        // })   
    }

    _togglePopupUploadImage = () => {
        this.setState({ isVisiblePopupUploadImage: !this.state.isVisiblePopupUploadImage });
    }

    chooseImage = (image = '') => {
        if (this.state.selected == image)
            this.setState({
                selected: ''
            }, () => console.log(this.state.selected))
        else
            this.setState({
                selected: image
            }, () => console.log(this.state.selected))
    }

    renderItem = ({ item, index }) => {
        if (_.isEmpty(item))
            return
        if (item.id == 0) {
            return (
                <TouchableOpacity style={styles.uploadImage} onPress={this._togglePopupUploadImage}>
                    <FontAwesome5 name='file-image' size={40} color={Colors.functionColorLight} />
                    <Text style={{ color: Colors.functionColorLight, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont }}>Tải ảnh lên</Text>
                </TouchableOpacity>
            )
        } else {
            console.log(item, this.state.selected, (item === this.state.selected))
            return (
                <TouchableOpacity style={styles.imageItem} onPress={() => this.chooseImage(item)}>
                    {item ?
                        <ImageProgress source={{ uri: item.slice(0, 4) !== 'http' ? item : `${item}` }} style={styles.imageItem}>
                            {(item === this.state.selected) &&
                                <View style={styles.blur}>
                                    <MaterialIcon name={'check-circle'} size={50} color={Colors.functionColorDark} />
                                </View>
                            }
                        </ImageProgress>
                        :
                        <ImageBackground source={require('../../../../../assets/img/default-service-blue.png')} style={styles.imageItem}>
                            {(item === this.state.selected) &&
                                <View style={styles.blur}>
                                    <MaterialIcon name={'check-circle'} size={50} color={Colors.functionColorDark} />
                                </View>
                            }
                        </ImageBackground>
                    }
                </TouchableOpacity>
            )
        }
    }

    render() {
        console.log('YourServiceTab render', this.props)
        const { availableImage } = this.state;
        const image = _.concat(availableImage)
        if (this.state.loading || this.props.isLoading) {
            return (
                <Loading />
            )
        }
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.navigate('CreateService')}
                    centerComponent={'Thêm dịch vụ mới'}
                />
                <View style={[styles.displayInlineBlock, styles.searchBlock]}>
                    <FormInput
                        label={'Tên dịch vụ'}
                        textBox
                        autoFocus
                        formStyle={{ width: Layout.window.width * 0.5 }}
                        placeholder={'VD: làm tóc, gội đầu,...'}
                        inputStyle={{ backgroundColor: Colors.lightBg, width: Layout.window.width * 0.5 }}
                        onChangeText={(text) => this.setState({ storeName: text })}
                        value={this.state.storeName}
                    />
                    <View style={{ width: Layout.window.width * 0.3, marginTop: 35, marginLeft: Layout.window.width * 0.1 }}>
                        <ButtonGradient
                            disabled={this.state.storeName == '' || this.state.selected == ''}
                            onPress={this.addService}
                            width={'100%'}
                            content={'Thêm'}
                        />
                    </View>
                </View>
                <View style={styles.form}>
                    <Text style={styles.formLabel}>Chọn hình ảnh</Text>
                </View>
                <View style={[styles.displayInlineBlock, { marginLeft: Layout.window.width * 0.0375, marginTop: 10, }]}>
                    <FlatList showsVerticalScrollIndicator={false}
                        numColumns={4}
                        data={image}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
                <PopUpUploadImage
                    isVisible={this.state.isVisiblePopupUploadImage}
                    takeImage={() => this.takeImage()}
                    selectImage={() => this.selectImage()}
                    pressCancel={this._togglePopupUploadImage}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        alignItems: 'center'
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
        marginTop: 20,
        width: Layout.window.width * 0.925
    },
    formLabel: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
    },
    formInput: {
        height: 40,
        borderWidth: 1,
        borderColor: Colors.darkBlur,
        paddingBottom: 8,
        paddingLeft: 10,
        color: Colors.darkText,
        backgroundColor: Colors.lightBg,
        borderRadius: 5,
        width: '60%',
        fontStyle: 'italic',
        fontSize: FontStyle.mdText
    },
    uploadImage: {
        width: Layout.window.width * 0.24,
        height: Layout.window.width * 0.24,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        backgroundColor: Colors.lightBg
    },
    blur: {
        height: Layout.window.width * 0.24,
        width: Layout.window.width * 0.24,
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        backgroundColor: "rgba(0,0,0,.3)",
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5
    },
    gridView: {
        flex: 1,
    },
    imageItem: {
        width: Layout.window.width * 0.24,
        height: Layout.window.width * 0.24,
        borderRadius: 10,
    },
    leftBlock: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    rightBlock: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    addButton: {
        height: 40,
        width: '30%',
        borderRadius: 25,
        backgroundColor: Colors.functionColorLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '10%',
    },
    searchBlock: {
        // flexDirection: 'row',
        // justifyContent: 'flex-start',
        // alignItems: 'center'
        width: Layout.window.width * 0.925,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfServiceReducers],
        ...state[nameOfLoadingReducers][serviceActions.ADD_YOUR_SERVICE]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(serviceActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(YourServiceTab)
