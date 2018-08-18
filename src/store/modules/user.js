/**
 * User: puti.
 * Time: 2018/5/21 上午11:01.
 */
import * as LoginService from '../../api/login';
import {getUserList} from '../../api/client';
import {getToken, setToken, removeToken} from '../../utils/auth';
import {ddApi} from '../../api/dingding';
import {RUN_IN_DD} from '../../config';
import {getGroundStore, getProvice, getQiNiu} from '../../api/common';
import QiniuUtils from '../../utils/qiniuUtil';

const user = {
  namespaced: true,
  state: {
    config: {
      corpId: ''
    },
    token: getToken(),
    // 用户位置
    location: {
      latitude: 23.676,
      longitude: 119.676
    },
    // 权限管理
    userAuths: {},
    id: '',
    name: '',
    mobile: '',
    email: null,
    avatar: '',
    pinyin: '',
    dingUserId: '',
    // 部门
    departments: [],
    // 所在部门人员
    departmentUsers: [],
    // 计划日期
    datelist: [],
    // 主管级及以下列表
    users: [],
    // 省市区列表
    addressList: [],
    // 七牛token及普遍地址
    QINIU_TOKEN: '',
    QINIU_HOST: '',
    storeList: []
  },
  mutations: {
    setUserToken: (state, token) => {
      state.token = token;
      setToken(token);
      $eventBus.$emit('tokenChange');
    },
    setLocation: (state, location) => {
      state.location = location;
    },
    setStoreList: (state, list) => {
      state.storeList = list;
    },
    setUserInfo: (state, info) => {
      state.name = info.name;
      state.id = info.id;
      state.mobile = info.mobile;
      state.avatar = info.avatar;
      state.pinyin = info.pinyin;
      state.dingUserId = info.dingUserId;
      state.departments = info.departments;
    },
    changeConfig: (state, config) => {
      state.config = config;
    },
    getUsers: (state, users) => {
      state.users = users;
    },
    setDepartmentUsers: (state, users) => {
      state.departmentUsers = users;
    },
    getAddressList: (state, list) => {
      state.addressList = list;
    },
    planDateList: (state, list) => {
      state.datelist = list;
    },
    setUserAuths: (state, list) => {
      let auths = {};
      list.forEach(item => auths[item] = true);
      state.userAuths = auths;
    },
    getQiniuInfo: (state, info) => {
      state.QINIU_TOKEN = info.QINIU_TOKEN;
      state.QINIU_HOST = info.QINIU_HOST;
    }
  },
  getters: {
    // 是否是主管
    isLeader: state => {
      return state.departments.filter(item => item.isLeader).length !== 0;
    }
  },
  actions: {
    getDingDingUserInfo: ({dispatch, state}) => {
      return new Promise((resolve, reject) => {
        if (!RUN_IN_DD) {
          // TODO 待取消
          // resolve(dispatch('handleLogin', '0234106038775759'));
          resolve(dispatch('handleLogin', '181008074935191688'));
        } else if (!dd.version) {
          reject({code: -1, message: '获取钉钉用户信息失败,请在钉钉环境运行此项目'});
        }
        ddApi.getUserInfo({
          corpId: state.config.corpId,
          onSuccess: (info) => {
            resolve(dispatch('handleLogin', info.emplId));
          },
          onFail: (err) => {
            reject({message: '钉钉获取用户信息失败', error: err});
          }
        });
      });
    },
    /**
     * 调用自身登录获取token
     * @param commit
     * @param code    钉钉的id
     * @returns {Promise<*>}
     * @param dispatch
     */
    handleLogin: async ({commit, dispatch}, code) => {
      try {
        const result = await LoginService.getUserInfo(code);
        commit('setUserInfo', result);
        localStorage.setItem('userInfo', JSON.stringify(result));
        await dispatch('getToken', {mobile: result.mobile, password: result.dingUserId});
        return true;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getToken: async ({commit, dispatch}, {mobile, password}) => {
      try {
        const tokenData = await LoginService.getToken(mobile, password);
        commit('setUserToken', tokenData.data.access_token);
        await Promise.all([dispatch('getAllAuths'), dispatch('menu/syncMenuData', null, {root: true}), dispatch('getUsers'), dispatch('getAddressList')]);
        // dispatch('menu/syncMenuData', null, {root: true});
        // dispatch('getUsers');
        // dispatch('getAddressList');
        dispatch('getQiniuInfo');
        dispatch('getLocation');
        dispatch('getStoreList');
        return true;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登出
    handleLogout({commit}) {
      return new Promise((resolve) => {
        commit('setUserToken', '');
        commit('setUserRoles', []);
        removeToken();
        resolve();
      });
    },
    // 前端 登出
    clearUserToken({commit}) {
      return new Promise(resolve => {
        commit('setUserToken', '');
        removeToken();
        localStorage.removeItem('userInfo');
        resolve();
      });
    },
    /**
     * 获取当前位置
     * @param commit
     * @returns {Promise<any>}
     */
    getLocation({commit}) {
      return new Promise((resolve) => {
        ddApi.getLocation({
          onSuccess: ({longitude, latitude, accuracy, address, province, city, district, road, errorMessage, errorCode}) => {
            console.log('getLocation', accuracy, address, province, city, district, road, errorMessage, errorCode);
            commit('setLocation', {longitude, latitude});
            resolve();
          }
        });
      });
    },
    changeConfig({commit}, newUser) {
      setTimeout(() => commit('changeConfig', newUser), 1000);
    },
    async getUsers({commit, state}) {
      console.log(state.id, '===>用户id');
      const res = await getUserList({id: state.id});
      const allUsers = await getUserList({id: state.id, type: 'deptAndChildren'});
      commit('getUsers', res);
      commit('setDepartmentUsers', allUsers);
    },
    getAddressList({commit}) {
      getProvice()
        .then((res) => {
          let dataArea = res.map((item) => {
            return {
              text: item.name,
              value: item.code,
              children: item.childrenList && item.childrenList.map((city) => {
                return {
                  province: item.name,
                  text: city.name,
                  value: city.code,
                  children: city.childrenList && city.childrenList.map((area) => {
                    return {
                      city: city.name,
                      text: area.name,
                      value: area.code
                    };
                  })
                };
              })
            };
          });
          commit('getAddressList', dataArea);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPlanDateList({commit}, list) {
      setTimeout(() => commit('planDateList', list), 1000);
    },
    /**
     * 获取用户权限列表
     * @param commit
     * @param userId
     * @returns {*}
     */
    getAllAuths({commit, state}) {
      return LoginService.getAllAuths(state.id).then(res => {
        commit('setUserAuths', res);
      });
    },
    getStoreList({commit}) {
      return getGroundStore().then(res => {
        commit('setStoreList', res);
      });
    },
    getQiniuInfo({commit}) {
      getQiNiu()
        .then(res=>{
          if (res) {
            let info = {};
            console.log(res);

            let qiniu = {
              Bucket: res.bucket,
              AK: res.accessKey,
              SK: res.secretKey,
              HOST: res.realmName + res.path
            };

            info.QINIU_HOST = res.realmName;
            info.QINIU_TOKEN = QiniuUtils.genUploadToken('erp', qiniu);

            commit('getQiniuInfo', info);
          }
        })
        .catch(err=>console.log(err));
    }
  }
};

export default user;
