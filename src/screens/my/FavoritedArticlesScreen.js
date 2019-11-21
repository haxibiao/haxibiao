import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import {
    OperationModal,
    listFooter,
    LoadingError,
    SpinnerLoading,
    StatusView,
    NoteItem,
    PageContainer,
} from '@src/components';

import { userStore } from '@src/store';
import { Mutation, Query, GQL } from '@src/apollo';

class FavoritedArticlesScreen extends Component {
    constructor(props) {
        super(props);
        this.handleModal = this.handleModal.bind(this);
        this.article = {};
        this.state = {
            modalVisible: false,
        };
    }

    render() {
        let { me } = userStore;
        let { modalVisible } = this.state;
        return (
            <PageContainer title="我的收藏">
                <View style={styles.container}>
                    <Query query={GQL.favoritedArticlesQuery} variables={{ user_id: me.id }} fetchPolicy="network-only">
                        {({ loading, error, data, refetch, fetchMore }) => {
                            if (error) return <LoadingError reload={() => refetch()} />;

                            if (loading) return <SpinnerLoading />;
                            let {
                                data: items,
                                paginatorInfo: { currentPage, hasMorePages },
                            } = data.favorites;
                            if (items.length < 1) {
                                return <StatusView.EmptyView />;
                            }
                            return (
                                <FlatList
                                    data={items}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <NoteItem
                                            post={item}
                                            longPress={() => {
                                                this.article = item;
                                                this.handleModal();
                                            }}
                                        />
                                    )}
                                    onEndReached={() => {
                                        if (hasMorePages) {
                                            fetchMore({
                                                variables: {
                                                    page: ++currentPage,
                                                },
                                                updateQuery: (prev, { fetchMoreResult: more }) => {
                                                    return {
                                                        favorites: {
                                                            ...more.data,
                                                            data: [...prev.favorites.data, ...more.favorites.data],
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
                    <Mutation mutation={GQL.favoriteArticleMutation}>
                        {favoriteArticle => {
                            return (
                                <OperationModal
                                    operation={['取消收藏']}
                                    visible={modalVisible}
                                    handleVisible={this.handleModal}
                                    handleOperation={index => {
                                        favoriteArticle({
                                            variables: {
                                                article_id: this.article.id,
                                            },
                                            refetchQueries: result => [{ query: GQL.favoritedArticlesQuery }],
                                        });
                                        this.handleModal();
                                    }}
                                />
                            );
                        }}
                    </Mutation>
                </View>
            </PageContainer>
        );
    }

    handleModal() {
        this.setState(prevState => ({
            modalVisible: !prevState.modalVisible,
        }));
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.skinColor,
    },
});

export default FavoritedArticlesScreen;
