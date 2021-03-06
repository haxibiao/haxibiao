import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import codePush from 'react-native-code-push';

import {
    PageContainer,
    TouchFeedback,
    Iconfont,
    ListItem,
    ItemSeparator,
    PopOverlay,
    AppUpdateOverlay,
} from '~/components';
import { userStore } from '~/store';
import { withApollo } from '~/apollo';
import { checkUpdate } from '~/utils';

class index extends Component {
    constructor(props) {
        super(props);
        const user = props.route.params?.user ?? {};

        this.state = {
            storageSize: (Math.random(1, 10) * 10).toFixed(1) + 'M',
            logoutConfirm: false,
            me: user,
        };
    }

    signOut = async () => {
        const { navigation } = this.props;
        const { me } = this.state;

        if (!this.state.logoutConfirm) {
            if (me.phone === null || me.phone === undefined) {
                PopOverlay({
                    content: '该账号还未绑定手机号，退出登录可能会丢失数据！可以在设置/账号安全中绑定手机号',
                    leftContent: '我再想想',
                    rightContent: '前去绑定',
                    onConfirm: async () => {
                        navigation.navigate('账号安全');
                    },
                });
            } else {
                PopOverlay({
                    content: '确定退出登录吗?',
                    onConfirm: async () => {
                        userStore.signOut();
                        navigation.navigate('Main', null, navigation.navigate({ routeName: '主页' }));
                    },
                });
            }
            this.setState({ logoutConfirm: true });
        } else {
            //第二次点击退出登录时弹出确定退出窗口
            PopOverlay({
                content: '确定退出登录吗?',
                onConfirm: async () => {
                    userStore.signOut();
                    navigation.navigate('Main', null, navigation.navigate({ routeName: '主页' }));
                },
            });
        }
    };

    render() {
        const { navigation } = this.props;
        const { login } = userStore;
        const { storageSize, me } = this.state;
        return (
            <PageContainer title="设置" white>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{
                        paddingBottom: pixel(20),
                    }}
                    bounces={false}
                    removeClippedSubviews={true}
                    showsVerticalScrollIndicator={false}>
                    {login && (
                        <View>
                            <ItemSeparator />
                            <ListItem
                                onPress={() => navigation.navigate('AccountSecurity', { user: me })}
                                style={styles.listItem}
                                leftComponent={<Text style={styles.itemText}> 账号安全 </Text>}
                                rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                            />
                            <ItemSeparator />
                            <ListItem
                                onPress={() => navigation.navigate('编辑个人资料')}
                                style={styles.listItem}
                                leftComponent={<Text style={styles.itemText}> 修改资料 </Text>}
                                rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                            />
                            <ItemSeparator />
                            <ListItem
                                onPress={() => navigation.navigate('UserBlockScreen')}
                                style={styles.listItem}
                                leftComponent={<Text style={styles.itemText}> 黑名单 </Text>}
                                rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                            />
                            <ItemSeparator />
                        </View>
                    )}
                    <ListItem
                        onPress={() => navigation.navigate('UserProtocol')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 用户协议 </Text>}
                        rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 隐私政策 </Text>}
                        rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    {/* <ListItem
                        onPress={() => navigation.navigate('CommonQuestion')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 常见问题 </Text>}
                        rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator /> */}
                    <ListItem
                        onPress={() => navigation.navigate('AboutUs')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 关于 {Config.userStoreName} </Text>}
                        rightComponent={<Iconfont name="right" size={pixel(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => {
                            // let rs = checkUpdate();
                            // if (rs) {
                            // 	AppUpdateOverlay.show(rs);
                            // }

                            codePush
                                .sync({
                                    updateDialog: {
                                        title: '有更新了哟',
                                        optionalUpdateMessage: '这是强制的哟',
                                    },
                                    installMode: codePush.InstallMode.IMMEDIATE,
                                })
                                .then(
                                    (status) => {
                                        console.log('codePush sync status', status);
                                        let statusText = '已最新';
                                        if (status == 1) {
                                            statusText = '更新已安装,需重启...';
                                        }
                                        if (status == 2) {
                                            statusText = '更新已忽略...';
                                        }
                                        if (status == 3) {
                                            statusText = '更新遇到未知错误...';
                                        }
                                        if (status == 4) {
                                            statusText = '正在下载更新...';
                                        }
                                        if (status == 5) {
                                            statusText = '正在检查更新...';
                                        }
                                        Toast.show({ content: '检查结果 - ' + statusText });
                                    },
                                    (reason) => {
                                        console.log('codePush reject reason', reason);
                                        Toast.show({ content: '拒绝原因-' + reason });
                                    },
                                );
                        }}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}>检查更新</Text>}
                        rightComponent={<Text style={styles.rigthText}> {Config.AppVersion} </Text>}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() =>
                            setTimeout(() => {
                                this.setState(
                                    {
                                        storageSize: '0M',
                                    },
                                    () => {
                                        Toast.show({ content: '已清除缓存' });
                                    },
                                );
                            }, 300)
                        }
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 清除缓存 </Text>}
                        rightComponent={<Text style={styles.rigthText}> {storageSize} </Text>}
                    />
                    <ItemSeparator />
                    {login && (
                        <TouchFeedback
                            style={[
                                styles.listItem,
                                {
                                    justifyContent: 'center',
                                },
                            ]}
                            onPress={this.signOut}>
                            <Text style={styles.logout}>退出登录</Text>
                        </TouchFeedback>
                    )}
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.groundColour,
        flex: 1,
    },
    itemText: {
        color: Theme.defaultTextColor,
        fontSize: pixel(15),
        marginRight: pixel(15),
    },
    listItem: {
        backgroundColor: '#fff',
        height: pixel(50),
        paddingHorizontal: pixel(16),
    },
    logout: {
        alignSelf: 'center',
        color: Theme.primaryColor,
        fontSize: pixel(14),
    },
    rigthText: {
        color: Theme.subTextColor,
        fontSize: pixel(14),
    },
});

export default withApollo(index);
