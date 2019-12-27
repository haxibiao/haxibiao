import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { PageContainer, TouchFeedback, Iconfont, Avatar, ListItem, PopOverlay } from '@src/components';
import { userStore, appStore } from '@src/store';
import { observer } from 'mobx-react';

import { bindWechat } from '@src/common';

@observer
class AccountSecurity extends Component {
    constructor(props) {
        super(props);
        const user = props.navigation.getParam('user');
        this.state = {
            is_bind_wechat: Helper.syncGetter('wallet.bind_platforms.wechat', user) || false,
            is_bind_alipay: Helper.syncGetter('wallet.platforms.alipay', user) || false,
            is_bind_dongdezhuan: Helper.syncGetter('is_bind_dongdezhuan', user) || false,
            me: user,
        };
    }

    alipay = async () => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');
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

    modifyPassword = async () => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');

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

    account = async () => {
        const { navigation } = this.props;
        const user = navigation.getParam('user');
        if (!user.phone) {
            navigation.navigate('账号安全');
        }
    };

    handlerBindWechat = () => {
        if (this.state.is_bind_wechat) {
            Toast.show({
                content: '已绑定微信',
            });
        } else {
            bindWechat({
                onSuccess: this.onSuccess,
            });
        }
    };

    onSuccess = () => {
        Toast.show({
            content: '绑定成功',
        });

        this.setState({
            is_bind_wechat: true,
        });
    };

    handlerBindDongdezhuan = () => {
        if (this.state.is_bind_dongdezhuan) {
            Toast.show({
                content: '已绑定懂得赚',
            });
        } else {
            this.props.navigation.navigate('BindDongdezhuan');
        }
    };

    render() {
        const { navigation } = this.props;
        const user = navigation.getParam('user') || userStore.me;
        const { is_bind_wechat, is_bind_alipay, is_bind_dongdezhuan } = this.state;

        return (
            <PageContainer title="账号安全" white loading={!user}>
                <View style={styles.container}>
                    <View style={styles.panelLeft}>
                        <Avatar
                            source={user.avatar}
                            size={52}
                            borderStyle={{ borderWidth: 1, borderColor: '#ffffff' }}
                        />
                        <View style={styles.panelContent}>
                            <Text style={{ color: Theme.defaultTextColor, fontSize: 15 }}>{user.name}</Text>
                        </View>
                    </View>

                    <ListItem
                        onPress={this.account}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>手机账号</Text>}
                        rightComponent={
                            user.phone ? (
                                <View style={styles.rightWrap}>
                                    <Text style={styles.rightText}>{user.phone}</Text>
                                    <Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />
                                </View>
                            ) : (
                                <View style={styles.rightWrap}>
                                    <Text style={styles.linkText}>去设置</Text>
                                    <Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />
                                </View>
                            )
                        }
                    />

                    {appStore.enableWallet && (
                        <ListItem
                            style={styles.listItem}
                            onPress={this.alipay}
                            leftComponent={<Text style={styles.itemText}>支付宝账号</Text>}
                            rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                            rightComponent={
                                user.wallet ? (
                                    <View style={styles.rightWrap}>
                                        <Text style={styles.rightText}>已绑定</Text>
                                        <Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />
                                    </View>
                                ) : (
                                    <View style={styles.rightWrap}>
                                        <Text style={styles.linkText}>未绑定</Text>
                                        <Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />
                                    </View>
                                )
                            }
                        />
                    )}

                    {!Device.IOS && (
                        <ListItem
                            onPress={this.handlerBindWechat}
                            style={styles.listItem}
                            leftComponent={<Text style={styles.itemText}>微信账号</Text>}
                            rightComponent={
                                <View style={styles.rightWrap}>
                                    <Text style={is_bind_wechat ? styles.rightText : styles.linkText}>
                                        {is_bind_wechat ? '已绑定' : '去绑定'}
                                    </Text>
                                    <Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />
                                </View>
                            }
                        />
                    )}

                    <ListItem
                        onPress={this.handlerBindDongdezhuan}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>懂得赚账号</Text>}
                        rightComponent={
                            <View style={styles.rightWrap}>
                                <Text style={is_bind_dongdezhuan ? styles.rightText : styles.linkText}>
                                    {is_bind_dongdezhuan ? '已绑定' : '去绑定'}
                                </Text>
                                <Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />
                            </View>
                        }
                    />

                    <ListItem
                        style={styles.listItem}
                        onPress={this.modifyPassword}
                        leftComponent={<Text style={styles.itemText}>修改密码</Text>}
                        rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                    />
                    {/* <ListItem
                        style={styles.listItem}
                        onPress={() => {
                            navigation.navigate('LogoutAccount');
                        }}
                        leftComponent={<Text style={styles.itemText}>注销账号</Text>}
                        rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                    /> */}
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    avatarTip: {
        color: Theme.subTextColor,
        fontSize: Font(13),
        marginVertical: PxDp(15),
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        marginHorizontal: PxDp(Theme.itemSpace),
    },
    field: {
        color: '#666',
        fontSize: Font(14),
    },
    fieldGroup: {
        marginBottom: PxDp(30),
        paddingHorizontal: Theme.itemSpace,
    },
    genderGroup: {
        alignItems: 'center',
        flexDirection: 'row',
        width: PxDp(100),
    },
    genderItem: { height: PxDp(20), marginRight: PxDp(8), width: PxDp(20) },
    inputStyle: {
        color: Theme.defaultTextColor,
        flex: 1,
        fontSize: Font(15),
        marginTop: PxDp(6),
        paddingVertical: PxDp(10),
    },
    inputWrap: {
        alignItems: 'center',
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: PxDp(1),
        flexDirection: 'row',
    },
    itemText: {
        color: Theme.defaultTextColor,
        fontSize: Font(15),
        marginRight: PxDp(15),
    },
    linkText: {
        color: '#407FCF',
        fontSize: Font(15),
        marginRight: PxDp(6),
    },
    listItem: {
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: PxDp(1),
        height: PxDp(50),
    },
    panelContent: {
        height: 34,
        justifyContent: 'space-between',
        marginLeft: 15,
        marginTop: 15,
    },
    panelLeft: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    rightText: {
        color: Theme.subTextColor,
        fontSize: Font(15),
        marginRight: PxDp(6),
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
        borderBottomWidth: PxDp(1),
        flexDirection: 'row',
        height: PxDp(80),
        justifyContent: 'space-between',
    },
});

export default AccountSecurity;
