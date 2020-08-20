import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Avatar, ListItem, PopOverlay } from '~/components';
import { userStore, adStore } from '~/store';
import { useRoute, useNavigation } from '~/router';
import { bindWechat } from '~/utils';

//FIXME: 需要检查逻辑
export default () => {
    const navigation = useNavigation();
    let route = useRoute();
    const user = route.params?.user ?? userStore.me;
    console.log('user', user);
    let stateObj = {
        is_bind_wechat: Helper.syncGetter('wallet.bind_platforms.wechat', user) || false,
        is_bind_alipay: Helper.syncGetter('wallet.platforms.alipay', user) || false,
        me: user,
    };

    const [state, setState] = useState(stateObj);

    const alipay = async () => {
        const user = route.params?.user ?? {};
        console.log('wallet', user.wallet);

        if (!user.phone) {
            PopOverlay({
                content: '该账号还未绑定手机号,先去绑定手机号?',
                onConfirm: async () => {
                    navigation.navigate('账号安全');
                },
            });
        } else if (!user.wallet) {
            navigation.navigate('ModifyAliPay');
        } else {
            navigation.navigate('ModifyAliPay', {
                pay_account: user.wallet.pay_account,
                real_name: user.wallet.real_name,
            });
        }
    };

    const modifyPassword = async () => {
        const user = route.params?.user ?? {};

        if (!user.phone) {
            PopOverlay({
                content: '该账号还未绑定手机号,先去绑定手机号?',
                onConfirm: async () => {
                    navigation.navigate('账号安全');
                },
            });
        } else {
            navigation.navigate('ModifyPassword');
        }
    };

    const account = async () => {
        const user = route.params?.user ?? {};
        if (!user.phone) {
            navigation.navigate('账号安全');
        }
    };

    const handlerBindWechat = () => {
        if (state.is_bind_wechat) {
            Toast.show({
                content: '已绑定微信',
            });
        } else {
            bindWechat({
                onSuccess: onSuccess,
            });
        }
    };

    const onSuccess = () => {
        Toast.show({
            content: '绑定成功',
        });

        setState({
            is_bind_wechat: true,
        });
    };

    const { is_bind_wechat, is_bind_alipay } = state;

    return (
        <PageContainer title="账号安全" white loading={!user}>
            <View style={styles.container}>
                <View style={styles.panelLeft}>
                    <Avatar source={user.avatar} size={52} borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }} />
                    <View style={styles.panelContent}>
                        <Text style={{ color: Theme.defaultTextColor, fontSize: 15 }}>{user.name}</Text>
                    </View>
                </View>

                <ListItem
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>{Config.AppName}账号</Text>}
                    rightComponent={
                        <View style={styles.rightWrap}>
                            <Text style={styles.rightText}>{user.id}</Text>
                        </View>
                    }
                />

                <ListItem
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>身份标识</Text>}
                    rightComponent={
                        <View style={styles.rightWrap}>
                            <Text style={styles.rightText}>{user.uuid || '未知身份'}</Text>
                        </View>
                    }
                />

                <ListItem
                    onPress={account}
                    style={styles.listItem}
                    leftComponent={<Text style={styles.itemText}>手机账号</Text>}
                    rightComponent={
                        user.phone ? (
                            <View style={styles.rightWrap}>
                                <Text style={styles.rightText}>{user.title_phone}</Text>
                                <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                            </View>
                        ) : (
                            <View style={styles.rightWrap}>
                                <Text style={styles.linkText}>去设置</Text>
                                <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                            </View>
                        )
                    }
                />

                {/* {adStore.enableWallet && (
                        <ListItem
                            style={styles.listItem}
                            onPress={alipay}
                            leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
                            rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                            rightComponent={
                                is_bind_alipay ? (
                                    <View style={styles.rightWrap}>
                                        <Text style={styles.rightText}>已绑定</Text>
                                        <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                                    </View>
                                ) : (
                                    <View style={styles.rightWrap}>
                                        <Text style={styles.linkText}>未绑定</Text>
                                        <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                                    </View>
                                )
                            }
                        />
                    )}

                    {!Device.IOS && (
                        <ListItem
                            onPress={handlerBindWechat}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                            rightComponent={
                                <View style={styles.rightWrap}>
                                    <Text style={is_bind_wechat ? styles.rightText : styles.linkText}>
                                        {is_bind_wechat ? '已绑定' : '去绑定'}
                                    </Text>
                                    <Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                    )} */}

                <ListItem
                    style={styles.listItem}
                    onPress={modifyPassword}
                    leftComponent={<Text style={styles.itemText}>修改密码</Text>}
                    rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                />
                {/* <ListItem
                        style={styles.listItem}
                        onPress={() => {
                            navigation.navigate('LogoutAccount');
                        }}
                        leftComponent={<Text style={styles.itemText}>注销账号</Text>}
                        rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                    /> */}
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    avatarTip: {
        color: Theme.subTextColor,
        fontSize: font(13),
        marginVertical: pixel(15),
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        marginHorizontal: pixel(Theme.itemSpace),
    },
    field: {
        color: '#666',
        fontSize: font(14),
    },
    fieldGroup: {
        marginBottom: pixel(30),
        paddingHorizontal: Theme.itemSpace,
    },
    genderGroup: {
        alignItems: 'center',
        flexDirection: 'row',
        width: pixel(100),
    },
    genderItem: { height: pixel(20), marginRight: pixel(8), width: pixel(20) },
    inputStyle: {
        color: Theme.defaultTextColor,
        flex: 1,
        fontSize: font(15),
        marginTop: pixel(6),
        paddingVertical: pixel(10),
    },
    inputWrap: {
        alignItems: 'center',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        flexDirection: 'row',
    },
    itemText: {
        color: Theme.defaultTextColor,
        fontSize: font(15),
        marginRight: pixel(15),
    },
    linkText: {
        color: '#407FCF',
        fontSize: font(15),
        marginRight: pixel(6),
    },
    listItem: {
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        height: pixel(50),
    },
    panelContent: {
        height: 34,
        justifyContent: 'space-between',
        marginLeft: 15,
        marginTop: 15,
    },
    panelLeft: {
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#6661',
    },
    rightText: {
        color: Theme.subTextColor,
        fontSize: font(15),
        marginRight: pixel(6),
    },
    rightWrap: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    userLevel: {
        color: Theme.subTextColor,
        fontSize: 12,
        fontWeight: '300',
        paddingTop: 3,
    },
    userPanel: {
        alignItems: 'center',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: pixel(1),
        flexDirection: 'row',
        height: pixel(80),
        justifyContent: 'space-between',
    },
});
