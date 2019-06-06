import React, { Component } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet
} from 'react-native';
import { nameOfAccountPackageReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers';
import { logoutFacebook, logoutGoogle, logoutPhone } from '../../../../helper/logoutHelper';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { Loading, Pincode, PopUpRemind } from '../../../../components/react-native-teso';
import { accountPackageActions, authActions } from '../../../../actions';
import NavigationService from '../../../../navigation/NavigationService';
import { nameOfAuthReducers } from '../../../../reducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class ActiveAccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loginRequired: false,
        };
        this.activeCode = this.activeCode.bind(this);
        this._toggleLoginRequried = this._toggleLoginRequried.bind(this);
        this.logoutManagerRole = this.logoutManagerRole.bind(this);
    }

    _toggleLoginRequried = () => this.setState({ loginRequired: !this.state.loginRequired });

    activeCode = (pin) => {
        this.setState({ loading: true }, async () => {
            console.log('pinCode>>>', pin, this.props.user.id);
            const obj = {
                'code': pin,
                'user': this.props.user.id
            }
            const data = {
                'code': obj,
                callback: () => {
                    // NavigationService.navigate('Account', { loginRequired: true });
                    this.setState({ loginRequired: true, loading: false });
                },
                fallback: () => {
                    this.setState({ loading: false });
                }
            }
            this.props.actions.activeCodeRequest(data)
        });
    }

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
        if (this.props.loading || this.state.loading) {
            return (
                <Loading />
            );
        }
        return (
            <SafeAreaView style={styles.container}>
                <Pincode
                    withTouchId={false}
                    spaceColor={Colors.functionColorDark}
                    closeButtonColor={Colors.functionColorDark}
                    onCloseView={() => NavigationService.goBack()}
                    descriptionText={'Nhập mã kích hoạt đính kèm trong email hoặc thư\n*Lưu ý: Không chia sẻ mã cho bất kỳ ai khác'}
                    onEnteredPincode={pin => this.activeCode(pin)}
                />
                <PopUpRemind
                    title={'Thông báo'}
                    isVisibleUpgradeStore={this.state.loginRequired}
                    limitContent={`Vui lòng đăng nhập lại để kích hoạt tài khoản!`}
                    okLabel={'Đăng xuất ngay'}
                    onPressOk={() => {
                        this._toggleLoginRequried()
                        this.logoutManagerRole()
                    }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})



const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAuthReducers],
        ...state[nameOfAccountPackageReducers],
        ...state[nameOfProfileReducers],
        ...state[nameOfLoadingReducers][accountPackageActions.ACTIVE_CODE]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators({ ...authActions, ...accountPackageActions }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAccountScreen);