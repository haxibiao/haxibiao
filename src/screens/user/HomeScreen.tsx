import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Animated } from 'react-native';

import {
    PostItem,
    PageContainer,
    StatusView,
    SpinnerLoading,
    Footer,
    Placeholder,
    CustomRefreshControl,
    ItemSeparator,
    HxfButton,
} from '@src/components';
import { Query, useQuery, GQL } from '@src/apollo';
import { userStore, observer } from '@src/store';
import UserProfile from './components/UserProfile';

const HomeScreen = (props: any) => {
    const user = props.navigation.getParam('user', {});
    const { data: result } = useQuery(GQL.userQuery, {
        variables: { id: user.id },
    });
    const userData = Helper.syncGetter('user', result);

    const me = Helper.syncGetter('me', userStore);
    const isSelf = me.id === user.id;

    return (
        <Query query={GQL.userArticlesQuery} variables={{ user_id: user.id }} fetchPolicy="network-only">
            {({ loading, error, data, refetch, fetchMore }) => {
                const articles = Helper.syncGetter('articles.data', data);
                const hasMorePages = Helper.syncGetter('articles.paginatorInfo.hasMorePages', data);
                let currentPage = Helper.syncGetter('articles.paginatorInfo.currentPage', data);
                if (loading || !articles || !userData) return <SpinnerLoading />;
                return (
                    <PageContainer contentViewStyle={{ marginTop: 0 }} error={error}>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                contentContainerStyle={styles.contentContainer}
                                bounces={false}
                                ListHeaderComponent={() => <UserProfile user={userData} />}
                                data={articles}
                                refreshing={loading}
                                refreshControl={<CustomRefreshControl onRefresh={refetch} />}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                scrollEventThrottle={16}
                                renderItem={(item: any) => <PostItem post={item.item} />}
                                ItemSeparatorComponent={() => <ItemSeparator />}
                                ListEmptyComponent={
                                    <StatusView.EmptyView
                                        title="TA还没有作品"
                                        imageSource={require('@src/assets/images/default_empty.png')}
                                    />
                                }
                                onEndReached={() => {
                                    if (hasMorePages) {
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                                if (more && more.articles) {
                                                    return {
                                                        articles: {
                                                            ...more.articles,
                                                            data: [...prev.articles.data, ...more.articles.data],
                                                        },
                                                    };
                                                }
                                            },
                                        });
                                    }
                                }}
                                ListFooterComponent={() => (hasMorePages ? <Placeholder quantity={1} /> : null)}
                            />
                            {!isSelf && (
                                <HxfButton
                                    size="small"
                                    title="私信"
                                    plain={true}
                                    titleStyle={{
                                        color: '#FFF',
                                    }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 10,
                                        right: 50,
                                        left: 50,
                                        backgroundColor: '#53A1F7',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingVertical: 15,
                                        borderRadius: 50,
                                        overflow: 'hidden',
                                        borderWidth: 0,
                                    }}
                                    onPress={() => {
                                        props.navigation.navigate('Chat', {
                                            chat: {
                                                withUser: { ...user },
                                            },
                                        });
                                    }}
                                />
                            )}
                        </View>
                    </PageContainer>
                );
            }}
        </Query>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        backgroundColor: '#fff',
        flexGrow: 1,
    },
});

export default observer(HomeScreen);
