import createIconSet from './createIconSet';
import glyphMap from '~assets/json/iconfont.json';

const Iconfont = createIconSet(glyphMap, 'iconfont', require('~assets/fonts/iconfont.ttf'));

export default Iconfont;
