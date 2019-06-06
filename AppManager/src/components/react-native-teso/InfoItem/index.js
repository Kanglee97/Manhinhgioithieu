import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import Swipeout from 'react-native-swipeout';
import numeral from 'numeral';

class TitleItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity style={[styles.displayInlineBlock, styles.modelCard]} onPress={this.props.onPress}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={styles.optionTitle}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

class InfoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            this.props.swipe ?
                <Swipeout {...this.props} backgroundColor={Colors.bg}>
                    <TouchableWithoutFeedback style={[styles.displayInlineBlock, styles.modelCard]} onPress={this.props.onPress}>
                        <View style={[styles.displayInlineBlock, styles.modelCard]}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <Text style={styles.optionLabel}>{this.props.label}</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={styles.optionPrice}>{numeral(this.props.price).format('0,0')} đ</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Swipeout>
                :
                <TouchableOpacity style={[styles.displayInlineBlock, styles.modelCard]} onPress={this.props.onPress}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Text style={styles.optionLabel}>{this.props.label}</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Text style={styles.optionPrice}>{numeral(this.props.price).format('0,0')} đ</Text>
                    </View>
                </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    modelCard: {
        height: 50,
        width: Layout.window.width * 0.925,
        marginVertical: 2,
        borderRadius: 10,
        backgroundColor: Colors.lightBg,
        shadowColor: Colors.functionColorDark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Layout.window.width * 0.03,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    optionTitle: {
        fontWeight: 'bold',
        fontFamily: FontStyle.mainFont,
        marginLeft: 20,
        fontSize: FontStyle.mdText,
        color: Colors.darkText
    },
    optionLabel: {
        fontFamily: FontStyle.mainFont,
        marginLeft: 20,
        fontSize: FontStyle.mdText,
        color: Colors.darkText
    },
    optionPrice: {
        fontSize: FontStyle.mdText,
        marginRight: 20,
        color: Colors.darkText
    },
})

export {
    TitleItem,
    InfoItem
};
