/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */

import React, { Component, useCallback, useContext, useState, useRef, useMemo, useEffect, Fragment } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { PageContainer, Iconfont, Row, HxfButton, PopOverlay, TouchFeedback } from '@src/components';
import StoreContext, { observer } from '@src/store';
import { middlewareNavigate, useNavigation, useNavigationParam } from '@src/router';
import { GQL, useMutation, useQuery } from '@src/apollo';
import { appStore } from '@src/store';
import { bindWechat } from '@src/common';

const WithdrawalOptions = [1, 3, 5, 10];
const WithdrawalPlatforms = [
    {
        type: 'ALIPAY',
        name: '支付宝',
        icon: require('@app/assets/images/alipay.png'),
    },
    {
        type: 'WECHAT',
        name: '微信',
        icon: require('@app/assets/images/wechat.png'),
    },
    {
        type: 'DONGDEZHUAN',
        name: '懂得赚',
        icon: require('@app/assets/images/dongdezhuan.png'),
    },
];
const BANNER_WIDTH = Device.WIDTH - PxDp(Theme.itemSpace * 2);

export default observer((props: any) => {
    const store = useContext(StoreContext);
    // 提现请求状态
    const [isWithdrawRequest, setIsWithdrawRequest] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [withdrawType, setWithdrawType] = useState('ALIPAY');

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
    // const { data: walletData } = useQuery(GQL.userWithdrawQuery, {
    //     fetchPolicy: 'network-only',
    // });

    const { data: walletData } = useQuery(GQL.userProfileQuery, {
        variables: { id: user.id },
        fetchPolicy: 'network-only',
    });
    const userData = Helper.syncGetter('user', walletData) || {};

    /**
     *  判断user 里的phone 是否存在,如果为null则提示用户去绑定手机号
     */
    // console.log('user from wallet : ', userData);
    // useEffect(() => {
    //     if (user.phone === null || !user.phone) {
    //         PopOverlay({
    //             content: '请先给该账号绑定手机号、否则可能无法正常提现、是否现在前往?',
    //             onConfirm: async () => {
    //                 navigation.navigate('账号安全');
    //             },
    //         });
    //     }
    // }, []);

    // const me = Helper.syncGetter('me', walletData) || {};
    user = Object.assign({}, user, { ...userData });
    const myWallet =
        useMemo(() => Helper.syncGetter('me.wallet', walletData), [walletData]) || user.wallet || walletAdapterData;

    console.log('withdrawType', withdrawType);

    const [withdrawRequest, { error, data: withdrawData }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount,
            platform: withdrawType,
        },
        errorPolicy: 'all',
        refetchQueries: () => [
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
                    Toast.show({ content: `请先绑定提现信息` });
                }
            }
        },
        [user, myWallet],
    );

    useEffect(() => {
        if (error) {
            // 设置点击过程为 false
            setIsWithdrawRequest(false);
            setSubmitting(false);

            Toast.show({ content: error.message.replace('GraphQL error: ', '') || '提现失败' });
        } else if (withdrawData) {
            // 设置点击过程为 false
            setIsWithdrawRequest(false);

            setTimeout(function() {
                setSubmitting(false);

                navigation.navigate('WithdrawApply', {
                    amount,
                    created_at: Helper.syncGetter('data.createWithdraw.created_at', withdrawData),
                });
            }, 3500);
        }
    }, [withdrawData, error]);

    const title = amount > 0 ? `申请提现${amount}元` : '申请提现';

    const onWithdrawRequest = () => {
        if (!isWithdrawRequest) {
            // 请求判断贡献接口
            setSubmitting(true);

            appStore.client
                .query({
                    query: GQL.canWithdrawalsQuery,
                    variables: {
                        amount,
                    },
                })
                .then((data: any) => {
                    // console.log('Data', data);
                    if (data.data.canWithdrawals <= 0) {
                        // 判断贡献足够，跳转申请提现接口
                        withdrawRequest();
                    } else {
                        setIsWithdrawRequest(false);
                        setSubmitting(false);

                        // 贡献不足，提示用户
                        PopOverlay({
                            content: '提现失败！贡献值不足，去完成任务即可获得贡献值哦！',
                            onConfirm: async () => {
                                navigation.goBack();
                                navigation.navigate('TaskScreen');
                            },
                        });
                    }
                })
                .catch((err: any) => {
                    // console.log('err', err);

                    setIsWithdrawRequest(false);
                    setSubmitting(false);

                    Toast.show({ content: '服务器繁忙！提现失败，请稍后重试！' });
                });
        } else {
            console.log('点击中…………………………');
        }

        // 如果已经发送请求就忽略重复点击
        setIsWithdrawRequest(true);
    };

    const navigationAction = () => {
        navigation.navigate('AccountSecurity', { user });
    };

    const renderBindTips = () => {
        console.log('renderBindTips  user :', user);

        if (withdrawType === 'ALIPAY' && Helper.syncGetter('wallet.platforms.alipay', user)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: Font(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if ((withdrawType === 'WECHAT' && Helper.syncGetter('wallet.bind_platforms.wechat', user)) || Device.IOS) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: Font(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if (withdrawType === 'DONGDEZHUAN' && Helper.syncGetter('is_bind_dongdezhuan', user)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: Font(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }

        let platformName = '支付宝';
        let bindPlatform = () => {
            setSubmitting(true);
            bindWechat({
                onSuccess: () => {
                    setSubmitting(false);
                    Toast.show({
                        content: '绑定成功',
                    });
                },
                onFailed: (error: { message: any }[]) => {
                    setSubmitting(false);
                },
            });
        };

        switch (withdrawType) {
            case 'WECHAT':
                platformName = '微信';
                break;
            case 'ALIPAY':
                bindPlatform = () => {
                    navigation.navigate('ModifyAliPay');
                };
                platformName = '支付宝';
                break;
            case 'DONGDEZHUAN':
                platformName = '懂得赚';
                bindPlatform = () => {
                    navigation.navigate('BindDongdezhuan');
                };
                break;
            default:
                break;
        }

        return (
            <TouchableOpacity onPress={bindPlatform}>
                <Row>
                    <Image source={require('@app/assets/images/broad_tips.png')} style={styles.broadTipsImage} />
                    <Text style={styles.bindPlatform}>{`去绑定${platformName}`}</Text>
                </Row>
            </TouchableOpacity>
        );
    };

    if (loading && walletData) {
        setLoading(!loading);
    }

    return (
        <PageContainer title="提现" loading={loading} submitting={submitting} submitTips={'请求中…'}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.statistics}>
                    <ImageBackground source={require('@app/assets/images/wallet_bg.png')} style={styles.bannerImage}>
                        <View style={styles.banner}>
                            <View style={styles.bannerLeft}>
                                <Row>
                                    <Text
                                        style={[
                                            styles.boldBlackText2,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}>
                                        余额(元)
                                    </Text>
                                    <Text style={styles.blackText1}>{user.reward || 0}</Text>
                                </Row>

                                <Row>
                                    <Text
                                        style={[
                                            styles.boldBlackText2,
                                            Device.Android && {
                                                fontFamily: ' ',
                                            },
                                        ]}>
                                        总提现 (元)
                                    </Text>
                                    <Text style={styles.blackText1}>{myWallet.total_withdraw_amount}</Text>
                                </Row>
                            </View>
                            <View style={styles.bannerRight}>
                                <TouchableOpacity
                                    style={styles.withdrawLogBtn}
                                    onPress={() => {
                                        navigation.navigate('WithdrawHistory', {
                                            wallet_id: myWallet.id,
                                        });
                                    }}>
                                    <Text style={styles.withdrawLogBtnText}>提现记录</Text>
                                </TouchableOpacity>
                                <Row>
                                    <Text
                                        style={[
                                            styles.boldBlackText2,
                                            Device.Android && {
                                                fontFamily: ' ',
                                                marginLeft: PxDp(2),
                                            },
                                        ]}>
                                        贡献值
                                    </Text>
                                    <Text style={styles.blackText1}>{userData.contribute || 0}</Text>
                                </Row>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.withdrawTop}>
                    <Text style={styles.withdrawTitle}>提现到</Text>
                    {renderBindTips()}
                </View>
                <View style={{ paddingHorizontal: PxDp(Theme.itemSpace) }}>
                    <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        {WithdrawalPlatforms.map((data, index) => {
                            if (Device.IOS && data.type === 'WECHAT') return null;
                            return (
                                <Fragment key={index}>
                                    <TouchFeedback
                                        style={[
                                            styles.withdrawType,
                                            withdrawType === data.type && { borderColor: Theme.primaryColor },
                                        ]}
                                        onPress={() => {
                                            setWithdrawType(data.type);
                                        }}>
                                        <Image source={data.icon} style={styles.withdrawTypeText} />
                                        <Text>{data.name}</Text>
                                    </TouchFeedback>
                                </Fragment>
                            );
                        })}
                    </Row>
                </View>

                <View style={styles.withdrawTop}>
                    <Text style={styles.withdrawTitle}>提现金额</Text>
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
                                    <Text style={[{ marginTop: 5, fontSize: 10 }, selected && { color: '#fff' }]}>
                                        {value * 60} 贡献值
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={styles.rule}>
                    <View>
                        <Text
                            style={[
                                styles.ruleText,
                                { color: '#000', fontWeight: 'bold' },
                            ]}>{`欢迎加入QQ反馈群：${Config.qqGroup}`}</Text>
                    </View>
                    {/* <Text style={[styles.ruleText, { color: '#000', fontWeight: 'bold' }]}>
                        {`今日汇率：${user.exchangeRate || '600'}${Config.goldAlias}/1元`}
                    </Text> */}

                    <Text style={[styles.ruleText, styles.ruleTitle]}>提现说明：</Text>

                    <Text style={styles.ruleText}>
                        {`1. 您可以通过首页刷视频等方式获取${Config.goldAlias}；只有当您绑定支付宝之后，才能开始提现。`}
                    </Text>

                    <Text style={styles.ruleText}>
                        2、贡献点获取方式：点击视频广告有机率获得贡献、每天前十次观看并点击激励视频有机率获得贡献值，点赞，评论，发布优质内容等方式都有机率获得贡献值。提现所需贡献值为：提现金额*60
                    </Text>

                    <Text style={styles.ruleText}>
                        {`3.每天的转换汇率与平台收益及您的平台活跃度相关，因此汇率会受到影响上下浮动；活跃度越高，汇率越高；您可以通过刷视频、点赞评论互动、邀请好友一起来${Config.AppName}等行为来提高活跃度。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`4. 每天凌晨 00:00-08:00 期间，系统会把您账户中的所有${Config.goldAlias}自动转为余额。`}
                    </Text>
                    <Text style={styles.ruleText}>5. 提现 3~5 天内到账。若遇高峰期，可能延迟到账，请您耐心等待。</Text>
                    <Text style={styles.ruleText}>
                        6.提现金额分为1元、3元、5元、10元四档，每次提现将扣除相应余额，剩余余额可以在下次满足最低提现额度时申请提现。
                    </Text>
                    <Text style={styles.ruleText}>
                        {`7.若您通过非正常手段获取${Config.goldAlias}或余额（包括但不限于刷单、应用多开等操作、一人名下只能绑定一个支付宝，同一人不得使用多个账号提现），${Config.AppName}有权取消您的提现资格，并视情况严重程度，采取封禁等措施。`}
                    </Text>
                </View>
            </ScrollView>
            <View style={styles.fixWithdrawBtn}>
                <HxfButton
                    title={title}
                    gradient={true}
                    style={styles.withdrawBtn}
                    disabled={amount <= 0}
                    onPress={onWithdrawRequest}
                />
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    banner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: PxDp(Theme.itemSpace),
    },
    bannerRight: {
        justifyContent: 'space-between',
    },
    bannerImage: {
        borderRadius: PxDp(10),
        height: BANNER_WIDTH * 0.4,
        overflow: 'hidden',
        resizeMode: 'contain',
        width: BANNER_WIDTH,
    },
    bannerLeft: {
        justifyContent: 'space-between',
    },

    bannerLeftItem: {
        flexDirection: 'row',
    },

    bindPlatform: {
        color: Theme.link,
        fontSize: Font(14),
        textDecorationLine: 'underline',
    },

    blackText1: {
        color: '#000',
        alignItems: 'center',
        marginLeft: PxDp(5),
        fontSize: Font(20),
    },

    boldBlackText1: {
        color: Theme.defaultTextColor,
        alignItems: 'center',
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
    withdrawType: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PxDp(10),
        width: (Device.WIDTH - 40) / 2,
        height: PxDp(50),
        justifyContent: 'center',
        borderColor: Theme.borderColor,
        borderWidth: PxDp(0.5),
        borderRadius: PxDp(5),
    },
    withdrawTypeText: {
        width: PxDp(24),
        height: PxDp(24),
        marginRight: PxDp(5),
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
