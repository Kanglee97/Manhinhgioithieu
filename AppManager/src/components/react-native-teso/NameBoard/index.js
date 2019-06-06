import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Colors, FontStyle, Layout } from '../Magic';
import { MaterialIcon, UserAvatar } from '../index';

class NameBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onPress } = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                {!onPress && <View style={[styles.block, this.props.blockStyle]}>
                    <View style={[styles.displayInlineBlock]}>
                        <FontAwesome5 name='store-alt' size={FontStyle.sm} color={Colors.functionColorLight} />
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginLeft: 10, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, letterSpacing: .2 }}>{this.props.displayName}</Text>
                    </View>
                    <View style={[styles.displayInlineBlock]}>
                        <FontAwesome5 name='location-arrow' size={FontStyle.sm} color={Colors.functionColorLight} />
                        <Text numberOfLines={1} ellipsizeMode='tail'
                            style={{ width: Layout.window.width * 0.6, marginLeft: 10, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, letterSpacing: .2 }}>
                            {this.props.address}
                        </Text>
                    </View>
                    <View style={styles.halfCircle}></View>
                    {this.props.bar ?
                        <TouchableOpacity style={styles.bar} onPress={this.props.barPress}>
                            <FontAwesome5 name='bars' size={FontStyle.mdText} style={{ color: Colors.functionColorLight }} />
                        </TouchableOpacity> : null}
                </View>}
                {onPress && <TouchableWithoutFeedback onPress={onPress}>
                    <View style={[styles.block, this.props.blockStyle]}>
                        <View style={[styles.displayInlineBlock]}>
                            <FontAwesome5 name='store-alt' size={FontStyle.sm} color={Colors.functionColorLight} />
                            <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginLeft: 10, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, letterSpacing: .2 }}>{this.props.displayName}</Text>
                        </View>
                        <View style={[styles.displayInlineBlock]}>
                            <FontAwesome5 name='location-arrow' size={FontStyle.sm} color={Colors.functionColorLight} />
                            <Text numberOfLines={1} ellipsizeMode='tail'
                                style={{ width: Layout.window.width * 0.6, marginLeft: 10, fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, letterSpacing: .2 }}>
                                {this.props.address}
                            </Text>
                        </View>
                        <View style={styles.halfCircle}></View>
                        {this.props.bar ? <View style={styles.bar}>
                            <TouchableOpacity onPress={this.props.barPress}>
                                <FontAwesome5 name='bars' size={FontStyle.mdText} style={{ color: Colors.functionColorLight }} />
                            </TouchableOpacity>
                        </View> : null}
                    </View>
                </TouchableWithoutFeedback>}
            </View>
        );
    }
}

class AccountBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            check: true
        };
    }

    render() {
        return (
            <View style={[styles.displayInlineBlock1, { alignItems: 'center' }, styles.card, { height: 100 }, this.props.style]}>
                <View style={[{ width: '35%', height: '100%', justifyContent: 'center', alignItems: 'center' }]}>
                    <UserAvatar source={this.props.image && { uri: this.props.image }} size={80} />
                </View>
                <View style={[{ width: '65%' }]}>
                    <Text style={[styles.title]} numberOfLines={1} ellipsizeMode={'tail'}>{this.props.title}</Text>
                    <Text style={[styles.text]} numberOfLines={1} ellipsizeMode={'tail'} >{this.props.content}</Text>
                    <TouchableOpacity onPress={this.props.onPress}>
                        <Text style={[styles.text, { color: Colors.functionColorLight }]} numberOfLines={1} ellipsizeMode={'tail'}>Chỉnh sửa thông tin</Text>
                    </TouchableOpacity>
                    {this.props.check && <MaterialIcon name={'check-circle'} size={20} color={Colors.functionColorDark} />}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.transparent,
        zIndex: 1
    },
    block: {
        justifyContent: 'center',
        height: 60,
        backgroundColor: Colors.lightBg,
        paddingLeft: '10%',
        borderColor: Colors.lightGreyColor,
        borderWidth: 1,
        borderRadius: 5,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 6.27,
        elevation: 8,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row',
    },
    displayInlineBlock1: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    halfCircle: {
        backgroundColor: Colors.functionColorLight,
        width: 20.83,
        height: 20.83 * 2,
        borderTopRightRadius: 20.83,
        borderBottomRightRadius: 20.83,
        position: 'absolute',
        left: -5,
    },
    bar: {
        position: 'absolute',
        right: 0,
        height: 60,
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: Layout.window.width * 0.9,
        height: 60,
        backgroundColor: Colors.lightBg,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
        fontWeight: 'bold',
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.smallText,
        fontFamily: FontStyle.mainFont,
        height: 20,
    },
});

export {
    AccountBoard,
    NameBoard
}