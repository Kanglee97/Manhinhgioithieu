import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';


class Wrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View style={[styles.topArea, this.props.topAreaStyle]}>
                    {this.props.topAreaComponent}
                </View>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Layout.window.width * 0.925,
        marginLeft: Layout.window.width * 0.0375,
        backgroundColor: Colors.lightBg,
        borderRadius: 5,
        borderWidth: 0,
        borderColor: Colors.transparent,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 20,
    },
    topArea: {
        flex: 1,
        borderBottomColor: Colors.bestBlur,
        borderBottomWidth: 1,
    },
})

export {
    Wrapper
};
