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


class CustomerPictureTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            picture: [
                { status: 'COMPLETE', date: '7/3/2019', price: '100000' },
                { status: 'DRAFT', date: '8/3/2019', price: '100000' },
                { status: 'VOID', date: '9/3/2019', price: '100000' },
                { status: 'COMPLETE', date: '10/3/2019', price: '100000' },
                { status: 'COMPLETE', date: '11/3/2019', price: '100000' },
                { status: 'COMPLETE', date: '10/3/2019', price: '100000' },
                { status: 'COMPLETE', date: '11/3/2019', price: '100000' },
                { status: 'COMPLETE', date: '10/3/2019', price: '100000' },
                { status: 'COMPLETE', date: '11/3/2019', price: '100000' },
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
                    backgroundColor: (item.status == 'COMPLETE') ? '#027E45' : (item.status == 'DRAFT') ? '#D3A200' : '#BC0117',
                    padding: 2,
                    width: 80,
                    alignItems: 'center',
                    borderRadius: 5
                }}>
                    <Text>{item.status}</Text>
                </View>
                <Text>{item.date}</Text>
                <Text>{item.price}</Text>
            </View >
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    style={{ backgroundColor: Colors.white, flex: 1 }}
                    data={this.state.picture}
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

export default CustomerPictureTab