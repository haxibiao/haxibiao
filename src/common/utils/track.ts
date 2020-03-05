import { Platform } from 'react-native';
import { userStore } from '@src/store';

interface Props {
    callback?: Function;
    data: Object;
}

// 数据上报
export function track(props: Props) {
    const { callback } = props;
    const body = constructData(props);

    fetch(Config.ServerRoot + '/api/track/', {
        method: 'POST',
        body: body,
    })
        .then(response => response.json())
        .then(result => {
            callback && callback(result);
        })
        .catch(err => {
            callback && callback(err);
        });
}

function constructData(props: Props) {
    const { data } = props;
    const reportContent = {
        category: '事件分类',
        action: '事件名',
        value: '1',
        package: Config.PackageName,
        os: Platform.OS,
        version: Config.Version,
        build: Config.Build,
        name: userStore.me.name,
        user_id: userStore.me.id,
        referrer: Config.AppStore,
    };

    const mergeData = JSON.stringify({ ...reportContent, ...data });
    let body = new FormData();
    body.append('data', mergeData);
    return body;
}
