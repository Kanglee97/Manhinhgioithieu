import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    FlatList,
    ScrollView,
    Image,
    SafeAreaView
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader } from '../../../../components/react-native-teso';

import EmployeeTabNavigator from '../../../../navigation/Manager/EmployeeTabNavigator';
import NavigationService from '../../../../navigation/NavigationService';


class EmployeeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            storeId: '',
            ownerId: null,
            displayName: '',
            address: ''
        };
    }

    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    centerComponent={'Nhân viên'}
                />
                <EmployeeTabNavigator ref={nav => {
                    this.navigator = nav;
                }} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg
    },
});

export default EmployeeScreen