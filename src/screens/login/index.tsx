import React, { Component, useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { PageContainer, HxfTextInput, HxfButton, Row, Center, Iconfont, GradientView } from '~/components';
import { exceptionCapture, useBounceAnimation } from '~/utils';
import { GQL, useMutation } from '~/apollo';
import { observer, userStore } from '~/store';
import { useNavigation } from '@react-navigation/native';

const thumbType = ['name', 'account', 'password'];

export default observer((props) => {
    const navigation = useNavigation();
    const [submitting, toggleSubmitting] = useState(false);
    const [secure, setSecure] = useState(true);
    const [thumb, setThumbType] = useState(false);
    const [signIn, toggleEntrance] = useState(true);
    const [formData, setFormData] = useState({ name: '', account: '', password: '' });
    const [signInMutation, { data: signInData }] = useMutation(GQL.signInMutation, {
        variables: {
            account: formData.account,
            password: formData.password,
            uuid: Device.UUID,
        },
    });
    const [signUpMutation, { data: signUpData }] = useMutation(GQL.signUpMutation, {
        variables: {
            name: formData.name,
            account: formData.account,
            password: formData.password,
            uuid: Device.UUID,
        },
    });
    const [autoSignInMutation, { data: autoSignInData }] = useMutation(GQL.autoSignInMutation, {
        variables: {
            UUID: Device.UUID,
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

    // 手动登录
    const onSignIn = useCallback(async () => {
        toggleSubmitting(true);
        const [error, result] = await exceptionCapture(signInMutation);
        toggleSubmitting(false);
        if (error) {
            Toast.show({ content: error.message || '登录失败', layout: 'top' });
        } else {
            userStore.signIn(Helper.syncGetter('data.signIn', result));
            navigation.goBack();
        }
    }, [signUpMutation]);

    // 手动注册
    const onSignUp = useCallback(async () => {
        toggleSubmitting(true);
        const [error, result] = await exceptionCapture(signUpMutation);
        toggleSubmitting(false);
        if (error) {
            Toast.show({ content: error.message || '注册失败', layout: 'top' });
        } else {
            userStore.signIn(Helper.syncGetter('data.signUp', result));
            navigation.goBack();
        }
    }, [signUpMutation]);

    // 使用本机UUID进行静默登录
    const onSilentLogin = useCallback(async () => {
        if (Device.UUID) {
            const [error, result] = await exceptionCapture(autoSignInMutation);
            if (error) {
                Toast.show({ content: error.message, layout: 'top' });
            } else {
                //登录成功,更新用户全局状态
                const meInfo = Helper.syncGetter('data.autoSignIn', result);
                userStore.signIn(meInfo);
                navigation.goBack();
            }
        } else {
            Toast.show({ content: '一键登录失败，请手动登录', layout: 'top' });
        }
    }, []);

    useEffect(() => {
        resetForm();
    }, [signIn]);

    let disabled = !(formData.account && formData.password);

    return (
        <PageContainer autoKeyboardInsets={false} submitting={submitting} submitTips={'loading'} hiddenNavBar>
            <View style={styles.container}>
                <View style={styles.registerCoverContainer}>
                    <Image source={require('!/assets/images/login_cover.png')} style={styles.registerCover} />
                </View>
                <View style={styles.header}>
                    <TouchableOpacity style={{ padding: pixel(5) }} onPress={() => navigation.pop()}>
                        <Iconfont name="guanbi1" size={font(24)} color={'#fff'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: pixel(5) }} onPress={() => toggleEntrance(!signIn)}>
                        <Text style={styles.linkText}>{signIn ? '去注册' : '去登录'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.formContainer}>
                    <Center>
                        <Image source={require('!/assets/images/dmg_logo_white.png')} style={styles.logo} />
                    </Center>
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
                                        <Iconfont name={'guanbi1'} size={pixel(20)} color={Theme.tintTextColor} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                        {!signIn && (
                            <View style={styles.fieldGroup}>
                                <View style={styles.inputWrap}>
                                    <HxfTextInput
                                        placeholderTextColor={'rgba(255,255,255,0.4)'}
                                        autoCorrect={false}
                                        placeholder={'请输入昵称'}
                                        style={styles.inputStyle}
                                        value={formData.name}
                                        onChangeText={changeName}
                                        onFocus={() => setThumbType(thumbType[0])}
                                    />

                                    {thumb == thumbType[0] && (
                                        <TouchableOpacity onPress={() => changeName('')}>
                                            <Iconfont name={'guanbi1'} size={pixel(20)} color={Theme.tintTextColor} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        )}
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
                                            name={secure ? 'icon' : 'liulan2'}
                                            size={secure ? pixel(22) : pixel(20)}
                                            color={Theme.tintTextColor}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={[styles.buttonStyle, disabled && { backgroundColor: 'rgba(255,255,255,0.2)' }]}
                        disabled={disabled}
                        onPress={signIn ? onSignIn : onSignUp}
                        gradient>
                        <Text style={styles.buttonText}>{signIn ? '登 录' : '注 册'}</Text>
                    </TouchableOpacity>
                    {signIn && (
                        <View style={styles.groupFooter}>
                            <TouchableOpacity onPress={onSilentLogin}>
                                <Row>
                                    <Iconfont name="iphone" size={pixel(15)} color="#fff" />
                                    <Text style={styles.grayText}>一键登录</Text>
                                </Row>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('获取验证码')}>
                                <Text style={styles.grayText}>忘记密码？</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <Row style={styles.protocol}>
                    <Text style={styles.bottomInfoText}>登录代表您已同意</Text>
                    <Row>
                        <TouchableOpacity onPress={() => navigation.navigate('UserProtocol')}>
                            <Text style={{ fontSize: font(13), color: Theme.secondaryColor }}>《用户协议》</Text>
                        </TouchableOpacity>
                        <Text style={styles.bottomInfoText}>和</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                            <Text style={{ fontSize: font(13), color: Theme.secondaryColor }}>《隐私政策》</Text>
                        </TouchableOpacity>
                    </Row>
                </Row>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        width: '100%',
        height: '100%',
        backgroundColor: '#6661',
    },
    header: {
        position: 'absolute',
        top: pixel(Theme.statusBarHeight + Theme.itemSpace),
        left: pixel(Theme.itemSpace),
        right: pixel(Theme.itemSpace),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formContainer: {
        marginTop: pixel(100),
        marginHorizontal: pixel(Theme.itemSpace * 2),
    },
    logo: {
        marginBottom: pixel(40),
        width: Helper.WPercent(30),
        height: Helper.WPercent(30),
        resizeMode: 'contain',
    },
    fieldGroup: {
        marginBottom: pixel(8),
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: pixel(4),
        paddingRight: pixel(10),
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    inputStyle: {
        flex: 1,
        height: pixel(42),
        fontSize: font(16),
        color: '#fff',
        paddingBottom: pixel(10),
        paddingTop: pixel(10),
        padding: pixel(10),
    },
    countdown: {
        padding: pixel(5),
    },
    countdownText: {
        fontSize: font(13),
        color: Theme.subTextColor,
    },
    buttonStyle: {
        marginTop: pixel(Theme.itemSpace),
        height: pixel(44),
        borderRadius: pixel(4),
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: font(16),
        fontWeight: 'bold',
        color: '#fff',
    },
    boldText: {
        fontSize: font(15),
        color: '#fff',
        fontWeight: 'bold',
    },
    grayText: {
        fontSize: font(14),
        color: '#fff',
    },
    linkText: {
        fontSize: font(17),
        color: '#fff',
    },
    groupFooter: {
        marginTop: pixel(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    bottomInfoText: {
        fontSize: font(13),
        color: '#fff',
    },
    protocol: {
        marginBottom: Theme.HOME_INDICATOR_HEIGHT + pixel(Theme.itemSpace),
        alignItems: 'center',
        justifyContent: 'center',
    },
});
