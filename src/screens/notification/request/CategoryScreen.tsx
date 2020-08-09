import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Colors } from '~/utils';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Header, CustomTabBar, Screen, ContentEnd, LoadingError, SpinnerLoading, BlankContent } from '~/components';
import NotificationItem from './NotificationItem';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Query, GQL } from '~/apollo';
import store from '~/store';

class CategoryScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keywords: '',
            fetchingMore: true,
        };
    }

    render() {
        let { fetchingMore } = this.state;
        let { user } = this.props;
        const navigation = useNavigation();
        const route = useRoute();
        let category = route.params?.category ?? {};
        return (
            <Screen header={<Header routeName={category.name} />}>
                <View style={styles.container}>
                    <ScrollableTabView renderTabBar={() => <CustomTabBar tabUnderlineWidth={40} />}>
                        <View style={styles.container} tabLabel="全部">
                            <Query
                                query={GQL.categoryPendingArticlesQuery}
                                variables={{ category_id: category.id, filter: 'ALL' }}>
                                {({ loading, error, data, refetch, fetchMore }) => {
                                    if (error) {
                                        return <LoadingError reload={() => refetch()} />;
                                    }
                                    if (!(data && data.category)) {
                                        return <SpinnerLoading />;
                                    }
                                    if (data.category.articles.length < 1) {
                                        return <BlankContent />;
                                    }
                                    return (
                                        <FlatList
                                            data={data.category.articles}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <NotificationItem article={item} navigation={navigation} />
                                            )}
                                            ListFooterComponent={() => {
                                                return <ContentEnd />;
                                            }}
                                        />
                                    );
                                }}
                            </Query>
                        </View>
                        <View style={styles.container} tabLabel="未处理">
                            {/*PEDING（pending） 后端参数单词错误**/}
                            <Query
                                query={GQL.categoryPendingArticlesQuery}
                                variables={{ category_id: category.id, filter: 'PEDING' }}>
                                {({ loading, error, data, refetch, fetchMore }) => {
                                    if (error) {
                                        return <LoadingError reload={() => refetch()} />;
                                    }
                                    if (!(data && data.category)) {
                                        return <SpinnerLoading />;
                                    }
                                    if (data.category.articles.length < 1) {
                                        return <BlankContent />;
                                    }
                                    return (
                                        <FlatList
                                            data={data.category.articles}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <NotificationItem article={item} navigation={navigation} />
                                            )}
                                            ListFooterComponent={() => {
                                                return <ContentEnd />;
                                            }}
                                        />
                                    );
                                }}
                            </Query>
                        </View>
                    </ScrollableTabView>
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.skinColor,
    },
});

export default CategoryScreen;
