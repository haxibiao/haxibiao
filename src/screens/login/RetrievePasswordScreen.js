import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { HxfButton, PageContainer } from 'components';
import { compose, graphql, GQL } from '@src/apollo';

class RetrievePassword extends Component {
    constructor(props) {
        super(props);
        const { time } = 59;
        this.time_remaining = time ? time - 1 : 60;
        this.state = {
            code: '',
            password: '',
            tips: `${this.time_remaining}s后重新发送`,
        };
    }

    componentDidMount() {
        this.countDown();
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.time_remaining == 60) {
            this.timer && clearInterval(this.timer);
        }
    }

    componentWillUnmount() {
        this.timer && clearInterval(this.timer);
    }

    countDown = () => {
        this.timer = setInterval(() => {
            --this.time_remaining;
            if (this.time_remaining == 0) {
                this.time_remaining = 60;
                this.setState({
                    tips: '重新获取验证码',
                });
                return;
            }
            this.setState({
                tips: this.time_remaining + 's后重新发送',
            });
        }, 1000);
    };

    resendVerificationCode = async () => {
        const { navigation } = this.props;

        const { phone } = navigation.state.params;

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
        } else {
            this.countDown();
            this.setState({
                submitting: false,
            });
        }
    };

    // 重置密码
    async resetPassword() {

        const { navigation } = this.props;

        const { code, password } = this.state;

        const { phone } = navigation.state.params;
        let result = {};
        this.setState({
            submitting: true,
        });
        console.log("verify code : ",code);
        try {
            result = await this.props.retrievePasswordMutation({
                variables: {
                    phone: phone,
                    newPassword: password,
                    code: code,
                },
            });
        } catch (ex) {
            result.errors = ex;
        }
        if (result && result.errors) {
            this.setState({
                submitting: false,
            });
            const str = result.errors.toString().replace(/Error: GraphQL error: /, '');
            Toast.show({ content: str }); // 打印错误信息
            console.log("str",str);
        } else {
            this.setState({
                submitting: false,
            });
            Toast.show({ content: '新密码设置成功' });
            navigation.pop(2);
        }
    }

    render() {
        const { code, password, tips, submitting } = this.state;
        return (
            <PageContainer title="重置密码" white submitting={submitting}>
                <View style={styles.header}>
                    <Text style={{ color: Theme.black, fontSize: 20, fontWeight: '600' }}>设置新密码</Text>
                </View>
                <View style={styles.textWrap}>
                    <TextInput
                        placeholder="请输入验证码"
                        selectionColor={Theme.primaryColor}
                        maxLength={48}
                        style={styles.textInput}
                        onChangeText={value => {
                            this.setState({
                                code: value,
                            });
                        }}
                    />
                </View>
                <View style={styles.textWrap}>
                    <TextInput
                        placeholder="请输入新密码"
                        selectionColor={Theme.primaryColor}
                        maxLength={48}
                        style={styles.textInput}
                        onChangeText={value => {
                            this.setState({
                                password: value,
                            });
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={{ marginHorizontal: PxDp(25), marginTop: PxDp(15) }}
                    onPress={this.resendVerificationCode}
                    disabled={!(this.time_remaining == 60)}>
                    <Text style={{ color: this.time_remaining == 60 ? Theme.primaryColor : Theme.grey, fontSize: 13 }}>
                        {tips}
                    </Text>
                </TouchableOpacity>

                <HxfButton
                    title="完成"
                    onPress={()=> this.resetPassword()}
                    disabled={code && password ? false : true}
                    style={{
                        height: PxDp(38),
                        fontSize: PxDp(16),
                        marginHorizontal: PxDp(25),
                        marginTop: PxDp(30),
                        backgroundColor: Theme.primaryColor,
                    }}
                />
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        marginBottom: PxDp(40),
        marginTop: PxDp(50),
        paddingHorizontal: PxDp(25),
    },
    textWrap: {
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: PxDp(0.5),
        marginHorizontal: PxDp(25),
        marginTop: PxDp(5),
        paddingHorizontal: 0,
    },
});

export default compose(
    graphql(GQL.retrievePasswordMutation, { name: 'retrievePasswordMutation' }),
    graphql(GQL.SendVerifyCodeMutation, { name: 'SendVerifyCodeMutation' }),
)(RetrievePassword);
