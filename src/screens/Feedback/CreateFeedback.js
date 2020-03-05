import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, Image, View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import { PageContainer, HxfButton, Iconfont, KeyboardSpacer, MediaUploader, HxfTextInput } from '@src/components';
import { observer, userStore } from '@src/store';
import { GQL, useMutation } from '@src/apollo';
import { useNavigation } from '@src/router';
//  onPress={() => navigation.navigate('TaskScreen')}

const contentGap = PxDp(20);
const MediaItemWidth = (Device.WIDTH - PxDp(60)) / 3;
let result = {};
export default observer(props => {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ content: '', images: [] });
    const [createFeedback, { data, loading }] = useMutation(GQL.createFeedbackMutation, {
        variables: {
            content: formData.content,
            images: formData.images,
        },
        onError: error => {
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '发布失败',
            });
        },
        onCompleted: mutationResult => {
            Toast.show({
                content: '发布成功',
            });
            console.log('data', mutationResult);
            // navigation.navigate('FeedbackHistory');
            navigation.navigate('FeedbackDetail', {
                feedback: mutationResult.createFeedback,
            });
            // setFormData({ content: '', images: [] });
            // navigation.replace('PostDetail', {
            //     post: mutationResult.createContent,
            // });
        },
    });

    const changeBody = useCallback(value => {
        setFormData(prevFormData => {
            return { ...prevFormData, content: value };
        });
    }, []);

    const uploadResponse = useCallback(response => {
        setFormData(prevFormData => {
            return { ...prevFormData, images: response };
        });
    }, []);

    const disabledButton = useMemo(() => !formData.content, [formData]);

    return (
        <PageContainer autoKeyboardInsets={false} hiddenNavBar={true} submitting={loading}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                    <View style={styles.creatorContainer}>
                        <View style={styles.bodyTextInputArea}>
                            <HxfTextInput
                                style={styles.bodyTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeBody}
                                multiline={true}
                                maxLength={100}
                                textAlignVertical="top"
                                placeholder="输入反馈内容，我们会积极响应..."
                            />
                            <View style={styles.textInputLimit}>
                                <Text style={styles.countInputText}>{`${formData.content.length}/200`}</Text>
                            </View>
                        </View>
                        <View style={[styles.formTitleWrap, { marginTop: PxDp(10) }]}>
                            <Text style={styles.formTitle}>
                                <Text>提供问题截图(选填)</Text>
                                <Text>
                                    {formData.images.length}
                                    /3
                                </Text>
                            </Text>
                        </View>
                        <View style={styles.mediaWrap}>
                            <MediaUploader
                                type="image"
                                maximum={3}
                                onResponse={uploadResponse}
                                maxWidth={Device.WIDTH / 2}
                                style={styles.mediaItem}
                            />
                        </View>
                        <View style={styles.formTitleWrap}>
                            <Text style={[styles.formTitle]}>{`欢迎加入QQ反馈群：${Config.qqGroup}`}</Text>
                        </View>
                    </View>
                    <HxfButton
                        title={'提交'}
                        gradient={true}
                        style={styles.button}
                        onPress={createFeedback}
                        disabled={disabledButton}
                    />
                </ScrollView>
            </View>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    bodyTextInput: {
        height: PxDp(120),
    },
    bodyTextInputArea: {
        paddingHorizontal: contentGap,
    },
    button: {
        height: PxDp(40),
        borderRadius: PxDp(5),
        margin: PxDp(30),
    },
    container: {
        paddingVertical: contentGap,
        backgroundColor: '#fff',
        flex: 1,
    },
    countInputText: {
        color: Theme.slateGray1,
        fontSize: PxDp(13),
    },
    creatorContainer: {
        backgroundColor: '#fff',
        borderRadius: PxDp(3),
    },
    mediaItem: { width: MediaItemWidth, height: MediaItemWidth, marginTop: PxDp(10), marginRight: PxDp(10) },
    textInputLimit: {
        alignItems: 'flex-end',
    },
    formTitle: {
        color: Theme.defaultTextColor,
        flexDirection: 'row',
        fontSize: PxDp(15),
        justifyContent: 'space-between',
    },
    formTitleWrap: {
        marginTop: PxDp(20),
        backgroundColor: Theme.groundColour,
        padding: PxDp(15),
    },
    mediaWrap: {
        marginLeft: PxDp(20),
        marginRight: PxDp(10),
        marginTop: PxDp(10),
    },
});
