/**
 * User: puti.
 * Time: 2018/6/11 下午4:12.
 */
import {RouteUtil} from '../../../utils/routeUtil';

export const config = {
  customers: {
    rightTitleParams: (vueInstance) => {
      if (!vueInstance.params.params.responsible || !vueInstance.$store.state.user.userAuths['wap-crm-customer-edit']) {
        return {};
      }
      return {
        text: '编辑',
        onSuccess: () => {
          RouteUtil.clientAdd({
            ...vueInstance.params,
            type: 'edit',
            onSuccess: () => {
              vueInstance.params.onSuccess && vueInstance.params.onSuccess();
              vueInstance.$router.go(-1);
            }
          });
        }
      };
    },
    transformData: (params) => {
      const {
        name, nickname, customerNo, mobile,
        gender, level, type, followUpStatus, industry, remark, origin
      } = params;
      return {
        data: [
          {title: '客户姓名', value: name},
          {title: '客户编号', value: customerNo},
          {title: '姓名备注', value: nickname},
          {title: '联系电话', value: mobile},
          {title: '客户性别', value: gender.name},
          {title: '客户来源', value: origin && origin.name},
          {title: '客户类型', value: type && type.name},
          {title: '客户状态', value: followUpStatus && followUpStatus.name},
          {title: '客户行业', value: industry},
          {title: '客户等级', value: level.code, type: 'rate'},
          // {title: '客户地址', value: area},
          {title: '备注信息', value: remark}
        ]
      };
    }
  },
  agents: {
    rightTitleParams: (vueInstance) => {
      if (!vueInstance.params.params.responsible || !vueInstance.$store.state.user.userAuths['wap-crm-agent-edit']) {
        return {};
      }
      return {
        text: '编辑',
        onSuccess: () => {
          RouteUtil.editInfo({
            ...vueInstance.params,
            onSuccess: () => {
              vueInstance.params.onSuccess && vueInstance.params.onSuccess();
              vueInstance.$router.go(-1);
            }
          });
        }
      };
    },
    transformData: (params) => {
      let {
        name, nickname, agentNo, mobile,
        gender, level, area, type, followUpStatus, category, label, remark, origin, giveUpReason
      } = params;
      return {
        data: [
          {title: '经纪人姓名', value: name},
          {title: '经纪人编号', value: agentNo},
          {title: '备注性名', value: nickname},
          {title: '联系电话', value: mobile},
          {title: '经纪人性别', value: gender && gender.name},
          {title: '经纪人等级', value: level && level.name},
          {title: '经纪人来源', value: origin && origin.name},
          {title: '经纪人类别', value: type && type.name},
          {title: '经纪人分类', value: category && category.name},
          {title: '经纪人类型', value: ''},
          {title: '经纪人标签', value: label && label.join('、')},
          {title: '经纪人状态', value: followUpStatus && followUpStatus.name},
          {title: '经纪人地址', value: area},
          {title: '备注信息', value: remark},
          {title: '放弃理由', value: giveUpReason}
        ]
      };
    }
  },
  clues: {
    rightTitleParams: (vueInstance) => {
      if (!vueInstance.params.params.responsibleId || !vueInstance.$store.state.user.userAuths['wap-crm-clue-edit']) {
        return {};
      }
      return {
        text: '编辑',
        onSuccess: () => {
          RouteUtil.clueEdit({
            id: vueInstance.id,
            onSuccess: () => {
              vueInstance.params.onSuccess && vueInstance.params.onSuccess();
              vueInstance.$router.go(-1);
            }
          });
        }
      };
    },
    transformData: (params) => {
      const {
        customerName, carName, customerMobile,
        customerGender, inColor, area, outColor, groundPromotionId, groundPromotionName, intentionGrade, customerId, remark, storeSimpleDTO, shoppingWay,
        brokerName, brokerId
      } = params;
      let otherData = [];
      if (groundPromotionId) {
        otherData.push({title: '关联地推', value: groundPromotionName});
      }
      if (brokerId) {
        otherData.push({
          title: '关联经纪人',
          value: brokerName,
          click: () => RouteUtil.commonDetail({id: brokerId, module: 'agents', type: 'all'})
        });
      }
      return {
        type: 'section',
        data: [{
          title: '客户信息',
          data: [
            {
              title: '客户姓名',
              value: customerName,
              click: () => RouteUtil.commonDetail({id: customerId, module: 'customers', type: 'all'})
            },
            {title: '客户性别', value: customerGender && customerGender.name},
            {title: '联系电话', value: customerMobile}
          ]
        },
        {
          title: '线索信息',
          data: [
            {title: '意向车型', value: carName},
            {title: '外观', value: outColor},
            {title: '内饰', value: inColor},
            {title: '意向等级', value: intentionGrade && intentionGrade.name},
            {title: '线索地区', value: area},
            {title: '地面店', value: storeSimpleDTO && storeSimpleDTO.storeName},
            {title: '备注信息', value: remark},
            {title: '购车方式', value: shoppingWay && shoppingWay.name}
          ]
        },
        {
          title: '其它信息',
          data: otherData
        }]
      };
    }
  },
  order: {
    rightTitleParams: () => ({
      // text: '编辑',
      // onSuccess: () => {
      //   RouteUtil.orderEdit({
      //     ...vueInstance.params,
      //     onSuccess: () => {
      //       vueInstance.params.onSuccess && vueInstance.params.onSuccess();
      //       vueInstance.$router.go(-1);
      //     }
      //   });
      // }
    }),
    transformData: (params) => {
      const {
        name, orderNo, mobile, outColor, inColor, carName, receiptsNo, orderType, clueNo, shoppingWay,
        followUpStatus, giveUpReason, createTime, updateTime, finishTime, customerId, clueId, groundStoreDTO
      } = params;
      let data = [
        {
          title: '客户姓名',
          value: name,
          click: () => RouteUtil.commonDetail({id: customerId, module: 'customers', type: 'all'})
        },
        {title: '客户电话', value: mobile},
        {title: '车型信息', value: carName},
        {title: '外观', value: outColor},
        {title: '内饰', value: inColor},
        {title: '合同编号', value: orderNo},
        {title: '单据编号', value: receiptsNo},
        {title: '订单类型', value: orderType && orderType.name},
        {
          title: '关联线索',
          value: clueNo,
          click: () => RouteUtil.commonDetail({id: clueId, module: 'clues', type: 'all'})
        },
        {title: '关联地推', value: groundStoreDTO && groundStoreDTO.storeName},
        {title: '购车方式', value: shoppingWay && shoppingWay.name},
        {title: '门店信息', value: followUpStatus && followUpStatus.name},
        {title: '订单生成时间', value: createTime},
        {title: '订单更新时间', value: updateTime},
        {title: '实际交车时间', value: giveUpReason},
        {title: '订单完成时间', value: finishTime}
      ].filter(({title, value}) => !((title === '关联线索' || title === '关联地推') && !(value)));
      return {
        data
      };
    }
  },
  enquiryPrices: {
    rightTitleParams: () => ({
      // text: '编辑',
      // onSuccess: () => {
      //   RouteUtil.orderEdit({
      //     ...vueInstance.params,
      //     onSuccess: () => {
      //       vueInstance.params.onSuccess && vueInstance.params.onSuccess();
      //       vueInstance.$router.go(-1);
      //     }
      //   });
      // }
    }),
    transformData: (params) => {
      const {
        customerName, customerMobile, customerGender, clueNo, customerId, vehicleModel, area, shoppingWay, clueCreateTime,
        appearance, interior, clueId, storeName, belongPlace, clueLevel, clueStatus, clueRemark, brokerId, brokerName, quotedTime, createTime, updateTime
      } = params;
      let data = [{
        title: '客户姓名',
        value: customerName,
        click: () => RouteUtil.commonDetail({id: customerId, module: 'customers', type: 'all'})
      },
      {title: '客户性别', value: customerGender && customerGender.name},
      {title: '客户电话', value: customerMobile},
      {title: '车型', value: vehicleModel},
      {title: '外观', value: appearance, type: 'color'},
      {title: '内饰', value: interior, type: 'color'},
      {
        title: '线索编号',
        value: clueNo,
        click: () => RouteUtil.commonDetail({id: clueId, module: 'clues', type: 'all'})
      },
      {title: '线索状态', value: clueStatus && clueStatus.name},
      {title: '意向等级', value: clueLevel && clueLevel.name},
      {title: '预计提车时间', value: area},
      {title: '购车方式', value: shoppingWay && shoppingWay.name},
      {title: '线索归属地', value: belongPlace},
      {title: '线索归属地面店', value: storeName}];
      if (brokerId) {
        data.push({
          title: '关联经纪人',
          value: brokerName,
          click: () => RouteUtil.commonDetail({id: brokerId, module: 'agents', type: 'all'})
        });
      }
      data.push(...[{title: '线索备注', value: clueRemark},
        {title: '线索创建时间', value: clueCreateTime},
        {title: '发起询价时间', value: createTime},
        {title: '提交报价时间', value: quotedTime},
        {title: '单据更新时间', value: updateTime}
      ]);
      return {
        data
      };
    }
  },
  quotedPrices: {
    rightTitleParams: () => ({
      // text: '编辑',
      // onSuccess: () => {
      //   RouteUtil.orderEdit({
      //     ...vueInstance.params,
      //     onSuccess: () => {
      //       vueInstance.params.onSuccess && vueInstance.params.onSuccess();
      //       vueInstance.$router.go(-1);
      //     }
      //   });
      // }
    }),
    transformData: (params) => {
      const {
        customerName, customerMobile, customerGender, clueNo, customerId, vehicleModel, area, shoppingWay, clueCreateTime,
        appearance, interior, clueId, storeName, belongPlace, clueLevel, clueStatus, clueRemark, brokerId, brokerName, quotedTime, createTime, updateTime
      } = params;
      let data = [{
        title: '客户姓名',
        value: customerName,
        click: () => RouteUtil.commonDetail({id: customerId, module: 'customers', type: 'all'})
      },
      {title: '客户性别', value: customerGender && customerGender.name},
      {title: '客户电话', value: customerMobile},
      {title: '车型', value: vehicleModel},
      {title: '外观', value: appearance, type: 'color'},
      {title: '内饰', value: interior, type: 'color'},
      {
        title: '线索编号',
        value: clueNo,
        click: () => RouteUtil.commonDetail({id: clueId, module: 'clues', type: 'all'})
      },
      {title: '线索状态', value: clueStatus && clueStatus.name},
      {title: '意向等级', value: clueLevel && clueLevel.name},
      {title: '预计提车时间', value: area},
      {title: '购车方式', value: shoppingWay && shoppingWay.name},
      {title: '线索归属地', value: belongPlace},
      {title: '线索归属地面店', value: storeName}];
      if (brokerId) {
        data.push({
          title: '关联经纪人',
          value: brokerName,
          click: () => RouteUtil.commonDetail({id: brokerId, module: 'agents', type: 'all'})
        });
      }
      data.push(...[{title: '线索备注', value: clueRemark},
        {title: '线索创建时间', value: clueCreateTime},
        {title: '发起询价时间', value: createTime},
        {title: '提交报价时间', value: quotedTime},
        {title: '单据更新时间', value: updateTime}
      ]);
      return {
        data
      };
    }
  }
};
