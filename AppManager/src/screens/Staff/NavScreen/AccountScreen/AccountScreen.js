import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    Text,
    SafeAreaView,
    Image,
    ScrollView,
    Linking,
    TouchableOpacity
} from 'react-native';

import { MainHeader, AccountBoard, PersonalFunction, PopUpConfirm, Logo } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { nameOfAuthReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers';
import NavigationService from '../../../../navigation/NavigationService';
import { authActions, profileActions } from '../../../../actions';
import { logoutFacebook, logoutGoogle, logoutPhone } from '../../../../helper/logoutHelper';
import { sendEmail } from '../../../../helper/functionHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DeviceInfo from 'react-native-device-info';
import { Rating } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { bindActionCreators } from 'redux';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';


class AccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isVisibleLogout: false,
            isVisibleSendFeedback: false,
            isVisibleReportIssue: false,
            isLike: false,
            isDislike: false,
        };
    }

    static navigationOptions = {
        header: null
    };

    renderFunctions() {
        return (
            <View style={{ borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5, alignItems: 'center', width: Layout.window.width }}>
                <View style={[{ marginTop: 10, width: Layout.window.width * 0.95 }]}>
                    <PersonalFunction
                        iconLeft={<AntDesign name={'bells'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#fab201'}
                        content={'Thông báo'}
                        onPress={() => Toast.show('Tính năng này đang được phát triển', Toast.SHORT)} />
                    {!this.props.isOwner && <PersonalFunction
                        iconLeft={<AntDesign name={'profile'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#199bd7'}
                        content={'Form xin nghỉ'}
                        onPress={() => this.props.navigation.navigate('AccountBreakSchedule')} />}
                    <PersonalFunction
                        iconLeft={<AntDesign name={'piechart'} size={FontStyle.mdText} color={Colors.lightText} />}
                        iconColor={'#199bd7'}
                        content={'Doanh thu cá nhân'}
                        onPress={() => this.props.navigation.navigate('AccountStatitic')} />
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
        if (!this.props.isOwner) {
            return (
                <View style={{
                    borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5,
                    borderBottomColor: Colors.lightGreyColor, borderBottomWidth: 0.5,
                    marginVertical: 10, alignItems: 'center', width: Layout.window.width
                }}>
                    <View style={[{ marginVertical: 10, width: Layout.window.width * 0.95 }]}>
                        <PersonalFunction
                            iconLeft={<AntDesign name={'poweroff'} size={FontStyle.mdText} color={Colors.lightText} />}
                            iconColor={'#ff3b30'}
                            content={'Đăng xuất'}
                            onPress={this._toggleLogout} />
                    </View>
                </View>
            );
        } else {
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
                            content={'Trở lại quản lý'}
                            onPress={() => this.props.navigation.navigate('MainManager')} />
                        <PersonalFunction
                            iconLeft={<AntDesign name={'poweroff'} size={FontStyle.mdText} color={Colors.lightText} />}
                            iconColor={'#ff3b30'}
                            content={'Đăng xuất'}
                            onPress={this._toggleLogout} />
                    </View>
                </View>
            )
        };
    }

    _toggleLogout = () => this.setState({ isVisibleLogout: !this.state.isVisibleLogout });

    _toggleSendFeedback = () => this.setState({ isVisibleSendFeedback: !this.state.isVisibleSendFeedback });

    _openSendFeedback = () => this.setState({ isLike: false, isDislike: false, isVisibleSendFeedback: !this.state.isVisibleSendFeedback });

    _toggleReportIssue = () => this.setState({ isVisibleReportIssue: !this.state.isVisibleReportIssue });

    render() {
        console.log(this.props)
        const { user } = this.props;
        const { isLike, isDislike, isVisibleLogout, isVisibleReportIssue, isVisibleSendFeedback } = this.state;
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    darkBar={isVisibleLogout || isVisibleReportIssue
                        || isVisibleSendFeedback}
                    backgroundColor={Colors.lightBg}
                    reRenderCenterComponent={<Logo height={44.121} width={75} />}
                    containerStyle={styles.accountHeader}
                />
                <AccountBoard
                    style={{ marginLeft: Layout.window.width * 0.05 }}
                    image={user.avatar}
                    title={`${user.firstName || 'Chủ sở hữu'} ${user.lastName || ''}`}
                    content={user.position || 'Chủ sở hữu'}
                    onPress={() => this.props.navigation.navigate('AccountInfo')}
                />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                    borderTopColor: Colors.lightGreyColor, borderTopWidth: 0.5,
                    marginTop: 20, alignItems: 'center'
                }}>
                    {this.renderFunctions()}
                    {this.renderSystemFunctions()}
                    {this.renderLogout()}
                </ScrollView>
                <Modal isVisible={this.state.isVisibleSendFeedback}
                    backdropColor={Colors.darkBlur}
                    animationIn='fadeIn'
                    animationOut='fadeOut'
                    onBackdropPress={this._toggleSendFeedback}
                    style={styles.feedBackBlock}>
                    {isLike &&
                        <View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[styles.text, { alignSelf: 'center', fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Chúng tôi thật vinh hạnh!</Text>
                            </View>
                            <Text>Hãy dành ít phút đánh giá ứng dụng của chúng tôi trên app store</Text>
                            <Rating fractions={1} readonly imageSize={20} startingValue={5} style={{ marginVertical: 10 }} />
                            <View style={[styles.displayInlineBlock, { justifyContent: 'space-around', alignItems: 'center' }]}>
                                <TouchableOpacity onPress={this._toggleSendFeedback}>
                                    <Text style={[styles.text, { color: Colors.lightGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Nhắc lại sau</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Platform.OS == "android" ?
                                        Linking.openURL('market://details?id=com.salozo.business').catch(err => console.log(err))
                                        :
                                        Linking.openURL('itms://itunes.apple.com/us/app/apple-store/com.salozo.business?mt=8').catch(err => console.log(err));
                                    this._toggleSendFeedback();
                                }}>
                                    <Text style={[styles.text, { color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Đánh giá ngay</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {isDislike &&
                        <View>
                            <View style={{ marginBottom: 10 }}>
                                <Text style={[styles.text, { alignSelf: 'center', fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Giúp chúng tôi hoàn thiện!</Text>
                            </View>
                            <Text style={{ marginBottom: 10 }}>Hãy dành vài giây phản hồi ứng dụng của chúng tôi trên app store</Text>
                            <View style={[styles.displayInlineBlock, { justifyContent: 'space-around', alignItems: 'center' }]}>
                                <TouchableOpacity onPress={this._toggleSendFeedback}>
                                    <Text style={[styles.text, { color: Colors.lightGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Không, cảm ơn</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    Platform.OS == "android" ?
                                        Linking.openURL('market://details?id=com.salozo.business').catch(err => console.log(err))
                                        :
                                        Linking.openURL('itms://itunes.apple.com/us/app/apple-store/com.salozo.business?mt=8').catch(err => console.log(err))
                                    this._toggleSendFeedback();
                                }}>
                                    <Text style={[styles.text, { color: Colors.functionColorLight, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Vâng</Text>
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
                            <Text style={[styles.text, { color: Colors.lightGreyColor, fontWeight: 'bold', fontSize: FontStyle.mdText }]}>Hủy bỏ</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <PopUpConfirm
                    isVisible={this.state.isVisibleLogout}
                    modalText={'Bạn chắc chắn muốn đăng xuất?'}
                    confirmText={'Có'}
                    confirmPress={() => {
                        this._toggleLogout();
                        if (this.props.isOwner) {
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
                        else
                            this.props.actions.logoutEmployeeAccountRequest({
                                callback: () => {
                                    NavigationService.navigate('SelectRole')
                                }
                            })
                    }}
                    confirmCancel={'Không'}
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
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAuthReducers],
        ...state[nameOfProfileReducers],
        loading: {
            ...state[nameOfLoadingReducers][
            profileActions.FETCH_PROFILE,
            profileActions.FETCH_PROFILE_WITH_TOKEN,
            authActions.LOGOUT_EMPLOYEE_ACCOUNT
            ]
        }
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(authActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen)