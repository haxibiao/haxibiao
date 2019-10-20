/**
 * @format
 */

import './src/common/global';
import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

YellowBox.ignoreWarnings([
    'Require cycle:',
    'Warning: componentWillUpdate',
    'Warning: componentWillMount',
    'Accessing view manager',
    'Warning: Expected instance props to match',
    'Warning: ViewPagerAndroid has been extracted from react-native core and will be removed in a future release.',
    'Warning: Slider has been extracted from react-native core and will be removed in a future release.',
    'Warning: Async Storage has been extracted from react-native core and will be removed in a future release.',
]);

AppRegistry.registerComponent(appName, () => App);
