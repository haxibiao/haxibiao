import React, { Component, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    ImageBackground,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { PageContainer, Iconfont, Row, Avatar, Badge } from '@src/components';
import StoreContext, { observer, appStore, userStore } from '@src/store';
import { middlewareNavigate, useNavigation } from '@src/router';
import { GQL, useQuery } from '@src/apollo';
import { useDetainment } from '@src/common';

import JPushModule from 'jpush-react-native';

export default observer(props => {
    const navigation = useNavigation();
    useDetainment(navigation);
    const store = useContext(StoreContext);
    const [taskAD, setTaskAD] = useState(false);
    const user = Helper.syncGetter('userStore.me', store);
    const { login } = userStore;
    const isLogin = user.token && login ? true : false;
    const { data: result, refetch } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const userData = Helper.syncGetter('user', result) || {};

    // 记住用户的广告时间间隔
    let dongdezhuanUser = Helper.syncGetter('dongdezhuanUser', userData) || {};
    let { ad_duration = 900000 } = dongdezhuanUser;
    console.log('用户广告时间' + ad_duration);

    appStore.setAdDuration(ad_duration);

    const userProfile = Object.assign({}, user, {
        ...userData,
    });

    console.log('userProfile', userProfile);

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

    useEffect(() => {
        const navWillFocusListener = props.navigation.addListener('willFocus', () => {
            StatusBar.setBarStyle('light-content');
            refetch();
        });
        const navWillBlurListener = props.navigation.addListener('willBlur', () => {
            StatusBar.setBarStyle('dark-content');
        });
        return () => {
            navWillFocusListener.remove();
            navWillBlurListener.remove();
        };
    });

    return (
        <PageContainer contentViewStyle={{ marginTop: 0 }}>
            <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: appStore.enableWallet ? -PxDp(20) : PxDp(20) }}>
                    <TouchableWithoutFeedback onPress={() => authNavigator('User', { user })}>
                        <View style={styles.personTopInfo}>
                            <View style={styles.personTopBg}>
                                <Image
                                    style={styles.personTopBgImage}
                                    source={require('@app/assets/images/person_top_bg.jpg')}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <View>
                                    <Text style={styles.userName} numberOfLines={1}>
                                        {isLogin ? userProfile.name : '登录/注册'}
                                    </Text>
                                    <Text style={styles.introduction} numberOfLines={2}>
                                        {isLogin
                                            ? user.introduction || '这个人很懒，啥都没留下'
                                            : '欢迎来到' + Config.AppName}
                                    </Text>
                                </View>
                                <Avatar
                                    source={userProfile.avatar || require('@app/assets/images/default_avatar.png')}
                                    style={styles.userAvatar}
                                />
                            </View>
                            <View style={styles.metaWrap}>
                                <TouchableOpacity
                                    onPress={() => authNavigator('Works', { user })}
                                    activeOpacity={1}
                                    style={styles.metaItem}>
                                    <Text
                                        style={[
                                            styles.metaCount,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}
                                        numberOfLines={1}>
                                        {Helper.NumberFormat(userProfile.count_articles)}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        发布
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => authNavigator('Society', { user })}
                                    activeOpacity={1}
                                    style={styles.metaItem}>
                                    <Text
                                        style={[
                                            styles.metaCount,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}
                                        numberOfLines={1}>
                                        {Helper.NumberFormat(userProfile.count_followings)}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        关注
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => authNavigator('Society', { user, follower: true })}
                                    activeOpacity={1}
                                    style={styles.metaItem}>
                                    <Text
                                        style={[
                                            styles.metaCount,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}
                                        numberOfLines={1}>
                                        {Helper.NumberFormat(userProfile.count_followers)}
                                    </Text>
                                    <Text style={styles.metaLabel} numberOfLines={1}>
                                        粉丝
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                {/* {appStore.enableWallet && (
                    <TouchableWithoutFeedback onPress={() => authNavigator('Wallet', { user: userProfile })}>
                        <View style={styles.wallet}>
                            <View style={styles.walletItem}>
                                <Image
                                    source={require('@app/assets/images/icon_wallet_dmb.png')}
                                    style={styles.walletItemIcon}
                                />
                                <View>
                                    <Text style={styles.walletItemCount} numberOfLines={1}>
                                        {Helper.NumberFormat(userProfile.gold)}
                                    </Text>
                                    <Text style={styles.walletItemLabel} numberOfLines={1}>
                                        {`当前${Config.goldAlias}(个)`}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.middleLine} />
                            <View style={styles.walletItem}>
                                <Image
                                    source={require('@app/assets/images/icon_wallet_rmb.png')}
                                    style={styles.walletItemIcon}
                                />
                                <View>
                                    <Text style={styles.walletItemCount} numberOfLines={1}>
                                        {Helper.NumberFormat(userProfile.reward)}
                                    </Text>
                                    <Text style={styles.walletItemLabel} numberOfLines={1}>
                                        当前余额(元)
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                )} */}

                {isLogin && taskAD && appStore.enableWallet && (
                    <View style={{ marginBottom: PxDp(10) }}>
                        <TouchableOpacity onPress={() => navigation.navigate('TaskScreen')}>
                            <Image
                                style={{
                                    width: '84%',
                                    height: PxDp(75),
                                    resizeMode: 'stretch',
                                    marginHorizontal: '8%',
                                }}
                                source={require('@app/assets/images/task_sleep_main.png')}
                            />
                        </TouchableOpacity>

                        <View style={{ flex: 1, alignItems: 'flex-end', position: 'absolute', top: 0, right: 20 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 关闭任务入口
                                    setTaskAD(false);
                                }}>
                                <Iconfont name="guanbi1" size={PxDp(19)} color={Theme.subTextColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.columnItemsWrap}>
                    {appStore.enableWallet && (
                        <TouchableOpacity
                            style={styles.columnItem}
                            onPress={() => {
                                authNavigator('NotificationPage');
                            }}>
                            <Row>
                                <View style={styles.columnIconWrap}>
                                    <Image
                                        style={styles.columnIcon}
                                        source={require('@app/assets/images/ic_mine_chat.png')}
                                    />
                                </View>
                                <Text style={styles.itemTypeText}>我的消息</Text>
                            </Row>
                            <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('喜欢', { user })}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/ic_mine_like.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>我的喜欢</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => {
                            authNavigator('我的收藏');
                        }}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/ic_mine_collect.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>我的收藏</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('浏览记录')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/ic_mine_history.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>浏览记录</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('Feedback')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/ic_mine_feedback.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>意见反馈</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => middlewareNavigate('Setting', { user: userProfile })}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@app/assets/images/ic_mine_setting.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>设置</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    columnIcon: {
        height: PxDp(24),
        resizeMode: 'contain',
        width: PxDp(24),
    },
    columnIconWrap: {
        alignItems: 'center',
        height: PxDp(30),
        justifyContent: 'center',
        width: PxDp(30),
    },
    columnItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: PxDp(62),
        justifyContent: 'space-between',
        paddingHorizontal: PxDp(Theme.itemSpace),
    },
    columnItemsWrap: {
        borderRadius: PxDp(6),
        marginHorizontal: PxDp(Theme.itemSpace),
        overflow: 'hidden',
        marginBottom: PxDp(10),
    },
    container: {
        backgroundColor: Theme.groundColour,
        flex: 1,
        marginBottom: PxDp(Theme.BOTTOM_HEIGHT),
    },
    introduction: {
        color: '#fff',
        fontSize: PxDp(14),
        marginTop: PxDp(10),
        marginRight: PxDp(70),
    },
    itemType: {
        justifyContent: 'center',
        marginRight: PxDp(10),
        textAlign: 'center',
        width: PxDp(25),
    },
    itemTypeText: {
        color: Theme.secondaryTextColor,
        fontSize: PxDp(16),
        marginLeft: PxDp(Theme.itemSpace),
    },
    metaCount: {
        color: '#fff',
        fontSize: PxDp(15),
        fontWeight: 'bold',
    },

    metaItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: PxDp(Theme.itemSpace),
    },
    metaLabel: {
        color: '#fff',
        fontSize: PxDp(13),
        marginLeft: PxDp(10),
    },
    metaWrap: {
        alignItems: 'stretch',
        flexDirection: 'row',
        marginBottom: PxDp(20),
    },
    middleLine: {
        backgroundColor: Theme.borderColor,
        height: PxDp(24),
        width: PxDp(1),
    },
    personTopBg: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    personTopBgImage: {
        alignItems: 'center',
        flex: 1,
        height: null,
        justifyContent: 'center',
        width: null,
    },
    personTopInfo: {
        padding: PxDp(Theme.itemSpace),
        paddingTop: PxDp(Theme.statusBarHeight + 20),
        backgroundColor: Theme.primaryColor,
    },
    userAvatar: {
        borderColor: '#fff',
        borderRadius: PxDp(33),
        borderWidth: PxDp(1),
        height: PxDp(66),
        marginLeft: PxDp(-60),

        width: PxDp(66),
    },
    userInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: PxDp(Theme.itemSpace),
    },
    userName: {
        color: '#fff',
        fontSize: PxDp(20),
        fontWeight: 'bold',
    },
    wallet: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxDp(6),
        flexDirection: 'row',
        height: PxDp(66),
        marginHorizontal: PxDp(Theme.itemSpace),
        marginBottom: PxDp(Theme.itemSpace),
    },
    walletItem: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    walletItemCount: {
        color: Theme.secondaryTextColor,
        fontSize: PxDp(15),
        fontWeight: 'bold',
    },
    walletItemIcon: {
        borderRadius: PxDp(10),
        height: PxDp(20),
        marginRight: PxDp(10),
        width: PxDp(20),
    },
    walletItemLabel: {
        color: Theme.secondaryTextColor,
        fontSize: PxDp(13),
    },
});
