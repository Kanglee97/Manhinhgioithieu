import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontStyle, Layout } from '../Magic';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { onSearch, onClear, value } = this.props;
        return (
            <View style={{ marginLeft: Layout.window.width * 0.03, }}>
                <TextInput style={[styles.formInput, this.props.inputStyle]}
                    {...this.props}
                    value={value}
                    placeholder={!this.props.placeholder ? 'Tìm kiếm' : this.props.placeholder}
                />
                {!value ?
                    <TouchableOpacity onPress={onSearch} style={styles.searchIcon}>
                        <FontAwesome5 name={'search'} size={FontStyle.mdText} color={Colors.functionColorDark} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={onClear} style={styles.searchIcon}>
                        <FontAwesome5 name={'times'} size={FontStyle.mdText} color={Colors.functionColorDark} />
                    </TouchableOpacity>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formInput: {
        height: 40,
        backgroundColor: Colors.lightGreyColor,
        paddingBottom: 10,
        paddingLeft: 15,
        fontSize: FontStyle.smallText,
        color: Colors.darkText,
        borderRadius: 10,
        width: Layout.window.width * 0.925,
        marginBottom: 15,
    },
    searchIcon: {
        position: 'absolute',
        top: '22%',
        right: '7%',
    },
})

export {
    SearchBar
}