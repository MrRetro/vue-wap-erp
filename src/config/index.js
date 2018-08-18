/**
 * User: puti.
 * Time: 2018/5/18 上午10:43.
 */
import Vue from 'vue';
import './es5fix';
// 环境
// TODO 设置环境
const ENV = 'DEV';
// 是否运行在钉钉平台上
const RUN_IN_DD = false;
// 判断是不是开发环境
const DEV = ENV === 'DEV';
// const DEV = true;
// 判断是不是生产环境
const PROD = ENV === 'PROD';
// 判断是不是测试环境
const TEST = ENV === 'TEST';
const BAST_HOST = {
  // DEV: 'http://devzuul.erp.itsmycar.cn',
  DEV: 'http://192.168.10.200:7201',
  TEST: 'http://testzuul.erp.itsmycar.cn',
  // TEST: 'http://192.168.10.210:7201',
  PROD: 'https://api.erp.yiautos.com'
};
const HOST = {
  // 系统模块
  SYS_IP: {
    DEV: `${BAST_HOST.DEV}/zuul/authorize`,
    PROD: `${BAST_HOST.PROD}/zuul/authorize`,
    TEST: `${BAST_HOST.TEST}/zuul/authorize`
  },
  // CRM模块
  CRM_IP: {
    DEV: `${BAST_HOST.DEV}/zuul/crm`,
    PROD: `${BAST_HOST.PROD}/zuul/crm`,
    TEST: `${BAST_HOST.TEST}/zuul/crm`
  },
  // 车型模块
  CAR_IP: {
    DEV: `${BAST_HOST.DEV}/zuul/models`,
    PROD: `${BAST_HOST.PROD}/zuul/models`,
    TEST: `${BAST_HOST.TEST}/zuul/models`
  },
  CONFIG_URL: {
    DEV: 'http://dev.erp.itsmycar.cn/waperp/',
    PROD: 'http://wap.erp.yiautos.com/',
    TEST: 'http://test.erp.itsmycar.cn/waperp/'
  },
  BASE_IP: {
    DEV: `${BAST_HOST.DEV}/zuul/base`,
    PROD: `${BAST_HOST.PROD}/zuul/base`,
    TEST: `${BAST_HOST.TEST}/zuul/base`
  },
  AUTH_IP: {
    // DEV: 'http://devoauth.erp.itsmycar.cn/oauth/',
    DEV: 'http://192.168.10.200:7101/oauth',
    PROD: 'https://oauth.erp.yiautos.com/oauth/',
    TEST: 'http://testoauth.erp.itsmycar.cn/oauth/'
    // TEST: 'http://192.168.10.210:7101/oauth/'
  }
};

export const SHARE_URL = 'http://event.itsmycar.cn/erp-redirect/public/';

export const SYS_IP = HOST.SYS_IP[ENV];
export const CRM_IP = HOST.CRM_IP[ENV];
export const CAR_IP = HOST.CAR_IP[ENV];
export const CONFIG_URL = HOST.CONFIG_URL[ENV];
export const BASE_IP = HOST.BASE_IP[ENV];
export const AUTH_IP = HOST.AUTH_IP[ENV];
export const QINIU_HOST = 'http://p831g0sg5.bkt.clouddn.com/'; // 七牛图片访问路径前缀

// // 取消Vue所有的日志
Vue.config.silent = PROD;
// Vue.config.performance = DEV;
// // 正式环境关闭所有的日志
// if (PROD) {
//   window.console = {
//     info: () => {
//     },
//     log: () => {
//     },
//     warn: () => {
//     },
//     error: () => {
//     }
//   };
// }


export {
  DEV,
  PROD,
  HOST,
  TEST,
  RUN_IN_DD,
  ENV
};
