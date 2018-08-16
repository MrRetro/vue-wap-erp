/**
 * User: retro.
 * Time: 2018/6/4
 */

import request from '../utils/request';
import {SYS_IP, CRM_IP} from '../config';

/**
 * 根据id获取合同订单列表
 * @param pageNum  页数
 * @param type     类型    enum (customers,agents)
 */
export const getOrderList = ({id, type}) => {
  let condition = {
    isPage: [false]
  };
  if (type === 'agents') {
    condition.brokerId = [id];
  } else if (type === 'clues') {
    condition.clueId = [id];
  } else {
    condition.customerId = [id];
  }
  condition.fastScreening = [-1];

  return request({
    url: `${CRM_IP}/wap/order/page`,
    method: 'POST',
    data: {
      select: ['status', 'orderNo', 'receiptsNo', 'orderContractStatus', 'carName', 'areaName', 'orderType', 'belongStoreId',
        'name', 'createTime', 'updateTime', 'deliveryTime', 'finishTime', 'principal'],
      condition
    }
  });
};


/**
 * 添加订单步骤一
 * @param name      姓名
 * @param mobile    手机
 * @param gender    性别
 * @param params    其他
 */
export const addOrderOne = ({name, mobile, gender, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customerfororder`,
    method: 'POST',
    data: {name, mobile, gender, ...params}
  });
};

/**
 * 覆盖订单用户
 * @param name
 * @param mobile
 * @param gender
 * @param params
 */
export const coverOrderUser = ({name, mobile, gender, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/customerfororder`,
    method: 'PUT',
    data: {name, mobile, gender, ...params}
  });
};

/**
 * 添加订单信息
 * @param address     订单地址
 * @param areaId      订单地区
 * @param gender      订单性别
 * @param industry    订单行业
 * @param level       订单等级
 * @param mobile      订单手机
 * @param name        订单姓名
 * @param nickname    订单昵称
 * @param origin      订单来源
 * @param remark      订单备注
 * @param type        订单类型
 * @param params      其他
 */
export const addOrderInfo = ({address, areaId, gender, industry, level, mobile, name, nickname, origin, remark, type, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/order`,
    method: 'POST',
    data: {address, areaId, gender, industry, level, mobile, name, nickname, origin, remark, type, ...params}
  });
};


/**
 * 获取编辑订单信息
 * @param id    订单id
 * @param type  操作类型 0:添加操作,1:修改操作
 */
export const getEditOrderInfo = (id, type = 1) => {
  return request({
    url: `${CRM_IP}/wap/order/operation`,
    method: 'POST',
    data: {id, type}
  });
};


/**
 * 编辑订单信息
 * @param orderId     订单id
 * @param address     订单地址
 * @param areaId      订单地区
 * @param gender      订单性别
 * @param industry    订单行业
 * @param level       订单等级
 * @param mobile      订单手机
 * @param name        订单姓名
 * @param nickname    订单昵称
 * @param origin      订单来源
 * @param remark      订单备注
 * @param type        订单类型
 * @param params      其他
 */
export const editOrderInfo = ({orderId, address, areaId, gender, industry, level, mobile, name, customerId, origin, remark, type, ...params}) => {
  return request({
    url: `${CRM_IP}/wap/order/${orderId}`,
    method: 'PUT',
    data: {address, areaId, gender, industry, level, mobile, name, customerId, origin, remark, type, ...params}
  });
};


/**
 * 转交订单
 * @param id                订单ID
 * @param responsibleId     负责人ID
 * @returns {AxiosPromise}
 */
export const transferOrder = ({id, responsibleId}) => {
  return request({
    url: `${CRM_IP}/wap/order/${id}/allocation`,
    method: 'PUT',
    data: {
      responsibleId
    }
  });
};


/**
 * 获取添加订单模版
 * @returns {AxiosPromise}
 */
export const getAddOrderModule = () => {
  return request({
    url: `${SYS_IP}/permissions/templateFields`,
    method: 'get',
    params: {
      frontUrl: '/wap/order'
    },
    cacheKey: 'getAddOrderModule'
  });
};


/**
 * 确认合同
 * @param orderId
 */
export const affirmOrder = (orderId) => {
  return request({
    url: `${CRM_IP}/wap/order/validateContract/${orderId}`,
    method: 'put'
  });
};


/**
 * 获取门店信息通过负责人Id
 * @param userId
 */
export const getStoresByUserId = (userId) => {
  return request({
    url: `${CRM_IP}/wap/order/${userId}/stores`,
    method: 'get',
    loading: false
  });
};
