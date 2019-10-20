import React, { useCallback, useEffect, useMemo } from 'react';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Config from '@src/common/config';
import DeviceInfo from 'react-native-device-info';

export { GQL } from './gqls';
export { Query, Mutation, compose, graphql, withApollo } from 'react-apollo';
export * from '@apollo/react-hooks';

interface DeviceReport {
    os: string;
    build: string;
    referrer: string;
    version: string;
    appid: string;
    package: string;
    brand: string;
    deviceCountry: string;
    systemVersion: string;
    uniqueId: string;
    deviceId: string;
    ip: string;
}
const deviceHeaders: DeviceReport = {};
deviceHeaders.os = Device.OS; // 操作系统
deviceHeaders.build = Config.Build; // 手动修改的build版本号
deviceHeaders.referrer = Config.AppStore; // 应用商店来源
deviceHeaders.version = Config.Version; // 手动修改的App版本号
deviceHeaders.appid = Config.PackageName; // 手动修改的包名
deviceHeaders.package = Config.PackageName; // 手动修改的包名

if (!DeviceInfo.isEmulator()) {
    deviceHeaders.brand = DeviceInfo.getBrand(); // 设备品牌
    deviceHeaders.deviceCountry = DeviceInfo.getDeviceCountry(); // 国家地区
    deviceHeaders.systemVersion = DeviceInfo.getSystemVersion(); // 系统版本
    deviceHeaders.uniqueId = DeviceInfo.getUniqueID(); // uniqueId
    deviceHeaders.deviceId = DeviceInfo.getUniqueID(); // uniqueId  兼容
}

export function useClientBuilder(token: string) {
    const createClient = useCallback(() => {
        return new ApolloClient({
            uri: Config.ServerRoot + '/gql',
            request: async operation => {
                operation.setContext({
                    headers: {
                        token,
                        Authorization: token ? `Bearer ${token}` : '',
                        ...deviceHeaders,
                    },
                });
            },
            onError: ({ graphQLErrors, networkError, operation, forward }) => {
                if (graphQLErrors) {
                    graphQLErrors.map(error => {
                        // gql error
                    });
                }
                if (networkError) {
                    // checkServer
                }
            },
            cache: new InMemoryCache(),
        });
    }, [token]);

    return useMemo(() => createClient(), [createClient]);
}
