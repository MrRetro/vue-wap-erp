/**
 * User: retro.
 * Time: 2018/6/4
 */

import request from '../utils/request';
import {SYS_IP, CRM_IP} from '../config';

/**
 * 添加客户信息
 * @param address   客户地址
 * @param areaId    客户地区
 * @param gender    客户性别
 * @param industry  客户行业
 * @param level     客户等级
 * @param mobile    客户手机
 * @param name      客户姓名
 * @param nickname  客户昵称
 * @param origin    客户来源
 * @param remark    客户备注
 * @param type      客户备注
 * @param sub       其他
 * @returns {AxiosPromise}
 */
export const addCustomersInfo = ({address, areaId, gender, industry, level, mobile, name, nickname, origin, remark, type, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customers`,
    method: 'POST',
    data: {address, area: areaId, gender, industry, level, mobile, name, nickname, origin, remark, type, ...params}
  });
};


/**
 * 获取客户编辑信息
 * @param id    客户id
 */
export const getClientEditInfo = (id) => {
  return request({
    url: `${CRM_IP}/wap/customers/${id}/get`,
    method: 'GET'
  });
};

/**
 * 客户信息 (用于编辑)
 * @param id    客户id
 */
export const editClientInfo = ({id, address, area, gender, industry, level, mobile, name, origin, remark, type, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customers/${id}`,
    method: 'PUT',
    data: {address, area, gender, industry, level, mobile, name, origin, remark, type, ...params}
  });
};

/**
 * 获取添加客户模版
 * @returns {AxiosPromise}
 */
export const getAddClientModule = ()=>{
  return request({
    url: `${SYS_IP}/permissions/templateFields`,
    method: 'GET',
    params: {
      frontUrl: '/wap/customer'
    },
    cacheKey: 'getAddClientModule'
  });
};

/**
 * 获取用户上下级列表
 * @param id
 * @param type
 * @returns {*}
 */
export const getUserList = ({id, type = 'selfAndAllLower'})=>{
  return request({
    url: `${SYS_IP}/wap/users/relation/${id}/${type}`,
    method: 'GET',
    loading: false
  });
};

