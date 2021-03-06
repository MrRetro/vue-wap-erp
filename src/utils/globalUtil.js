/**
 * User: puti.
 * Time: 2018/5/23 下午6:56.
 */
import {RouteUtil} from './routeUtil';
import {AlertUtil} from './AlertUtil';
import {images} from '../assets';


const GlobalPlugin = {};
GlobalPlugin.install = (Vue) => {
  Vue.prototype.$RouteUtil = RouteUtil;
  Vue.prototype.$AlertUtil = AlertUtil;
  Vue.prototype.$images = images;
  Vue.prototype.$testMsg = '我是一条测试消息';
};
export default GlobalPlugin;
