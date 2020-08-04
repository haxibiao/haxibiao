import React, { Component, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { PageContainer, StatusView, UserItem } from '~components';
import { Query, GQL, useApolloClient } from '~apollo';

// import {userStore} from '~store';

export default (props: any) => {
	const client = useApolloClient();

	useEffect(() => {
		return () => {
			client.query({
				query: GQL.unreadsQuery,
				fetchPolicy: 'network-only',
			});

			console.log('out');
		};
	}, []);
	return (
		<PageContainer title="新的粉丝">
			<View style={styles.container}>
				<Query query={GQL.followersNotificationsQuery}>
					{({ loading, error, data, refetch, fetchMore }) => {
						if (loading) return null;
						const { notifications } = data;
						const items = Helper.syncGetter('data', notifications);
						if (items.length <= 0) return <StatusView.EmptyView />;
						return (
							<FlatList
								data={items}
								renderItem={({ item, index }) => <UserItem user={item.user} />}
								onEndReached={() => {
									let { hasMorePages, currentPage } = notifications.paginatorInfo;
									if (hasMorePages) {
										fetchMore({
											variables: {
												page: ++currentPage,
											},
											updateQuery: (prev, { fetchMoreResult }) => {
												if (fetchMoreResult && fetchMoreResult.notifications) {
													return Object.assign({}, prev, {
														notifications: Object.assign({}, prev.notifications, {
															paginatorInfo: fetchMoreResult.notifications.paginatorInfo,
															data: [
																...prev.notifications.data,
																...fetchMoreResult.notifications.data,
															],
														}),
													});
												}
											},
										});
									}
								}}
							/>
						);
					}}
				</Query>
			</View>
		</PageContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: Theme.skinColor || '#FFF',
		flex: 1,
	},
});
