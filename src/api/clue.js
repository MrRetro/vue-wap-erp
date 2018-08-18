/**
 * User: retro.
 * Time: 2018/6/4
 */

import request from '../utils/request';
import {SYS_IP, CRM_IP} from '../config';


/**
 * 添加用户信息
 * @param name      姓名
 * @param mobile    手机
 * @param gender    性别
 * @param params    其他
 * @param id
 * @param userId
 * @param isOverride
 * @return {*}
 */
export const addUserInfo = ({id, userId, name, mobile, gender, isOverride, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customers/add`,
    method: 'POST',
    data: {id, userId, name, mobile, gender, isOverride, ...params}
  });
};

/**
 * 快速编辑客户信息
 * @param id            客户id
 * @param name          客户名称
 * @param mobile        客户手机
 * @param gender        客户性别
 * @param isOverride    是否覆盖
 * @param params
 */
export const editUserInfo = ({id, name, mobile, gender, isOverride = true, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customers/${id}/override`,
    method: 'PUT',
    data: {name, mobile, gender, isOverride, ...params}
  });
};

/**
 * 覆盖用户
 * @param name
 * @param mobile
 * @param gender
 * @param params
 */
export const coverUser = ({name, mobile, gender, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customerforclue`,
    method: 'PUT',
    data: {name, mobile, gender, ...params}
  });
};

/**
 * 添加线索信息
 * @param address     线索地址
 * @param areaId      线索地区
 * @param gender      线索性别
 * @param industry    线索行业
 * @param level       线索等级
 * @param mobile      线索手机
 * @param name        线索姓名
 * @param nickname    线索昵称
 * @param origin      线索来源
 * @param remark      线索备注
 * @param type        线索类型
 * @param params      其他
 */
export const addClueInfo = ({address, belongPlaceId, gender, industry, level, mobile, name, nickname, origin, remark, type, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/clue`,
    method: 'POST',
    data: {address, belongPlaceId, gender, industry, level, mobile, name, nickname, origin, remark, type, ...params}
  });
};

/**
 * 编辑线索信息
 * @param address     线索地址
 * @param areaId      线索地区
 * @param gender      线索性别
 * @param industry    线索行业
 * @param level       线索等级
 * @param mobile      线索手机
 * @param name        线索姓名
 * @param nickname    线索昵称
 * @param origin      线索来源
 * @param remark      线索备注
 * @param type        线索类型
 * @param params      其他
 */
export const editClueInfo = ({id, address, areaId, gender, industry, level, mobile, name, origin, remark, type, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/clue/true`,
    method: 'PUT',
    data: {id, address, areaId, gender, industry, level, mobile, name, origin, remark, type, ...params}
  });
};

/**
 * 线索模块签约生成订单
 * @param clueId
 * @param orderNo
 * @param carPrice
 * @param certificateUrl
 * @param contractUrl
 * @param deposit
 * @param depositVoucherUrl
 * @param orderAmount
 * @param orderType
 * @param status
 * @param totalAmount
 * @param params
 */
export const clueToOrder = ({
  clueId,
  orderNo,
  carPrice,
  certificateUrl,
  contractUrl,
  deposit,
  depositVoucherUrl,
  orderAmount,
  orderType,
  status,
  totalAmount,
  ...params
}) => {
  return request({
    url: `${CRM_IP}/wap/order/addFromClue`,
    method: 'POST',
    data: {
      clueId,
      orderNo,
      carPrice,
      certificateUrl,
      contractUrl,
      deposit,
      depositVoucherUrl,
      orderAmount,
      orderType,
      status,
      totalAmount,
      ...params
    }
  });
};


/**
 * 获取线索编辑信息
 * @param id    线索id
 */
export const getClueEditInfo = (id) => {
  return request({
    url: `${CRM_IP}/wap/showclue/${id}`,
    method: 'GET',
    loading: false
  });
};


/**
 * 获取添加线索模版
 * @returns {AxiosPromise}
 */
export const getAddClueModule = () => {
  return request({
    url: `${SYS_IP}/permissions/templateFields`,
    method: 'GET',
    params: {
      frontUrl: '/wap/clue'
    },
    cacheKey: 'getAddClueModule'
  });
};


/**
 * 获取合同资料模版
 * @returns {AxiosPromise}
 */
export const getContactDataModule = () => {
  return request({
    url: `${SYS_IP}/permissions/templateFields`,
    method: 'GET',
    params: {
      frontUrl: '/wap/order/addFromClue'
    },
    cacheKey: 'getContactDataModule'
  });
};


/**
 * 获取线索列表
 * @returns {*}
 * @param customerId id
 * @param isAll    传是则不过滤无效线索等
 */
export const getListClue = (customerId, isAll = true) => {
  return request({
    url: `${CRM_IP}/wap/${isAll ? 'alllistclue' : 'listclue'}/${customerId}`,
    method: 'get'
  });
};

/**
 * 线索标记失效
 * @returns {AxiosPromise}
 */
export const markCluefailures = ({clueId, failureReason, failureRemark, failureType}) => {
  return request({
    url: `${CRM_IP}/wap/cluefailures`,
    method: 'PUT',
    data: {clueIds: [clueId], failureReason, failureRemark, failureType}
  });
};

/**
 *  获取经纪人标签 type:  'customer', 'agent':category: 'followUpPurpose', 'agentLabel', 'agentCategory'
 * @param category
 * @param type
 */
export const getAgentsLabel = ({type = 'customer', category = 'followUpPurpose'}) => {
  let url = `${SYS_IP}/dict/${type}/child/${category}/options`;
  return request({
    url,
    method: 'GET',
    cacheKey: url
  });
};
