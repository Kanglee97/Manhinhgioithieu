import React from 'react'
import {
    View,
    StyleSheet,
    SafeAreaView
} from 'react-native'

import { Colors , FontStyle} from '../../../../components/react-native-teso/Magic'
import Layout from '../../../../assets/styles/Layout';
import {FontAwesome} from 'react-native-vector-icons/FontAwesome'


class CustomerNoteTab extends React.Component {
    componentDidMount() {
        this.loadData()
    }

    loadData() {

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                
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

export default CustomerNoteTab