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
import { useQuery } from 'src/apollo';

const douyiScreen = (props: any) => {
    const TAG = '测试';

    const [formData, setFormData] = useState('');

    const disablePublishButton = useMemo(() => {
        return !(formData && (formData || formData.length > 0));
    }, [formData]);

    const [contentType, setContentType] = useState(false);

    const changeBody = useCallback((value) => {
        setFormData(value);
    }, []);

    const changeContentType = useCallback((isIssue) => {
        if (isIssue) {
            setContentType(true);
        } else {
            setContentType(false);
        }
    }, []);

    return (
        <PageContainer
            leftView={
                <TouchFeedback onPress={() => props.navigation.goBack()}>
                    <Iconfont name="guanbi1" size={PxDp(22)} color={Theme.primaryAuxiliaryColor} />
                </TouchFeedback>
            }
            rightView={
                <TouchFeedback
                    disabled={disablePublishButton}
                    style={[styles.publishButton, disablePublishButton && styles.disabledButton]}
                    onPress={() => {
                        console.log(TAG, '1111');
                    }}>
                    <Text style={[styles.publishText, disablePublishButton && styles.disabledPublishText]}>
                        采集发布
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
                                <Text style={styles.countInputText}>{`${formData.length}/100`}</Text>
                            </View>
                        </View>

                        <HxfRadio
                            onChange={changeContentType}
                            radioText={
                                <Text
                                    style={styles.radioText}
                                    onPress={() => props.navigation.navigate('CommonQuestion')}>
                                    {`▎悬浮窗工具` + `  `}
                                    <Iconfont name="bangzhu" size={PxDp(16)} color={Theme.watermelon} />
                                </Text>
                            }
                            mode="switch"
                        />
                    </View>
                </ScrollView>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    bodyTextInput: {
        height: PxDp(120),
    },
    bodyTextInputArea: {
        marginBottom: PxDp(20),
    },
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
        fontSize: font(13),
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
        paddingHorizontal: PxDp(20),
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
        fontSize: font(15),
        color: Theme.watermelon,
    },
});

export default douyiScreen;
