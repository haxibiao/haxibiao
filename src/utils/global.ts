import { Device } from '!/theme';
import Theme from '!/theme';
import _ from 'lodash';
import config from './config';
import * as Helper from './helper';
import * as scale from './helper/scale';

const Global: any = global || window || {};

// 设备信息
Global.Device = Device;
// App主题
Global.Theme = Theme;
// 适配字体
Global.font = scale.font;
// 屏幕适配
Global.pixel = scale.pixel;
// 宽度适配
Global.percent = scale.percent;

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
