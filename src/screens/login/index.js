import React, { Component, useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { PageContainer, HxfTextInput, HxfButton, Row, Center, Iconfont, GradientView } from '@src/components';
import { exceptionCapture, useBounceAnimation } from '@src/common';
import { GQL, useMutation } from '@src/apollo';
import { observer } from '@src/store';

const thumbType = ['name', 'account', 'password'];

export default observer(props => {
    const { navigation } = props;
    const store = useContext(StoreContext);
    const [submitting, toggleSubmitting] = useState(false);
    const [secure, setSecure] = useState(true);
    const [thumb, setThumbType] = useState(false);
    const [signIn, toggleEntrance] = useState(true);
    const [convenienceLogin, setConvenienceLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', account: '', password: '' });
    const [uniqueID, setUniqueID] = useState('');
    const [signInMutation, { data: signInData }] = useMutation(GQL.signInMutation, {
        variables: {
            account: formData.account,
            password: formData.password,
        },
    });
    const [signUpMutation, { data: signUpData }] = useMutation(GQL.signUpMutation, {
        variables: {
            name: formData.name,
            account: formData.account,
            password: formData.password,
        },
    });
    const [autoSignInMutation, { data: autoSignInData }] = useMutation(GQL.autoSignInMutation, {
        variables: {
            UUID: uniqueID,
        },
    });

    function resetForm() {
        setFormData({ name: '', account: '', password: '' });
    }

    function changeName(value) {
        setFormData({
            ...formData,
            name: value,
        });
    }

    function changeAccount(value) {
        setFormData({
            ...formData,
            account: value,
        });
    }

    function changePassword(value) {
        setFormData({
            ...formData,
            password: value,
        });
    }

    async function handleConvenienceLogin() {
        //获取本机UUID, 使用静默登录接口进行登录
        let uuid = Device.UUID;
        console.log('uuid : ', uuid);
        if (uuid) {
            await setUniqueID(uuid); //等待更新完state的UUID后再进行接口查询操作
            const [error, result] = await exceptionCapture(autoSignInMutation);
            if (error) {
                console.log('Error: [login/index.js] 静默登录接口 autoSignInMutation 返回错误 :', error);
                Toast.show({ content: '一键登录失败、切换到手动登录', layout: 'top' });
                setConvenienceLogin(false);
            } else {
                //登录成功,更新用户全局状态
                const meInfo = Helper.syncGetter('data.autoSignIn', result);
                store.userStore.signIn(meInfo);
                //返回上一个页面
                navigation.goBack();
            }
        } else {
            console.log('Info: [login/index.js] 获取UUID失败 ,切换到手动登录');
            setConvenienceLogin(false);
        }
    }

    // 修改state，从而调出手动登录
    function LoginWaySwitch() {
        setConvenienceLogin(false);
        console.log('switch');
    }

    async function onSubmit() {
        toggleSubmitting(true);
        if (signIn) {
            const [error, result] = await exceptionCapture(signInMutation);
            console.log(error, '===', result);
            toggleSubmitting(false);

            if (error) {
                Toast.show({ content: error.message || '登录失败', layout: 'top' });
            } else {
                store.userStore.signIn(Helper.syncGetter('data.signIn', result));
                navigation.goBack();
            }
        } else {
            const [error, result] = await exceptionCapture(signUpMutation);
            console.log(error, '===', result);
            toggleSubmitting(false);
            if (error) {
                Toast.show({ content: error.message || '注册失败', layout: 'top' });
            } else {
                store.userStore.signIn(Helper.syncGetter('data.signUp', result));
                navigation.goBack();
            }
        }
    }

    useEffect(() => {
        resetForm();
    }, [signIn]);

    let disabled = !(formData.account && formData.password);

    return (
        <PageContainer autoKeyboardInsets={false} submitting={submitting} submitTips={'loading'} hiddenNavBar>
            <View style={styles.container}>
                <View style={styles.registerCoverContainer}>
                    <Image source={require('@src/assets/images/login_cover.png')} style={styles.registerCover} />
                </View>
                <View style={styles.header}>
                    <TouchableOpacity style={{ padding: PxDp(5) }} onPress={() => navigation.pop()}>
                        <Iconfont name="chacha" size={Font(24)} color={'#fff'} />
                    </TouchableOpacity>
                </View>
                <View style={styles.formContainer}>
                    <Center>
                        <Image source={require('@src/assets/images/dmg_logo_white.png')} style={styles.logo} />
                    </Center>
                    {convenienceLogin ? (
                        <TouchableOpacity
                            style={[styles.buttonStyle, disabled && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                            onPress={handleConvenienceLogin}
                            gradient>
                            <Text style={styles.buttonText}>一键登录</Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}

                    {convenienceLogin ? (
                        <View />
                    ) : (
                        <View>
                            <View style={styles.fieldGroup}>
                                <View style={styles.inputWrap}>
                                    <HxfTextInput
                                        placeholderTextColor={'rgba(255,255,255,0.4)'}
                                        autoCorrect={false}
                                        placeholder={'请输入手机号'}
                                        style={styles.inputStyle}
                                        value={formData.account}
                                        onChangeText={changeAccount}
                                        onFocus={() => setThumbType(thumbType[1])}
                                    />

                                    {thumb == thumbType[1] && (
                                        <TouchableOpacity onPress={() => changeAccount('')}>
                                            <Iconfont name={'chacha'} size={PxDp(20)} color={Theme.tintTextColor} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <View style={styles.fieldGroup}>
                                <View style={styles.inputWrap}>
                                    <HxfTextInput
                                        placeholderTextColor={'rgba(255,255,255,0.4)'}
                                        autoCorrect={false}
                                        placeholder={'请输入密码'}
                                        secureTextEntry={secure}
                                        style={styles.inputStyle}
                                        value={formData.password}
                                        onChangeText={changePassword}
                                        onFocus={() => setThumbType(thumbType[2])}
                                    />
                                    {thumb == thumbType[2] && (
                                        <TouchableOpacity onPress={() => setSecure(!secure)}>
                                            <Iconfont
                                                name={secure ? 'privacy' : 'browse'}
                                                size={secure ? PxDp(22) : PxDp(20)}
                                                color={Theme.tintTextColor}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}

                    {convenienceLogin ? (
                        <TouchableOpacity
                            style={[styles.buttonStyle, disabled && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                            onPress={LoginWaySwitch}
                            gradient>
                            <Text style={styles.buttonText}>{'使用其他手机号登录'}</Text>
                        </TouchableOpacity>
                    ) : (
                        <View />
                    )}
                    {convenienceLogin ? (
                        <View />
                    ) : (
                        <TouchableOpacity
                            style={[styles.buttonStyle, disabled && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                            disabled={disabled}
                            onPress={onSubmit}
                            gradient>
                            <Text style={styles.buttonText}>{'登 录'}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Row style={styles.protocol}>
                    <Text style={styles.bottomInfoText}>登录代表您已同意</Text>
                    <Row>
                        <TouchableOpacity onPress={() => navigation.navigate('UserProtocol')}>
                            <Text style={{ fontSize: Font(13), color: Theme.secondaryColor }}>《用户协议》</Text>
                        </TouchableOpacity>
                        <Text style={styles.bottomInfoText}>和</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                            <Text style={{ fontSize: Font(13), color: Theme.secondaryColor }}>《隐私政策》</Text>
                        </TouchableOpacity>
                    </Row>
                </Row>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        height: Device.HEIGHT,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    registerCoverContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    registerCover: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    header: {
        position: 'absolute',
        top: PxDp(Theme.statusBarHeight + Theme.itemSpace),
        left: PxDp(Theme.itemSpace),
        right: PxDp(Theme.itemSpace),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formContainer: {
        marginTop: PxDp(100),
        marginHorizontal: PxDp(Theme.itemSpace * 2),
    },
    logo: {
        marginBottom: PxDp(40),
        width: Helper.WPercent(30),
        height: Helper.WPercent(30),
        resizeMode: 'contain',
    },
    fieldGroup: {
        marginBottom: PxDp(8),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: PxDp(4),
        paddingRight: PxDp(10),
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    inputStyle: {
        flex: 1,
        height: PxDp(42),
        fontSize: Font(16),
        color: '#fff',
        paddingBottom: PxDp(10),
        paddingTop: PxDp(10),
        padding: PxDp(10),
    },
    countdown: {
        padding: PxDp(5),
    },
    countdownText: {
        fontSize: Font(13),
        color: Theme.subTextColor,
    },
    buttonStyle: {
        marginTop: PxDp(Theme.itemSpace),
        height: PxDp(44),
        borderRadius: PxDp(4),
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: Font(16),
        fontWeight: 'bold',
        color: '#fff',
    },
    grayText: {
        fontSize: Font(14),
        color: '#fff',
    },
    linkText: {
        fontSize: Font(17),
        color: '#fff',
    },
    groupFooter: {
        marginTop: PxDp(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomInfoText: {
        fontSize: Font(13),
        color: '#fff',
    },
    protocol: {
        marginBottom: Theme.HOME_INDICATOR_HEIGHT + PxDp(Theme.itemSpace),
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
