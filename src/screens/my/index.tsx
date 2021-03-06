import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { PageContainer, Iconfont, Row, Avatar } from '~/components';
import { observer, appStore, userStore, adStore } from '~/store';
import { useNavigation } from '~/router';
import { GQL, useQuery } from '~/apollo';
import { useDetainment } from '~/utils';

export default observer((props: any) => {
    const navigation = useNavigation();
    useDetainment(navigation);
    const [taskAD, setTaskAD] = useState(false);
    const user = userStore.me;
    const { login } = userStore;
    const isLogin = user.token && login ? true : false;
    const { data: result, refetch } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const userData = Helper.syncGetter('user', result) || {};

    let ad_duration = 900000;
    console.log('用户广告时间' + ad_duration);

    adStore.setAdInterval(ad_duration);

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
            navWillFocusListener();
            navWillBlurListener();
        };
    });

    return (
        <PageContainer contentViewStyle={{ marginTop: 0 }}>
            <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: adStore.enableWallet ? -pixel(20) : pixel(20) }}>
                    <TouchableWithoutFeedback onPress={() => authNavigator('User', { user })}>
                        <View style={styles.personTopInfo}>
                            {/* <View style={styles.personTopBg}>
                                <Image
                                    style={styles.personTopBgImage}
                                    source={require('!/assets/images/person_top_bg.png')}
                                />
                            </View> */}
                            <View style={styles.userInfo}>
                                <Avatar
                                    source={userProfile.avatar || require('!/assets/images/default_avatar.png')}
                                    style={styles.userAvatar}
                                />
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
                                {isLogin && <Iconfont name="right" size={pixel(15)} color={'#000'} />}
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

                {/* {adStore.enableWallet && (
                    <TouchableWithoutFeedback onPress={() => authNavigator('Wallet', { user: userProfile })}>
                        <View style={styles.wallet}>
                            <View style={styles.walletItem}>
                                <Image
                                    source={require('!/assets/images/icon_wallet_dmb.png')}
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
                                    source={require('!/assets/images/icon_wallet_rmb.png')}
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

                {isLogin && taskAD && adStore.enableWallet && (
                    <View style={{ marginBottom: pixel(10) }}>
                        <TouchableOpacity onPress={() => navigation.navigate('TaskScreen')}>
                            <Image
                                style={{
                                    width: '84%',
                                    height: pixel(75),
                                    resizeMode: 'stretch',
                                    marginHorizontal: '8%',
                                }}
                                source={require('!/assets/images/task_sleep_main.png')}
                            />
                        </TouchableOpacity>

                        <View style={{ flex: 1, alignItems: 'flex-end', position: 'absolute', top: 0, right: 20 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    // 关闭任务入口
                                    setTaskAD(false);
                                }}>
                                <Iconfont name="guanbi1" size={pixel(19)} color={Theme.subTextColor} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <View style={styles.columnItemsWrap}>
                    {adStore.enableWallet && (
                        <TouchableOpacity
                            style={styles.columnItem}
                            onPress={() => {
                                authNavigator('NotificationPage');
                            }}>
                            <Row>
                                <View style={styles.columnIconWrap}>
                                    <Image
                                        style={styles.columnIcon}
                                        source={require('!/assets/images/ic_mine_chat.png')}
                                    />
                                </View>
                                <Text style={styles.itemTypeText}>消息通知</Text>
                            </Row>
                            <Iconfont name="right" size={pixel(15)} color={'#afafaf'} />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => {
                            authNavigator('我的收藏');
                        }}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('!/assets/images/ic_mine_collect.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>我的收藏</Text>
                        </Row>
                        <Iconfont name="right" size={pixel(15)} color={'#afafaf'} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('喜欢', { user })}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image style={styles.columnIcon} source={require('!/assets/images/ic_mine_like.png')} />
                            </View>
                            <Text style={styles.itemTypeText}>我的喜欢</Text>
                        </Row>
                        <Iconfont name="right" size={pixel(15)} color={'#afafaf'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('Feedback')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('!/assets/images/ic_mine_feedback.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>意见反馈</Text>
                        </Row>
                        <Iconfont name="right" size={pixel(15)} color={'#afafaf'} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.columnItem} onPress={() => authNavigator('浏览记录')}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('!/assets/images/ic_mine_history.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>浏览记录</Text>
                        </Row>
                        <Iconfont name="right" size={pixel(15)} color={'#afafaf'} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.columnItem}
                        onPress={() => navigation.navigate('Setting', { user: userProfile })}>
                        <Row>
                            <View style={styles.columnIconWrap}>
                                <Image
                                    style={styles.columnIcon}
                                    source={require('!/assets/images/ic_mine_setting.png')}
                                />
                            </View>
                            <Text style={styles.itemTypeText}>设置</Text>
                        </Row>
                        <Iconfont name="right" size={pixel(15)} color={'#afafaf'} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    columnIcon: {
        height: pixel(24),
        resizeMode: 'contain',
        width: pixel(24),
    },
    columnIconWrap: {
        alignItems: 'center',
        height: pixel(30),
        justifyContent: 'center',
        width: pixel(30),
    },
    columnItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: pixel(62),
        justifyContent: 'space-between',
        paddingHorizontal: pixel(Theme.itemSpace),
    },
    columnItemsWrap: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        overflow: 'hidden',
        marginTop: pixel(25),
    },
    container: {
        backgroundColor: Theme.groundColour,
        flex: 1,
        marginBottom: pixel(Theme.BOTTOM_HEIGHT),
    },
    introduction: {
        color: '#afafaf',
        fontSize: pixel(14),
        marginTop: pixel(10),
        marginRight: pixel(150),
    },
    itemType: {
        justifyContent: 'center',
        marginRight: pixel(10),
        textAlign: 'center',
        width: pixel(25),
    },
    itemTypeText: {
        color: Theme.secondaryTextColor,
        fontSize: pixel(16),
        marginLeft: pixel(Theme.itemSpace),
    },
    metaCount: {
        color: '#000',
        fontSize: pixel(15),
        fontWeight: '300',
        marginBottom: pixel(5),
        marginLeft: pixel(8),
    },

    metaItem: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        marginLeft: pixel(10),
        marginRight: pixel(10),
        paddingVertical: pixel(Theme.itemSpace),
    },
    metaLabel: {
        color: '#afafaf',
        fontSize: pixel(13),
        marginLeft: pixel(10),
    },
    metaWrap: {
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    middleLine: {
        backgroundColor: Theme.borderColor,
        height: pixel(24),
        width: pixel(1),
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
        padding: pixel(Theme.itemSpace),
        paddingTop: pixel(Theme.statusBarHeight + 20),
        backgroundColor: '#fff',
    },
    userAvatar: {
        borderColor: '#fff',
        borderRadius: pixel(33),
        borderWidth: pixel(1),
        height: pixel(66),
        width: pixel(66),
    },
    userInfo: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: pixel(Theme.itemSpace),
    },
    userName: {
        color: '#000',
        fontSize: pixel(18),
        fontWeight: 'bold',
    },
    wallet: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: pixel(6),
        flexDirection: 'row',
        height: pixel(66),
        marginHorizontal: pixel(Theme.itemSpace),
        marginBottom: pixel(Theme.itemSpace),
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
        fontSize: pixel(15),
        fontWeight: 'bold',
    },
    walletItemIcon: {
        borderRadius: pixel(10),
        height: pixel(20),
        marginRight: pixel(10),
        width: pixel(20),
    },
    walletItemLabel: {
        color: Theme.secondaryTextColor,
        fontSize: pixel(13),
    },
});
