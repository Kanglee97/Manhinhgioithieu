import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, FontStyle, Layout } from '../Magic';
import { CustomButtonGradient } from '../index';

class Notification extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity disabled={this.props.notificationPress == null} onPress={this.props.notificationPress} style={[styles.notification, styles.displayInlineBlock, this.props.style]}>
                <View style={styles.leftBlock}>
                    <Text style={styles.text}>
                        {this.props.number} {this.props.content}
                    </Text>
                </View>
                <View style={styles.rightBlock}>
                    <CustomButtonGradient
                        width={this.props.btnWidth}
                        content={this.props.label || 'Thêm'}
                        onPress={this.props.onPress}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    notification: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        paddingHorizontal: 10,
        flex: 1,
        width: Layout.window.width,
        backgroundColor: Colors.lightBg,
        borderTopColor: Colors.secondaryColor,
        borderTopWidth: 1,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    topBlock: {
        width: Layout.window.width,
        paddingBottom: 10,
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
    text: {
        color: Colors.darkText,
        fontWeight: 'bold',
        fontSize: FontStyle.smallText,
        fontFamily: FontStyle.mainFont,
        height: 20,
    },
    addButton: {
        height: 35,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 25,
        backgroundColor: Colors.lightBg,
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
});

export {
    Notification
}