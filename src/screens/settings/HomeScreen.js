import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, ListItem, ItemSeparator, PopOverlay } from 'components';
import { userStore } from '@src/store';
import { withApollo } from '@src/apollo';
import { checkUpdate } from '@src/common';

class index extends Component {
    constructor(props) {
        const user = props.navigation.getParam('user');
        super(props);
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
                        paddingBottom: PxDp(20),
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
                                rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                            />
                            <ItemSeparator />
                            <ListItem
                                onPress={() => navigation.navigate('编辑个人资料')}
                                style={styles.listItem}
                                leftComponent={<Text style={styles.itemText}> 修改资料 </Text>}
                                rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                            />
                            <ItemSeparator />
                            <ListItem
                                onPress={() => navigation.navigate('UserBlockScreen')}
                                style={styles.listItem}
                                leftComponent={<Text style={styles.itemText}> 黑名单 </Text>}
                                rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                            />
                            <ItemSeparator />
                        </View>
                    )}
                    <ListItem
                        onPress={() => navigation.navigate('UserProtocol')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 用户协议 </Text>}
                        rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('PrivacyPolicy')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 隐私政策 </Text>}
                        rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('CommonQuestion')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 常见问题 </Text>}
                        rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => navigation.navigate('AboutUs')}
                        style={styles.listItem}
                        leftComponent={<Text style={styles.itemText}> 关于 {Config.userStoreName} </Text>}
                        rightComponent={<Iconfont name="right" size={PxDp(14)} color={Theme.subTextColor} />}
                    />
                    <ItemSeparator />
                    <ListItem
                        onPress={() => checkUpdate()}
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
        fontSize: PxDp(15),
        marginRight: PxDp(15),
    },
    listItem: {
        backgroundColor: '#fff',
        height: PxDp(50),
        paddingHorizontal: PxDp(16),
    },
    logout: {
        alignSelf: 'center',
        color: Theme.primaryColor,
        fontSize: PxDp(14),
    },
    rigthText: {
        color: Theme.subTextColor,
        fontSize: PxDp(14),
    },
});

export default withApollo(index);
