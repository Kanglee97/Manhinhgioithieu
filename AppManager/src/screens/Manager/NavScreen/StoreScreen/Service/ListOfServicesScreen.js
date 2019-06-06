import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    SafeAreaView
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../../../components/react-native-teso/Magic';
import { Card7 } from '../../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NavigationService from '../../../../../navigation/NavigationService';

export default class ListOfServicesScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            servicesList: [
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
                { title: 'Cạo trọc', description: 'Bóng lưỡng, đỡ hao sà phòng', price: '10000000', url: 'https://firebasestorage.googleapis.com/v0/b/meup-beauty-app.appspot.com/o/Images%2Favocado-face-mask.jpg?alt=media&token=5bb4d5a4-924e-420f-a044-f7dd3a998622' },
            ]
        };
    }

    static navigationOptions = {
        header: null
    };

    render() {
        const { servicesList } = this.state;
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.goBack()}
                    centerComponent={'Cắt tóc'}
                    rightComponent={<FontAwesome5 name='plus' size={20} />}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.containerBody}>
                        <FlatList showsVerticalScrollIndicator={false}
                            numColumns={1}
                            data={servicesList}
                            renderItem={({ item }) =>
                                <Card7 url={item.url} >
                                    <Text style={{ fontWeight: 'bold', fontSize: FontStyle.mdText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>Tên sản phẩm-dịch vụ: {item.title}</Text>
                                    <Text style={{ fontSize: FontStyle.smallText, lineHeight: 20, fontFamily: FontStyle.mainFont }}>Mô tả: <Text style={{ color: Colors.darkText }}>{item.description}</Text></Text>
                                    <Text style={{ fontSize: FontStyle.smallText, lineHeight: 20, fontFamily: FontStyle.mainFont }}>Giá tiền: <Text style={{ color: Colors.darkText }}>{item.price}</Text></Text>
                                </Card7>
                            }
                            keyExtractor={(item, index) => `${index}`}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
        marginBottom: 22
    },
    containerBody: {
        flex: 1,
        backgroundColor: Colors.bg,
        marginTop: 3,
        paddingLeft: 10,
        paddingRight: 10,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
});