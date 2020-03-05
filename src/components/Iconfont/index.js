import createIconSet from './createIconSet';
import glyphMap from '@app/assets/iconfont.json';

const Iconfont = createIconSet(glyphMap, 'iconfont', require('../../../fonts/iconfont.ttf'));

export default Iconfont;

