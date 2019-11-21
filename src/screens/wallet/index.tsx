/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */

import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { PageContainer, Iconfont, Row, HxfButton, PopOverlay } from '@src/components';
import StoreContext, { observer } from '@src/store';
import { middlewareNavigate, useNavigation, useNavigationParam } from '@src/router';
import { GQL, useMutation, useQuery } from '@src/apollo';

const WithdrawalOptions = [1, 3, 5, 10];
const BANNER_WIDTH = Device.WIDTH - PxDp(Theme.itemSpace * 2);

export default observer(props => {
    const store = useContext(StoreContext);
    let user = useNavigationParam('user') || store.userStore.me;
    const navigation = useNavigation();
    const [amount, setAmount] = useState(0);
    const walletAdapterData = useRef({
        id: null,
        pay_account: '',
        real_name: '',
        reward: 0,
        total_withdraw_amount: 0,
        today_withdraw_left: 0,
        available_balance: 0,
    }).current;
    const { data: walletData } = useQuery(GQL.userWithdrawQuery, {
        fetchPolicy: 'network-only',
    });

    /**
     *  判断user 里的phone 是否存在,如果为null则提示用户去绑定手机号
     */
    console.log('user from wallet : ', user);
    useEffect(() => {
        if (user.phone === null || !user.phone) {
            PopOverlay({
                content: '请先给该账号绑定手机号、否则可能无法正常提现、是否现在前往?',
                onConfirm: async () => {
                    navigation.navigate('账号安全');
                },
            });
        }
    }, []);

    const me = Helper.syncGetter('me', walletData) || {};
    user = Object.assign({}, user, { ...me });
    const myWallet =
        useMemo(() => Helper.syncGetter('me.wallet', walletData), [walletData]) || user.wallet || walletAdapterData;

    const [withdrawRequest, { error, data: withdrawData }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount,
        },
        errorPolicy: 'all',
        refetchQueries: () => [
            {
                query: GQL.userWithdrawQuery,
            },
            {
                query: GQL.userProfileQuery,
                variables: { id: user.id },
            },
        ],
    });

    const setWithdrawAmount = useCallback(
        value => {
            if (user.reward < value) {
                Toast.show({ content: `您的提现余额不足` });
            } else {
                if (myWallet.id) {
                    if (myWallet.today_withdraw_left >= value) {
                        setAmount(value);
                    } else {
                        Toast.show({ content: `今日提现额度已用完哦` });
                    }
                } else {
                    Toast.show({ content: `请先绑定支付宝账号` });
                }
            }
        },
        [user, myWallet],
    );

    useEffect(() => {
        if (error) {
            Toast.show({ content: error.message || '提现失败' });
        } else if (withdrawData) {
            navigation.navigate('WithdrawApply', {
                amount,
                created_at: Helper.syncGetter('data.createWithdraw.created_at', withdrawData),
            });
        }
    }, [withdrawData, error]);

    const title = amount > 0 ? `申请提现${amount}元` : '申请提现';
    return (
        <PageContainer title="提现">
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.statistics}>
                    <ImageBackground source={require('@src/assets/images/wallet_bg.png')} style={styles.bannerImage}>
                        <View style={styles.banner}>
                            <View style={styles.bannerTop}>
                                <View>
                                    <Text style={styles.boldBlackText2}>{Config.goldAlias}</Text>
                                    <Text
                                        style={[
                                            styles.boldBlackText3,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}>
                                        {user.gold || 0}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.withdrawLogBtn}
                                    onPress={() => {
                                        navigation.navigate('WithdrawHistory', {
                                            wallet_id: myWallet.id,
                                        });
                                    }}>
                                    <Text style={styles.withdrawLogBtnText}>提现记录</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bannerBottom}>
                                <Row>
                                    <Text
                                        style={[
                                            styles.boldBlackText1,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}>
                                        余额(元)
                                    </Text>
                                    <Text style={styles.blackText}>{user.reward || 0}</Text>
                                </Row>
                                <Row>
                                    <Text
                                        style={[
                                            styles.boldBlackText1,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}>
                                        总提现(元)
                                    </Text>
                                    <Text style={styles.blackText}>{myWallet.total_withdraw_amount}</Text>
                                </Row>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.withdrawTop}>
                    <Text style={styles.withdrawTitle}>提现金额</Text>
                    {!myWallet.id ? (
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('ModifyAliPay');
                            }}>
                            <Row>
                                <Image
                                    source={require('@src/assets/images/broad_tips.png')}
                                    style={styles.broadTipsImage}
                                />
                                <Text style={styles.bindAiLiPay}>请先绑定支付宝</Text>
                            </Row>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('ModifyAliPay', {
                                    pay_account: myWallet.pay_account,
                                    real_name: myWallet.real_name,
                                })
                            }>
                            <Row>
                                <Image
                                    source={require('@src/assets/images/broad_tips.png')}
                                    style={styles.broadTipsImage}
                                />
                                <Text style={styles.bindAiLiPay}>修改支付宝信息</Text>
                            </Row>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.withdrawOptionsWrap}>
                    <View style={styles.withdrawOptions}>
                        {WithdrawalOptions.map((value, index) => {
                            const selected = value === amount;
                            return (
                                <TouchableOpacity
                                    style={[styles.valueItem, selected && styles.selectedItem]}
                                    key={index}
                                    onPress={() => setWithdrawAmount(value)}>
                                    <Text
                                        style={[
                                            styles.moneyText,
                                            selected && { color: '#fff' },
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}>
                                        {value}元
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View style={styles.rule}>
                    <Text style={[styles.ruleText, { color: '#000', fontWeight: 'bold' }]}>
                        {`今日汇率：${user.exchangeRate || '999'}${Config.goldAlias}/1元`}
                    </Text>
                    <Text style={[styles.ruleText, styles.ruleTitle]}>提现说明：</Text>

                    <Text style={styles.ruleText}>
                        {`1. 您可以通过首页刷视频等方式获取${Config.goldAlias}；只有当您绑定支付宝之后，才能开始提现。`}
                    </Text>

                    <Text style={styles.ruleText}>
                        {`2.每天的转换汇率与平台收益及您的平台活跃度相关，因此汇率会受到影响上下浮动；活跃度越高，汇率越高；您可以通过刷视频、点赞评论互动、邀请好友一起来${Config.AppName}等行为来提高活跃度。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`3. 每天凌晨 00:00-08:00 期间，系统会把您账户中的所有${Config.goldAlias}自动转为余额。`}
                    </Text>
                    <Text style={styles.ruleText}>4. 提现 3~5 天内到账。若遇高峰期，可能延迟到账，请您耐心等待。</Text>
                    <Text style={styles.ruleText}>
                        5.
                        提现金额分为1元、3元、5元、10元四档，每次提现将扣除相应余额，剩余余额可以在下次满足最低提现额度时申请提现。
                    </Text>
                    <Text style={styles.ruleText}>
                        {`6.若您通过非正常手段获取${Config.goldAlias}或余额（包括但不限于刷单、应用多开等操作、一人名下只能绑定一个支付宝，同一人不得使用多个账号提现），${Config.AppName}有权取消您的提现资格，并视情况严重程度，采取封禁等措施。`}
                    </Text>
                </View>
            </ScrollView>
            <View style={styles.fixWithdrawBtn}>
                <HxfButton
                    title={title}
                    gradient={true}
                    style={styles.withdrawBtn}
                    disabled={amount <= 0}
                    onPress={withdrawRequest}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    banner: {
        flex: 1,
        justifyContent: 'space-between',
        padding: PxDp(Theme.itemSpace),
    },
    bannerBottom: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bannerImage: {
        borderRadius: PxDp(10),
        height: BANNER_WIDTH * 0.4,
        overflow: 'hidden',
        resizeMode: 'contain',
        width: BANNER_WIDTH,
    },
    bannerTop: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    bindAiLiPay: {
        color: Theme.link,
        fontSize: Font(14),
        textDecorationLine: 'underline',
    },
    blackText: {
        color: Theme.defaultTextColor,
        fontSize: Font(16),
        marginLeft: Font(6),
    },
    boldBlackText1: {
        color: Theme.defaultTextColor,
        // fontFamily: ' ',
        fontSize: Font(14),
        fontWeight: 'bold',
    },
    boldBlackText2: {
        color: Theme.defaultTextColor,
        fontSize: Font(16),
        fontWeight: 'bold',
    },
    boldBlackText3: {
        color: Theme.defaultTextColor,
        // fontFamily: ' ',
        fontSize: Font(30),
        fontWeight: 'bold',
    },
    broadTipsImage: {
        height: PxDp(16),
        marginRight: PxDp(5),
        width: PxDp(16),
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: PxDp(48) + PxDp(Theme.itemSpace * 2) + Theme.HOME_INDICATOR_HEIGHT,
    },
    fixWithdrawBtn: {
        bottom: PxDp(Theme.itemSpace * 2) + Theme.HOME_INDICATOR_HEIGHT,
        left: PxDp(Theme.itemSpace * 2),
        position: 'absolute',
        right: PxDp(Theme.itemSpace * 2),
    },
    moneyText: {
        color: Theme.subTextColor,
        fontSize: Font(16),
        fontWeight: 'bold',
    },
    rule: {
        backgroundColor: '#fff',
        borderRadius: PxDp(15),
        margin: PxDp(Theme.itemSpace),
    },
    ruleText: {
        color: Theme.subTextColor,
        fontSize: Font(14),
        lineHeight: PxDp(18),
        paddingVertical: PxDp(5),
    },
    ruleTitle: {
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
    },
    selectedItem: {
        backgroundColor: Theme.secondaryColor,
    },
    statistics: {
        margin: PxDp(Theme.itemSpace),
    },
    valueItem: {
        alignItems: 'center',
        backgroundColor: Theme.groundColour,
        borderRadius: PxDp(4),
        height: PxDp(50),
        justifyContent: 'center',
        marginRight: PxDp(Theme.itemSpace),
        marginTop: PxDp(Theme.itemSpace),
        width: (Device.WIDTH - PxDp(Theme.itemSpace * 3)) / 2,
    },
    whiteText: {
        color: '#fff',
        fontSize: Font(16),
    },
    withdrawBtn: {
        alignItems: 'center',
        borderRadius: PxDp(22),
        height: PxDp(44),
        justifyContent: 'center',
    },
    withdrawLogBtn: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: PxDp(14),
        height: PxDp(28),
        justifyContent: 'center',
        paddingHorizontal: PxDp(14),
    },
    withdrawLogBtnText: {
        color: '#fff',
        fontSize: Font(14),
        fontWeight: 'bold',
    },
    withdrawOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    withdrawOptionsWrap: {
        marginBottom: PxDp(Theme.itemSpace),
        marginLeft: PxDp(Theme.itemSpace),
    },
    withdrawText: {
        color: Theme.primaryColor,
        fontSize: Font(17),
    },
    withdrawTitle: {
        color: Theme.defaultTextColor,
        fontSize: Font(16),
        fontWeight: 'bold',
    },
    withdrawTop: {
        margin: PxDp(Theme.itemSpace),
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
