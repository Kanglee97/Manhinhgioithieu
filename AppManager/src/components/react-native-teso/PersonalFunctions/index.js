import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
    AsyncStorage
} from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';

class PersonalFunction extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity style={[styles.displayInlineBlock, { height: 30, justifyContent: 'center', marginVertical: 10 }]} onPress={this.props.onPress}
                onLongPress = {this.props.onLongPress}>
                <View style={[{ width: '10%', }]}>
                    <View style={[{ width: 30, height: 30, borderRadius: 50, backgroundColor: this.props.iconColor || Colors.functionColorDark, justifyContent: 'center', alignItems: 'center' }]}>
                        {this.props.iconLeft}
                    </View>
                </View>
                <View style={[{ width: '70%', height: 30, justifyContent: 'center' }]}>
                    <Text style={styles.text}>{this.props.content}</Text>
                </View>
                <View style={[{ width: '15%', height: 30, justifyContent: 'center', alignItems: 'flex-end' }]}>
                    {this.props.iconRight}
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.transparent,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    text: {
        color: Colors.darkText,
        fontSize: FontStyle.mdText,
        fontFamily: FontStyle.mainFont,
    },
});

export {
    PersonalFunction
};
