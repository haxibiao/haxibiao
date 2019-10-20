import React, { Component, useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';

import {
    PostItem,
    PageContainer,
    listFooter,
    LoadingError,
    SpinnerLoading,
    StatusView,
    OperationModal,
} from '@src/components';

import { Query, GQL } from '@src/apollo';
import { userStore } from '@src/store';

const LikedArticlesScreen = (props: any) => {
    const { me } = userStore;
    const [modalVisible, setModalVisible] = useState(false);
    const { user = {} } = props.navigation.state.params;
    let is_self = false;
    if (user.id == me.id) {
        is_self = true;
    }

    function handleModal() {
        setModalVisible(!modalVisible);
    }

    return (
        <PageContainer title="我的喜欢">
            <View style={styles.container}>
                <Query query={GQL.userLikedArticlesQuery} variables={{ user_id: me.id }} fetchPolicy="network-only">
                    {({ loading, error, data, refetch, fetchMore }) => {
                        if (error) return <LoadingError reload={() => refetch()} />;
                        if (loading) return <SpinnerLoading />;
                        let {
                            data: items,
                            paginatorInfo: { currentPage, hasMorePages },
                        } = data.likes;
                        if (items.length < 1) return <StatusView.EmptyView />;

                        return (
                            <FlatList
                                data={items}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(item: any) => {
                                    let article = item.item.article;
                                    return <PostItem post={article} />;
                                }}
                                onEndReached={() => {
                                    if (hasMorePages) {
                                        fetchMore({
                                            variables: {
                                                page: ++currentPage,
                                            },
                                            updateQuery: (prev: any, { fetchMoreResult: more }) => {
                                                return {
                                                    likes: {
                                                        ...more.likes,
                                                        data: [...prev.likes.data, ...more.likes.data],
                                                    },
                                                };
                                            },
                                        });
                                    }
                                }}
                                ListFooterComponent={listFooter}
                            />
                        );
                    }}
                </Query>
                {is_self && (
                    <OperationModal
                        operation={['取消喜欢']}
                        visible={modalVisible}
                        handleVisible={handleModal}
                        handleOperation={(index: any) => {
                            handleModal();
                        }}
                    />
                )}
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default LikedArticlesScreen;
