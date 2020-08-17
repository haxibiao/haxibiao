import { Device } from '!/theme';
import Theme from '!/theme';
import _ from 'lodash';
import config from './config';
import * as Helper from './helper';

const Global: any = global || window || {};

// 设备信息
Global.Device = Device;
// App主题
Global.Theme = Theme;
// 适配字体
Global.font = Helper.font;
// 屏幕适配
Global.PxDp = Helper.PxDp;
// helper
Global.Helper = Helper;
// App配置
Global.Config = config;
// 用户token
Global.TOKEN = null;
// lodash
Global.__ = _;
// toast
Global.Toast = () => null;
