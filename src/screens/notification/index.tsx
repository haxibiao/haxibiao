import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { PageContainer, Avatar, Badge, Row, SafeText, StatusView } from '@src/components';
import { GQL, useQuery, useLazyQuery, useApolloClient } from '@src/apollo';
import { observer, userStore } from '@src/store';
import { middlewareNavigate } from '@src/router';
import { exceptionCapture } from '@src/common';
import Chats from './components/Chats';

export default observer(props => {
    const [myUnreadNotify, setUnreadNotify] = useState({});
    const [chats, setChats] = useState([]);
    const login = Helper.syncGetter('login', userStore);
    const user = Helper.syncGetter('me', userStore);
    const userId = Helper.syncGetter('id', user);

    const { data: notifyData, refetch: refetchUnreadsQuery } = useQuery(GQL.unreadsQuery, {
        fetchPolicy: 'network-only',
    });

    const { data: chatsData, refetch: refetchChatsQuery } = useQuery(GQL.chatsQuery, {
        fetchPolicy: 'network-only',
        variables: { user_id: userId },
        skip: !userId,
    });

    useEffect(() => {
        const newNotify = Helper.syncGetter('me', notifyData);
        if (newNotify) {
            setUnreadNotify(newNotify);
        }
    }, [notifyData]);

    useEffect(() => {
        const newChats = Helper.syncGetter('chats.data', chatsData);
        if (newChats) {
            setChats(newChats);
        }
    }, [chatsData]);

    // 退出登录，清除记录
    useEffect(() => {
        if (!userId) {
            setUnreadNotify({});
            setChats([]);
        }
    }, [userId]);

    const FooterView = useMemo(() => {
        if (chats.length < 1) {
            return (
                <StatusView.EmptyView
                    title="若不寻人聊，只能待佳音"
                    imageSource={require('@src/assets/images/default_chat.png')}
                />
            );
        } else {
            return (
                <View style={styles.footerView}>
                    <Text style={styles.footerViewText}>--end--</Text>
                </View>
            );
        }
    }, [chats]);

    useEffect(() => {
        if (userId) {
            const navWillBlurListener = props.navigation.addListener('willFocus', payload => {
                refetchUnreadsQuery();
                refetchChatsQuery();
            });
            return () => {
                navWillBlurListener.remove();
            };
        }
    }, [userId, refetchUnreadsQuery, refetchChatsQuery]);
    return (
        <PageContainer isTopNavigator={true} title="消息">
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.notifyType}>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => middlewareNavigate('CommentNotification', { user })}>
                        <View>
                            <Avatar
                                style={{ borderRadius: PxDp(5) }}
                                size={PxDp(42)}
                                source={require('@src/assets/images/notification_comment.png')}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>评论和@</SafeText>
                        </View>
                        <View style={{ marginLeft: PxDp(10) }}>
                            <Badge count={myUnreadNotify.unread_comments} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => middlewareNavigate('BeLikedNotification', { user })}>
                        <View>
                            <Avatar
                                style={{ borderRadius: PxDp(5) }}
                                size={PxDp(42)}
                                source={require('@src/assets/images/notification_like.png')}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>收到的赞</SafeText>
                        </View>
                        <View style={{ marginLeft: PxDp(10) }}>
                            <Badge count={myUnreadNotify.unread_likes} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => middlewareNavigate('FollowNotification', { user })}>
                        <View>
                            <Avatar
                                style={{ borderRadius: PxDp(5) }}
                                size={PxDp(42)}
                                source={require('@src/assets/images/notification_following.png')}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>新的粉丝</SafeText>
                        </View>
                        <View style={{ marginLeft: PxDp(10) }}>
                            <Badge count={myUnreadNotify.unread_follows} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => middlewareNavigate('OtherRemindNotification', { user })}>
                        <View>
                            <Avatar
                                style={{ borderRadius: PxDp(5) }}
                                size={PxDp(42)}
                                source={require('@src/assets/images/notification_other.png')}
                            />
                        </View>
                        <View style={styles.itemContent}>
                            <SafeText style={styles.itemName}>其它提醒</SafeText>
                        </View>
                        <View style={{ marginLeft: PxDp(10) }}>
                            <Badge count={myUnreadNotify.unread_others} />
                        </View>
                    </TouchableOpacity>
                </View>
                <Chats chats={chats} />
                {FooterView}
            </ScrollView>
        </PageContainer>
    );
});

/* <StatusView.EmptyView
    title="若不寻人聊，只能待佳音"
    imageSource={require('@src/assets/images/default_chat.png')}
/> */

/* <StatusView.EmptyView
    title="加入我们，认识更多小伙伴吧"
    imageSource={require('@src/assets/images/default_chat.png')}
/>; */

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: Theme.groundColour,
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(56),
    },
    footerView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: PxDp(40),
        justifyContent: 'center',
    },
    footerViewText: {
        color: '#a0a0a0',
        fontSize: Font(14),
    },
    itemContent: {
        flex: 1,
        marginLeft: PxDp(10),
    },
    itemContentBottom: {
        justifyContent: 'space-between',
        marginTop: PxDp(4),
    },
    itemContentTop: { justifyContent: 'space-between' },
    itemName: {
        color: Theme.defaultTextColor,
        fontSize: Font(15),
        fontWeight: 'bold',
    },
    lastMessage: {
        color: Theme.subTextColor,
        fontSize: Font(12),
        marginTop: PxDp(4),
        paddingRight: PxDp(20),
    },
    notifyItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: Theme.minimumPixel,
        flexDirection: 'row',
        padding: PxDp(Theme.itemSpace),
    },
    notifyType: {
        backgroundColor: '#fff',
        borderRadius: PxDp(6),
        margin: PxDp(10),
        overflow: 'hidden',
    },
    timeAgo: {
        color: Theme.subTextColor,
        fontSize: Font(12),
    },
});
