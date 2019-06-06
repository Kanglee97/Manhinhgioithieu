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
    TouchableOpacity,
    StatusBar
} from 'react-native';
import { MainHeader, AccountBoard, PersonalFunction, PopUpConfirm, CustomButtonGradient, ButtonGradient } from '../../../../components/react-native-teso';
import { nameOfAccountPackageReducers, nameOfLoadingReducers, nameOfProfileReducers } from '../../../../reducers/index';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { convertPriceToFloat } from '../../../../helper/validationHelper';
import NavigationService from '../../../../navigation/NavigationService';
import { accountPackageActions } from '../../../../actions/index';
import * as storeService from '../../../../sagas/storeService'
import LinearGradient from 'react-native-linear-gradient';
import { Badge } from 'react-native-elements';
import Carousel from 'react-native-looped-carousel';
import { bindActionCreators } from 'redux';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { get } from 'lodash'

class UpgradeAccountScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listPackages: [],
            leftArrow: <Image source={require('../../../../assets/img/freezone32.png')} />,
            rightArrow: <Image source={require('../../../../assets/img/platinumzone32.png')} />,
            screenState: 1,
            statusBarColor: 'rgb(255,162,7)'
        };
    }


    componentDidMount = () => {
        this.props.actions.getAccountPackageRequest({
            callback: () => {
                this.setState({ listPackages: [...this.props.listPackages] })
            }
        });
    }

    renderFreeZone = () => {
        const { listPackages } = this.props;
        let freezone = listPackages[0];
        return (
            <LinearGradient start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#8b93a1', '#a7b0be', '#c1cad8']}
                style={[styles.carouselContainer]}>
                <View style={styles.carouselBlock}>
                    <Text style={styles.title}>Free Zone</Text>
                    <View style={styles.zoneCircle}>
                        <Image source={require('../../../../assets/img/freezone.png')} style={{ marginTop: 10 }} />
                    </View>
                    <View style={[styles.infoBlock, { padding: 10 }]}>
                        <Text style={[styles.text, { fontSize: FontStyle.bigText }]}>Quyền lợi</Text>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text, { alignSelf: 'flex-start' }]}>{`Chi nhánh`}</Text>
                            <Text style={[styles.text, { alignSelf: 'flex-end', color: Colors.functionColorLight }]}>
                                {`${freezone.storeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tài khoản nhân viên`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.employeeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Sản phẩm/ dịch vụ`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.designLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tùy chọn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.optionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Khuyến mãi`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.promotionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Hóa đơn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.transactionLimit}/tháng`}
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.infoBlock, { marginVertical: 20 }]}>
                        <View style={[{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }]}>
                            <ButtonGradient disabled={true} content={'Đã nâng cấp'} />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        );
    }

    renderGoldZone = () => {
        const { listPackages, user, currentPackage } = this.props;
        let freezone = listPackages[1];
        return (
            <LinearGradient start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#ffa204', '#ffb503', '#ffcb02']}
                style={[styles.carouselContainer]}>
                <View style={styles.carouselBlock}>
                    <Text style={styles.title}>Gold Zone</Text>
                    <View style={styles.zoneCircle}>
                        <Image source={require('../../../../assets/img/goldzone.png')} style={{ marginTop: 10 }} />
                    </View>
                    <View style={[styles.infoBlock, { padding: 10 }]}>
                        <Text style={[styles.text, { fontSize: FontStyle.bigText }]}>Quyền lợi</Text>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text, { alignSelf: 'flex-start' }]}>{`Chi nhánh`}</Text>
                            <Text style={[styles.text, { alignSelf: 'flex-end', color: Colors.functionColorLight }]}>
                                {`${freezone.storeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tài khoản nhân viên`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.employeeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Sản phẩm/ dịch vụ`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.designLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tùy chọn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.optionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Khuyến mãi`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.promotionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Hóa đơn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.transactionLimit}/tháng`}
                            </Text>
                        </View>
                    </View>
                    {this.renderPricingBlock(freezone.price, freezone.name, currentPackage.price)}
                    {freezone.price > currentPackage.price ?
                        <TouchableOpacity style={{ padding: 10, borderRadius: 30, backgroundColor: Colors.lightBg }} onPress={() => NavigationService.navigate('ActiveAccount')}>
                            <Text style={{ color: Colors.functionColorDark }}>Tôi có mã kích hoạt</Text>
                        </TouchableOpacity> : null}
                </View>
            </LinearGradient>
        );
    }

    renderPlatinumZone = () => {
        const { listPackages, user, currentPackage } = this.props;
        let freezone = listPackages[2];
        return (
            <LinearGradient start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#32d083', '#39e69a', '#40fcb0']}
                style={[styles.carouselContainer]}>
                <View style={styles.carouselBlock}>
                    <Text style={styles.title}>Platinum Zone</Text>
                    <View style={styles.zoneCircle}>
                        <Image source={require('../../../../assets/img/platinumzone.png')} style={{ marginTop: 10 }} />
                    </View>
                    <View style={[styles.infoBlock, { padding: 10 }]}>
                        <Text style={[styles.text, { fontSize: FontStyle.bigText }]}>Quyền lợi</Text>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text, { alignSelf: 'flex-start' }]}>{`Chi nhánh`}</Text>
                            <Text style={[styles.text, { alignSelf: 'flex-end', color: Colors.functionColorLight }]}>
                                {`${freezone.storeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tài khoản nhân viên`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.employeeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Sản phẩm/ dịch vụ`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.designLimit == '2000000000' ? 'Không giới hạn' : freezone.designLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tùy chọn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.optionLimit == '2000000000' ? 'Không giới hạn' : freezone.optionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Khuyến mãi`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.promotionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Hóa đơn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.transactionLimit == '2000000000' ? 'Không giới hạn' : freezone.transactionLimit + '/tháng'}`}
                            </Text>
                        </View>
                    </View>
                    {this.renderPricingBlock(freezone.price, freezone.name, currentPackage.price)}
                    {freezone.price > currentPackage.price ?
                        <TouchableOpacity style={{ padding: 10, borderRadius: 30, backgroundColor: Colors.lightBg }} onPress={() => NavigationService.navigate('ActiveAccount')}>
                            <Text style={{ color: Colors.functionColorDark }}>Tôi có mã kích hoạt</Text>
                        </TouchableOpacity> : null}
                </View>
            </LinearGradient>
        );
    }

    renderDiamondZone = () => {
        const { listPackages, user, currentPackage } = this.props;
        let freezone = listPackages[3];
        return (
            <LinearGradient start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#1d86da', '#14a7eb', '#0bc9fd']}
                style={[styles.carouselContainer]}>
                <View style={styles.carouselBlock}>
                    <Text style={styles.title}>Diamond Zone</Text>
                    <View style={styles.zoneCircle}>
                        <Image source={require('../../../../assets/img/diamondzone.png')} style={{ marginTop: 10 }} />
                    </View>
                    <View style={[styles.infoBlock, { padding: 10 }]}>
                        <Text style={[styles.text, { fontSize: FontStyle.bigText }]}>Quyền lợi</Text>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={[styles.text, { alignSelf: 'flex-start' }]}>{`Chi nhánh`}</Text>
                            <Text style={[styles.text, { alignSelf: 'flex-end', color: Colors.functionColorLight }]}>
                                {`${freezone.storeLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tài khoản nhân viên`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.employeeLimit == '2000000000' ? 'Không giới hạn' : freezone.employeeLimit + '/tháng'}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Sản phẩm/ dịch vụ`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.designLimit == '2000000000' ? 'Không giới hạn' : freezone.designLimit + '/tháng'}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Tùy chọn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.optionLimit == '2000000000' ? 'Không giới hạn' : freezone.optionLimit + '/tháng'}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Khuyến mãi`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.promotionLimit == '2000000000' ? 'Không giới hạn' : freezone.promotionLimit}`}
                            </Text>
                        </View>
                        <View style={[styles.displayInlineBlock, { width: '90%', justifyContent: 'space-between' }]}>
                            <Text style={styles.text}>{`Hóa đơn`}</Text>
                            <Text style={[styles.text, { color: Colors.functionColorLight }]}>
                                {`${freezone.transactionLimit == '2000000000' ? 'Không giới hạn' : freezone.transactionLimit + '/tháng'}`}
                            </Text>
                        </View>
                    </View>
                    {this.renderPricingBlock(freezone.price, freezone.name, currentPackage.price)}
                    {freezone.price > currentPackage.price ?
                        <TouchableOpacity style={{ padding: 10, borderRadius: 30, backgroundColor: Colors.lightBg }} onPress={() => NavigationService.navigate('ActiveAccount')}>
                            <Text style={{ color: Colors.functionColorDark }}>Tôi có mã kích hoạt</Text>
                        </TouchableOpacity> : null}
                </View>
            </LinearGradient>
        );
    }

    renderPricingBlock = (pofm, packageName, currentPackagePrice) => {
        const { user } = this.props;
        console.log(pofm, currentPackagePrice);
        return (
            <View style={[styles.infoBlock, { marginVertical: 20 }]}>
                {pofm > currentPackagePrice ?
                    <View style={styles.displayInlineBlock}>
                        <View style={[styles.pricingBlock, { borderTopRightRadius: 10, marginTop: 10 }]}>
                            <Text style={{ fontSize: FontStyle.largeText + 8, fontWeight: '500', fontFamily: FontStyle.mainFont, marginBottom: 5, }}>6</Text>
                            <Text style={{ fontSize: FontStyle.mdText, marginBottom: 5, }}>tháng</Text>
                            <Text style={{ fontSize: FontStyle.smallText, marginBottom: 5, }}>{`+1 tháng`}</Text>
                            <ButtonGradient width={'80%'} onPress={() => {
                                NavigationService.navigate('RegisterPackage', {
                                    packageValue: packageName,
                                    packageTime: 6,
                                    paidMoney: convertPriceToFloat(pofm),
                                });
                            }} content={`đ ${numeral(pofm).format('0,0')}`} />
                        </View>
                        <View style={[styles.pricingBlock, { borderWidth: 1, borderColor: Colors.functionColorDark }]}>
                            <Badge value={'Phổ biến nhất'} status={'primary'} containerStyle={{ marginTop: -20, padding: 5 }} />
                            <Text style={{ fontSize: FontStyle.largeText + 8, fontWeight: '500', fontFamily: FontStyle.mainFont, color: Colors.functionColorDark, marginBottom: 5, }}>1</Text>
                            <Text style={{ fontSize: FontStyle.mdText, color: Colors.functionColorDark, marginBottom: 5, }}>năm</Text>
                            <Text style={{ fontSize: FontStyle.smallText, color: Colors.functionColorDark, marginBottom: 5, }}>{`+3 tháng`}</Text>
                            <ButtonGradient width={'80%'} onPress={() => {
                                NavigationService.navigate('RegisterPackage', {
                                    packageValue: packageName,
                                    packageTime: 12,
                                    paidMoney: convertPriceToFloat(pofm),
                                });
                            }} content={`đ ${numeral(pofm).format('0,0')}`} />
                        </View>
                        <View style={[styles.pricingBlock, { borderTopLeftRadius: 10, marginTop: 10, }]}>
                            <Text style={{ fontSize: FontStyle.largeText + 8, fontWeight: '500', fontFamily: FontStyle.mainFont, marginBottom: 5, }}>2</Text>
                            <Text style={{ fontSize: FontStyle.mdText, marginBottom: 5, }}>năm</Text>
                            <Text style={{ fontSize: FontStyle.smallText, marginBottom: 5, }}>{`+6 tháng`}</Text>
                            <ButtonGradient width={'80%'} onPress={() => {
                                NavigationService.navigate('RegisterPackage', {
                                    packageValue: packageName,
                                    packageTime: 24,
                                    paidMoney: convertPriceToFloat(pofm),
                                });
                            }} content={`đ ${numeral(pofm).format('0,0')}`} />
                        </View>
                    </View>
                    :
                    <View style={[{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }]}>
                        <ButtonGradient disabled={true} content={'Đã nâng cấp'} />
                    </View>
                }
            </View>
        )
    }

    render() {
        console.log(this.props);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: this.state.statusBarColor }}>
                <MainHeader
                    rounded
                    statusBarProps={Platform.OS == 'ios' ? {
                        barStyle: 'dark-content', backgroundColor: this.state.statusBarColor
                    } : { hidden: true, animated: true, showHideTransition: 'slide' }}
                    backgroundColor={Colors.transparent}
                    leftPress={() => NavigationService.navigate('Account')}
                    containerStyle={{
                        // position: 'absolute',
                        // top: 0, left: 0,
                        zIndex: 1,//1000,
                        backgroundColor: Colors.transparent,
                        paddingTop: 0,
                        marginTop: 0,
                        marginBottom: -70,
                        width: Layout.window.width,
                    }}
                />
                <Carousel
                    autoplay={false}
                    isLooped={false}
                    style={styles.carouselContainer}
                    currentPage={1}
                    // arrows
                    bullets
                    bulletsContainerStyle={{ marginBottom: -15, }}
                    // leftArrowStyle={{ width: 32, height: 40 }}
                    // rightArrowStyle={{ width: 32, height: 40 }}
                    // leftArrowText={this.state.leftArrow}
                    // rightArrowText={this.state.rightArrow}
                    onAnimateNextPage={id => {
                        switch (id) {
                            case 0:
                                if (this.state.screenState !== 0)
                                    this.setState({
                                        screenState: 0,
                                        statusBarColor: 'rgb(139,148,162)',
                                        // leftArrow: ' ',
                                        // rightArrow: <Image source={require('../../../../assets/img/goldzone32.png')} />
                                    })
                                break;
                            case 1:
                                if (this.state.screenState !== 1)
                                    this.setState({
                                        screenState: 1,
                                        statusBarColor: 'rgb(255,162,7)',
                                        // leftArrow: <Image source={require('../../../../assets/img/freezone32.png')} />,
                                        // rightArrow: <Image source={require('../../../../assets/img/platinumzone32.png')} />
                                    })
                                break;
                            case 2:
                                if (this.state.screenState !== 2)
                                    this.setState({
                                        screenState: 2,
                                        statusBarColor: 'rgb(50,209,131)',
                                        // leftArrow: <Image source={require('../../../../assets/img/goldzone32.png')} />,
                                        // rightArrow: <Image source={require('../../../../assets/img/diamondzone32.png')} />
                                    })
                                break;
                            case 3:
                                if (this.state.screenState !== 3)
                                    this.setState({
                                        screenState: 3,
                                        statusBarColor: 'rgb(27,136,218)',
                                        // leftArrow: <Image source={require('../../../../assets/img/platinumzone32.png')} />,
                                        // rightArrow: ' '
                                    })
                                break;
                        }
                    }}
                >
                    {this.renderFreeZone()}
                    {this.renderGoldZone()}
                    {this.renderPlatinumZone()}
                    {this.renderDiamondZone()}
                </Carousel>
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
    carouselContainer: {
        height: Layout.window.height,
        width: Layout.window.width,
    },
    carouselBlock: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        fontSize: FontStyle.largeText,
        fontFamily: FontStyle.mainFont,
        color: Colors.lightText,
        lineHeight: FontStyle.largeText,
    },
    infoBlock: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: Colors.lightBg,
        width: Layout.window.width * 0.9,
        borderRadius: 10,
    },
    text: {
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        lineHeight: 30,
    },
    zoneCircle: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.lightBg,
        borderRadius: 50,
        marginVertical: 20,
    },
    pricingBlock: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
        width: '33.33%',
        paddingVertical: 5,
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfAccountPackageReducers],
        ...state[nameOfProfileReducers],
        ...state[nameOfLoadingReducers][accountPackageActions.GET_ACCOUNT_PACKAGE]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(accountPackageActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeAccountScreen);
