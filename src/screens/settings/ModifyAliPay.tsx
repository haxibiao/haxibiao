/*
 * @flow
 * created by wyk made in 2019-03-22 12:02:09
 */
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { PageContainer, TouchFeedback, HxfButton, CustomTextInput } from '~/components';

import { graphql, GQL } from '~/apollo';
import { userStore } from '~/store';

class EditProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pay_account: '',
            submitting: false,
        };
    }

    sendVerificationCode = async () => {
        const { navigation } = this.props;
        const { me } = userStore;
        if (me && me.phone) {
            let result = {};
            this.setState({
                submitting: true,
            });
            try {
                result = await this.props.SendVerifyCodeMutation({
                    variables: {
                        phone: me.phone,
                        action: 'USER_INFO_CHANGE',
                    },
                    errorPolicy: 'all',
                });
            } catch (ex) {
                result.errors = ex;
            }
            if (result && result.errors) {
                this.setState({
                    submitting: false,
                });
                Toast.show({ content: '发送验证码失败' });
            } else {
                this.setState({
                    submitting: false,
                });
                navigation.navigate('BindAlipay', {
                    code: result.data.sendVerifyCode.code,
                    // phone: result.data.sendVerifyCode.surplusSecond,
                });
            }
        } else {
            Toast.show({ content: '账号获取失败，请重新登录' });
        }
    };

    render() {
        let { navigation } = this.props;
        const { submitting } = this.state;
        const { me } = userStore;
        // if (loading) return null;
        // let { loading, user } = data;
        return (
            <PageContainer title="账户绑定" white submitting={submitting}>
                <View style={styles.container}>
                    <View style={{ marginTop: pixel(50), paddingHorizontal: pixel(25), paddingBottom: pixel(15) }}>
                        <Text
                            style={{
                                color: Theme.black,
                                fontSize: 20,
                                fontWeight: '600',
                                paddingBottom: pixel(20),
                            }}>
                            验证账号
                        </Text>
                        <Text style={styles.tipsText}>绑定支付宝信息需要验证账号的安全性</Text>
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput
                            placeholder={
                                me && me.phone
                                    ? '验证码将发送至账号 ' + me.phone
                                    : '未绑定手机号，请绑定手机号或重新登录'
                            }
                            style={{ height: pixel(48) }}
                            onChangeText={(value) => {
                                this.setState({
                                    pay_account: value,
                                });
                            }}
                            editable={false}
                        />
                    </View>
                    <HxfButton title={'确认发送验证码'} style={styles.button} onPress={this.sendVerificationCode} />
                </View>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.white || '#FFF',
    },
    header: {
        paddingHorizontal: pixel(25),
        marginVertical: pixel(15),
    },
    tips: {
        fontWeight: '300',
        color: Theme.grey,
        lineHeight: pixel(20),
    },
    tipsText: {
        color: Theme.grey,
        fontSize: pixel(13),
    },
    inputWrap: {
        borderBottomWidth: pixel(0.5),
        borderBottomColor: Theme.borderColor,
        marginHorizontal: pixel(25),
        paddingHorizontal: 0,
    },
    button: {
        height: pixel(38),
        borderRadius: pixel(5),
        marginHorizontal: pixel(25),
        marginTop: pixel(35),
        backgroundColor: Theme.primaryColor,
    },
    footer: {
        fontSize: pixel(12),
        lineHeight: pixel(16),
        color: Theme.secondaryColor,
        paddingTop: pixel(15),
    },
});

export default graphql(GQL.SendVerifyCodeMutation, { name: 'SendVerifyCodeMutation' })(EditProfileScreen);
