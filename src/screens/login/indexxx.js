import React, { Component, useState, useContext, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import { PageContainer, HxfTextInput, HxfButton, Row, Center, Iconfont, GradientView } from '@src/components';
import { exceptionCapture, useBounceAnimation } from '@src/common';
import { GQL, useMutation } from '@src/apollo';
import { observer } from '@src/store';

const thumbType = ['name', 'email', 'password'];

export default observer(props => {
    const { navigation } = props;
    const store = useContext(StoreContext);
    const [submitting, toggleSubmitting] = useState(false);
    const [secure, setSecure] = useState(true);
    const [thumb, setThumbType] = useState(false);
    const [signIn, toggleEntrance] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [signInMutation, { data: signInData }] = useMutation(GQL.signInMutation, {
        variables: {
            email: formData.email,
            password: formData.password,
        },
    });
    const [signUpMutation, { data: signUpData }] = useMutation(GQL.signUpMutation, {
        variables: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        },
    });

    function resetForm() {
        setFormData({ name: '', email: '', password: '' });
    }

    function changeName(value) {
        setFormData({
            ...formData,
            name: value,
        });
    }

    function changeEmail(value) {
        setFormData({
            ...formData,
            email: value,
        });
    }

    function changePassword(value) {
        setFormData({
            ...formData,
            password: value,
        });
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

    let disabled = !(formData.email && formData.password);

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
                    <TouchableOpacity style={{ padding: PxDp(5) }} onPress={() => toggleEntrance(!signIn)}>
                        <Text style={styles.linkText}>{signIn ? '去注册' : '去登录'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.formContainer}>
                    <Center>
                        <Image source={require('@src/assets/images/dmg_logo_white.png')} style={styles.logo} />
                    </Center>
                    <View>
                        <View style={styles.fieldGroup}>
                            <View style={styles.inputWrap}>
                                <HxfTextInput
                                    placeholderTextColor={'rgba(255,255,255,0.4)'}
                                    autoCorrect={false}
                                    placeholder={'请输入手机号'}
                                    style={styles.inputStyle}
                                    value={formData.email}
                                    onChangeText={changeEmail}
                                    onFocus={() => setThumbType(thumbType[1])}
                                />

                                {thumb == thumbType[1] && (
                                    <TouchableOpacity onPress={() => changeEmail('')}>
                                        <Iconfont name={'chacha'} size={PxDp(20)} color={Theme.tintTextColor} />
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
                                            <Iconfont name={'chacha'} size={PxDp(20)} color={Theme.tintTextColor} />
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
                                            name={secure ? 'privacy' : 'browse'}
                                            size={secure ? PxDp(22) : PxDp(20)}
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
                        onPress={onSubmit}
                        gradient>
                        <Text style={styles.buttonText}>{signIn ? '登 录' : '注 册'}</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.groupFooter}>
                            <Row>
                                <Text style={styles.grayText}>{signIn ? '没有账号？' : '已有账号？'}</Text>
                                <TouchableOpacity onPress={() => toggleEntrance(!signIn)}>
                                    <Text style={styles.linkText}>{signIn ? '去注册' : '去登录'}</Text>
                                </TouchableOpacity>
                            </Row>
                            {signIn && (
                                <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                                    <Text style={styles.grayText}>忘记密码</Text>
                                </TouchableOpacity>
                            )}
                        </View> */}
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
