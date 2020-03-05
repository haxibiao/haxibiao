// import React, { Component } from "react";
// import { StyleSheet, View, TouchableOpacity, ScrollView, Image, FlatList, Text, Dimensions } from "react-native";
// import ScrollableTabView from "react-native-scrollable-tab-view";

// import Colors from "utils";
// import Config from "utils/Config";
// import { CustomScrollTabBar, ContentEnd, LoadingMore } from "components";
// import { Header, HeaderLeft } from "components";
// import {Screen} from "components";

// import { Query } from "react-apollo";
// import gql from "graphql-tag";
//  import store  from "store";
//

// let { width, height } = Dimensions.get("window");

// class HelpScreen extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			hot: [
// 				{ id: 1375, title: `${Config.AppDisplayName}签约作者申请指南` },
// 				{ id: 12574, title: "提现没有到账怎么办？" },
// 				{ id: 12580, title: "专题投稿须知" },
// 				{ id: 12579, title: "如果你上传图片失败了" },
// 				{ id: 12575, title: `对${Config.AppDisplayName}专题推荐作者的说明` },
// 				{ id: 12577, title: `${Config.AppDisplayName}社区管理规则` },
// 				{ id: 12572, title: "删除的文章如何找回,有回收站吗？" }
// 			],
// 			explain: [
// 				{ id: 12576, title: `什么是${Config.AppDisplayName}内容领域优质作者及相关细则` },
// 				{ id: 12578, title: "如何创建并玩转属于你自己的专题" }
// 			],
// 			account: [
// 				{ id: 12422, title: `${Config.AppDisplayName}用户协议` },
// 				{ id: 12423, title: "隐私声明" },
// 				{ id: 12573, title: `${Config.AppDisplayName}账号绑定解绑相关问题汇总` }
// 			]
// 		};
// 	}

// 	render() {
// 		let { hot, explain, account } = this.state;
// 		let { navigation } = this.props;
// 		return (
// 			<Screen>
// 				<View style={styles.container}>
//
// 					{
// 						// 隐藏功能
// 						// rightComponent={
// 						// 	<TouchableOpacity onPress={() => navigation.navigate("意见反馈")}>
// 						// 		<Text
// 						// 			style={{
// 						// 				fontSize: 16,
// 						// 				color: Colors.themeColor
// 						// 			}}
// 						// 		>
// 						// 			去反馈
// 						// 		</Text>
// 						// 	</TouchableOpacity>
// 						// }
// 					}
// 					<ScrollView style={styles.container}>
// 						<FlatList
// 							data={hot}
// 							keyExtractor={this._keyExtractor}
// 							renderItem={this._renderHelpItem}
// 							ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
// 							ListHeaderComponent={this._renderHeader("热门问题")}
// 						/>
// 						<FlatList
// 							data={explain}
// 							keyExtractor={this._keyExtractor}
// 							renderItem={this._renderHelpItem}
// 							ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
// 							ListHeaderComponent={this._renderHeader(`如何玩转${Config.AppDisplayName}`)}
// 						/>
// 						<FlatList
// 							data={account}
// 							keyExtractor={this._keyExtractor}
// 							renderItem={this._renderHelpItem}
// 							ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
// 							ListHeaderComponent={this._renderHeader(`${Config.AppDisplayName}账号问题`)}
// 						/>
// 						{
// 							// 隐藏功能
// 							// <View style={styles.feedBack}>
// 							// 	<Image
// 							// 		style={styles.image}
// 							// 		source={{
// 							// 			uri: "https://dongmeiwei.com/images/feedBack.png"
// 							// 		}}
// 							// 	/>
// 							// 	<View>
// 							// 		<Text
// 							// 			style={{
// 							// 				fontSize: 15,
// 							// 				color: Colors.tintFontColor,
// 							// 				textAlign: "center"
// 							// 			}}
// 							// 		>
// 							// 			没解决你的疑问？
// 							// 			<Text
// 							// 				style={{
// 							// 					marginLeft: 10,
// 							// 					color: Colors.linkColor
// 							// 				}}
// 							// 				onPress={() => navigation.navigate("意见反馈")}
// 							// 			>
// 							// 				去反馈~
// 							// 			</Text>
// 							// 		</Text>
// 							// 	</View>
// 							// </View>
// 						}
// 					</ScrollView>
// 				</View>
// 			</Screen>
// 		);
// 	}

// 	_keyExtractor = (item, index) => item.id.toString();

// 	_renderHeader(title) {
// 		return (
// 			<View style={[styles.classifyWrap, title == "热门问题" && { borderTopColor: "transparent" }]}>
// 				<View style={styles.classifyItem}>
// 					<Text style={styles.classifyText}>{title}</Text>
// 				</View>
// 			</View>
// 		);
// 	}

// 	_renderHelpItem = ({ item, index }) => {
// 		let { navigation } = this.props;
// 		return (
// 			<TouchableOpacity onPress={() => navigation.navigate("文章详情", { article: item })}>
// 				<View style={styles.HelpItem}>
// 					<Text style={styles.HelpText}>{item.title}</Text>
// 				</View>
// 			</TouchableOpacity>
// 		);
// 	};
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: Colors.skinColor
// 	},
// 	classifyWrap: {
// 		padding: 15,
// 		borderBottomWidth: 1,
// 		borderTopWidth: 1,
// 		borderColor: Colors.lightBorderColor
// 	},
// 	classifyItem: {
// 		paddingLeft: 10,
// 		borderLeftColor: Colors.themeColor,
// 		borderLeftWidth: 3
// 	},
// 	classifyText: {
// 		fontSize: 17,
// 		lineHeight: 20,
// 		color: Colors.primaryFontColor
// 	},
// 	HelpItem: {
// 		marginHorizontal: 15,
// 		paddingVertical: 10
// 	},
// 	itemSeparator: {
// 		marginHorizontal: 15,
// 		height: 1,
// 		backgroundColor: Colors.tintGray
// 	},
// 	HelpText: {
// 		fontSize: 16,
// 		lineHeight: 23,
// 		color: Colors.primaryFontColor
// 	},
// 	feedBack: {
// 		paddingTop: 30,
// 		paddingBottom: 40,
// 		alignItems: "center",
// 		backgroundColor: Colors.lightGray
// 	},
// 	image: {
// 		width: width / 6,
// 		height: width / 4,
// 		resizeMode: "contain"
// 	}
// });

// export default HelpScreen;
