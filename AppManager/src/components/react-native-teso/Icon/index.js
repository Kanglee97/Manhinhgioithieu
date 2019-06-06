import React, { Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors, FontStyle, Layout } from '../Magic';
import { Image, View, TouchableOpacity } from 'react-native';

const TabBarIcon = (props) => {
    const {
        name,
        focused
    } = props;
    return (
        <MaterialIcons
            name={name}
            size={24}
            color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />
    );
}

const TabBarIconImage = (props) => {
    const { inActiveSource, activeSource, height, width, focused } = props;
    return (
        <View>
            {focused ?
                <Image source={activeSource} style={{ height: height, width: width }} />
                :
                <Image source={inActiveSource} style={{ height: height, width: width }} />
            }
        </View>
    );
}

const IconImage = (props) => {
    const {
        source,
        height,
        width,
        style
    } = props;
    return (
        <Image source={source} style={[{ height: height, width: width }, style]} />
    )
}

const MaterialIcon = (props) => {
    const {
        name,
        size,
        color,
        button,
        onPress,
        style
    } = props;
    return (
        onPress ?
            <TouchableOpacity style={button && [{
                height: size + 10, width: size + 10,
                borderRadius: (size + 10) / 2,
                backgroundColor: Colors.lightGreyColor,
                alignItems: 'center',
                justifyContent: 'center'
            }, style]}
                onPress={onPress}>
                <MaterialIcons
                    name={name}
                    size={size}
                    color={color}
                />
            </TouchableOpacity>
            :
            <View style={button && [{
                height: size + 10, width: size + 10,
                borderRadius: (size + 10) / 2,
                backgroundColor: Colors.lightGreyColor,
                alignItems: 'center',
                justifyContent: 'center'
            }]}>
                <MaterialIcons
                    name={name}
                    size={size}
                    color={color}
                />
            </View>
    );
}

const AntIcon = (props) => {
    const {
        name,
        size,
        color
    } = props;
    return (
        <MaterialIcons
            name={name}
            size={size}
            color={color}
        />
    );
}

export {
    TabBarIcon,
    TabBarIconImage,
    IconImage,
    MaterialIcon,
    AntIcon
}