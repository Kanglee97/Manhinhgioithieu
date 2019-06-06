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
import { nameOfCustomerReducers } from '../../../../reducers/index';
import { connect } from 'react-redux'
class CustomerHistoryTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [
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
                    backgroundColor: (item.payment == 'BYTRANFER') ? Colors.functionColorLight : (item.payment == 'DRAFT') ? '#D3A200' : Colors.functionColorDark,
                    padding: 2,
                    width: 80,
                    alignItems: 'center',
                    borderRadius: 5
                }}>
                    <Text style={{ fontSize: FontStyle.xsp, fontFamily: FontStyle.mainFont, color: Colors.lightText }}>
                        {(item.payment === 'BYTRANFER') ? 'Chuyển khoản' : 'Tiền mặt'}
                    </Text>
                </View>
                <View style={[styles.displayInlineBlock, { width: '70%', justifyContent: 'space-between' }]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                        {/* {item.date} */}
                    </Text>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.darkText }}>
                        {item.totalPrice}
                    </Text>
                </View>
            </View >
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    style={{ backgroundColor: Colors.lightBg }}
                    data={this.props.detail.transaction}
                    renderItem={this.renderItem}
                />
            </View>
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

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfCustomerReducers]
    }
}

export default connect(mapStateToProps)(CustomerHistoryTab)