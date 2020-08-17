import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, TextInput, ScrollView } from 'react-native';
import { PageContainer } from '~/components';
import { useNavigation } from '~/router';

const Report = () => {
    const navigation = useNavigation();
    const [type, settype] = useState(0);
    const data = [{ value: '辱骂攻击' }, { value: '垃圾广告' }, { value: '低俗色情' }, { value: '政治敏感' }];
    const submitError = () => {
        Toast.show({ content: '举报成功' });
        navigation.goBack();
    };
    const selcet = (index) => {
        settype(index);
    };

    return (
        <PageContainer
            white
            title="举报"
            rightView={
                <TouchableOpacity style={styles.saveButton} onPress={submitError}>
                    <Text style={styles.saveText}>提交</Text>
                </TouchableOpacity>
            }>
            <ScrollView style={styles.container} keyboardShouldPersistTaps={'always'}>
                <View style={styles.errorTypes}>
                    <View style={styles.radios}>
                        {data.map((item, index) => {
                            return (
                                <TouchableOpacity key={index} style={styles.row} onPress={() => selcet(index)}>
                                    {type == index ? (
                                        <Image
                                            source={require('!/assets/images/gou1.png')}
                                            resizeMode="contain"
                                            style={{ height: 13, width: 13, marginHorizontal: pixel(5) }}
                                        />
                                    ) : (
                                        <Image
                                            source={require('!/assets/images/gou2.png')}
                                            resizeMode="contain"
                                            style={{ height: 12, width: 12, marginHorizontal: pixel(5) }}
                                        />
                                    )}

                                    <Text style={styles.text}>{item.value}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
                <View style={styles.body}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'共同营造良好的社区环境！'}
                        multiline
                        underline
                        maxLength={140}
                        textAlignVertical={'top'}
                    />
                </View>
            </ScrollView>
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        flex: 1,
        justifyContent: 'center',
    },
    saveText: { fontSize: 15, textAlign: 'center', color: '#000' },
    errorTypes: {
        backgroundColor: '#fff',
    },
    type: {
        marginTop: 20,
        fontSize: 17,
        color: '#000',
    },
    radios: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingVertical: 10,
    },
    row: {
        paddingHorizontal: 20,
        width: 150,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    text: {
        fontSize: 15,
        paddingLeft: 20,
    },
    body: {
        flex: 1,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    textInput: {
        marginTop: 15,
        height: 150,
        fontSize: 15,
        padding: 15,
        justifyContent: 'flex-start',
    },
});

export default Report;
