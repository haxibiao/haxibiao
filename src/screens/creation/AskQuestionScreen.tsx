import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import { StyleSheet, View, Image, ScrollView, Text, Keyboard, StatusBar } from 'react-native';
import {
    PageContainer,
    HxfTextInput,
    TouchFeedback,
    HxfButton,
    HorizontalList,
    Iconfont,
    Center,
    PlaceholderImage,
    ProgressOverlay,
    OverlayViewer,
    KeyboardSpacer,
    MediaUploader,
    HxfRadio,
} from '~/components';
import { observer, userStore, appStore, adStore } from '~/store';
import { useNavigation } from '~/router';
import { GQL, useMutation } from '~/apollo';
import Video from 'react-native-video';
import { Overlay } from 'teaset';
import { useQuery } from '~/apollo';
import { observable } from 'mobx';

const GoldsOption = [30, 60, 120, 300, 600, 900];
const contentGap = pixel(20);
const MediaItemWidth = (Device.WIDTH - pixel(60)) / 3;
const issueContentType = 'ISSUE';
const PostContentType = 'POST';

const AskQuestionScreen = (props) => {
    const category = useMemo(() => props.route.params?.category ?? {}, [props]);
    const navigation = useNavigation();
    const [gold, setGold] = useState(0);
    const [userGold, setUserGold] = useState(0);
    const [categories, setCategories] = useState(() => (category ? [category] : []));
    const [contentType, setContentType] = useState(PostContentType);
    const [formData, setFormData] = useState({ body: '', video_id: '', images: [], category_ids: [] });
    const [askQuestion, { data, loading }] = useMutation(GQL.createPostMutation, {
        variables: {
            body: formData.body,
            qcvod_fileid: formData.video_id,
            images: formData.images,
            category_ids: categories.map((category) => category.id),
            type: contentType,
            issueInput: {
                gold,
            },
        },
        onError: (error) => {
            console.log(
                '打印视频发布错误',
                error,
                categories.map((category) => category.id),
            );
            if (categories.map((category) => category.id)[0] == undefined) {
                Toast.show({
                    content: '请添加话题',
                });
            } else {
                Toast.show({
                    content: error.message.replace('GraphQL error: ', '') || '发布失败',
                });
            }
        },
        onCompleted: (mutationResult) => {
            console.log('视频发布成功', mutationResult, categories);

            Toast.show({
                content: '发布成功',
            });
            navigation.goBack();
        },
    });

    useEffect(() => {
        appStore.client
            .query({
                query: GQL.userProfileQuery,
                variables: {
                    id: userStore.me.id,
                },
            })
            .then((result) => {
                setUserGold(Helper.syncGetter('data.user.gold', result));
            })
            .catch((err) => {
                console.log('err', err);
            });
    }, []);

    const setGoldMiddleware = useCallback(
        (value) => {
            if (userGold >= value) {
                setGold(value);
            } else {
                Toast.show({ content: `${Config.goldAlias}不足，快去赚取吧` });
            }
        },
        [userGold],
    );

    const selectCategory = useCallback(
        (category) => {
            if (
                __.find(categories, function (item) {
                    return item.id === category.id;
                })
            ) {
                Toast.show({ content: '该专题已经添加过了' });
            } else {
                categories.push(category);
                setCategories([...categories]);
            }
        },
        [categories],
    );

    const changeContentType = useCallback((isIssue) => {
        if (isIssue) {
            setContentType(issueContentType);
        } else {
            setContentType(PostContentType);
        }
    }, []);

    const addedCategories = useMemo(() => {
        return categories.map((category, index) => {
            return (
                <TouchFeedback
                    activeOpacity={1}
                    key={category.id}
                    style={styles.categoryItem}
                    onPress={() => navigation.navigate('Category', { category })}>
                    <Text style={styles.categoryName}>#{category.name}</Text>
                    <TouchFeedback
                        style={styles.close}
                        onPress={() => {
                            categories.splice(index, 1);
                            setCategories([...categories]);
                        }}>
                        <Iconfont name="guanbi1" size={pixel(12)} color={Theme.primaryColor} />
                    </TouchFeedback>
                </TouchFeedback>
            );
        });
    }, [categories]);

    const changeBody = useCallback((value) => {
        setFormData((prevFormData) => {
            return { ...prevFormData, body: value };
        });
    }, []);

    const uploadResponse = useCallback((response) => {
        if (Array.isArray(response)) {
            setFormData((prevFormData) => {
                return { ...prevFormData, images: response };
            });
        } else {
            setFormData((prevFormData) => {
                return { ...prevFormData, video_id: response ? response.video_id : null };
            });
        }
    }, []);

    const disablePublishButton = useMemo(() => {
        return !(formData.body && (formData.video_id || formData.images.length > 0));
    }, [formData]);

    return (
        <PageContainer
            submitting={loading}
            leftView={
                <TouchFeedback onPress={() => navigation.goBack()}>
                    <Iconfont name="guanbi1" size={pixel(22)} color={Theme.primaryAuxiliaryColor} />
                </TouchFeedback>
            }
            rightView={
                <TouchFeedback
                    disabled={disablePublishButton}
                    style={[styles.publishButton, disablePublishButton && styles.disabledButton]}
                    onPress={askQuestion}>
                    <Text style={[styles.publishText, disablePublishButton && styles.disabledPublishText]}>
                        立即发布
                    </Text>
                </TouchFeedback>
            }>
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.contentContainerStyle}
                    showsVerticalScrollIndicator={false}
                    bounces={false}>
                    <View style={styles.creatorContainer}>
                        <View style={styles.bodyTextInputArea}>
                            <HxfTextInput
                                style={styles.bodyTextInput}
                                placeholderTextColor={Theme.slateGray1}
                                onChangeText={changeBody}
                                multiline={true}
                                maxLength={100}
                                textAlignVertical="top"
                                placeholder="记录你此刻的生活，分享给有趣的人看..."
                            />
                            <View style={styles.textInputLimit}>
                                <Text style={styles.countInputText}>{`${formData.body.length}/100`}</Text>
                            </View>
                        </View>
                        <View style={{ marginRight: -pixel(10) }}>
                            <MediaUploader
                                onResponse={uploadResponse}
                                maxWidth={Device.WIDTH / 2}
                                style={styles.mediaItem}
                            />
                        </View>
                        <View style={styles.categoriesContainer}>
                            {categories.length < 3 && (
                                <TouchFeedback
                                    style={[styles.categoryShadow, styles.categoryItem]}
                                    onPress={() =>
                                        navigation.navigate('SelectCategory', { selectCategory, categories })
                                    }>
                                    <Text style={styles.categoryName}>#添加话题</Text>
                                </TouchFeedback>
                            )}
                            {addedCategories}
                        </View>
                        {/* {adStore.enableWallet && (
                            <HxfRadio
                                onChange={changeContentType}
                                radioText={
                                    <Text
                                        style={styles.radioText}
                                        onPress={() => navigation.navigate('CommonQuestion')}>
                                        {`▎悬赏问答`}{' '}
                                        <Iconfont name="bangzhu" size={pixel(16)} color={Theme.watermelon} />
                                    </Text>
                                }
                                mode="switch"
                            />
                        )} */}

                        <View style={[styles.goldsOption, contentType !== issueContentType && { display: 'none' }]}>
                            {GoldsOption.map((value, index) => {
                                const selected = value === gold;
                                let marginHorizontal = false;
                                if (index === 1 || index === 4) {
                                    marginHorizontal = true;
                                }
                                return (
                                    <TouchFeedback
                                        style={[styles.goldItem, selected && styles.selectedGold]}
                                        key={value}
                                        onPress={() => setGoldMiddleware(value)}>
                                        <Text style={[styles.goldText, selected && { color: Theme.watermelon }]}>
                                            {value}
                                            <Text style={{ fontSize: font(14) }}> {Config.goldAlias}</Text>
                                        </Text>
                                    </TouchFeedback>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </PageContainer>
    );
};

export default AskQuestionScreen;

const styles = StyleSheet.create({
    bodyTextInput: {
        height: pixel(120),
    },
    bodyTextInputArea: {},
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: pixel(Theme.itemSpace),
    },
    categoryItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: pixel(34),
        justifyContent: 'center',
        marginRight: pixel(10),
        marginTop: pixel(10),
    },
    categoryName: {
        color: Theme.primaryColor,
        fontSize: font(13),
    },
    categoryShadow: {
        backgroundColor: Theme.slateGray2,
        borderRadius: pixel(4),
        paddingHorizontal: pixel(12),
    },
    close: {
        height: pixel(30),
        justifyContent: 'center',
        paddingLeft: pixel(8),
        width: pixel(30),
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: contentGap,
    },
    contentContainerStyle: { flexGrow: 1, paddingBottom: Theme.HOME_INDICATOR_HEIGHT },
    countInputText: {
        color: Theme.slateGray1,
        fontSize: pixel(13),
    },
    creatorContainer: {
        backgroundColor: '#fff',
        borderRadius: pixel(3),
        paddingVertical: pixel(20),
    },
    disabledButton: {
        backgroundColor: '#f0f0f0',
    },
    mediaItem: { width: MediaItemWidth, height: MediaItemWidth, marginTop: pixel(10), marginRight: pixel(10) },
    goldItem: {
        alignItems: 'center',
        borderColor: Theme.borderColor,
        borderRadius: pixel(4),
        borderWidth: pixel(1),
        justifyContent: 'center',
        marginTop: pixel(Theme.itemSpace),
        marginRight: pixel(10),
        paddingVertical: pixel(Theme.itemSpace),
        width: MediaItemWidth,
    },
    goldItemMargin: {
        marginHorizontal: pixel(Theme.itemSpace),
    },
    goldText: {
        color: Theme.defaultTextColor,
        fontSize: pixel(16),
    },
    goldsOption: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -pixel(10),
    },
    publishButton: {
        backgroundColor: Theme.watermelon,
        borderRadius: pixel(15),
        height: pixel(30),
        justifyContent: 'center',
        paddingHorizontal: pixel(10),
    },
    publishText: {
        color: '#fff',
        fontSize: pixel(14),
        textAlign: 'center',
    },
    disabledPublishText: {
        color: Theme.subTextColor,
    },
    selectedGold: {
        backgroundColor: `rgba(255,94,125,0.1)`,
        borderColor: `rgba(255,94,125,0.5)`,
    },
    textInputLimit: {
        alignItems: 'flex-end',
    },
    radioText: {
        fontSize: font(15),
        color: Theme.watermelon,
    },
});
