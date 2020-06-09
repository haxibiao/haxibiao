import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button } from '@src/components';
import { useNavigation, useNavigationParam } from '@src/router';
import { useQuery, GQL, useApolloClient } from '@src/apollo';
import { observer } from '@src/store';

const CategoryItem = props => {
    const { category, isHot, selectedCategories, selectCategory } = props;
    const selected = selectedCategories && selectedCategories.id === category.id;
    const navigation = useNavigation();
    const onPress = useCallback(() => {
        selectCategory(category);
        navigation.goBack();
    }, [category]);
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.categoryItem}>
                <Text style={styles.categoryName}>#{category.name}</Text>
                {isHot && (
                    <View style={styles.hotMark}>
                        <Text style={styles.hotMarkText}>热</Text>
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const SelectCategoryScreen = props => {
    const client = useApolloClient();
    const selectCategory = useNavigationParam('selectCategory');
    const selectedCategories = useNavigationParam('categories');
    const [hotCategories, setHotCategories] = useState([]);
    const [latestCategories, setLatestCategories] = useState([]);
    const [promiseState, setPromiseState] = useState({ error: null, loading: true });
    // const [keyword, setKeyword] = useState();

    // const onChangeText = useCallback(inputKeyword => {
    //     setKeyword(inputKeyword);
    // }, []);

    const categoriesQuery = useCallback(() => {
        const hotCategoriesQuery = client.query({
            query: GQL.categoriesQuery,
            variables: { filter: 'hot' },
        });
        const latestCategoriesQuery = client.query({
            query: GQL.categoriesQuery,
            variables: { filter: 'other', count: 10},
        });
        Promise.all([hotCategoriesQuery, latestCategoriesQuery])
            .then(function (responses) {
                console.log('话题页面请求数据',responses);

                const hotCategoriesData = Helper.syncGetter('data.categories.data', responses[0]);
                const latestCategoriesData = Helper.syncGetter('data.categories.data', responses[1]);
                if (hotCategoriesData) {
                    setHotCategories(hotCategoriesData);
                }
                if (latestCategoriesData) {
                    setLatestCategories(latestCategoriesData);
                }
                setPromiseState({
                    error: null,
                    loading: false,
                });
            })
            .catch(function (error) {
                console.log('话题页面报错',error);
                
                setPromiseState({
                    loading: false,
                    error,
                });
            });
    }, [client, promiseState]);

    useEffect(() => {
        categoriesQuery();
    }, []);

    const renderHotCategories = useMemo(() => {
        return hotCategories.map(item => (
            <CategoryItem
                key={item.id}
                isHot={true}
                category={item}
                selectedCategories={selectedCategories}
                selectCategory={selectCategory}
            />
        ));
    }, [hotCategories, selectedCategories]);

    const renderLatestCategories = useMemo(() => {
        return latestCategories.map(item => (
            <CategoryItem
                key={item.id}
                category={item}
                selectedCategories={selectedCategories}
                selectCategory={selectCategory}
            />
        ));
    }, [latestCategories, selectedCategories]);
    return (
        <PageContainer title="选择话题" loading={promiseState.loading} error={promiseState.error}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <View style={styles.categorySection}>
                        <Text style={styles.categorySectionTitle}>热门话题</Text>
                        <View style={styles.categoryWrap}>{renderHotCategories}</View>
                    </View>
                    <View style={styles.categorySection}>
                        <Text style={styles.categorySectionTitle}>最新话题</Text>
                        <View style={styles.categoryWrap}>{renderLatestCategories}</View>
                    </View>
                </ScrollView>
            </View>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    categoryItem: {
        alignItems: 'center',
        backgroundColor: Theme.slateGray2,
        borderRadius: PxDp(4),
        flexDirection: 'row',
        height: PxDp(34),
        justifyContent: 'center',
        marginRight: PxDp(10),
        marginTop: PxDp(10),
        paddingHorizontal: PxDp(12),
    },
    categoryName: {
        color: Theme.secondaryTextColor,
        fontSize: Font(13),
    },
    categorySection: {
        marginTop: PxDp(Theme.itemSpace),
    },
    categorySectionTitle: {
        color: Theme.slateGray1,
        fontSize: Font(14),
        marginVertical: PxDp(10),
    },
    categoryWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    contentContainerStyle: {
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT,
        paddingHorizontal: PxDp(Theme.itemSpace),
    },
    hotMark: {
        alignItems: 'center',
        backgroundColor: Theme.watermelon,
        borderRadius: PxDp(4),
        height: PxDp(18),
        justifyContent: 'center',
        marginLeft: PxDp(10),
        width: PxDp(18),
    },
    hotMarkText: {
        color: '#fff',
        fontSize: Font(11),
    },
});

export default SelectCategoryScreen;
