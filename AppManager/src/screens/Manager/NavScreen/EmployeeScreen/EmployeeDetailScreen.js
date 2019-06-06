import React from 'react'
import { ScrollView, StyleSheet, View, Platform, Image, Text, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import { nameOfEmployeeDetailReducers, nameOfLoadingReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { ButtonSolid, MainHeader, UserAvatar, PopUpConfirm, Loading, ButtonText } from '../../../../components/react-native-teso';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import NavigationService from '../../../../navigation/NavigationService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as storeService from '../../../../sagas/storeService'
import { employeeActions } from '../../../../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash'


class EmployeeDetailScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: 'Name',
            image: '',
            position: 'position',
            isVisiblePopup: false,
        };
        this.deleteEmployee = this.deleteEmployee.bind(this)
        this.loadData = this.loadData.bind(this)
        this._togglePopup = this._togglePopup.bind(this)
    }

    static navigationOptions = {
        header: null
    };

    componentWillMount() {
        console.log('EmployeeDetailScreen will mount')
    }

    componentDidMount() {
        this.loadData()
    }

    _togglePopup = () => this.setState({ isVisiblePopup: !this.state.isVisiblePopup });

    loadData() {
        const data = {
            'employeeId': this.props.navigation.getParam('employeeId')
        }
        this.props.actions.fetchEmployeeRequest(data)
    }

    deleteEmployee = () => {
        const obj = {
            'id': this.props.detail.id,
            'portal': get(storeService.getSpecificState(nameOfProfileReducers), 'user.portal'),
        }
        const data = {
            'employee': obj,
            callback: () => {
                this.props.navigation.state.params.callback()
                NavigationService.goBack()
            }
        }
        this._togglePopup()
        this.props.actions.deleteEmployeeRequest(data)
    }

    render() {
        const {
            id,
            firstName,
            lastName,
            position,
            birthday,
            userName,
            hometown,
            address,
            identification,
            phone,
            email,
            avatar
        } = this.props.detail
        const { image } = this.state
        if (this.props.isLoading) return (<Loading />)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => {
                        this.props.navigation.state.params.callback()
                        NavigationService.goBack()
                    }}
                    rightComponent={<FontAwesome5
                        name='edit'
                        size={20}
                        color={Colors.functionColorDark}
                    />}
                    rightPress={() =>
                        NavigationService.navigate('EditEmployee', {
                            callback: () => {
                                this.loadData()
                            }
                        })} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.isLoading}
                            onRefresh={this.loadData}
                        />
                    }
                    showsVerticalScrollIndicator={false} style={styles.container}>
                    <View style={styles.containerBody}>
                        <View style={styles.containerInfoAvatar}  >
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <UserAvatar source={avatar && { uri: avatar }} />
                                <Text style={[styles.text, styles.textBold, { color: Colors.functionColorDark }]}>
                                    {`${firstName || 'Quản lý'} ${lastName || ''}`}
                                </Text>
                                <Text style={styles.text}>
                                    {position || 'Quản lý'}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.text, styles.textBold, { alignSelf: 'center', marginTop: 0, marginBottom: 0 }]}>
                            Thông tin cơ bản
                        </Text>
                        <View style={styles.containerInfo}>
                            <Text style={styles.text}>
                                Tài khoản: {userName || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Chức vụ: {position || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Năm sinh: {birthday || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Quê quán: {hometown || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Chỗ ở hiện tại: {address || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Căn cước/ CMND: {identification || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Điện thoại: {phone || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                            <Text style={styles.text}>
                                Email: {email || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    text: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        marginTop: 5,
        marginBottom: 5,
    },
    textBold: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        fontWeight: 'bold',
        marginTop: 2,
        marginBottom: 2,
    },
    containerBody: {
        alignSelf: 'center',
        width: Layout.window.width * 0.95,
        alignItems: 'center',
    },
    containerInfoAvatar: {
        width: Layout.window.width * 0.9,
        marginVertical: Layout.window.width * 0.05,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'black',
        padding: 20,
        borderRadius: 5,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },
    containerInfo: {
        flexWrap: 'wrap',
        backgroundColor: 'black',
        width: Layout.window.width * 0.9,
        marginVertical: Layout.window.width * 0.05,
        padding: 10,
        borderRadius: 5,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfEmployeeDetailReducers],
        ...state[nameOfLoadingReducers][
        employeeActions.FETCH_EMPLOYEE
        ],
        ...state[nameOfLoadingReducers][
        employeeActions.DELETE_EMPLOYEE
        ]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(employeeActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDetailScreen)