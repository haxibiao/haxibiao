import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { OperationModal, NoteItem, ListFooter, LoadingError, SpinnerLoading, BlankContent, Screen } from '~components';

import { Query, graphql, compose, GQL } from '~apollo';
import { Colors } from '~utils';
import store from '~store';
import user from '../../store/user';
class DraftsScreen extends Component {
	constructor(props) {
		super(props);
		this.handleModal = this.handleModal.bind(this);
		this.state = {
			modalVisible: false,
		};
	}

	render() {
		let { modalVisible } = this.state;
		let { navigation } = this.props;
		let { me: user } = store;
		return (
			<Screen>
				<View style={styles.container}>
					<Query query={GQL.draftsQuery} variables={{ user_id: user.id }} fetchPolicy="network-only">
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
								<FlatList
									data={items}
									refreshing={loading}
									onRefresh={() => {
										refetch();
									}}
									keyExtractor={(item, index) => index.toString()}
									renderItem={({ item, index }) => (
										<NoteItem
											post={item}
											compress
											popoverMenu
											longPress={() => {
												this.article = item;
												this.handleModal();
											}}
											options={['编辑', '删除', '公开发布']}
											popoverHandler={(index) => {
												this.article = item;
												this.operationHandler(index);
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
							);
						}}
					</Query>
				</View>
				<OperationModal
					operation={['编辑', '删除', '公开发布']}
					visible={modalVisible}
					handleVisible={this.handleModal}
					handleOperation={(index) => {
						this.operationHandler(index);
						this.handleModal();
					}}
				/>
			</Screen>
		);
	}

	handleModal() {
		this.setState((prevState) => ({
			modalVisible: !prevState.modalVisible,
		}));
	}

	operationHandler = (index) => {
		let { navigation, publishArticle, removeArticle } = this.props;
		switch (index) {
			case 0:
				navigation.navigate('创作', { article: this.article });
				break;
			case 1:
				removeArticle({
					variables: {
						id: this.article.id,
					},
					refetchQueries: (result) => [
						{
							query: GQL.draftsQuery,
						},
						{
							query: GQL.userTrashQuery,
						},
					],
				});
				break;
			case 2:
				publishArticle({
					variables: {
						id: this.article.id,
					},
					refetchQueries: (result) => [
						{
							query: GQL.draftsQuery,
						},
					],
				});
				break;
		}
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor,
	},
	draftsItem: {
		height: 90,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		justifyContent: 'center',
	},
	timeAgo: {
		fontSize: 13,
		color: Colors.lightFontColor,
		marginBottom: 4,
	},
	title: {
		fontSize: 17,
		color: Colors.primaryFontColor,
		lineHeight: 22,
	},
});

export default compose(
	graphql(GQL.removeArticleMutation, { name: 'removeArticle' }),
	graphql(GQL.publishArticleMutation, { name: 'publishArticle' }),
)(DraftsScreen);
