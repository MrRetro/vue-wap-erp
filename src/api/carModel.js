/**
 * User: puti.
 * Time: 2018/5/29 上午10:47.
 */
import request from '../utils/request';
import {CAR_IP} from '../config';

/**
 * 获取所有品牌
 */
export const getBrandList = () => {
  return request({
    url: `${CAR_IP}/brand/putaway_list`,
    method: 'post',
    loading: false,
    cacheKey: 'getBrandList'
  });
};
/**
 * 根据品牌获取厂商
 */
export const getFirmList = (brandId = '4028817763951897016395190af30000') => {
  let url = `${CAR_IP}/firm/list/${brandId}`;
  return request({
    url,
    method: 'post',
    cacheKey: url
  });
};

/**
 * 获取搜索结果
 */
export const getSearchList = (page, text) => {
  return request({
    url: `${CAR_IP}/models/putaway_list/page`,
    method: 'post',
    data: {
      condition: {name: [text]},
      pageNum: page,
      pageSize: 10
    }
  });
};

/**
 * 根据厂商获取车系列表
 */
export const getSeriesList = (seriesId = '402881776395d108016395d175790001') => {
  let url = `${CAR_IP}/series/list/${seriesId}`;
  return request({
    url,
    method: 'post',
    cacheKey: url
  });
};


/**
 * 根据车系获取车型列表
 */
export const getModelList = (seriesId = '40288177639622790163962360400000') => {
  return request({
    url: `${CAR_IP}/models/list/${seriesId}`,
    method: 'post',
    loading: false
  });
};


/**
 * 根据车系获取车型列表
 */
export const getModelDetail = (modelId = '4028817763cfb62b0163d3870a990003') => {
  let url = `${CAR_IP}/wechat/models/${modelId}`;
  return request({
    url,
    method: 'get',
    cacheKey: url,
    loading: false
  });
};
