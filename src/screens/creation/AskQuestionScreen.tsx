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
import { observer, userStore, appStore } from '~/store';
import { useNavigation } from '~/router';
import { GQL, useMutation } from '~/apollo';
import Video from 'react-native-video';
import { Overlay } from 'teaset';
import { useQuery } from '~/apollo';
import { observable } from 'mobx';

const GoldsOption = [30, 60, 120, 300, 600, 900];
const contentGap = PxDp(20);
const MediaItemWidth = (Device.WIDTH - PxDp(60)) / 3;
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
            Toast.show({
                content: error.message.replace('GraphQL error: ', '') || '发布失败',
            });
        },
        onCompleted: (mutationResult) => {
            Toast.show({
                content: '发布成功',
            });
            navigation.replace('PostDetail', {
                post: observable(mutationResult.createContent),
            });
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
                        <Iconfont name="guanbi1" size={PxDp(12)} color={Theme.primaryColor} />
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
                    <Iconfont name="guanbi1" size={PxDp(22)} color={Theme.primaryAuxiliaryColor} />
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
                        <View style={{ marginRight: -PxDp(10) }}>
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
                        {/* {appStore.enableWallet && (
                            <HxfRadio
                                onChange={changeContentType}
                                radioText={
                                    <Text
                                        style={styles.radioText}
                                        onPress={() => navigation.navigate('CommonQuestion')}>
                                        {`▎悬赏问答`}{' '}
                                        <Iconfont name="bangzhu" size={PxDp(16)} color={Theme.watermelon} />
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
                                            <Text style={{ fontSize: Font(14) }}> {Config.goldAlias}</Text>
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
        height: PxDp(120),
    },
    bodyTextInputArea: {},
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: PxDp(Theme.itemSpace),
    },
    categoryItem: {
        alignItems: 'center',
        flexDirection: 'row',
        height: PxDp(34),
        justifyContent: 'center',
        marginRight: PxDp(10),
        marginTop: PxDp(10),
    },
    categoryName: {
        color: Theme.primaryColor,
        fontSize: Font(13),
    },
    categoryShadow: {
        backgroundColor: Theme.slateGray2,
        borderRadius: PxDp(4),
        paddingHorizontal: PxDp(12),
    },
    close: {
        height: PxDp(30),
        justifyContent: 'center',
        paddingLeft: PxDp(8),
        width: PxDp(30),
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
        paddingHorizontal: contentGap,
    },
    contentContainerStyle: { flexGrow: 1, paddingBottom: Theme.HOME_INDICATOR_HEIGHT },
    countInputText: {
        color: Theme.slateGray1,
        fontSize: PxDp(13),
    },
    creatorContainer: {
        backgroundColor: '#fff',
        borderRadius: PxDp(3),
        paddingVertical: PxDp(20),
    },
    disabledButton: {
        backgroundColor: '#f0f0f0',
    },
    mediaItem: { width: MediaItemWidth, height: MediaItemWidth, marginTop: PxDp(10), marginRight: PxDp(10) },
    goldItem: {
        alignItems: 'center',
        borderColor: Theme.borderColor,
        borderRadius: PxDp(4),
        borderWidth: PxDp(1),
        justifyContent: 'center',
        marginTop: PxDp(Theme.itemSpace),
        marginRight: PxDp(10),
        paddingVertical: PxDp(Theme.itemSpace),
        width: MediaItemWidth,
    },
    goldItemMargin: {
        marginHorizontal: PxDp(Theme.itemSpace),
    },
    goldText: {
        color: Theme.defaultTextColor,
        fontSize: PxDp(16),
    },
    goldsOption: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -PxDp(10),
    },
    publishButton: {
        backgroundColor: Theme.watermelon,
        borderRadius: PxDp(15),
        height: PxDp(30),
        justifyContent: 'center',
        paddingHorizontal: PxDp(10),
    },
    publishText: {
        color: '#fff',
        fontSize: PxDp(14),
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
        fontSize: Font(15),
        color: Theme.watermelon,
    },
});
