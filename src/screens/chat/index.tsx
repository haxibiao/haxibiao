import React, { Component, useEffect, useCallback, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { middlewareNavigate } from '@src/router';
import { GiftedChat, Bubble, Send, Composer, InputToolbar } from 'react-native-gifted-chat';
import { PageContainer, LoadingError, SpinnerLoading, HeaderRight, Header, TouchFeedback } from '@src/components';
import { Query, Mutation, withApollo, GQL, useQuery, useMutation } from '@src/apollo';
import { appStore, userStore, observer } from '@src/store';
import Echo from 'laravel-echo';

import ChatStore from './ChatStore';

interface Props {
    navigation: any;
}

const Chat = observer((props: Props) => {
    const { navigation } = props;
    const [messages, setMessages] = useState([]);
    const { me } = userStore;
    const chat = navigation.getParam('chat', {});

    useEffect(() => {
        if (chat.id) {
            //监听聊天室
            ChatStore.chatId = chat.id;
            ChatStore.listenChat(chat.id);
        } else {
            //创建聊天
            ChatStore.createChat(chat.withUser.id);
        }

        return () => {
            appStore.echo.leave(`chat.${ChatStore.chatId}`);
            ChatStore.messagesData = [];
            ChatStore.chatId = null;
        };
    }, []);

    //chat id存在
    const { data, loading, error, refetch, fetchMore } = useQuery(GQL.messagesQuery, {
        variables: {
            chat_id: ChatStore.chatId,
            page: 1,
        },
        fetchPolicy: 'network-only',
        skip: ChatStore.chatId ? false : true,
    });

    useEffect(() => {
        if (data && data.messages.data.length > 0) {
            constructMessages(data.messages);
        }
    }, [loading]);

    //遍历messages 构造新message
    const constructMessages = messagesData => {
        messagesData.data.forEach(message => {
            const incomingMessage = {
                _id: message.id,
                text: message.message,
                // createdAt: message.time_ago,
                user: {
                    _id: message.user.id,
                    name: message.user.name,
                    avatar: message.user.avatar,
                },
            };
            ChatStore.prependMessage(incomingMessage);
        });
        ChatStore.currentPage = messagesData.paginatorInfo.currentPage;
        ChatStore.hasMorePages = messagesData.paginatorInfo.hasMorePages;
    };

    //输入框
    const renderInputToolbar = props => {
        return <InputToolbar {...props} containerStyle={styles.inputToolbar} />;
    };

    const renderComposer = props => {
        return (
            <Composer
                {...props}
                textInputStyle={{
                    backgroundColor: '#FFF',
                    marginTop: 3,
                    marginBottom: 3,
                    padding: 5,
                    lineHeight: 20,
                }}
            />
        );
    };

    const renderSend = props => {
        return (
            <Send {...props} onSend={ChatStore.onSendTextMessage} containerStyle={styles.sendButton} alwaysShowSend>
                <Text style={{ color: '#000', fontSize: PxDp(14) }}>发送</Text>
            </Send>
        );
    };

    const renderBubble = props => {
        return <Bubble {...props} wrapperStyle={chatStyle.bubbleWrapper} textStyle={chatStyle.bubbleText} />;
    };

    return (
        <PageContainer
            autoKeyboardInsets={Device.Android}
            topInsets={Device.Android ? 0 : -Theme.statusBarHeight}
            title={chat.withUser.name}
            titleStyle={{ fontSize: Font(16) }}
            rightView={
                <TouchFeedback onPress={() => middlewareNavigate('ChatSetting', { user: chat.withUser })} style={{}}>
                    <Text style={{ fontSize: Font(16), color: Theme.navBarTitleColor }}>设置</Text>
                </TouchFeedback>
            }>
            <View style={{ paddingTop: 10, flex: 1 }}>
                <GiftedChat
                    renderAvatarOnTop={true}
                    showUserAvatar={true}
                    loadEarlier={true}
                    isAnimated={true}
                    showAvatarForEveryMessage={true}
                    placeholder={'写私信...'}
                    onInputTextChanged={ChatStore.changText}
                    text={ChatStore.textMessage}
                    renderInputToolbar={renderInputToolbar}
                    renderComposer={renderComposer}
                    renderSend={renderSend}
                    renderBubble={renderBubble}
                    messages={ChatStore.messagesData.slice()}
                    isLoadingEarlier={true}
                    renderLoadEarlier={() => {
                        if (ChatStore.messagesData.length > 0 && ChatStore.hasMorePages) {
                            return (
                                <View style={styles.loadEarlier}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            fetchMore({
                                                variables: {
                                                    page: ChatStore.currentPage + 1,
                                                },
                                                updateQuery: (prev, { fetchMoreResult }) => {
                                                    constructMessages(fetchMoreResult.messages);
                                                    return Object.assign({}, prev, {
                                                        messages: Object.assign({}, prev.messages, {
                                                            data: [
                                                                ...prev.messages.data,
                                                                ...fetchMoreResult.messages.data,
                                                            ],
                                                            paginatorInfo: {
                                                                ...prev.messages.paginatorInfo,
                                                                ...fetchMoreResult.messages.paginatorInfo,
                                                            },
                                                        }),
                                                    });
                                                },
                                            });
                                        }}>
                                        <View
                                            style={{
                                                alignItems: 'center',
                                            }}>
                                            <Text style={{ fontSize: PxDp(12) }}>查看更早的消息</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    }}
                    onPressAvatar={user => {
                        user = { ...user, ...{ id: user._id } };
                        navigation.navigate('User', { user });
                    }}
                    user={{
                        _id: me.id,
                        name: me.name,
                        avatar: me.avatar,
                    }}
                />
            </View>
        </PageContainer>
    );
});

const chatStyle = {
    bubbleWrapper: {
        left: {
            marginBottom: PxDp(15),
            marginLeft: PxDp(3),
            backgroundColor: '#eee',
            borderWidth: PxDp(2),
            borderColor: '#fff',
            overflow: 'hidden',
        },
        right: {
            marginBottom: PxDp(15),
            marginRight: PxDp(3),
            backgroundColor: '#b7e8ff',
            borderWidth: PxDp(2),
            borderColor: '#fff',
            overflow: 'hidden',
        },
    },
    bubbleText: {
        left: {
            padding: PxDp(5),
            color: '#515151',
        },
        right: {
            padding: PxDp(5),
            color: '#515151',
        },
    },
};

const styles = StyleSheet.create({
    inputToolbar: {
        // paddingVertical: PxDp(4),
        borderTopColor: '#F0F0F0',
        borderTopWidth: PxDp(0.5),
        backgroundColor: '#FFF',
    },
    sendButton: {
        // marginBottom: 5,
        marginRight: PxDp(15),
        // width: 60,
        // height: 31,
        // borderRadius: PxDp(6),
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: Theme.primaryColor,
    },
    loadEarlier: {
        marginVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default Chat;
