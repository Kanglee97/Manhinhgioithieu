import React from 'react'
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,

} from 'react-native'

import { Colors, Layout, FontStyle } from '../../../../components/react-native-teso/Magic';
import { nameOfCustomerReducers } from '../../../../reducers/index';
import { connect } from 'react-redux'


class CustomerContactTab extends React.Component {
    render() {
        const { info } = this.props.detail
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ height: Layout.window.height * 0.40 }}>
                {/* <View style={styles.container}> */}
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                        Điện thoại: {info.phone || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                    </Text>
                    <View />
                </View>
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                        Năm sinh: {info.birthday || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                    </Text>
                    <View />
                </View>
                {/* {<View style={[styles.displayInlineBlock, styles.formInput]}>
                        <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                            Job
                    </Text>
                        <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                            Student
                    </Text>
                        <View />
                    </View>} */}
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                        Email: {info.email || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                    </Text>
                    <View />
                </View>
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }} numberOfLines={1} ellipsizeMode={'tail'}>
                        Chỗ ở hiện tại: {info.address || <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                    </Text>
                    <View />
                </View>
                <View style={[styles.displayInlineBlock, styles.formInput]}>
                    <Text style={{ fontSize: FontStyle.smallText, fontFamily: FontStyle.mainFont, color: Colors.dark1 }}>
                        Facebook: {info.facebookId ? `fb.com/${info.facebookId}` : <Text style={{ fontSize: FontStyle.smallText, fontStyle: 'italic', color: Colors.darkBlur }}>(Chưa cập nhật)</Text>}
                    </Text>
                    <View />
                </View>
                {/* </View> */}
            </ScrollView>
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

export default connect(mapStateToProps)(CustomerContactTab)