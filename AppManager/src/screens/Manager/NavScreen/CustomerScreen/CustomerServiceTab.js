import React from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    ScrollView,
    SafeAreaView
} from 'react-native'

import { Colors, FontStyle } from '../../../../components/react-native-teso/Magic'
import Layout from '../../../../assets/styles/Layout';
import { FontAwesome } from 'react-native-vector-icons/FontAwesome'


class CustomerServiceTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            service: [
                { displayName: '7/3/2019', price: '100000', percent: 0.3 },
                { displayName: '8/3/2019', price: '100000', percent: 1 },
                { displayName: '9/3/2019', price: '100000', percent: 0.5 },
                { displayName: '10/3/2019', price: '100000', percent: 0.8 },
                { displayName: '11/3/2019', price: '100000', percent: 0 },
            ],
        }
    }
    componentDidMount() {
        this.loadData()
    }

    loadData() {

    }

    renderItem = ({ item, index }) => {
        return (
            <View style={[styles.displayInlineBlock, styles.formInput, { justifyContent: 'space-around' }]}>
                <View style={{
                    backgroundColor: '#939292',
                    padding: 2,
                    width: 65,
                    height: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5
                }}>
                    <View style={{
                        backgroundColor: '#076DAD',
                        borderRadius: 5,
                        width: 65 * item.percent,
                        alignSelf: 'flex-start',
                        height: 15,
                        position: 'absolute'
                    }}>
                    </View>
                    <Text style={{ fontSize: FontStyle.xsp, fontFamily: FontStyle.mainFont, color: Colors.lightText }}>
                        USING
                    </Text>
                </View>
                <View style={[styles.displayInlineBlock, { width: '70%', justifyContent: 'space-between' }]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                        {item.displayName}
                    </Text>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                        {item.price}
                    </Text>
                </View>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    style={{ backgroundColor: Colors.white, flex: 1 }}
                    data={this.state.service}
                    renderItem={this.renderItem}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    formInput: {
        height: 40,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: Colors.darkBlur,
        color: Colors.darkText,
        borderRadius: 5,
        marginTop: 6.2,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})

export default CustomerServiceTab