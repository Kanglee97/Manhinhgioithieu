import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image
} from 'react-native'

import { Colors, Layout, FontStyle } from '../../../../components/react-native-teso/Magic'
import { MainHeader, UserAvatar, Logo, MaterialIcon } from '../../../../components/react-native-teso'
import { GiftedChat, Actions, Send, Time, Day, Bubble, LoadEarlier, utils } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils';
import SlackMessage from './ChatConfig/SlackMessage';
import CustomActions from './ChatConfig/CustomActions';
import CustomView from './ChatConfig/CustomView';
import Fire from './Fire';
import NavigationService from '../../../../navigation/NavigationService';
import * as storeService from '../../../../sagas/storeService'
import { nameOfProfileReducers, nameOfStoreDetailReducers } from '../../../../reducers'
import { connect } from 'react-redux'
import { get } from 'lodash'


class CustomerChatScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            loadEarlier: true,
            typingText: null,
            isLoadingEarlier: false,
        }
        this._isAlright = null;
        this._isMounted = false;
        this.onSend = this.onSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderTime = this.renderTime.bind(this);
        this.renderSend = this.renderSend.bind(this);
        this.renderBubble = this.renderBubble.bind(this);
        this.renderAvatar = this.renderAvatar.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.onLoadEarlier = this.onLoadEarlier.bind(this);
        this.renderLoadEarlier = this.renderLoadEarlier.bind(this);
        this.renderSystemMessage = this.renderSystemMessage.bind(this);
        //this.renderCustomActions = this.renderCustomActions.bind(this);
    }

    static navigationOptions = {
        header: null
    };

    componentDidMount() {
        this._isMounted = true;
        Fire.shared.on(message =>
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message)
            }))
        );
    }

    componentWillUnmount() {
        this._isMounted = false;
        Fire.shared.off();
    }

    renderMessage(props) {
        const { currentMessage: { text: currText } } = props;

        let messageTextStyle;

        // Make "pure emoji" messages much bigger than plain text.
        if (currText && emojiUtils.isPureEmojiString(currText)) {
            messageTextStyle = {
                fontSize: 28,
                // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            };
        }

        return (
            <SlackMessage {...props} messageTextStyle={messageTextStyle} />
        );
    }

    onSend(messages = []) {
        Fire.shared.send(messages);
    }


    onReceive(text) {
        this.setState((previousState) => {
            return {
                messages: GiftedChat.append(previousState.messages, {
                    _id: Math.round(Math.random() * 1000000),
                    text: text,
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'React Native',
                    },
                }),
            };
        });
    }

    renderCustomActions(props) {
        if (Platform.OS === 'ios') {
            return (
                <CustomActions
                    {...props}
                />
            );
        }
        const options = {
            'Action 1': (props) => {
                alert('option 1');
            },
            'Action 2': (props) => {
                alert('option 2');
            },
            'Cancel': () => { },
        };
        return (
            <Actions
                {...props}
                options={options}
            />
        );
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: Colors.functionColorLight,
                    }
                }}
            />
        );
    }

    renderAvatar(props) {
        return (
            <UserAvatar source={{ uri: `${image}` }} size={40} />
        )
    }

    renderSystemMessage(props) {
        return (
            <SystemMessage
                {...props}
                containerStyle={{
                    marginBottom: 15,
                }}
                textStyle={{
                    fontSize: 14,
                }}
            />
        );
    }

    renderCustomView(props) {
        return (
            <CustomView
                {...props}
            />
        );
    }

    onLoadEarlier() {
        this.setState((previousState) => {
            return {
                isLoadingEarlier: true,
            };
        });

        setTimeout(() => {
            if (this._isMounted === true) {
                Fire.shared.more(message =>
                    this.setState((previousState) => {
                        return {
                            messages: GiftedChat.append(previousState.messages, message),
                            loadEarlier: false,
                            isLoadingEarlier: false,
                        };
                    })
                );
            }
        }, 1000); // simulating network
    }

    renderLoadEarlier(props) {
        return (
            <LoadEarlier
                {...props}
                onLoadEarlier={this.onLoadEarlier}
                label={'Tải tin nhắn cũ hơn'}
            />
        );
    }

    renderTime() {
        return (
            <Time
                {...timeProps}
                containerStyle={{ left: [styles.timeContainer] }}
                textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
            />
        );
    }

    renderFooter(props) {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
        return null;
    }

    renderSend(props) {
        return <Send {...props} containerStyle={{ justifyContent: 'center', paddingRight: 3 }}>
            <MaterialIcon name={'send'} color={Colors.functionColorLight} size={30} />
        </Send>
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <MainHeader
                    backgroundColor={Colors.lightBg}
                    leftPress={() => NavigationService.goBack()}
                    centerComponent={this.props.navigation.getParam('displayName', 'Khách hàng')}
                    containerStyle={styles.accountHeader}
                />
                <GiftedChat
                    // isAnimated={true}
                    onSend={this.onSend}
                    // renderTime={this.renderTime}
                    messages={this.state.messages}
                    // renderFooter={this.renderFooter}
                    // renderBubble={this.renderBubble}
                    // renderAvatar={this.renderAvatar}
                    placeholder={'Nhập tin nhắn...'}
                    // loadEarlier={this.state.loadEarlier}
                    // renderLoadEarlier={this.renderLoadEarlier}
                    // isLoadingEarlier={this.state.isLoadingEarlier}
                    // renderSystemMessage={this.renderSystemMessage}
                    renderAvatarOnTop
                    alwaysShowSend
                    renderMessage={this.renderMessage}
                    // user={{ '_id': this.props.user.id, name: this.props.user.firstName }}
                    user={{ '_id': this.props.user.id, name: get(storeService.getSpecificState(nameOfStoreDetailReducers), 'data.displayName') }}
                    renderSend={this.renderSend}
                />
            </SafeAreaView>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightBg
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        ...state[nameOfProfileReducers]
    }
}


export default connect(mapStateToProps)(CustomerChatScreen)