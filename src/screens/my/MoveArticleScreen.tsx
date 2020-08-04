import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

import { Iconfont, Colors } from '~utils';
import { Screen, Header, WriteModal, SpinnerLoading } from '~components';

import { Query, Mutation, GQL } from '~apollo';
import store from '~store';

class MoveArticleScreen extends Component {
	constructor(props) {
		super(props);
		this.toggleCreateModal = this.toggleCreateModal.bind(this);
		this.article = props.navigation.getParam('article', {});
		const { collection = {} } = this.article;
		this.collectionName = '';
		this.state = {
			createModalVisible: false,
			selectCollection: collection.id,
		};
	}

	render() {
		let { navigation, user, moveArticle } = this.props;
		let { createModalVisible, selectCollection } = this.state;
		return (
			<Screen header={this.renderHeader()}>
				<View style={styles.container}>
					<Query query={GQL.userCollectionsQuery} variables={{ user_id: user.id }}>
						{({ loading, error, data, refetch }) => {
							if (error) {
								return <LoadingError reload={() => refetch()} />;
							}
							if (!(data && data.collections)) {
								return <SpinnerLoading />;
							}
							return data.collections.map((item, index) => {
								return (
									<Mutation mutation={GQL.moveArticleMutation} key={index}>
										{(moveArticle) => {
											return (
												<TouchableOpacity
													style={styles.collectionItem}
													onPress={() => {
														this.setState((prevState) => ({
															selectCollection: item.id,
														}));
														moveArticle({
															variables: {
																article_id: this.article.id,
																collection_id: item.id,
															},
														});
													}}>
													<Text>{item.name}</Text>
													{selectCollection == item.id ? (
														<Iconfont
															name="radio-check"
															size={22}
															color={Colors.themeColor}
														/>
													) : (
														<Iconfont
															name="radio-uncheck"
															size={22}
															color={Colors.themeColor}
														/>
													)}
												</TouchableOpacity>
											);
										}}
									</Mutation>
								);
							});
						}}
					</Query>
				</View>
				<Mutation mutation={GQL.createCollectionMutation}>
					{(createCollection) => {
						return (
							<WriteModal
								modalName="新建文集"
								placeholder={'文集名'}
								visible={createModalVisible}
								value={this.collectionName}
								handleVisible={this.toggleCreateModal}
								changeVaule={this.changeCollectionName.bind(this)}
								submit={() => {
									createCollection({
										variables: {
											name: this.collectionName,
										},
										refetchQueries: (addCollection) => [
											{
												query: GQL.userCollectionsQuery,
												variables: {
													user_id: user.id,
												},
											},
										],
									});
									this.toggleCreateModal();
								}}
							/>
						);
					}}
				</Mutation>
			</Screen>
		);
	}

	renderHeader = () => {
		return (
			<Header
				routeName="文集"
				rightComponent={
					<TouchableOpacity onPress={this.toggleCreateModal}>
						<Text
							style={{
								fontSize: 17,
								color: Colors.themeColor,
							}}>
							新建
						</Text>
					</TouchableOpacity>
				}
			/>
		);
	};

	changeCollectionName(val) {
		this.collectionName = val;
	}

	toggleCreateModal() {
		this.setState((prevState) => ({
			createModalVisible: !prevState.createModalVisible,
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.skinColor,
	},
	collectionItem: {
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.lightBorderColor,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default MoveArticleScreen;
