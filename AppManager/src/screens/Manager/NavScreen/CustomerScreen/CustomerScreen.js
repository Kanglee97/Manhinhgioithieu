import React, { Component } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    StatusBar
} from 'react-native';
import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MainHeader, IconImage, CustomerNameCard, Loading, SearchBar } from '../../../../components/react-native-teso';
import CustomerTabNavigator from '../../../../navigation/Manager/CustomerTabNavigator';
class CustomerScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static navigationOptions = {
        header: null
    };

    render() {
        if (this.props.isLoading)
            return (
                <Loading />
            )
        return (
            <SafeAreaView style={styles.container}>
                        {/* <MainHeader
                    backgroundColor={Colors.lightBg}
                    centerComponent={
                        <View style={styles.displayInlineBlock}>
                            <Text style={{
                                color: Colors.functionColorDark, fontWeight: 'bold',
                                fontSize: FontStyle.mdText, textAlign: 'center',
                                width: '90%'
                            }}
                                numberOfLines={1} ellipsizeMode={'tail'}>ab</Text>
                            <FontAwesome5 name={'chevron-down'} color={Colors.functionColorDark} size={FontStyle.sm} style={{ marginTop: 5 }} />
                        </View>
                    }
                    centerPress={this._toggleDropdownStore}
                    rightComponent={<IconImage source={require('../../../../assets/img/bluePen.png')} height={20.304} width={23.256} />}
                /> */}
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    centerComponent={'Khách hàng'}
                />
                <CustomerTabNavigator ref={nav => {
                    this.navigator = nav;
                }} />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg//transparent,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
});

export default (CustomerScreen)