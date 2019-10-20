import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from "react-native";
import store from "store";

import { Colors, Iconfont, Config, navigationAction } from "utils";
import {
	Screen,
	Avatar,
	ContentEnd,
	LoadingMore,
	LoadingError,
	SpinnerLoading,
	BlankContent,
	TextContainer,
	SubComment,
	ContentType,
	Header
} from "components";
import { Query, GQL } from "apollo";

class ActionsScreen extends Component {
	constructor(props) {
		super(props);
		this.user = props.navigation.getParam("user", {});
		this.self = props.navigation.getParam("self", false);
		this.state = {
			fetchingMore: true
		};
	}

	render() {
		return (
			<Screen header={<Header routeName={this.self ? "我的动态" : "TA的动态"} />}>
				<View style={styles.container}>
					<Query query={GQL.} variables={{ user_id: this.user.id }}>
						{({ loading, error, data, refetch, fetchMore }) => {
							if (error) return <LoadingError reload={() => refetch()} />;
							if (!(data && data.actions)) return <SpinnerLoading />;
							if (data.actions.length < 1) return <BlankContent />;
							let actions = data.actions;
							return (
								<View style={styles.container}>
									<FlatList
										style={styles.activityWrap}
										data={actions}
										refreshing={loading}
										onRefresh={() => {
											fetch();
										}}
										keyExtractor={(item, index) => index.toString()}
										renderItem={this._renderItem}
										onEndReachedThreshold={0.3}
										onEndReached={() => {
											if (actions) {
												fetchMore({
													variables: {
														offset: actions.length
													},
													updateQuery: (prev, { fetchMoreResult }) => {
														if (!(fetchMoreResult && fetchMoreResult.actions && fetchMoreResult.actions.length > 0)) {
															this.setState({
																fetchingMore: false
															});
															return prev;
														}
														return Object.assign({}, prev, {
															actions: [...prev.actions, ...fetchMoreResult.actions]
														});
													}
												});
											} else {
												this.setState({
													fetchingMore: false
												});
											}
										}}
										ListHeaderComponent={this._renderListHeader}
										ListFooterComponent={() => {
											return (
												<View style={{ backgroundColor: "#fff", paddingBottom: 20 }}>
													{this.state.fetchingMore ? <LoadingMore /> : <ContentEnd />}
												</View>
											);
										}}
									/>
								</View>
							);
						}}
					</Query>
				</View>
			</Screen>
		);
	}

	_renderListHeader = () => {
		return (
			<View style={{ height: 20 }}>
				<View style={styles.activityTimeLine} />
			</View>
		);
	};

	_renderItem = ({ item, index }) => {
		let action = item;
		if (!this._activityFilter(action)) {
			return <View />;
		}
		return (
			<View style={[styles.activity, action.signUp && { paddingBottom: 0 }]}>
				{!action.signUp && <View style={styles.activityTimeLine} />}
				<View style={styles.activitySide}>
					<Avatar size={42} source={this.user.avatar} borderStyle={{ borderWidth: 0 }} />
					{this._activityMark(action.type)}
				</View>
				<View style={styles.activityBody}>
					<View style={styles.activityInfo}>
						<Text style={styles.typeText}>
							{this.user.name}
							{action.signUp ? (
								<Text>
									{" "}
									加入
									{Config.AppDisplayName}
								</Text>
							) : (
									this._activityType(action)
								)}
						</Text>
					</View>
					{action.postedComment && this._activityComment(action.postedComment)}
					<View style={{ marginTop: 15 }}>
						<Text style={styles.tintText}>{action.time_ago}</Text>
					</View>
				</View>
			</View>
		);
	};

	// 过滤activity,只渲染目标字段
	_activityFilter = action => {
		if (action.postedArticle || action.followed || action.tiped || action.postedComment || action.signUp) {
			return true;
		} else if (action.liked && action.liked.article) {
			return true;
		} else {
			return false;
		}
	};

	// 动态类型
	_activityType = action => {
		switch (action.type) {
			case "articles":
				if (action.postedArticle) {
					return (
						<Text>
							发布了
							<ContentType content={action.postedArticle} />
						</Text>
					);
				}
				break;
			case "comments":
				if (action.postedComment.article) {
					return (
						<Text>
							评论了
							<ContentType content={action.postedComment.article} />
						</Text>
					);
				}
				break;
			case "follows":
				{
					let followed = action.followed;
					if (followed.user) {
						let user = followed.user;
						return (
							<Text>
								{" " + "关注了用户" + " "}
								<Text style={styles.linkText} onPress={() => this.skipFollowed({ user })}>
									{user.name}
								</Text>
							</Text>
						);
					} else if (followed.category) {
						let category = followed.category;
						return (
							<Text>
								{" " + "关注了专题" + " "}
								<Text style={styles.linkText} onPress={() => this.skipFollowed({ category })}>
									{category.name}
								</Text>
							</Text>
						);
					}
					// else if (followed.collection) {
					// 	let collection = followed.collection;
					// 	return (
					// 		<Text>
					// 			{" " + "关注了文集" + " "}
					// 			<Text style={styles.linkText} onPress={() => this.skipFollowed({ collection })}>
					// 				{collection.name}
					// 			</Text>
					// 		</Text>
					// 	);
					// }
				}
				break;
			case "likes":
				if (action.liked.article) {
					return (
						<Text>
							喜欢了
							<ContentType content={action.liked.article} />
						</Text>
					);
				}
				break;
			case "tips":
				if (action.tiped.article) {
					return (
						<Text>
							赞赏了
							<ContentType content={action.tiped.article} />
						</Text>
					);
				}
				break;
		}
	};

	// 动态标注
	_activityMark = type => {
		switch (type) {
			case "articles":
				return (
					<View style={[styles.activityMark, { backgroundColor: Colors.themeColor }]}>
						<Iconfont name="collection" size={11} color="#fff" />
					</View>
				);
				break;
			case "comments":
				return (
					<View style={[styles.activityMark, { backgroundColor: Colors.weixinColor }]}>
						<Iconfont name="comment" size={11} color="#fff" />
					</View>
				);
				break;
			case "follows":
				return (
					<View style={[styles.activityMark, { backgroundColor: Colors.weixinColor }]}>
						<Iconfont name="star" size={11} color="#fff" />
					</View>
				);
				break;
			case "likes":
				return (
					<View style={[styles.activityMark, { backgroundColor: Colors.themeColor }]}>
						<Iconfont name="like" size={11} color="#fff" />
					</View>
				);
				break;
			case "tips":
				return (
					<View style={[styles.activityMark, { backgroundColor: Colors.qqzoneColor }]}>
						<Iconfont name="RMB" size={11} color="#fff" />
					</View>
				);
				break;
			default:
				return (
					<View style={[styles.activityMark, { backgroundColor: Colors.darkBorderColor }]}>
						<Iconfont name="more" size={11} color="#fff" />
					</View>
				);
		}
	};

	// 用户评论
	_activityComment = comment => {
		let { navigation } = this.props;
		return (
			<TouchableOpacity onPress={() => navigation.dispatch(navigationAction({ routeName: "评论详情", params: { comment } }))}>
				<TextContainer customStyle={{ marginTop: 5 }}>
					<SubComment numberOfLines={3} style={styles.tintText} body={comment.body} />
				</TextContainer>
			</TouchableOpacity>
		);
	};

	// 跳转screen
	skipContent = article => {
		let { navigation } = this.props;
		switch (article.type) {
			case "article":
				navigation.dispatch(navigationAction({ routeName: "文章详情", params: { article } }));
				break;
			case "video":
			case "post":
				navigation.dispatch(navigationAction({ routeName: "动态详情", params: { post: article } }));
				break;
		}
	};

	skipFollowed = followed => {
		let { navigation } = this.props;
		let { user = null, category = null, collection = null } = followed;
		if (user) {
			navigation.dispatch(navigationAction({ routeName: "User", params: { user } }));
		} else if (category) {
			navigation.dispatch(navigationAction({ routeName: "专题详情", params: { category } }));
		}
		// else if (collection) {
		// 	navigation.dispatch(navigationAction({ routeName: "文集详情", params: { collection } }));
		// }
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	activityWrap: {
		flex: 1
	},
	activityTimeLine: {
		position: "absolute",
		top: 0,
		left: 41,
		bottom: 0,
		width: 1,
		backgroundColor: Colors.darkGray
	},
	activity: {
		flexDirection: "row",
		paddingHorizontal: 20,
		paddingBottom: 40,
		borderBottomColor: Colors.lightBorderColor
	},
	activitySide: {
		position: "relative"
	},
	activityMark: {
		position: "absolute",
		right: -2,
		top: 25,
		width: 20,
		height: 20,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: "#fff",
		justifyContent: "center",
		alignItems: "center"
	},
	activityBody: {
		flex: 1,
		marginLeft: 10
	},
	activityInfo: {
		flex: 1
	},
	typeText: {
		fontSize: 17,
		lineHeight: 23,
		color: Colors.primaryFontColor
	},
	linkText: {
		color: Colors.linkColor,
		lineHeight: 20
	},
	tintText: {
		fontSize: 14,
		color: Colors.tintFontColor
	}
});

export default ActionsScreen;
