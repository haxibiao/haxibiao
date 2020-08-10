import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import Config from '~/utils/config';
import DeviceInfo from 'react-native-device-info';
import NetInfo from '@react-native-community/netinfo';

export { GQL } from '~/gqls';
export { Query, Mutation, useMutation, useQuery, graphql, withApollo } from 'react-apollo';

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

let netInfo: any;

export function useClientBuilder(userToken: string) {
    const createClient = useCallback((token) => {
        return new ApolloClient({
            uri: Config.ServerRoot + '/gql',
            request: async (operation) => {
                if (!netInfo) {
                    netInfo = await NetInfo.fetch();
                }
                operation.setContext({
                    headers: {
                        token,
                        Authorization: token ? `Bearer ${token}` : '',
                        network: netInfo.type,
                        ...deviceHeaders,
                    },
                });
            },
            onError: ({ graphQLErrors, networkError, operation, forward }) => {
                if (graphQLErrors) {
                    graphQLErrors.map((error) => {
                        // gql error
                    });
                }
                if (networkError) {
                    // checkServer
                }
            },
            cache: new InMemoryCache(),
        });
    }, []);

    const [client, setClient] = useState(() => createClient(userToken));

    useEffect(() => {
        const client = createClient(userToken);
        client.token = userToken;
        setClient(client);
    }, [userToken]);

    return client;
}
