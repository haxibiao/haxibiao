import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { HxfButton, PageContainer } from '@src/components';
import { compose, graphql, GQL } from '@src/apollo';

class VerificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            submitting: false,
        };
    }

    sendVerificationCode = async () => {
        const { navigation } = this.props;

        const { phone } = this.state;
        if (phone) {
            let result = {};
            this.setState({
                submitting: true,
            });
            try {
                result = await this.props.SendVerifyCodeMutation({
                    variables: {
                        phone: phone,
                        action: 'RESET_PASSWORD',
                    },
                    errorPolicy: 'all',
                });
            } catch (ex) {
                result.errors = ex;
            }
            console.log('result', result);
            if (result && result.errors) {
                this.setState({
                    submitting: false,
                });
                const str = result.errors[0].message;
                Toast.show({ content: str });
                console.log('str', str);
            } else {
                this.setState({
                    submitting: false,
                });
                navigation.navigate('找回密码', {
                    code: result.data.sendVerifyCode.code,
                    time: result.data.sendVerifyCode.surplusSecond,
                    phone: phone,
                });
            }
        } else {
            Toast.show({ content: '账号获取失败，请重新登录' });
        }
    };

    render() {
        const { submitting } = this.state;
        return (
            <PageContainer title="找回密码" white submitting={submitting}>
                <View style={styles.container}>
                    <View style={{ marginTop: 50, paddingHorizontal: 25 }}>
                        <Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>获取验证码</Text>
                    </View>
                    <View style={styles.textWrap}>
                        <TextInput
                            placeholder="请输入手机号"
                            selectionColor={Theme.primaryColor}
                            maxLength={48}
                            keyboardType="numeric"
                            style={styles.textInput}
                            onChangeText={value => {
                                this.setState({
                                    phone: value,
                                });
                            }}
                        />
                    </View>

                    <HxfButton
                        title="获取验证码"
                        gradient={true}
                        style={styles.button}
                        onPress={this.sendVerificationCode}
                    />
                </View>
            </PageContainer>
        );
    }
}
const styles = StyleSheet.create({
    button: {
        borderRadius: PxDp(5),
        height: PxDp(40),
        marginHorizontal: PxDp(15),
        marginTop: PxDp(35),
    },
    container: {
        backgroundColor: Theme.white || '#FFF',
        flex: 1,
        paddingHorizontal: PxDp(20),
    },
    textInput: {
        color: Theme.primaryFont,
        fontSize: PxDp(16),
        height: PxDp(50),
        padding: 0,
    },
    textWrap: {
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: PxDp(0.5),
        marginHorizontal: PxDp(25),
        marginTop: PxDp(40),
        paddingHorizontal: 0,
    },
});

export default compose(graphql(GQL.SendVerifyCodeMutation, { name: 'SendVerifyCodeMutation' }))(VerificationScreen);
