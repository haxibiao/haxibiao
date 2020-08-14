import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Row } from '~/components';

class CommonQuestionScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [
                {
                    question: '如何发布视频问答？有什么奖励？',
                    answer:
                        `1.为了提高视频学习的趣味性，平台新增了视频问答的发布类型，您可以在提问页描述清楚您的问题，并插入相关视频内容即可发布视频问答,发布优质的视频问答将奖励一定${Config.goldAlias}。` +
                        '\n' +
                        '2.优质问答需保持真实客观，用语规范；凡带有其他软件水印的视频将不会被推荐，建议上传无水印视频；内容不得涉黄、政治引导、煽动谣言、传播垃圾广告。',
                },
                {
                    question: '什么是悬赏视频问答？',
                    answer: `为了更好的得到答案，您也可以对问题设置悬赏${Config.goldAlias}，支付的悬赏${Config.goldAlias}越高，受关注度越高。同时请您注意，设置了悬赏${Config.goldAlias}，${Config.goldAlias}将从您的账户中扣除，并在您选择了最佳答案后，赠送给最佳答案的回答者。`,
                },
                {
                    question: '发布悬赏问答后，如何设置最佳答案？',
                    answer:
                        '1.当其他用户回答了您的问题，您可以在评论区长按选择您满意的答案设置为最佳答案，被采纳的回答者将获得您支付的悬赏奖励。' +
                        '\n' +
                        '2.若您在发布问题后的7天内未设置最佳答案，系统将在超时后默认将悬赏奖励分发给评论区的三名用户。',
                },
                {
                    question: '什么样的回答更有机会获得悬赏奖励？',
                    answer:
                        '针对问题提供专业、措辞规范的解答，中肯客观或新颖、脑洞大开、有用并有趣的回答将更有机会被采纳。被采纳的答案将获得一定悬赏奖励。',
                },
                {
                    question: '绑定支付宝账户是否会有风险？',
                    answer:
                        '绑定支付宝账户只是为了方便给您提现哦，除了您的支付宝账户，我们不会获取您支付宝的任何信息，完全不用担心会有风险哦。',
                },
            ],
        };
    }

    renderQuestions = () => {
        return this.state.questions.map((elem, index) => {
            return (
                <View style={styles.issueItem} key={index}>
                    <View style={styles.question}>
                        <Image style={styles.avatar} source={require('!/assets/images/xiaodamei_man.png')} />
                        <View style={styles.content}>
                            <View style={[styles.inner, styles.right]}>
                                <Text style={styles.questionText}>{elem.question}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.answer}>
                        <View style={styles.content}>
                            <View style={[styles.inner, styles.left]}>
                                <Text style={styles.answerText}>{elem.answer}</Text>
                            </View>
                        </View>
                        <Image style={styles.avatar} source={require('!/assets/images/xiaodamei_women.png')} />
                    </View>
                </View>
            );
        });
    };

    render() {
        const { navigation } = this.props;
        return (
            <PageContainer title="常见问题" white>
                <ScrollView
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
                    <View>{this.renderQuestions()}</View>
                    <View style={styles.footer}>
                        <Row>
                            <Text style={{ fontSize: Font(13), color: Theme.subTextColor }}>没有解决？</Text>
                            <TouchFeedback
                                navigation={navigation}
                                authenticated
                                onPress={() => navigation.navigate('Feedback')}>
                                <Text style={{ fontSize: Font(13), color: Theme.linkColor }}>去反馈</Text>
                            </TouchFeedback>
                        </Row>
                    </View>
                </ScrollView>
            </PageContainer>
        );
    }
}

const styles = StyleSheet.create({
    answer: {
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: PxDp(Theme.itemSpace),
    },
    answerText: {
        color: Theme.defaultTextColor,
        fontSize: Font(15),
        lineHeight: PxDp(18),
    },
    avatar: {
        height: PxDp(42),
        width: PxDp(42),
    },
    container: {
        backgroundColor: '#fff',
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        paddingTop: PxDp(Theme.itemSpace * 2),
    },
    content: {
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: PxDp(Theme.itemSpace),
    },
    inner: {
        borderRadius: PxDp(5),
        padding: PxDp(10),
    },
    issueItem: {
        marginBottom: PxDp(Theme.itemSpace * 2),
        paddingHorizontal: PxDp(Theme.itemSpace),
    },
    left: {
        backgroundColor: '#FFEBEE',
        marginRight: PxDp(10),
    },
    question: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    questionText: {
        color: Theme.defaultTextColor,
        fontSize: Font(15),
        fontWeight: 'bold',
        lineHeight: PxDp(20),
    },
    right: {
        backgroundColor: '#E1F4FE',
        marginLeft: PxDp(10),
    },
});

export default CommonQuestionScreen;
