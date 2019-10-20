import createIconSet from './createIconSet';
import glyphMap from './iconfont.json';

const Iconfont = createIconSet(glyphMap, 'iconfont', require('./fonts/iconfont.ttf'));

export default Iconfont;

