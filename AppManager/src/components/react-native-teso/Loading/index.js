import React, { Component } from 'react'
import {
    ActivityIndicator,
    AppRegistry,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import { Colors, FontStyle, Layout } from '../Magic';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';

class Loading extends Component {
    state = { animating: true }
    render() {
        return (
            <View style={styles.background}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={Colors.functionColorLight} />
                    <Text>{this.props.message || 'Đang tải...'}</Text>
                </View>
            </View>
        )
    }
}

class LoadingElement extends Component {
    state = { animating: true }
    render() {
        return (
            <View style={styles.miniBackground}>
                <View style={styles.container}>
                    <ActivityIndicator size="small" color={Colors.functionColorLight} />
                </View>
            </View>
        )
    }
}

class ImageProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Image source={this.props.source}
                indicator={Progress.Circle}
                size={20}
                style={[{
                    borderRadius: this.props.borderRadius,
                    borderBottomLeftRadius: this.props.borderBottomLeftRadius,
                    borderTopLeftRadius: this.props.borderTopLeftRadius,
                }, this.props.style]}
                {...this.props} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.bg
    },
    miniBackground: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: Colors.transparent
    }
})

export {
    Loading,
    LoadingElement,
    ImageProgress
}