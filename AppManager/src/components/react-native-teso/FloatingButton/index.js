import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import { Colors, FontStyle, Layout } from '../Magic';
import LinearGradient from 'react-native-linear-gradient';

class FloatingButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <ActionButton onPress={this.props.onPress} buttonColor={Colors.functionColorLight} size={50}>
                {this.props.children}
            </ActionButton>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    miniCircle: {
        height: 20,
        width: 20
    },
    btnFloating: {
        height: 50,
        width: 50,
        position: 'absolute',
        bottom: 40,
        right: 40
    }
});

export {
    FloatingButton
}