import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { GQL, useQuery, useApolloClient } from '@src/apollo';
import { PageContainer, Iconfont, ItemSeparator, PopOverlay, ScrollTabBar, TouchFeedback } from '@src/components';

import CreateFeedback from './CreateFeedback';
import FeedbackHistory from './FeedbackHistory';

interface Props {
    navigation: any;
}
function Feedback(props: Props) {
    const { navigation } = props;

    return (
        <PageContainer
            autoKeyboardInsets={false}
            hiddenNavBar={true}
            contentViewStyle={{ marginTop: Theme.statusBarHeight }}>
            <ScrollableTabView
                renderTabBar={props => (
                    <ScrollTabBar {...props} tabUnderlineWidth={PxDp(50)} underLineColor={Theme.primaryColor} />
                )}>
                <CreateFeedback navigation={navigation} tabLabel="提交反馈" />
                <FeedbackHistory navigation={navigation} tabLabel="反馈记录" />
            </ScrollableTabView>
            <View style={styles.back}>
                <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
                    <Iconfont name="zuojiantou" color={Theme.defaultTextColor} size={PxDp(21)} />
                </TouchFeedback>
            </View>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    back: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Theme.NAVBAR_HEIGHT,
        height: Theme.NAVBAR_HEIGHT,
        justifyContent: 'center',
        paddingLeft: PxDp(Theme.itemSpace),
    },
});

export default Feedback;
