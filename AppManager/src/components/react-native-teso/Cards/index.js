import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image, ImageBackground, FlatList } from 'react-native';
import { UserAvatar, ImageProgress, MaterialIcon } from '../index';
import { Colors, FontStyle, Layout } from '../Magic';
import numeral from 'numeral';
import _ from 'lodash'
import Moment from 'moment'

const MessageCard = props => {
    const {
        onPress,
        cardStyle,
        image,
        title,
        time,
        content
    } = props;
    return (
        <TouchableOpacity style={[styles.displayInlineBlock, styles.card, cardStyle]} onPress={onPress}>
            <View style={[{ width: '20%' }]}>
                <UserAvatar source={image && { uri: image }} size={48} />
            </View>
            <View style={[{ width: '80%' }]}>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '50%', alignItems: 'flex-start' }}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                    </View>
                    <View style={{ width: '50%', alignItems: 'flex-end' }}>
                        <Text style={styles.text}>{time}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', alignItems: 'flex-start' }}>
                    <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'} >{content}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const StoreCard = props => {
    const {
        cardStyle = {},
        onPress = {},
        image = '',
        title = '',
        content = '',
        check = true
    } = props

    return (
        <TouchableOpacity style={[styles.displayInlineBlock, styles.card, cardStyle]} onPress={onPress}>
            <View style={[{ width: '20%' }]}>
                <UserAvatar source={image && { uri: image }} size={48} />
            </View>
            <View style={[{ width: '80%' }]}>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '70%', alignItems: 'flex-start' }}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', alignItems: 'flex-start' }}>
                    <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'} >{content}</Text>
                </View>
                {check && <MaterialIcon name={'check-circle'} size={20} color={Colors.functionColorDark} />}
            </View>
        </TouchableOpacity>
    );
}

const OrderCard = (props) => {
    const {
        image = '',
        title = '',
        startTime = '',
        content = '',
        detail = '',
        price = '',
        check = false,
    } = props
    return (
        <TouchableOpacity
            style={[styles.displayInlineBlock, styles.card, props.style]}
            onPress={props.onPress}>
            <View style={[{ width: '20%' }]}>
                <UserAvatar source={image && { uri: image }} size={48} />
            </View>
            <View style={[{ width: '80%' }]}>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '60%', alignItems: 'flex-start' }}>
                        <Text style={[styles.title, { fontSize: FontStyle.mdText, fontWeight: 'normal' }]} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                    </View>
                    <View style={{ width: '40%', alignItems: 'flex-end' }}>
                        <Text style={[styles.title, { fontWeight: 'normal' }]} numberOfLines={1} ellipsizeMode={'tail'}>{content}</Text>
                    </View>
                </View>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '60%', alignItems: 'flex-start' }}>
                        <Text style={[styles.text, { fontSize: FontStyle.smallText }]} numberOfLines={1} ellipsizeMode={'tail'}>{detail}</Text>
                    </View>
                    {price !== '' &&
                        <View style={{ width: '40%', alignItems: 'flex-end' }}>
                            <Text style={[styles.text, { fontSize: FontStyle.mdText }]}>{numeral(price).format('0,0')} đ</Text>
                        </View>
                    }
                </View>
                {check && <MaterialIcon name={'check-circle'} size={20} color={Colors.functionColorDark} />}
            </View>
        </TouchableOpacity>
    )
}

class EmployeeCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            check: false
        }
    }

    componentDidMount() {
        this.setState({
            check: this.props.check
        })
    }

    render() {
        const {
            cardStyle = {},
            image,
            onPress,
            lockCheck,
            title = '',
            content = '',
            unShadow = false,
        } = this.props
        const {
            check
        } = this.state
        return (
            <TouchableOpacity
                style={[styles.displayInlineBlock, styles.card, unShadow && { elevation: 0 }, cardStyle]}
                onPress={(item) => {
                    this.setState({
                        check: !this.state.check
                    })
                    return onPress(item)
                }}>
                <View style={[{ width: '20%' }]}>
                    <UserAvatar source={image && { uri: image }} size={48} />
                </View>
                <View style={[styles.displayInlineBlock, { width: '80%', alignItems: 'center' }]}>
                    <View style={{ width: '90%' }}>
                        <View style={[styles.displayInlineBlock]}>
                            <View style={{ width: '90%', alignItems: 'flex-start' }}>
                                <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', alignItems: 'flex-start' }}>
                            <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'} >{content}</Text>
                        </View>
                    </View>
                    {(check && !lockCheck) && <MaterialIcon name={'check-circle'} size={20} color={Colors.functionColorDark} />}
                </View>
            </TouchableOpacity>
        );
    }
}

const EmployeeRecord = props => {
    const {
        image = '',
        recordStyle = {},
        onPress,
        title = '',
        content = '',
        price = ''
    } = props
    return (
        <TouchableOpacity style={[styles.displayInlineBlock, styles.record, recordStyle]} onPress={onPress}>
            <View style={[{ width: '20%' }]}>
                <UserAvatar source={image && { uri: image }} size={48} />
            </View>
            <View style={[{ width: '60%' }]}>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '70%', alignItems: 'flex-start' }}>
                        <Text style={[styles.title, { color: Colors.functionColorLight }]} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', alignItems: 'flex-start' }}>
                    <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'} >{content}</Text>
                </View>
            </View>
            <View style={{ width: '20%', height: 56, justifyContent: 'center' }}>
                <Text style={[styles.text, { color: Colors.functionColorLight }]} >{numeral(price).format('0,0')}</Text>
            </View>
        </TouchableOpacity >
    );
}

const CustomerNameCard = props => {
    const {
        image = '',
        cardStyle = {},
        onPress = {},
        title = '',
        type = ''
    } = props
    return (
        <TouchableOpacity style={[styles.displayInlineBlock, styles.customerCard, cardStyle, { alignItems: 'center' }]} onPress={onPress}>
            <UserAvatar source={image && { uri: image }} size={50} />
            <View style={[{ width: '60%', marginHorizontal: 10, }]}>
                <Text style={[styles.title, { fontWeight: 'normal', fontSize: FontStyle.mdText }]} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                <Text style={[styles.text]} >{type}</Text>
            </View>
        </TouchableOpacity>
    );
}

const Card7 = props => {
    const {
        style,
        onPress,
        discountContentStyle,
        children,
        url
    } = props;
    return (
        <View style={[styles.card7, style]}>
            <TouchableOpacity style={styles.displayInlineBlock} onPress={onPress}>
                {url ?
                    <ImageProgress source={{ uri: `${url}` }} style={styles.img7} borderBottomLeftRadius={10} borderTopLeftRadius={10} />
                    :
                    <Image source={require('../../../assets/img/default-service-blue.png')} style={styles.img7} />
                }
                <View style={[styles.discountContent7, discountContentStyle]}>
                    {children}
                </View>
            </TouchableOpacity>
        </View>
    );
}

const Card8 = props => {
    const {
        modelStyle,
        onPress,
        url,
        imgStyle,
        title,
        price,
        icon = true,
        addPress,
        removeIcon,
        isPopup,
    } = props;
    return (
        <View style={[styles.modelCard8, modelStyle, !isPopup && {
            marginVertical: 5,
            borderRadius: 5,
        }]}>
            <TouchableWithoutFeedback onPress={onPress} style={{ borderRadius: 5 }}>
                <View style={[styles.displayInlineBlock]}>
                    {url ?
                        <ImageProgress source={{ uri: `${url}` }} style={[styles.img8, imgStyle]} borderRadius={10}
                            borderBottomLeftRadius={isPopup ? 0 : 5} borderTopLeftRadius={isPopup ? 0 : 5} />
                        :
                        <Image source={require('../../../assets/img/default-service-blue.png')} style={[styles.img8, imgStyle]} />
                    }
                    <View style={styles.rightBlock8}>
                        <Text style={styles.title8} numberOfLines={2}>{title}</Text>
                        <Text style={styles.price8}>{numeral(price).format('0,0')} đ</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {icon && addPress &&
                <TouchableOpacity style={{
                    width: 50, height: '100%', justifyContent: 'center', alignItems: 'center',
                    position: 'absolute', right: 0, zIndex: 100
                }} onPress={addPress}>
                    {removeIcon ?
                        <MaterialIcon
                            button
                            name={'remove-circle-outline'}
                            size={20}
                            color={Colors.dangerColor}
                        /> :
                        <MaterialIcon
                            button
                            name={'add-circle-outline'}
                            size={20}
                            color={Colors.functionColorDark}
                        />
                    }
                </TouchableOpacity>}
        </View>
    );
}

class Card9 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isClick: false
        }
    }

    componentDidMount() {
        if (this.props.checkCondition) {
            this.setState({
                isClick: true
            })
        }
    }

    render() {
        console.log('SampleServiceCard render', this.props.checkCondition)
        return (
            <View style={[styles.serviceCard]}>
                <TouchableOpacity
                    style={{ opacity: 1 }}
                    onPress={value => {
                        this.setState({
                            isClick: !this.state.isClick
                        })
                        return this.props.onPress(value)
                    }}>
                    {this.props.url ?
                        (<ImageProgress source={{ uri: `${this.props.url}` }} style={styles.img} borderRadius={10}>
                            {this.state.isClick &&
                                <View style={styles.blur9}>
                                    <MaterialIcon name={'check-circle'} size={50} color={Colors.lightText} />
                                </View>
                            }
                        </ImageProgress>)
                        :
                        (<ImageBackground source={require('../../../assets/img/default-service-blue.png')} style={styles.img}>
                            {this.state.isClick &&
                                <View style={styles.blur9}>
                                    <MaterialIcon name={'check-circle'} size={50} color={Colors.lightText} />
                                </View>
                            }
                        </ImageBackground>)
                    }
                    <Text style={styles.serviceTitle} numberOfLines={1} ellipsizeMode={'tail'}>{this.props.title}</Text>
                </TouchableOpacity>
            </View >
        );
    }
}

const Card10 = props => {
    const {
        onPress = {},
        url,
        title = '',
        nonChild = true,
        cardStyle,
    } = props;
    return (
        <View style={[styles.serviceCard,]}>
            <TouchableOpacity onPress={onPress}>
                {url ?
                    <ImageProgress source={{ uri: `${url}` }} style={styles.img} borderRadius={10} />
                    :
                    <Image source={require('../../../assets/img/default-service-blue.png')} style={styles.img} />
                }
                {!nonChild &&
                    <View style={[{
                        position: 'absolute', top: 0,
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: Colors.darkBlur,
                        height: Layout.window.width * 0.25,
                        width: Layout.window.width * 0.25,
                        borderRadius: 10
                    }]}>
                        <MaterialIcon name={'add-circle-outline'} size={40} color={Colors.lightText} />
                    </View>
                }
                <Text style={styles.serviceTitle} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
}

const Card11 = props => {
    const {
        onPress,
        onRightPress,
        rightComponent,
        url,
        name = '',
    } = props;
    console.log('render ServiceCard', props)
    return (
        <View style={[styles.card11, styles.displayInlineBlock]}>
            <TouchableOpacity onPress={onPress} style={[{
                flexWrap: 'wrap', flexDirection: 'row',
                alignItems: 'center', width: '70%', height: '100%',
                paddingHorizontal: 10,
            }]}>
                {url ?
                    <ImageProgress source={{ uri: `${url}` }} style={styles.img} />
                    :
                    <MaterialIcon name={'store'} color={Colors.darkText} size={17} />
                }
                <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, marginLeft: 5 }} numberOfLines={1} ellipsizeMode={'tail'}>{name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onRightPress} style={{ width: '30%', height: '100%', alignItems: 'center' }}>
                {rightComponent}
            </TouchableOpacity>
        </View>
    );
}

class Card12 extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detailDisplayed: false
        }
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 13, marginVertical: 5, justifyContent: 'space-between' }}>
                <Text style={[styles.card12Text]}>{item.displayName}</Text>
                <Text style={[styles.card12Text]}>{item.price + _.sumBy(item.data, 'data.price')}</Text>
            </View>
        )
    }
    render() {
        const {
            onPress = {},
            reviewPress = {},
            title = '',
            content = '',
            orderId = '',
            price = '',
            startTime = '',
            service = [],
            promotion = []
        } = this.props;
        const { detailDisplayed } = this.state
        return (
            <TouchableOpacity
                onPress={onPress}
                style={styles.card12Container}>
                <View style={styles.card12StoreInfo}>
                    <View style={[styles.displayInlineBlock, { width: '100%', paddingTop: 10, paddingBottom: 5, justifyContent: 'space-between' }]}>
                        <Text style={styles.card12Text}>
                            {title}
                        </Text>
                        <Text style={[styles.card12Text, { color: '#1C1C1C' }]}>
                            {`#${orderId}`}
                        </Text>

                    </View>
                    {startTime !== '' && <View style={[styles.displayInlineBlock, { width: '100%', paddingTop: 5, paddingBottom: 10, justifyContent: 'space-between' }]}>
                        <Text style={[styles.card12Text, { width: '70%' }]} numberOfLines={1} ellipsizeMode={'tail'} >
                            {content}
                        </Text>
                        <Text style={styles.card12Text}>
                            Bắt đầu: {Moment(startTime).format('h:mm a, DD/MM/YYYY')}
                        </Text>
                    </View>}
                </View>
                {
                    detailDisplayed && <View style={{ width: '100%', backgroundColor: '#007894' }}>
                        <Text style={[styles.card12Text, {
                            padding: 10,
                            fontWeight: 'bold',
                            fontSize: FontStyle.mdText,
                            color: 'white',
                        }]}>
                            Chi tiết đơn hàng
                        </Text>
                        <View>
                            {!_.isEmpty(this.props.service) &&
                                <View>
                                    <Text style={[styles.card12Text, {
                                        padding: 10,
                                        fontWeight: 'bold',
                                        fontSize: FontStyle.smallText,
                                        backgroundColor: 'white',
                                    }]}>
                                        Dịch vụ sử dụng
                                    </Text>
                                    <FlatList
                                        style={{ backgroundColor: 'white', marginBottom: 1 }}
                                        data={this.props.service}
                                        keyExtractor={(item, index) => `${index}`}
                                        renderItem={this.renderItem}
                                    />
                                </View>}
                            {!_.isEmpty(this.props.promotion) && <View><Text style={[styles.card12Text, {
                                padding: 10,
                                fontWeight: 'bold',
                                fontSize: FontStyle.smallText,
                                color: 'white',
                                backgroundColor: 'white',
                            }]}>
                                Khuyến mãi sự dụng
                            </Text>
                                <FlatList
                                    style={{ backgroundColor: 'white', marginBottom: 1 }}
                                    data={this.props.promotion}
                                    keyExtractor={(item, index) => `${index}`}
                                    renderItem={this.renderItem}
                                />
                            </View>}
                        </View>
                    </View>
                }
                <View style={styles.card12Foot}>
                    <View style={[styles.displayInlineBlock, { width: '100%', paddingTop: 10, paddingBottom: 10, alignItems: 'center', justifyContent: 'space-between' }]}>
                        <Text style={[styles.card12SolidButtonTitle, { color: Colors.functionColorLight }]}>
                            {`${numeral(price).format('0,0')} đ`}
                        </Text>
                        <TouchableOpacity onPress={() => {
                            this.setState({ detailDisplayed: !this.state.detailDisplayed })
                        }} style={{ backgroundColor: Colors.functionColorDark, height: 40, width: 100, justifyContent: 'center', alignItems: 'center', borderRadius: 4, }}>
                            <Text style={styles.card12SolidButtonTitle}>
                                {detailDisplayed ? 'Thu gọn' : 'Chi tiết'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const BookingCard = (props) => {
    const {
        time = '',
        title = '',
        content = '',
        status = '',
        check = false,
    } = props
    return (
        <TouchableOpacity
            style={[styles.displayInlineBlock, styles.card, props.style]}
            onPress={props.onPress}>
            <View style={[{ width: '20%' }]}>
                {time != '' &&
                    <View style={{
                        height: 48, width: 48, borderRadius: 25,
                        backgroundColor: Colors.secondaryColor, justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: Colors.darkText, fontWeight: 'bold', fontSize: FontStyle.smallText }}>{time}</Text>
                    </View>
                }
            </View>
            <View style={[{ width: '80%' }]}>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '60%', alignItems: 'flex-start', }}>
                        <Text style={[styles.title, { fontWeight: 'normal' }]} numberOfLines={1} ellipsizeMode={'tail'}>{title}</Text>
                    </View>
                    {status !== '' &&
                        <View style={{ width: '40%', alignItems: 'flex-end' }}>
                            <Text style={[styles.text, {
                                color: status == 'CONFIRMED' ? '#4cccff' :
                                    (status == 'PROCESSING' ? '#058600' :
                                        (status == 'DONE' ? '#004D86' : Colors.dangerColor))
                            }]} numberOfLines={1} ellipsizeMode={'tail'}>
                                {status == 'CONFIRMED' ? 'Đã xác nhận' :
                                    (status == 'PROCESSING' ? 'Đang xử lý' :
                                        (status == 'DONE' ? 'Hoàn tất' : 'Hủy bỏ'))}</Text>
                        </View>}
                </View>
                <View style={[styles.displayInlineBlock]}>
                    <View style={{ width: '60%', alignItems: 'flex-start' }}>
                        <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'}>Số lượng khách: {content}</Text>
                    </View>
                    {/* {price !== '' &&
                        <View style={{ width: '40%', alignItems: 'flex-end' }}>
                            <Text style={[styles.text, { fontSize: FontStyle.mdText }]}>{numeral(price).format('0,0')} đ</Text>
                        </View>
                    } */}
                </View>
                {check && <MaterialIcon name={'check-circle'} size={20} color={Colors.functionColorDark} />}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    title: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.smallText,
        fontFamily: FontStyle.mainFont,
        lineHeight: 20,
    },
    card: {
        width: Layout.window.width * 0.9,
        height: 70,
        backgroundColor: Colors.lightBg,
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    record: {
        width: Layout.window.width * 0.9,
        height: 76,
        backgroundColor: Colors.lightBg,
        padding: 10,
        borderBottomColor: 'rgba(79, 79, 79, .3)',
        borderBottomWidth: 1,
    },
    customerCard: {
        width: Layout.window.width * 0.925,
        backgroundColor: Colors.lightBg,
        height: 70,
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        borderColor: Colors.lightGreyColor,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    card7: {
        position: 'relative',
        width: Layout.window.width * 0.925,
        marginVertical: 5,
        marginBottom: 20,
        marginLeft: Layout.window.width * 0.03,
        backgroundColor: Colors.lightBg,
        borderRadius: 10,
    },
    img7: {
        height: Layout.window.width * 0.25,
        width: '30%',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    },
    discountContent7: {
        height: Layout.window.width * 0.25,
        width: '70%',
        paddingLeft: 10,
        paddingTop: 10,
        backgroundColor: Colors.lightBg,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },
    modelCard8: {
        height: 93.11,
        width: Layout.window.width * 0.925,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 3,
    },
    img8: {
        height: 93.11,
        width: Layout.window.width * 0.25,
    },
    title8: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        lineHeight: 30,
    },
    price8: {
        color: Colors.functionColorLight,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        lineHeight: 25,
    },
    rightBlock8: {
        backgroundColor: Colors.lightBg,
        padding: 15,
    },
    btnSwipe8: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bg,
    },
    blur9: {
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        backgroundColor: "rgba(0,0,0,.3)",
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderRadius: 10,
        zIndex: 5,
        top: 0,
        left: 0,
        flex: 1,
    },
    serviceCard: {
        marginHorizontal: Layout.window.width * 0.035,
        marginBottom: Layout.window.width * 0.07,
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        position: 'relative',
        marginVertical: 5,
    },
    img: {
        height: Layout.window.width * 0.25,
        width: Layout.window.width * 0.25,
        borderRadius: 10,

    },
    serviceTitle: {
        color: Colors.darkText,
        fontSize: FontStyle.smallText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    card12Container: {
        borderRadius: 5,
        borderColor: Colors.lightGreyColor,
        borderWidth: 1,
        backgroundColor: Colors.bg,
        width: Layout.window.width * 0.95,
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 5,
    },
    card12StoreInfo: {
        width: Layout.window.width * 0.9,
    },
    card12Foot: {
        width: Layout.window.width * 0.9
    },
    card12Text: {
        color: Colors.dark1,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
    },
    card12SolidButtonTitle: {
        color: Colors.lightText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    card11: {
        width: Layout.window.width * 0.9,
        height: 50,
        borderRadius: 5,
        backgroundColor: Colors.lightBg,
        borderColor: Colors.lightGreyColor,
        borderWidth: 1,
        marginVertical: 5,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2.84,
        elevation: 3,
    }
});

export {
    MessageCard,
    StoreCard,
    EmployeeCard,
    EmployeeRecord,
    CustomerNameCard,
    OrderCard,
    Card7,
    Card8,
    Card9,
    Card10,
    Card11,
    Card12,
    BookingCard
};
