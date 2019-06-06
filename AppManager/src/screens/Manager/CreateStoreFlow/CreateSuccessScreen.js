import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../components/react-native-teso/Magic';
import { ButtonGradient } from '../../../components/react-native-teso';
import NavigationService from '../../../navigation/NavigationService';

export default class CreateSuccessScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                        <View style={styles.XinChaoBlock}>
                    <Image source={require('../../../assets/img/ChucmungTitle.png')} style={styles.xinchao} />
                </View>
                <View style={styles.ContentBlock}>
                    <Text style={styles.content}>Khởi tạo thành công!</Text>
                    <Text style={styles.content}>Bắt đầu quản lý cửa hàng của bạn.</Text>
                </View>
                <ButtonGradient
                    onPress={() => NavigationService.navigate('Store')}
                    content='Bắt đầu'
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.bg
    },
    ContentBlock: {
        position: 'absolute',
        top: '33%',
    },
    content: {
        fontSize: FontStyle.mdText,
        color: Colors.darkText,
        textAlign: 'center',
        lineHeight: 30,
        width: Layout.window.width / 1.15,
        fontFamily: FontStyle.mainFont,
    },
    XinChaoBlock: {
        position: 'absolute',
        top: '20%',
    },
    xinchao: {
        height: 46.4,
        width: 266.5
    },
});