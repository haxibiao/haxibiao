import React, { useMemo, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';

import { PageContainer, HxfButton } from '~/components';
import { GQL, graphql, useMutation } from '~/apollo';
import { userStore } from '~/store';

const Input = (props) => {
    const { placeholder, get, defaultValue } = props;
    const [, setValue] = useState();
    return (
        <TextInput
            defaultValue={defaultValue}
            placeholder={placeholder}
            maxLength={20}
            style={{ height: 45 }}
            onChangeText={(v) => {
                setValue(v);
                get(v);
            }}
        />
    );
};

const BindAlipay = (props) => {
    const { me } = userStore;
    console.log('me里的钱包数据 ', me.wallet);
    const pay_account = useRef(Helper.syncGetter('wallet.pay_account', me) || '');
    const real_name = useRef(Helper.syncGetter('wallet.real_name', me) || '');
    const code = useRef('');
    console.log('account', pay_account);

    /*
     *  pay_account 为空  -> ''
     *  real_name
     *  code
     */
    // const code

    const [formData, setFormData] = useState({
        real_name: real_name.current,
        pay_account: pay_account.current,
        code: null,
    });
    const hasWallet = useRef(pay_account.current.length > 1);
    const [submitting, toggleSubmitting] = useState(false);

    const [setWalletPaymentInfo] = useMutation(GQL.setWalletPaymentInfoMutation, {
        variables: {
            input: {
                real_name: formData.real_name,
                pay_account: formData.pay_account,
            },
        },
        refetchQueries: (result) => [
            {
                query: GQL.userWithdrawQuery,
            },
        ],
    });

    // const [checkVerifyCode] = useMutation(GQL.CheckVerifyCodeMutation, {
    //     variables: {
    //         input: {
    //             code: formData.code,
    //             phone: userStore.me.phone,
    //             action: 'USER_INFO_CHANGE',
    //         },
    //     },
    // });

    const onSubmit = useCallback(async () => {
        if (code.current === formData.code) {
            toggleSubmitting(true);
            const [error, result] = await Helper.exceptionCapture(setWalletPaymentInfo);
            toggleSubmitting(false);
            if (error) {
                Toast.show({ content: error.message || hasWallet.current ? '修改失败' : '绑定失败', layout: 'top' });
            } else {
                userStore.changeAlipay(formData.real_name, formData.pay_account);
                Toast.show({ content: hasWallet.current ? '修改成功' : '绑定成功', layout: 'top' });
                props.navigation.pop(2);
            }
        } else {
            Toast.show({ content: '验证码错误', layout: 'top' });
        }
    }, [formData]);

    const disabledButton = useMemo(() => !(formData.real_name && formData.pay_account), [formData]);

    console.log('formData.code', formData, code);
    return (
        <PageContainer title={hasWallet.current ? '修改支付宝' : '绑定支付宝'} submitting={submitting}>
            <View style={styles.container}>
                <View style={{ paddingVertical: PxDp(20) }}>
                    <Text
                        style={{
                            color: Theme.defaultTextColor,
                            fontSize: font(20),
                            fontWeight: '600',
                            paddingBottom: PxDp(20),
                        }}>
                        支付宝信息
                    </Text>
                    <Text style={styles.tipsText}>
                        支付宝账号及真实姓名为提现有效证据,请输入已经通过实名认证的支付宝账号,否则提现将失败
                    </Text>
                </View>
                <View style={styles.inputWrap}>
                    <Input
                        placeholder="请输入收到的验证码"
                        defaultValue={formData.code}
                        get={(v) => {
                            setFormData({
                                ...formData,
                                code: v,
                            });
                        }}
                    />
                </View>
                <View style={styles.inputWrap}>
                    <Input
                        placeholder="请输入姓名"
                        defaultValue={formData.real_name}
                        get={(v) => {
                            setFormData({
                                ...formData,
                                real_name: v,
                            });
                        }}
                    />
                </View>
                <View style={styles.inputWrap}>
                    <Input
                        placeholder="请输入支付宝账号"
                        defaultValue={formData.pay_account}
                        get={(v) => {
                            setFormData({
                                ...formData,
                                pay_account: v,
                            });
                        }}
                    />
                </View>
                <HxfButton
                    title={'保存'}
                    gradient={true}
                    style={styles.button}
                    onPress={onSubmit}
                    disabled={disabledButton}
                />
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: PxDp(20),
    },
    tipsText: {
        color: Theme.subTextColor,
        fontSize: font(13),
    },
    inputWrap: {
        borderBottomWidth: PxDp(0.5),
        borderBottomColor: Theme.borderColor,
    },
    button: {
        height: PxDp(40),
        borderRadius: PxDp(5),
        marginTop: PxDp(35),
    },
});

export default graphql(GQL.setWalletPaymentInfoMutation, { name: 'setWalletPaymentInfo' })(BindAlipay);
