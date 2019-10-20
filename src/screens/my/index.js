import React, { Component, useContext, useCallback, useEffect, useMemo } from 'react';
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
import StoreContext, { observer, appStore } from '@src/store';
import { middlewareNavigate, useNavigation } from '@src/router';
import { GQL, useQuery } from '@src/apollo';

import JPushModule from 'jpush-react-native';

export default observer(props => {
    const navigation = useNavigation();
    const store = useContext(StoreContext);
    const user = Helper.syncGetter('userStore.me', store);
    const { data: result, refetch } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id },
    });
    const userData = Helper.syncGetter('user', result) || {};
    const userProfile = Object.assign({}, userData, {
        ...user,
        reward: userData.reward,
        gold: userData.gold,
        count_articles: userData.count_articles,
        count_followings: userData.count_followings,
        count_followers: userData.count_followers,
    });
    const authNavigator = useCallback(
        (route, params) => {
            if (user.token) {
                navigation.navigate(route, params);
            } else {
                navigation.navigate('Login');
            }
        },
        [user],
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
                <View style={{ marginBottom: -PxDp(20) }}>
                    <TouchableWithoutFeedback onPress={() => authNavigator('User', { user })}>
                        <View style={styles.personTopInfo}>
                            <View style={styles.personTopBg}>
                                <Image
                                    style={styles.personTopBgImage}
                                    source={require('@src/assets/images/person_top_bg.jpg')}
                                />
                            </View>
                            <View style={styles.userInfo}>
                                <View>
                                    <Text style={styles.userName} numberOfLines={1}>
                                        {user.token ? userProfile.name : '登录/注册'}
                                    </Text>
                                    <Text style={styles.introduction} numberOfLines={1}>
                                        {user.token ? user.introduction : '欢迎来到' + Config.AppName}
                                    </Text>
                                </View>
                                <Avatar
                                    source={userProfile.avatar || require('@src/assets/images/default_avatar.png')}
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

                {appStore.enableWallet && (
                    <TouchableWithoutFeedback onPress={() => middlewareNavigate('Wallet', { user: userProfile })}>
                        <View style={styles.wallet}>
                            <View style={styles.walletItem}>
                                <Image
                                    source={require('@src/assets/images/icon_wallet_dmb.png')}
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
                                    source={require('@src/assets/images/icon_wallet_rmb.png')}
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
                )}

                <View style={styles.columnItemsWrap}>
                    <TouchableOpacity style={styles.columnItem} onPress={() => middlewareNavigate('喜欢', { user })}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@src/assets/images/ic_mine_like.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>我的喜欢</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => {
                            middlewareNavigate('我的收藏');
                        }}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@src/assets/images/ic_mine_collect.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>我的收藏</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => middlewareNavigate('浏览记录')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@src/assets/images/ic_mine_history.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>浏览记录</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => middlewareNavigate('Feedback')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@src/assets/images/ic_mine_feedback.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>意见反馈</Text>
                        </Row>
                        <Iconfont name="right" size={PxDp(15)} color={Theme.secondaryTextColor} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => middlewareNavigate('Setting')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('@src/assets/images/ic_mine_setting.png')}
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
        resizeMode: 'cover',
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
    },
    container: {
        backgroundColor: Theme.groundColour,
        flex: 1,
        marginBottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(56),
    },
    introduction: {
        color: '#fff',
        fontSize: Font(14),
        marginTop: PxDp(10),
    },
    itemType: {
        justifyContent: 'center',
        marginRight: PxDp(10),
        textAlign: 'center',
        width: PxDp(25),
    },
    itemTypeText: {
        color: Theme.secondaryTextColor,
        fontSize: Font(16),
        marginLeft: PxDp(Theme.itemSpace),
    },
    metaCount: {
        color: '#fff',
        fontSize: Font(15),
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
        fontSize: Font(13),
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
        marginLeft: PxDp(20),
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
        fontSize: Font(20),
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
        fontSize: Font(15),
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
        fontSize: Font(13),
    },
});
