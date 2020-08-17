import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, StatusBar } from 'react-native';
import { PageContainer, Avatar, Badge, Row, SafeText, StatusView } from '~/components';
import { GQL, useQuery, useLazyQuery, useApolloClient } from '~/apollo';
import { observer, userStore } from '~/store';
import { useNavigation } from '~/router';
import { exceptionCapture } from '~/utils';
import Chats from './components/Chats';

export default observer((props: any) => {
    const navigation = useNavigation();
    const [myUnreadNotify, setUnreadNotify] = useState({});
    const [chats, setChats] = useState([]);
    const isLogin = Helper.syncGetter('login', userStore);
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
                    imageSource={require('!/assets/images/default_chat.png')}
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
            const navWillBlurListener = props.navigation.addListener('willFocus', (payload) => {
                refetchUnreadsQuery();
                refetchChatsQuery();
            });
            return () => {
                navWillBlurListener();
            };
        }
    }, [userId, refetchUnreadsQuery, refetchChatsQuery]);

    const authNavigator = useCallback(
        (route, params) => {
            if (isLogin) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate('Login');
            }
        },
        [isLogin],
    );

    return (
        <PageContainer title="消息">
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.notifyType}>
                    <TouchableOpacity
                        style={styles.notifyItem}
                        onPress={() => authNavigator('CommentNotification', { user })}>
                        <View>
                            <Image
                                style={{ width: PxDp(42), height: PxDp(42), borderRadius: PxDp(5) }}
                                source={require('!/assets/images/notification_comment.png')}
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
                        onPress={() => authNavigator('BeLikedNotification', { user })}>
                        <View>
                            <Image
                                style={{ width: PxDp(42), height: PxDp(42), borderRadius: PxDp(5) }}
                                source={require('!/assets/images/notification_like.png')}
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
                        onPress={() => authNavigator('FollowNotification', { user })}>
                        <View>
                            <Image
                                style={{ width: PxDp(42), height: PxDp(42), borderRadius: PxDp(5) }}
                                source={require('!/assets/images/notification_following.png')}
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
                        onPress={() => authNavigator('OtherRemindNotification', { user })}>
                        <View>
                            <Image
                                style={{ width: PxDp(42), height: PxDp(42), borderRadius: PxDp(5) }}
                                source={require('!/assets/images/notification_other.png')}
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
    imageSource={require('!/assets/images/default_chat.png')}
/> */

/* <StatusView.EmptyView
    title="加入我们，认识更多小伙伴吧"
    imageSource={require('!/assets/images/default_chat.png')}
/>; */

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: Theme.groundColour,
        flexGrow: 1,
        paddingBottom: PxDp(Theme.BOTTOM_HEIGHT),
    },
    footerView: {
        alignItems: 'center',
        flexDirection: 'row',
        height: PxDp(40),
        justifyContent: 'center',
    },
    footerViewText: {
        color: '#a0a0a0',
        fontSize: font(14),
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
        fontSize: font(15),
        fontWeight: 'bold',
    },
    lastMessage: {
        color: Theme.subTextColor,
        fontSize: font(12),
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
        fontSize: font(12),
    },
});
