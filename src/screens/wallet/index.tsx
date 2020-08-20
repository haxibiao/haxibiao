/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:45:13
 */

import React, { useCallback, useState, useMemo, useEffect, Fragment } from 'react';
import { StyleSheet, Platform, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { PageContainer, Iconfont, Row, HxfButton, PopOverlay, TouchFeedback } from '~/components';
import { observer, userStore } from '~/store';
import { useNavigation } from '~/router';
import { GQL, useMutation, useQuery } from '~/apollo';
import { bindWechat, syncGetter } from '~/utils';

import DownloadApkIntro from './components/DownloadApkIntro';

const withdrawAmountList = [
    {
        tips: '秒到账',
        amount: 1,
        description: '新人福利',
        fontColor: '#FFA200',
        bgColor: Theme.themeRed,
        highWithdrawCardsRate: null,
    },
    {
        tips: '限量抢',
        amount: 3,
        description: `108日${Config.limitAlias}`,
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
        highWithdrawCardsRate: 0,
    },
    {
        tips: '限量抢',
        amount: 5,
        description: `180日${Config.limitAlias}`,
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
        highWithdrawCardsRate: 0,
    },
    {
        tips: '限量抢',
        amount: 10,
        description: `360日${Config.limitAlias}`,
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
        highWithdrawCardsRate: 0,
    },
];

const withdrawAmountBadgeList = [
    {
        tips: '提现令牌',
        amount: 3,
        description: `108日${Config.limitAlias}`,
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
        threeYuanWithdrawBadgesCount: 0,
    },
    {
        tips: '提现令牌',
        amount: 5,
        description: `180日${Config.limitAlias}`,
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
        fiveYuanWithdrawBadgesCount: 0,
    },
    {
        tips: '提现令牌',
        amount: 10,
        description: `360日${Config.limitAlias}`,
        fontColor: Theme.subTextColor,
        bgColor: Theme.primaryColor,
        tenYuanWithdrawBadgesCount: 0,
    },
];

const WithdrawalPlatforms = [
    {
        type: 'ALIPAY',
        name: '支付宝',
        icon: require('!/assets/images/alipay.png'),
    },
    {
        type: 'WECHAT',
        name: '微信',
        icon: require('!/assets/images/wechat.png'),
    },
    {
        type: 'DONGDEZHUAN',
        name: '懂得赚',
        icon: require('!/assets/images/dongdezhuan.png'),
    },
];

const walletAdapterData = {
    id: null,
    pay_account: '',
    real_name: '',
    reward: 0,
    total_withdraw_amount: 0,
    today_withdraw_left: 0,
    available_balance: 0,
};

const BANNER_WIDTH = Device.WIDTH - pixel(Theme.itemSpace * 2);

export default observer(() => {
    const navigation = useNavigation();
    const me = userStore.me;
    // 提现请求状态
    const [, setIsWithdrawRequest] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [withdrawType, setWithdrawType] = useState('ALIPAY');
    const [useWithdrawBadges, setWithdrawBadges] = useState(false);
    const [withdrawList, setWithdrawList] = useState(withdrawAmountList);
    const [amount, setAmount] = useState(0);

    const { data: userProfileData } = useQuery(GQL.userProfileQuery, {
        variables: { id: me.id },
        fetchPolicy: 'network-only',
    });

    const getWithdrawAmountListQuery = useQuery(GQL.getWithdrawAmountList);

    const user = useMemo(() => Object.assign({}, me, syncGetter('user', userProfileData) || {}), [me, userProfileData]);

    const withdrawBadges = useMemo(
        () => [user.threeYuanWithdrawBadgesCount, user.fiveYuanWithdrawBadgesCount, user.tenYuanWithdrawBadgesCount],
        [user],
    );

    const myWallet = useMemo(() => syncGetter('wallet', user) || walletAdapterData, [user]);

    useEffect(() => {
        if (loading && userProfileData) {
            setLoading(false);
        }
    }, [loading, userProfileData]);

    useEffect(() => {
        if (getWithdrawAmountListQuery.data && getWithdrawAmountListQuery.data.getWithdrawAmountList) {
            setWithdrawList(syncGetter('data.getWithdrawAmountList', getWithdrawAmountListQuery));
        }
    }, [getWithdrawAmountListQuery.loading, getWithdrawAmountListQuery.refetch]);

    const [withdrawRequest, { error, data: withdrawData }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount,
            useWithdrawBadges,
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
        (value, useBadge) => {
            if (user.reward < value) {
                Toast.show({ content: `您的提现余额不足` });
            } else {
                if (myWallet.id) {
                    if (myWallet.today_withdraw_left >= value) {
                        if (useBadge) {
                            setWithdrawBadges(true);
                        } else {
                            setWithdrawBadges(false);
                        }
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

            setTimeout(function () {
                setSubmitting(false);

                navigation.navigate('WithdrawApply', {
                    amount,
                    created_at: syncGetter('data.createWithdraw.created_at', withdrawData),
                });
            }, 3500);
        }
    }, [withdrawData, error]);

    const checkWithdrawAmount = useCallback(() => {
        console.warn('====================================');
        console.warn('withdrawType', withdrawType);
        console.warn('====================================');
        if (user.force_alert && (withdrawType === 'ALIPAY' || withdrawType === 'WECHAT')) {
            setSubmitting(false);
            DownloadApkIntro.show();
        } else {
            withdrawRequest();
        }
    }, [user, withdrawType, withdrawRequest]);

    const onWithdrawRequest = useCallback(() => {
        // 设置点击状态
        setSubmitting(true);
        // 跳转申请提现接口
        checkWithdrawAmount();
    }, [checkWithdrawAmount]);

    const navigationAction = () => {
        navigation.navigate('AccountSecurity', { user });
    };

    const renderBindTips = () => {
        if (withdrawType === 'ALIPAY' && syncGetter('wallet.platforms.alipay', user)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: font(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if ((withdrawType === 'WECHAT' && syncGetter('wallet.bind_platforms.wechat', user)) || Device.IOS) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: font(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if (withdrawType === 'DONGDEZHUAN' && syncGetter('is_bind_dongdezhuan', user)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: font(14),
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
                onFailed: () => {
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
                    <Image source={require('!/assets/images/broad_tips.png')} style={styles.broadTipsImage} />
                    <Text style={styles.bindPlatform}>{`去绑定${platformName}`}</Text>
                </Row>
            </TouchableOpacity>
        );
    };

    //提现令牌说明

    const TokenDescription = async () => {
        PopOverlay({
            title: '高额提现令牌',
            content: '高额提现令牌可以在懂得赚商城中通过钻石购买，一个令牌只能够使用一次',
            leftContent: '恍然大悟',
            rightContent: '原来是这样',
        });
    };

    return (
        <PageContainer title="提现" loading={loading} submitting={submitting} submitTips={'请求中…'}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.statistics}>
                    <ImageBackground source={require('!/assets/images/wallet_bg.png')} style={styles.bannerImage}>
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
                                                marginLeft: pixel(2),
                                            },
                                        ]}>
                                        {`日${Config.limitAlias}`}
                                    </Text>
                                    <Text style={styles.blackText1}>{user.today_contribute || 0}</Text>
                                </Row>
                                <Row>
                                    <Text
                                        style={[
                                            styles.boldBlackText2,
                                            Device.Android && {
                                                fontFamily: ' ',
                                                marginLeft: pixel(2),
                                            },
                                        ]}>
                                        {`总${Config.limitAlias}`}
                                    </Text>
                                    <Text style={styles.blackText1}>{user.contribute || 0}</Text>
                                </Row>
                            </View>
                        </View>
                    </ImageBackground>
                </View>

                <View style={styles.withdrawTop}>
                    <Text style={styles.withdrawTitle}>提现到</Text>
                    {renderBindTips()}
                </View>
                <View style={{ paddingHorizontal: pixel(Theme.itemSpace) }}>
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
                        {withdrawList.map((data, index) => {
                            const selected = data.amount === amount && !useWithdrawBadges;
                            return (
                                <TouchableOpacity
                                    style={[styles.valueItem, selected && styles.selectedItem]}
                                    key={index}
                                    onPress={() => setWithdrawAmount(data.amount)}>
                                    <Text style={[styles.moneyText, selected && { color: '#202020' }]}>
                                        {data.amount}元
                                    </Text>
                                    <Text style={{ marginTop: 5, fontSize: 10 }}>{data.description}</Text>
                                    <View style={styles.valueItemLabel}>
                                        <Text style={styles.valueItemLabelText}>
                                            {data.tips}
                                            {data.highWithdrawCardsRate > 0 ? `倍率×${data.highWithdrawCardsRate}` : ''}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View
                    style={{
                        margin: pixel(Theme.itemSpace),
                        marginBottom: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Text style={styles.withdrawTitle}>高额提现令牌</Text>
                    <TouchableOpacity onPress={TokenDescription}>
                        <Image
                            source={require('!/assets/images/tokenDescription.png')}
                            style={{ width: pixel(18), height: pixel(18), marginLeft: pixel(5) }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.withdrawOptionsWrap}>
                    <View style={styles.withdrawOptions}>
                        {withdrawAmountBadgeList.map((data, index) => {
                            const selected = data.amount === amount && useWithdrawBadges;
                            return (
                                <TouchableOpacity
                                    style={[styles.valueItem, selected && styles.selectedBadgeItem]}
                                    key={index}
                                    onPress={() => setWithdrawAmount(data.amount, 'withdrawBadge')}>
                                    <Image
                                        style={styles.withdrawBadgeImage}
                                        source={require('!/assets/images/withdrawBadge.png')}
                                    />
                                    <Text
                                        style={{
                                            marginTop: pixel(6),
                                            fontSize: pixel(14),
                                            color: Theme.defaultTextColor,
                                        }}>
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                            }}>
                                            {data.amount}
                                        </Text>
                                        {`元提现令牌 × `}
                                        <Text
                                            style={{
                                                fontWeight: 'bold',
                                            }}>
                                            {withdrawBadges[index] || 0}
                                        </Text>
                                    </Text>
                                    <View style={styles.selectedBadgeItemLabel}>
                                        <Iconfont
                                            name={selected ? 'radiobuttonchecked' : 'radiobuttonunchecked'}
                                            color={selected ? Theme.watermelon : Theme.borderColor}
                                            size={pixel(20)}
                                        />
                                    </View>
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
                        {`1、您可以通过首页刷视频等方式获取${Config.goldAlias}；只有当您绑定懂得赚（官方专属钱包，提现秒到账不限时不限量）或支付宝或微信之后，才能开始提现。`}
                    </Text>

                    <Text style={styles.ruleText}>
                        2、懂得赚是哈希表、答题赚钱、答妹等时下热门赚钱APP的官方专属钱包，多款赚钱APP收益一键提现，不限时不限量秒提现，汇聚百款赚钱软件评测攻略，是千万网赚用户必备的赚钱提现法宝。
                    </Text>

                    <Text style={styles.ruleText}>
                        {`3、${Config.limitAlias}获取方式：点击视频广告有机率获得${Config.limitAlias}、每天前十次观看并点击激励视频有机率获得${Config.limitAlias}，点赞，评论，发布优质内容等方式都有机率获得${Config.limitAlias}。提现所需${Config.limitAlias}为：提现金额*60`}
                    </Text>

                    <Text style={styles.ruleText}>
                        {`4、每天的转换汇率与平台收益及您的平台活跃度相关，因此汇率会受到影响上下浮动；活跃度越高，汇率越高；您可以通过刷视频、点赞评论互动、邀请好友一起来${Config.AppName}等行为来提高活跃度。`}
                    </Text>
                    <Text style={styles.ruleText}>
                        {`5、每天凌晨 00:00-08:00 期间，系统会把您账户中的所有${Config.goldAlias}自动转为余额。`}
                    </Text>
                    <Text style={styles.ruleText}>6、提现 3~5 天内到账。若遇高峰期，可能延迟到账，请您耐心等待。</Text>
                    <Text style={styles.ruleText}>
                        7、提现金额分为1元、3元、5元、10元四档，每次提现将扣除相应余额，剩余余额可以在下次满足最低提现额度时申请提现。
                    </Text>
                    <Text style={styles.ruleText}>
                        {`8、若您通过非正常手段获取${Config.goldAlias}或余额（包括但不限于刷单、应用多开等操作、一人名下只能绑定一个支付宝，同一人不得使用多个账号提现），${Config.AppName}有权取消您的提现资格，并视情况严重程度，采取封禁等措施。`}
                    </Text>
                </View>
            </ScrollView>
            <View style={styles.fixWithdrawBtn}>
                <HxfButton
                    title={amount > 0 ? `申请提现${amount}元` : '申请提现'}
                    gradient={true}
                    style={styles.withdrawBtn}
                    disabled={amount <= 0}
                    onPress={onWithdrawRequest}
                />
            </View>
        </PageContainer>
    );
});

const valueItemWidth = (Device.WIDTH - pixel(Theme.itemSpace * 3)) / 2;

const styles = StyleSheet.create({
    banner: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: pixel(Theme.itemSpace),
    },
    bannerRight: {
        justifyContent: 'space-between',
    },
    bannerImage: {
        borderRadius: pixel(10),
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
        fontSize: font(14),
        textDecorationLine: 'underline',
    },

    blackText1: {
        color: '#000',
        alignItems: 'center',
        marginLeft: pixel(5),
        fontSize: font(20),
    },

    boldBlackText1: {
        color: Theme.defaultTextColor,
        alignItems: 'center',
        fontSize: font(14),
        fontWeight: 'bold',
    },

    boldBlackText2: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        fontWeight: 'bold',
    },
    boldBlackText3: {
        color: Theme.defaultTextColor,
        fontSize: font(30),
        fontWeight: 'bold',
    },
    broadTipsImage: {
        height: pixel(16),
        marginRight: pixel(5),
        width: pixel(16),
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: pixel(48) + pixel(Theme.itemSpace * 2) + Theme.HOME_INDICATOR_HEIGHT,
    },
    fixWithdrawBtn: {
        bottom: pixel(Theme.itemSpace * 2) + Theme.HOME_INDICATOR_HEIGHT,
        left: pixel(Theme.itemSpace * 2),
        position: 'absolute',
        right: pixel(Theme.itemSpace * 2),
    },
    moneyText: {
        color: Theme.subTextColor,
        fontSize: font(16),
        fontWeight: 'bold',
        ...Platform.select({
            ios: {},
            android: {
                fontFamily: ' ',
            },
        }),
    },
    rule: {
        backgroundColor: '#fff',
        borderRadius: pixel(15),
        margin: pixel(Theme.itemSpace),
    },
    ruleText: {
        color: Theme.subTextColor,
        fontSize: font(14),
        lineHeight: pixel(18),
        paddingVertical: pixel(5),
    },
    ruleTitle: {
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
    },
    selectedItem: {
        borderColor: Theme.secondaryColor,
    },
    selectedBadgeItem: {
        borderColor: Theme.watermelon,
    },
    statistics: {
        margin: pixel(Theme.itemSpace),
    },
    valueItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: pixel(1),
        borderRadius: pixel(5),
        borderColor: Theme.borderColor,
        paddingTop: pixel(14),
        paddingBottom: pixel(10),
        justifyContent: 'center',
        marginRight: pixel(Theme.itemSpace),
        marginTop: pixel(Theme.itemSpace),
        width: valueItemWidth,
    },
    withdrawBadgeImage: {
        height: (valueItemWidth * 0.55 * 275) / 300,
        resizeMode: 'contain',
        width: valueItemWidth * 0.55,
    },
    valueItemLabel: {
        position: 'absolute',
        right: -pixel(1),
        top: -pixel(1),
        borderTopRightRadius: pixel(5),
        borderBottomLeftRadius: pixel(5),
        backgroundColor: Theme.secondaryColor,
        paddingHorizontal: pixel(5),
    },
    selectedBadgeItemLabel: {
        position: 'absolute',
        left: pixel(5),
        top: pixel(4),
    },
    valueItemLabelText: {
        color: '#fff',
        fontSize: pixel(10),
        lineHeight: pixel(18),
    },
    whiteText: {
        color: '#fff',
        fontSize: font(16),
    },
    withdrawBtn: {
        alignItems: 'center',
        borderRadius: pixel(22),
        height: pixel(44),
        justifyContent: 'center',
    },
    withdrawLogBtn: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: pixel(14),
        height: pixel(28),
        justifyContent: 'center',
        paddingHorizontal: pixel(14),
    },
    withdrawLogBtnText: {
        color: '#fff',
        fontSize: font(14),
        fontWeight: 'bold',
    },
    withdrawType: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: pixel(10),
        width: (Device.WIDTH - 40) / 2,
        height: pixel(50),
        justifyContent: 'center',
        borderColor: Theme.borderColor,
        borderWidth: pixel(0.5),
        borderRadius: pixel(5),
    },
    withdrawTypeText: {
        width: pixel(24),
        height: pixel(24),
        marginRight: pixel(5),
    },
    withdrawOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    withdrawOptionsWrap: {
        marginBottom: pixel(Theme.itemSpace),
        marginLeft: pixel(Theme.itemSpace),
    },
    withdrawText: {
        color: Theme.primaryColor,
        fontSize: font(17),
    },
    withdrawTitle: {
        color: Theme.defaultTextColor,
        fontSize: font(16),
        fontWeight: 'bold',
    },
    withdrawTop: {
        margin: pixel(Theme.itemSpace),
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
