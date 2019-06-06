import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { ButtonGradient, MainHeader } from '../../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import ImagePicker from 'react-native-image-crop-picker';
import NavigationService from '../../../../../navigation/NavigationService';

export default class EditOptionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: '',
            price: '',
            desc: '',
            isEdit: false
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        const { navigation } = this.props;
        this.setState({
            isEdit: navigation.getParam('isEdit', 'NO-ISEDIT')
        })
    }

    selectImage() {
        ImagePicker.openPicker({
            width: 250,
            height: 250,
            cropping: true
        }).then(response => {
            // let source = { uri: response.uri };
            // this.setState({image_uri: response.uri})

            // You can also display the image using data:
            // let image_uri = { uri: 'data:image/jpeg;base64,' + response.data };

            this.uploadImage(response.path)
                .then(url => {
                    alert('uploaded');
                    console.log(response);
                    console.log(url);
                })
                .catch(error => console.log(error))
        }).catch(err => {
            console.log(err);
        });
    }


    //upload image to firebase 
    uploadImage(uri, mime = 'application/octet-stream') {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null

            const imageRef = FirebaseClient.storage().ref('Images').child('Services');
            // image_uri;
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` });
                })
                .then((blob) => {
                    uploadBlob = blob;
                    return imageRef.put(blob, { contentType: mime });
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL();
                })
                .then((url) => {
                    resolve(url);
                })
                .catch((error) => {
                    reject(error);
                })
        })
    }

    render() {
        const { displayName, price, desc } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
                    <MainHeader
                        backgroundColor={Colors.lightBg}
                        leftPress={() => NavigationService.navigate('ModalDetail')}
                        centerComponent={'Thêm kiểu dáng'}
                    />
                    <View style={styles.containerBody}>
                        <View style={styles.form}>
                            <Text style={styles.formLabel}>Tên kiểu dáng</Text>
                            <TextInput style={[styles.formInput, styles.blackText, { fontWeight: 'bold' }]}
                                onChangeText={(text) => this.setState({ displayName: text })}
                                value={displayName}
                                placeholder={'Nhập tên kiểu dáng...'} />
                        </View>
                        <View style={styles.form}>
                            <Text style={styles.formLabel}>Giá tiền</Text>
                            <TextInput style={[styles.formInput, styles.blueText, { fontWeight: 'bold' }]}
                                onChangeText={(text) => this.setState({ price: text })}
                                value={price}
                                placeholder={'Nhập tên kiểu dáng...'} />
                        </View>
                        <View style={styles.form}>
                            <Text style={styles.formLabel}>Mô tả</Text>
                            <AutoGrowingTextInput value={desc} onChangeText={(text) => this.setState({ desc: text })}
                                style={[styles.formInput, styles.blackText]}
                                placeholder={'Nhập mô tả kiểu dáng...'} />
                        </View>
                        <View style={[{ justifyContent: 'flex-start', alignItems: 'center', height: 100 }]}>
                            {!this.state.isEdit &&
                                <ButtonGradient {...this.props}
                                    content={'Thêm'}
                                    labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                                />}
                            {this.state.isEdit &&
                                <View style={[styles.displayInlineBlock, styles.form, { alignItems: 'center', justifyContent: 'center' }]}>
                                    <TouchableOpacity style={styles.cancelBtn}>
                                        <Text style={{ fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.functionColorLight, fontWeight: 'bold' }}>Hủy bỏ</Text>
                                    </TouchableOpacity>
                                    <ButtonGradient {...this.props}
                                        content={'Lưu'}
                                        labelStyle={{ fontWeight: 'bold', fontSize: FontStyle.mdText }}
                                        style={{ width: Layout.window.width * 0.3 }} />
                                </View>}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightBg,
    },
    containerBody: {
        flex: 1,
        backgroundColor: Colors.lightBg,
        marginTop: 3,
        paddingLeft: 10,
        paddingRight: 10,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
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
        borderWidth: 1,
        paddingBottom: 10,
        paddingLeft: 10,
        borderColor: Colors.darkBlur,
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
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: Colors.transparent,
        zIndex: 55,
        position: 'relative',
    },
    delImage: {
        position: 'absolute',
        top: 5,
        right: 5
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
    }
});