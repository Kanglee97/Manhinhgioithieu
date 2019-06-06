import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from 'react-native';

import { Colors, FontStyle, Layout } from '../../../../components/react-native-teso/Magic';
import { MessageCard, MainHeader } from '../../../../components/react-native-teso';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { nameOfMessengerReducers, nameOfProfileReducers, nameOfLoadingReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { messengerActions, profileActions } from '../../../../actions/index';
import { connect } from 'react-redux';
import { get } from 'lodash'
import * as storeService from '../../../../sagas/storeService'


class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 1', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 2', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
                { title: 'Tiêu đề 3', time: '20/10/2019', content: 'Lorem Lorem LoremLoremLorem LoremLorem LoremLorem LoremLoremLorem' },
            ]
        };
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount = () => {
        this.props.actions.getMessengerManagerRequest({
            'managerId': get(storeService.getSpecificState(nameOfProfileReducers), 'user.id'),
            callback: () => {

            }
        })
    }

    render() {
        const { messengers } = this.props;
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => this.props.navigation.goBack()}
                    centerComponent={'Thông báo'}
                    containerStyle={{
                        borderBottomColor: Colors.lightGreyColor,
                        borderBottomWidth: 1,
                    }}
                />
                {messengers.length <= 0 &&
                    <View style={styles.noContainer}>
                        <Text style={styles.text}>{'Không có bất kỳ tin nhắn nào.'}</Text>
                    </View>
                }
                <FlatList showsVerticalScrollIndicator={false}
                    data={messengers}
                    numColumns={1}
                    contentContainerStyle={styles.messageBlock}
                    renderItem={({ item }) =>
                            <MessageCard
                                title={item.title}
                                time={item.time}
                                content={item.content}
                            // onPress={() => NavigationService.navigate('MessageDetails')}
                            />
             
                    }
                    keyExtractor={(item, index) => `${index}`}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bg,
    },
    displayInlineBlock: {
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    messageBlock: {
        width: Layout.window.width,
        alignItems: 'center',
    },
    noContainer: {
        backgroundColor: Colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfMessengerReducers],
        ...state[nameOfLoadingReducers][messengerActions.GET_ABSENTFORM_MANAGER]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(messengerActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
