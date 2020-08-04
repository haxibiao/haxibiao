/**
 * @format
 */

import './src/utils/global';

import { AppRegistry, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

LogBox.ignoreAllLogs(true);
import 'mobx-react/batchingForReactNative';

AppRegistry.registerComponent(appName, () => App);
