import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from 'react-native-elements';

export default class HeaderGradient extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <LinearGradient start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={['#2D5C81', '#2F87AB', '#32B4D8']}>
                <Header
                    placement='left'
                    statusBarProps={{ barStyle: 'light-content' }}
                    barStyle="light-content"
                    {...this.props}
                />
            </LinearGradient>
        );
    }
}