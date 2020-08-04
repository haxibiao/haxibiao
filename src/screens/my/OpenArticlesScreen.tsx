import React, { Component } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Screen, OperationModal, NoteItem, ListFooter, LoadingError, SpinnerLoading, BlankContent } from '~components';

import { Colors } from '~utils';
import { Mutation, Query, graphql, GQL } from '~apollo';
import store from '~store';

class OpenArticlesScreen extends Component {
	constructor(props) {
		super(props);
		this.handleModal = this.handleModal.bind(this);
		this.article = {};
		this.state = {
			modalVisible: false,
		};
	}

	render() {
		let { modalVisible } = this.state;
		const { navigation, unpublishArticle } = this.props;
		const { me: user } = store;
		return (
			<Screen>
				<View style={styles.container}>
					<Query
						query={GQL.userArticlesQuery}
						variables={{
							user_id: user.id,
						}}
						fetchPolicy="network-only">
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (loading) return <SpinnerLoading />;
							let {
								data: items,
								paginatorInfo: { hasMorePages, currentPage },
							} = data.articles;
							if (items.length < 1) {
								return <BlankContent />;
							}
							return (
								<View style={{ flex: 1 }}>
									<FlatList
										data={items}
										keyExtractor={(item, index) => index.toString()}
										refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
										renderItem={({ item, index }) => (
											<NoteItem
												post={item}
												compress
												longPress={() => {
													this.article = item;
													this.handleModal();
												}}
											/>
										)}
										onEndReachedThreshold={0.3}
										onEndReached={() => {
											if (hasMorePages) {
												fetchMore({
													variables: {
														page: ++currentPage,
													},
													updateQuery: (prev, { fetchMoreResult: more }) => {
														return {
															articles: {
																...more.articles,
																data: [...prev.articles.data, ...more.articles.data],
															},
														};
													},
												});
											}
										}}
										ListFooterComponent={ListFooter}
									/>
									<Mutation mutation={GQL.removeArticleMutation}>
										{(removeArticle) => {
											return (
												<OperationModal
													operation={
														this.article.type == 'post'
															? ['删除', '转为私密']
															: ['编辑', '删除', '投稿管理', '转为私密']
													}
													visible={modalVisible}
													handleVisible={this.handleModal}
													handleOperation={(index) => {
														this.handleModal();
														if (this.article.type == 'post') {
															switch (index) {
																case 0:
																	removeArticle({
																		variables: {
																			id: this.article.id,
																		},
																		refetchQueries: (result) => [
																			{
																				query: GQL.userArticlesQuery,
																				variables: {
																					user_id: user.id,
																				},
																			},
																		],
																	});
																	break;
																case 1:
																	unpublishArticle({
																		variables: {
																			id: this.article.id,
																		},
																		refetchQueries: (result) => [
																			{
																				query: GQL.userArticlesQuery,
																				variables: {
																					user_id: user.id,
																				},
																			},
																		],
																	});
																	break;
															}
														} else {
															switch (index) {
																case 0:
																	navigation.navigate('创作', {
																		article: this.article,
																	});
																	break;
																case 1:
																	removeArticle({
																		variables: {
																			id: this.article.id,
																		},
																		refetchQueries: (result) => [
																			{
																				query: GQL.userArticlesQuery,
																				variables: {
																					user_id: user.id,
																				},
																			},
																		],
																	});
																	break;
																case 2:
																	navigation.navigate('投稿管理', {
																		article: this.article,
																	});
																	break;
																case 3:
																	unpublishArticle({
																		variables: {
																			id: this.article.id,
																		},
																		refetchQueries: (result) => [
																			{
																				query: GQL.userArticlesQuery,
																				variables: {
																					user_id: user.id,
																				},
																			},
																		],
																	});
																	break;
															}
														}
													}}
												/>
											);
										}}
									</Mutation>
								</View>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}

	handleModal() {
		this.setState((prevState) => ({
			modalVisible: !prevState.modalVisible,
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor,
	},
});

export default graphql(GQL.unpublishArticleMutation, {
	name: 'unpublishArticle',
})(OpenArticlesScreen);
