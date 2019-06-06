import React, { Component } from 'react';
import {
    View,
    Image,
    StyleSheet,
    SafeAreaView,
    RefreshControl,
    ScrollView,
    Platform,
    StatusBar,
    FlatList,
    TouchableOpacity,
    Text,
    Linking,
} from 'react-native';

import { MainHeader, AccountBoard, PersonalFunction, Logo, MaterialIcon, PopUpConfirm, PopUpRemind } from '../../../../components/react-native-teso';
import { nameOfAuthReducers, nameOfProfileReducers, nameOfLoadingReducers, nameOfStoreDetailReducers } from '../../../../reducers';
import { authActions, profileActions, storeDetailActions, employeeActions } from '../../../../actions';
import { GoogleSignin, GoogleSigninButton, statusCodes, } from 'react-native-google-signin';
import { logoutFacebook, logoutGoogle, logoutPhone } from '../../../../helper/logoutHelper';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { googleWebClientID, googleIOSClientID } from '../../../../config/constants';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService';
import { sendEmail } from '../../../../helper/functionHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import { Rating } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { get } from 'lodash'

class AccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            openSwithStore: false,
            isVisibleLogout: false,
            isVisibleSendFeedback: false,
            isVisibleReportIssue: false,
            isLike: false,
            isDislike: false,
            // loginRequired: false,
        };
        this.loadData = this.loadData.bind(this)
        this._toggleDropdownStore = this._toggleDropdownStore.bind(this)
        this.checkAccountGG = this.checkAccountGG.bind(this)
        this.renderUpgradeAccount = this.renderUpgradeAccount.bind(this)
        this.renderFunctions = this.renderFunctions.bind(this)
        this.renderSystemFunctions = this.renderSystemFunctions.bind(this)
        this.renderLogout = this.renderLogout.bind(this)
        this.onSelectStore = this.onSelectStore.bind(this)
        this._toggleLogout = this._toggleLogout.bind(this)
        this._toggleSendFeedback = this._toggleSendFeedback.bind(this)
        this._toggleReportIssue = this._toggleReportIssue.bind(this)
        this.logoutManagerRole = this.logoutManagerRole.bind(this)
        this.store = get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data')
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this.loadData()
        this.checkAccountGG();
    }

    loadData = () => {
        const data = {
            'userId': this.props.user.id
        }
        this.props.actions.fetchProfileRequest(data)
    }

    _toggleDropdownStore = () => this.setState({ openSwithStore: !this.state.openSwithStore });


    async checkAccountGG() {
        // this.unsubscriber = firebase.auth().onAuthStateChanged((changedUser) => {
        //   // console.log(`changed User : ${JSON.stringify(changedUser.toJSON())}`);
        //   this.setState({ user: changedUser });
        //   // console.log(changedUser);
        // });
        GoogleSignin.signInSilently().then(res => {
            this.setState({ user: res })
            console.log(`Login success with user: ${res}`);
        }
        ).catch(error => {
            if (error.code === statusCodes.SIGN_IN_REQUIRED) {
                // user has not signed in yet
                console.log(`Login fail with SIGN_IN_REQUIRED: ${error}`);
            } else {
                // some other error
                console.log(`Login fail with ERROR: ${error}`);
            }
        });
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            iosClientId: googleIOSClientID, // only for iOS
            webClientId: googleWebClientID,
            // offlineAccess: true,
        });
    }

    renderUpgradeAccount = () => {
        return (
            <View style={{ marginVertical: 10, alignItems: 'center', width: Layout.window.width }}>
                <View style={[{ width: Layout.window.width * 0.95 }]}>
                    <PersonalFunction
                        iconLeft={<AntDesign name={'star'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#199bd7'}
                        content={'Nâng cấp salon'}
                        onPress={() => this.props.navigation.navigate('UpgradeAccount')} />
                </View>
            </View>
        )
    }

    renderFunctions = () => {
        return (
            <View style={{ borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5, alignItems: 'center', width: Layout.window.width }}>
                <View style={[{ marginTop: 10, width: Layout.window.width * 0.95 }]}>
                    <PersonalFunction
                        iconLeft={<AntDesign name={'bells'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#fab201'}
                        content={'Thông báo'}
                        onPress={() => Toast.show('Tính năng này đang được phát triển', Toast.SHORT)} />
                    <PersonalFunction
                        iconLeft={<AntDesign name={'mail'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#0dc05f'}
                        content={'Tin nhắn'}
                        onPress={() => this.props.navigation.navigate('Message')} />
                </View>
            </View>
        )
    }

    renderSystemFunctions = () => {
        return (
            <View style={{ borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5, marginTop: 10, alignItems: 'center', width: Layout.window.width }}>
                <View style={[{ marginTop: 10, width: Layout.window.width * 0.95 }]}>
                    <PersonalFunction
                        iconLeft={<AntDesign name={'book'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#199bd7'}
                        content={'Hướng dẫn sử dụng'}
                        onPress={() => Toast.show('Tính năng này đang được phát triển', Toast.SHORT)} />
                    <PersonalFunction
                        iconLeft={<AntDesign name={'frown'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#d9425a'}
                        content={'Báo cáo sự cố'}
                        onPress={() => { this._toggleReportIssue() }} />
                    <PersonalFunction
                        iconLeft={<AntDesign name={'like1'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#0dc05f'}
                        content={'Gửi phản hồi'}
                        onPress={() => { this._openSendFeedback() }} />
                    <PersonalFunction
                        iconLeft={<AntDesign name={'setting'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#6c7175'}
                        content={'Cài đặt'}
                        onPress={() => Toast.show('Tính năng này đang được phát triển', Toast.SHORT)} />
                </View>
            </View>
        )
    }

    renderLogout = () => {
        return (
            <View style={{
                borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5,
                borderBottomColor: Colors.lightGreyColor, borderBottomWidth: 0.5,
                marginVertical: 10, alignItems: 'center', width: Layout.window.width
            }}>
                <View style={[{ marginVertical: 10, width: Layout.window.width * 0.95 }]}>
                    <PersonalFunction
                        iconLeft={<AntDesign name={'sync'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#22c3c2'}
                        content={'Trở thành nhân viên'}
                        onPress={() => { this._toggleDropdownStore() }} />
                    <PersonalFunction
                        iconLeft={<AntDesign name={'poweroff'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#ff3b30'}
                        content={'Đăng xuất'}
                        onPress={this._toggleLogout} />
                </View>
            </View>
        )
    }

    onSelectStore = async (storeId, displayName, address) => {
        if (storeId != get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId')) {
            storeService.dispatch(storeDetailActions.clearStore())
            storeService.dispatch(employeeActions.clearEmployee())
        }
        const data = {
            'storeId': storeId,
            'displayName': displayName,
            'address': address,
        }
        await storeService.dispatch(storeDetailActions.saveStoreDetail(data))
        this.props.navigation.navigate('MainStaff')
    }

    _toggleLogout = () => this.setState({ isVisibleLogout: !this.state.isVisibleLogout });

    _toggleSendFeedback = () => this.setState({ isVisibleSendFeedback: !this.state.isVisibleSendFeedback });

    _openSendFeedback = () => this.setState({ isLike: false, isDislike: false, isVisibleSendFeedback: !this.state.isVisibleSendFeedback });

    _toggleReportIssue = () => this.setState({ isVisibleReportIssue: !this.state.isVisibleReportIssue });

    logoutManagerRole = () => {
        if (this.props.isAuthorized) {
            if (this.props.phoneToken != '') {
                logoutPhone({
                    logout: () => {
                        NavigationService.navigate('SelectRole')
                    }
                });
            } else if (this.props.facebookToken != '') {
                logoutFacebook({
                    logout: () => {
                        NavigationService.navigate('SelectRole')
                    }
                });
            } else if (this.props.googleToken != '') {
                logoutGoogle({
                    logout: () => {
                        NavigationService.navigate('SelectRole')
                    }
                });
            }
        }
    }

    render() {
        console.log(this.props)
        const { user } = this.props;
        const { isLike, isDislike, isVisibleLogout, isVisibleReportIssue, isVisibleSendFeedback, openSwithStore } = this.state;
        console.log(this.store);

        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    darkBar={isVisibleLogout || isVisibleReportIssue
                        || isVisibleSendFeedback || openSwithStore}
                    backgroundColor={Colors.lightBg}
                    reRenderCenterComponent={<Logo height={44.121} width={75} />}
                    reRenderRightComponent={<TouchableOpacity onPress={() => Toast.show('Tính năng này đang được phát triển', Toast.SHORT)}>
                        <Image source={
                            user.accountType == 'copper_pack' ? require('../../../../assets/img/freezone.png') :
                                (user.accountType == 'gold_pack' ? require('../../../../assets/img/goldzone.png') :
                                    (user.accountType == 'platinum_pack' ? require('../../../../assets/img/platinumzone.png') :
                                        (user.accountType == 'diamond_pack' ? require('../../../../assets/img/diamondzone.png') : null)))
                        } style={{ width: 40, height: 40, marginTop: -10, }} />
                    </TouchableOpacity>}
                    containerStyle={styles.accountHeader}
                />
                <AccountBoard
                    style={{ marginLeft: Layout.window.width * 0.05 }}
                    image={user.avatar}
                    title={`${user.firstName || 'Chủ sở hữu'} ${user.lastName || ''}`}
                    content={user.position || 'Chủ sở hữu'}
                    onPress={() => this.props.navigation.navigate('AccountInfo')}
                />
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5,
                        marginTop: 20, alignItems: 'center'
                    }}>
                    {this.renderUpgradeAccount()}
                    {this.renderFunctions()}
                    {this.renderSystemFunctions()}
                    {this.renderLogout()}
                </ScrollView>
                <Modal isVisible={this.state.openSwithStore}
                    backdropColor={Colors.transparent}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleDropdownStore}
                    style={styles.dropdownBlock}>
                    <ScrollView style={{ maxHeight: Layout.window.height * 0.4 }}>
                        <FlatList
                            data={user.isManager ? [this.store] : this.props.storeList}
                            numColumns={1}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    style={[styles.displayInlineBlock, styles.storeRecord, { justifyContent: 'space-between', alignItems: 'center' }]}
                                    onPress={() => {
                                        this._toggleDropdownStore();
                                        this.onSelectStore(item.id, item.displayName, item.address)
                                    }}>
                                    <View style={{ width: '80%' }}>
                                        <Text style={styles.name} numberOfLines={1} ellipsizeMode={'tail'}>{item.displayName}</Text>
                                        <Text style={styles.address} numberOfLines={1} ellipsizeMode={'tail'}>{item.address}</Text>
                                    </View>
                                    {(item.id === get(storeService.getSpecificState(nameOfStoreDetailReducers), 'storeId')) && <MaterialIcon name={'check-circle'} size={15} color={Colors.functionColorDark} />}
                                </TouchableOpacity>
                            }
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </ScrollView>
                </Modal>
                <Modal isVisible={this.state.isVisibleSendFeedback}
                    backdropColor={Colors.darkBlur}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleSendFeedback}
                    style={styles.feedBackBlock}>
                    {isLike &&
                        <View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[styles.text, { marginTop: 10, alignSelf: 'center', fontWeight: 'bold', fontSize: FontStyle.mdText, color: Colors.dark1 }]}>Chúng tôi thật vinh hạnh!</Text>
                            </View>
                            <Text>Hãy dành ít phút đánh giá ứng dụng của chúng tôi trên app store</Text>
                            <Rating fractions={1} readonly imageSize={20} startingValue={5} style={{ marginVertical: 10 }} />
                            <View style={styles.hairline} />
                            <View style={[styles.displayInlineBlock, { marginTop: 10, justifyContent: 'space-around', alignItems: 'center' }]}>
                                <TouchableOpacity onPress={this._toggleSendFeedback}>
                                    <Text style={[styles.text, { color: Colors.darkGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>NHẮC LẠI SAU</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Platform.OS == "android" ?
                                        Linking.openURL('market://details?id=com.salozo.business').catch(err => console.log(err))
                                        : Linking.openURL('itms://itunes.apple.com/us/app/apple-store/com.salozo.business?mt=8').catch(err => console.log(err));
                                    this._toggleSendFeedback();
                                }}>
                                    <Text style={[styles.text, { color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>ĐÁNH GIÁ NGAY</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {isDislike &&
                        <View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[styles.text, { marginTop: 10, alignSelf: 'center', fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Giúp chúng tôi hoàn thiện!</Text>
                            </View>
                            <Text style={{ marginBottom: 10 }}>Hãy dành vài giây phản hồi ứng dụng của chúng tôi trên app store</Text>
                            <View style={styles.hairline} />
                            <View style={[styles.displayInlineBlock, { marginTop: 10, justifyContent: 'space-around', alignItems: 'center' }]}>
                                <TouchableOpacity onPress={this._toggleSendFeedback}>
                                    <Text style={[styles.text, { color: Colors.darkGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>KHÔNG, CẢM ƠN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Platform.OS == "android" ?
                                        Linking.openURL('market://details?id=com.salozo.business').catch(err => console.log(err))
                                        :
                                        Linking.openURL('itms://itunes.apple.com/us/app/apple-store/com.salozo.business?mt=8').catch(err => console.log(err))
                                    this._toggleSendFeedback();
                                }}>
                                    <Text style={[styles.text, { color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>VÂNG</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {!isLike && !isDislike &&
                        <View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[styles.text, { alignSelf: 'center', fontWeight: 'bold', fontSize: FontStyle.bigText }]}>Bạn có thích sử dụng Salozo?</Text>
                            </View>
                            <View style={styles.displayInlineBlock}>
                                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.likeButton} onPress={() => this.setState({ isDislike: true })}>
                                        <Image source={require('../../../../assets/img/dislike.png')} style={{ width: 60, height: 60.3 }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '50%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.likeButton} onPress={() => this.setState({ isLike: true })}>
                                        <Image source={require('../../../../assets/img/like.png')} style={{ width: 60, height: 60.3 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                </Modal>
                <Modal isVisible={this.state.isVisibleReportIssue}
                    backdropColor={Colors.darkBlur}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleReportIssue}
                    style={[styles.feedBackBlock, { top: '25%' }]}>
                    <View style={{ marginBottom: 10 }}>
                        <Text style={[styles.text, { alignSelf: 'center', fontWeight: 'bold', fontSize: FontStyle.bigText }]}>Báo cáo sự cố</Text>
                    </View>
                    <Text style={[styles.text, { textAlign: 'center' }]}>Bạn muốn báo cáo một vấn đề kỹ thuật của ứng dụng hoặc cho chúng tôi phản hồi làm thế nào để cải thiện?</Text>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                            sendEmail(`hau@tesosoft.com`,
                                `[SALOZO] Báo cáo lỗi: Phiên bản ${Platform.OS === 'android' ? 'Android' : 'IOS'} ${DeviceInfo.getVersion()}`,
                                `\n\n\n\n--------------------------------------\nPortal: \n${user.portal}\nUser Id: ${user.id}\nUser phone: ${user.phone}\nChức vụ: ${user.position || 'Quản lý'}\nOS version: ${DeviceInfo.getSystemVersion()}\nDevice: ${DeviceInfo.getModel()}\nApp Name: ${DeviceInfo.getApplicationName()}\n`)
                            this._toggleReportIssue();
                        }}>
                            <Text style={[styles.text, { color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Gửi báo cáo lỗi</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => {
                            sendEmail(`hau@tesosoft.com`,
                                `[SALOZO] Phản hồi ứng dụng: Phản hồi cho Phiên bản ${Platform.OS === 'android' ? 'Android' : 'IOS'} ${DeviceInfo.getVersion()}`,
                                `\n\n\n\n--------------------------------------\nPortal: \n${user.portal}\nUser Id: ${user.id}\nUser phone: ${user.phone}\nChức vụ: ${user.position || 'Quản lý'}\nOS version: ${DeviceInfo.getSystemVersion()}\nDevice: ${DeviceInfo.getModel()}\nApp Name: ${DeviceInfo.getApplicationName()}\n`)
                            this._toggleReportIssue();
                        }}>
                            <Text style={[styles.text, { color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Đề xuất cải thiện</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => this._toggleReportIssue()}>
                            <Text style={[styles.text, { color: Colors.darkGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Hủy bỏ</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <PopUpConfirm
                    isVisible={this.state.isVisibleLogout}
                    modalText={'Bạn chắc chắn muốn đăng xuất?'}
                    confirmText={'CÓ'}
                    confirmPress={() => {
                        this._toggleLogout();
                        this.logoutManagerRole()
                    }}
                    confirmCancel={'KHÔNG'}
                    confirmCancelPress={this._toggleLogout}
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
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
    },
    accountHeader: {
        justifyContent: 'center',
        height: 100,
        marginTop: -24,
        borderBottomColor: Colors.transparent,
        borderBottomWidth: 1,
    },
    storeRecord: {
        width: '100%',
        height: 50,
        borderBottomColor: Colors.secondaryColor,
        borderBottomWidth: 1
    },
    dropdownBlock: {
        position: 'absolute',
        bottom: 60,
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderColor: Colors.functionColorLight,
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    feedBackBlock: {
        position: 'absolute',
        top: '35%',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderRadius: 10,
        padding: 15,
    },
    likeButton: {
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: FontStyle.smallText,
        color: Colors.functionColorDark,
        maxWidth: '90%',
        marginVertical: 3,
    },
    address: {
        fontSize: FontStyle.smallText,
        color: Colors.functionColorLight,
        maxWidth: '90%'
    },
    hairline: {
        marginTop: 10,
        backgroundColor: '#EAEAEA',
        marginBottom: 10,
        height: 1,
        width: Layout.window.width * 0.80
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAuthReducers],
        ...state[nameOfProfileReducers],
        loading: {
            ...state[nameOfLoadingReducers][
            profileActions.FETCH_PROFILE,
            profileActions.FETCH_PROFILE_WITH_TOKEN,
            authActions.LOGOUT_EMPLOYEE_ACCOUNT,
            authActions.LOGOUT_FACEBOOK_ACCOUNT,
            authActions.LOGOUT_GOOGLE_ACCOUNT,
            authActions.LOGOUT_PHONE_ACCOUNT
            ]
        }
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...authActions, ...profileActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen)