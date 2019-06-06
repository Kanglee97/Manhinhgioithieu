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
import { nameOfProfileReducers } from '../../../../reducers/index';
import { bindActionCreators } from 'redux';
import { profileActions } from '../../../../actions/index';
import { connect } from 'react-redux';

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

    render() {
        const { messages } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                        <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => this.props.navigation.goBack()}
                    centerComponent={'Thông báo'}
                />
                <FlatList showsVerticalScrollIndicator={false}
                    data={messages}
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
    }
});

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfProfileReducers]
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        actions: bindActionCreators(profileActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
