/**
 * User: puti.
 * Time: 2018/6/11 下午4:12.
 */
import Numeral from 'numeral';
import {ddApi} from '../../../api/dingding';
import {RouteUtil} from '../../../utils/routeUtil';
import {AlertUtil} from '../../../utils/AlertUtil';
import {giveUpAgent} from '../../../api/agent';
import {transformColorName, handleDateString, getDistance} from '../../../utils/commonUtil';
import {images} from '../../../assets';
import {cancelFollowUpPlan, delayFollowUpPlan} from '../../../api/followUpPlan';
import {cancelEnquiryPrice} from '../../../api/inquiry';
import {SHARE_URL, ENV} from '../../../config';

const getDistanceStr = (location, data) => {
  if (!data.latitude) return '无';
  const l = getDistance(location.latitude, location.longitude, data.latitude, data.longitude);
  if (l / 1000 > 1) {
    return `${(l / 1000).toFixed(2)}km`;
  }
  return `${l}m`;
};
/**
 * 获取头部显示的状态字符串
 * @param time
 * @param responsible
 * @returns {*}
 */
const getStatusTime = (time, responsible) => {
  if (!responsible) return null;
  if (!time) return '暂无跟进计划';
  if (time.split(' ')[0] === new Date().format('yyyy-MM-dd')) return '今日需跟进';
  if (new Date(time.replace(/-/g, '/')).getTime() <= new Date().getTime()) return `已逾期!原定跟进时间:${time.split(' ')[0]}`;
  return `下次跟进时间 ：${time.split(' ')[0]}`;
};

const share = ({title = '宜买车ERP', content = '分享了一个链接', module, type, id} = {}) => {
  ddApi.share({
    title,
    content,
    url: `${SHARE_URL}?module=${module}&type=${type}&id=${id}$env=${ENV.toLocaleLowerCase()}`,
    onSuccess: () => {

    }
  });
};

/**
 * 获取线索是否可编辑
 * @param code
 * @returns {boolean}
 */
const getClueEditAble = (code) => {
  // 线索不为已战败,已签约，已失效
  return code !== 6 && code !== 4 && code !== 5;
};


/**
 * 获取正确的配置项
 * @param module  一级条件
 * @param type    二级条件
 * @param tag     需要获取的字段
 * @returns {*}
 */
export const getCorrectParams = (module, type, tag) => {
  return (config[module][type] && config[module][type][tag]) || (config[module][tag] || config[tag]);
};

/**
 * 转化detail数据的方法
 * @param module   模块
 * @param type     类型
 * @param instance vue实例
 * @param data     网络获取数据的
 * @returns {{nameData: *, updateTime: *, nextData: *, bottomButtons: *, infoData: *, personData: *, tabConfig: *, rightParams: *}}
 */
export const transformData = ({module, type, instance, data}) => {
  return {
    ...data,
    nameData: getCorrectParams(module, type, 'getNameData')({data}),
    hintShowText: getCorrectParams(module, type, 'getHintShowText')({data}),
    listRowData: getCorrectParams(module, type, 'getListRowData')({data, instance}),
    bottomButtons: getCorrectParams(module, type, 'getBottomButtons')({instance, data}),
    infoData: getCorrectParams(module, type, 'getInfoData')({data, instance}),
    personData: getCorrectParams(module, type, 'getPersonData')({data}),
    tabConfig: getCorrectParams(module, type, 'getTabConfig')({instance, data}),
    rightParams: getCorrectParams(module, type, 'getRightParams')({instance, data}),
    ...getCorrectParams(module, type, 'getOtherParams')({data})
  };
};

export const config = {
  getTabConfig: () => [{title: '跟进记录', tab: 'FollowUpTab'},
    {title: '报价记录', tab: 'OfferTab'},
    {title: '变更记录', tab: 'ChangeTab'}],
  getOtherParams: () => ({}),
  getBottomButtons: ({instance}) => [{
    title: '跟进',
    icon: images.base.ic_followup,
    click: () => RouteUtil.commonFollowUp({
      id: instance.id,
      module: instance.module,
      targetId: instance.id,
      targetName: instance.nameData.name,
      onSuccess: () => {
        instance.tabFetchData('FollowUpTab');
        instance.fetchData();
      }
    })
  }, {
    title: '询价',
    icon: images.all.ico_money,
    click: () => RouteUtil.commonInquiry({
      id: instance.id,
      module: instance.module,
      params: instance.allData,
      type: 'add',
      onSuccess: () => {
        instance.tabFetchData('OfferTab');
      }
    })
  }],
  getNameData: ({data}) => ({
    name: data.name,
    remark: data.nickname,
    follow: data.hasFollow,
    showFollow: !!data.responsible
  }),
  getListRowData: ({data, instance}) => ([{
    title: '购车线索',
    click: () => RouteUtil.clueList({module: instance.module, id: instance.id, isAll: true}),
    count: data.clueCount,
    icon: images.all.ico_line
  }, {
    title: '合同订单',
    click: () => RouteUtil.orderList({module: instance.module, id: instance.id}),
    count: data.orderCount,
    icon: images.all.ico_order
  }]),
  getHintShowText: ({data}) => getStatusTime(data.nextFollowUpTime, data.responsible),
  getPersonData: ({data}) => ({
    name: '负责人',
    edit: true,
    subname: '协同人',
    master: {...data.responsible, ico: data.responsible && data.responsible.avatar},
    pater: data.teamwork ? data.teamwork.map(item => ({...item, ico: item.avatar})) : []
  }),
  customers: {
    title: '客户详情',
    getRightParams: ({instance, data}) => ({
      text: '...',
      onSuccess: () => {
        let items = [];
        if (data.responsible) {
          items = [
            {id: '1', text: '编辑信息', auth: 'wap-crm-customer-edit'},
            {id: '2', text: '分享客户'}
          ];
        } else {
          items = [
            // {id: '1', text: '编辑信息'},
            {id: '2', text: '分享客户'}
          ];
        }
        ddApi.setPopMenu({
          items,
          onSuccess: ({id}) => {
            switch (id) {
              case '1':
                if (!instance.hasAuth) {
                  AlertUtil.showToast({txt: '只有负责人、协同人或者主管才能操作'});
                  return;
                }
                RouteUtil.clientAdd({
                  id: instance.id,
                  type: 'edit',
                  params: instance.data,
                  onSuccess: () => {
                    instance.fetchData();
                    instance.tabFetchData('ChangeTab');
                  }
                });
                break;
              case '2':
                share({module: instance.module, type: instance.type, id: instance.id});
                break;
              default:
                break;
            }
          }
        });
      }
    }),
    getInfoData: ({data}) => [
      {title: '编号', value: data.customerNo, type: 'copy'},
      {title: '性别', value: data.gender && data.gender.name},
      {title: '状态', value: data.followUpStatus && data.followUpStatus.name},
      {title: '等级', value: data.level ? data.level.code : 0, type: 'star'},
      {title: '电话', value: data.mobile, type: 'mobile'}
    ],
    getBottomButtons: ({instance, data}) => {
      if (data.responsible) {
        return [{
          title: '跟进',
          icon: images.base.ic_followup,
          click: () => RouteUtil.commonFollowUp({
            id: instance.id,
            module: instance.module,
            targetId: instance.id,
            targetName: instance.allData.nameData.name,
            onSuccess: () => {
              instance.fetchData();
              instance.tabFetchData('FollowUpTab');
            }
          })
        }, {
          title: '询价',
          icon: images.all.ico_money,
          click: () => RouteUtil.commonInquiry({
            id: instance.id,
            module: instance.module,
            params: instance.allData,
            type: 'add',
            onSuccess: () => {
              instance.tabFetchData('OfferTab');
            }
          })
        }];
      }
      if (instance.isLeader) {
        return [{
          title: '分配',
          icon: images.all.ic_person,
          click: () => instance.allocationPerson()
        }, {
          title: '捞取',
          icon: images.all.ic_add,
          click: () => instance.obtainPerson()
        }];
      }
      return [{
        title: '捞取',
        icon: images.all.ic_add,
        click: () => instance.obtainPerson()
      }];
    }
  },
  agents: {
    title: '经纪人详情',
    getInfoData: ({data, instance}) => [
      {title: '编号', value: data.agentNo, type: 'copy'},
      {title: '性别', value: data.gender && data.gender.name},
      {title: '距离', value: getDistanceStr(instance.$store.state.user.location, data), type: 'distance'},
      {title: '等级', value: data.level && data.level.code},
      {title: '电话', value: data.mobile, type: 'mobile'},
      {
        title: '状态',
        value: data.followUpStatus && data.followUpStatus.name,
        type: data.giveUpReason ? 'cancel' : '',
        message: '经纪人已放弃',
        hint: `放弃理由:${data.giveUpReason}`
      }
    ],
    getRightParams: ({instance, data}) => ({
      text: '...',
      onSuccess: () => {
        let items = [];
        if (data.responsible) {
          items = [
            {id: '1', text: '编辑信息', auth: 'wap-crm-agent-edit'},
            {id: '2', text: '放弃经纪人'},
            {id: '3', text: '分享经纪人'}
          ];
        } else {
          items = [
            // {id: '1', text: '编辑信息'},
            // {id: '2', text: '放弃经纪人'},
            {id: '3', text: '分享经纪人'}
          ];
        }
        ddApi.setPopMenu({
          items,
          onSuccess: ({id}) => {
            switch (id) {
              case '1':
                if (!instance.hasAuth) {
                  AlertUtil.showToast({txt: '只有负责人、协同人或者主管才能操作'});
                  return;
                }
                RouteUtil.editInfo({
                  id: instance.id,
                  onSuccess: () => {
                    instance.fetchData();
                    instance.tabFetchData('ChangeTab');
                  }
                });
                break;
              case '2':
                if (!instance.hasAuth) {
                  AlertUtil.showToast({txt: '只有负责人、协同人或者主管才能操作'});
                  return;
                }
                AlertUtil.showInputPop({
                  title: '放弃经纪人',
                  placeholder: '请输入放弃理由…',
                  onSuccess: async (text, hide) => {
                    if (text) {
                      hide();
                      await giveUpAgent({id: instance.id, reason: text});
                      AlertUtil.showToast({txt: '放弃成功', type: 'success'});
                      instance.fetchData();
                      instance.tabFetchData('ChangeTab');
                    } else {
                      AlertUtil.showToast({txt: '请输入无效理由'});
                    }
                  }
                });
                break;
              case '3':
                share({module: instance.module, type: instance.type, id: instance.id});
                break;
              default:
                break;
            }
          }
        });
      }
    }),

    getBottomButtons: ({instance, data}) => {
      if (data.responsible) {
        return [{
          title: '跟进',
          flex: 1,
          icon: images.base.ic_followup_white,
          click: () => RouteUtil.commonFollowUp({
            id: instance.id,
            module: instance.module,
            targetId: instance.id,
            targetName: instance.allData.nameData.name,
            onSuccess: () => {
              instance.fetchData();
              instance.tabFetchData('FollowUpTab');
            }
          })
        }];
      }
      if (instance.isLeader) {
        return [{
          title: '分配',
          icon: images.all.ic_person,
          click: () => instance.allocationPerson()
        }];
      }
      return [];
    },
    getTabConfig: () => [{title: '跟进记录', tab: 'FollowUpTab'},
      {title: '变更记录', tab: 'ChangeTab'}]
  },
  clues: {
    title: '线索详情',
    getRightParams: ({instance, data}) => ({
      text: '...',
      onSuccess: () => {
        let items = [];
        if (data.responsibleId && getClueEditAble(data.status.code)) {
          items = [
            {id: '1', text: '编辑信息', auth: 'wap-crm-clue-edit'},
            {id: '2', text: '分享线索'},
            {id: '3', text: '标记无效'}
          ];
        } else {
          items = [
            {id: '2', text: '分享线索'}
          ];
        }
        ddApi.setPopMenu({
          backgroundColor: '#FFFFFF',
          items,
          onSuccess: async ({id}) => {
            switch (id) {
              case '1':
                if (!instance.hasAuth) {
                  AlertUtil.showToast({txt: '只有负责人、协同人或者主管才能操作'});
                  return;
                }
                RouteUtil.clueEdit({
                  id: instance.id,
                  onSuccess: () => {
                    instance.fetchData();
                    instance.tabFetchData('ChangeTab');
                  }
                });
                break;
              case '2':
                share({module: instance.module, type: instance.type, id: instance.id});
                break;
              case '3':
                if (!instance.isResponsible) {
                  AlertUtil.showToast({txt: '只有负责人才能操作'});
                  return;
                }
                RouteUtil.clueFailure({
                  id: instance.id,
                  onSuccess: () => {
                    instance.fetchData();
                    instance.tabFetchData('ChangeTab');
                  }
                });
                break;
              default:
                break;
            }
          }
        });
      }
    }),
    getListRowData: ({data, instance}) => ([{
      title: '合同订单',
      click: () => RouteUtil.orderList({module: instance.module, id: instance.id}),
      count: data.orderNum,
      icon: images.all.ico_order
    }]),
    getInfoData: ({data}) => [
      {title: '姓名', value: data.customerName},
      {title: '编号', value: data.clueNo, type: 'copy'},
      // {title: '状态', value: data.status && data.status.name},
      {title: '性别', value: data.customerGender && data.customerGender.name},
      {title: '等级', value: data.intentionGrade && data.intentionGrade.name},
      {title: '电话', value: data.customerMobile, type: 'mobile'},
      {
        title: '状态',
        value: data.status && data.status.name,
        type: (data.status.code === 6 || data.status.code === 5) ? 'cancel' : '',
        message: data.status.code === 6 ? '线索已失效' : '线索已战败',
        hint: `失效备注:${data.failureRemark}`
      }
    ],
    getHintShowText: ({data}) => getStatusTime(data.nextFollowUpTime, data.responsibleId),
    getNameData: ({data}) => ({
      carName: data.carName,
      follow: data.focusType,
      showFollow: data.status.code !== 6 && data.status.code !== 2 && data.status.code !== 5
    }),
    getPersonData: ({data}) => ({
      name: (data.status.code === 5 || data.status.code === 6) ? '前负责人' : '负责人',
      edit: getClueEditAble(data.status.code),
      subname: (data.status.code === 5 || data.status.code === 6) ? '前协同人' : '协同人',
      master: {...data.responsible, ico: data.responsible && data.responsible.avatar},
      pater: data.teamworkMans ? data.teamworkMans.map(item => ({
        ...item,
        ico: item.avatar
      })) : []
    }),
    getOtherParams: ({data}) => {
      let {appearance, interior} = data;
      let params = {};
      let outColor = '';
      let inColor = '';
      try {
        outColor = appearance ? JSON.parse(appearance) : null;
        inColor = interior ? JSON.parse(interior) : null;
      } catch (e) {
        outColor = '无';
        inColor = '无';
      }
      params.outColor = transformColorName(outColor) || '无';
      params.inColor = transformColorName(inColor) || '无';
      return params;
    },
    getBottomButtons: ({instance, data}) => {
      // 已签约则隐藏按钮
      if (data.status.code === 4) {
        return [];
      }
      if (data.responsibleId && getClueEditAble(data.status.code)) {
        return [{
          title: '询价',
          flex: 1,
          icon: images.all.ic_money_blue,
          click: () => RouteUtil.commonInquiry({
            id: instance.id,
            module: instance.module,
            params: instance.allData,
            type: 'add',
            onSuccess: () => {
              instance.tabFetchData('OfferTab');
              instance.tabFetchData('ChangeTab');
            }
          })
        }, {
          title: '签约',
          flex: 1,
          icon: images.base.ic_sign,
          click: () => {
            if (data.intentionType.code === 2) {
              AlertUtil.showToast({txt: '线索为模糊意向无法签约，请编辑修改后再做操作。'});
              return;
            }
            if (!instance.isParticipant) {
              AlertUtil.showToast({txt: '只有负责人、协同人才能操作'});
              return;
            }
            RouteUtil.contractConfirm({
              ...instance.allData,
              onSuccess: () => {
                instance.fetchData();
              }
            });
          }
        }, {
          title: '跟进',
          flex: 2,
          icon: images.base.ic_followup_white,
          click: () => RouteUtil.commonFollowUp({
            id: instance.id,
            module: instance.module,
            targetId: instance.id,
            targetName: instance.allData.customerName,
            onSuccess: () => {
              instance.tabFetchData('FollowUpTab');
              instance.fetchData();
            }
          })
        }];
      }
      if (data.status.code === 6 || data.status.code === 2 || data.status.code === 5) {
        let newVar = [{
          title: '捞取',
          icon: instance.isLeader ? images.all.ic_add_blue : images.all.ic_add,
          click: () => instance.obtainPerson()
        }];
        if (instance.isLeader) {
          newVar.push({
            title: '分配',
            icon: images.all.ic_person_white,
            click: () => instance.allocationPerson()
          });
        }
        return newVar;

      }
      if (instance.isLeader) {
        let newVar = [{
          title: '分配',
          icon: images.all.ic_person_white,
          click: () => instance.allocationPerson()
        }];
        return newVar;
      }
      return [];
    }
  },
  order: {
    title: '合同订单',
    getTabConfig: () => [{title: '合同订单', tab: 'OrderTab'},
      // {title: '在途记录', tab: 'OnOrderTab'},
      // {title: '变更记录', tab: 'ChangeTab'},
      {title: '文件柜', tab: 'FileCaseTab'}],
    getHintShowText: ({data}) => `订单更新时间 ：${data.updateTime}`,
    getNameData: ({data}) => ({
      carName: data.carName,
      showFollow: false
    }),
    getRightParams: () => {
    },
    // getRightParams: ({instance}) => ({
    //   text: '...',
    //   onSuccess: () => {
    //     ddApi.setPopMenu({
    //       items: [
    //         // {id: '1', text: '复制订单'},
    //         // {id: '2', text: '编辑合同'},
    //         // {id: '3', text: '数据变更'},
    //         // {id: '4', text: '申请取消'},
    //         // {id: '5', text: '取消订单'}
    //       ],
    //       onSuccess: ({id}) => {
    //         switch (id) {
    //           case '1':
    //             AlertUtil.showInputPop({
    //               title: '复制订单',
    //               placeholder: '请输入生成订单数量',
    //               type: 'number',
    //               onSuccess: (txt, hide) => {
    //                 if (!txt) {
    //                   AlertUtil.showToast({txt: '数量不能为空', type: 'error'});
    //                 } else {
    //                   hide();
    //                 }
    //               }
    //             });
    //             break;
    //           case '2':
    //             RouteUtil.orderEdit({
    //               id: instance.id,
    //               onSuccess: () => {
    //                 instance.fetchData();
    //               }
    //             });
    //             break;
    //           case '3':
    //
    //             break;
    //           case '4':
    //
    //             break;
    //           case '5':
    //             RouteUtil.orderCancel({id: instance.id});
    //             break;
    //           default:
    //             break;
    //         }
    //       }
    //     });
    //   }
    // }),
    getInfoData: ({data}) => [
      {title: '姓名', value: data.name},
      {title: '编号', value: data.orderNo, type: 'copy'},
      {title: '性别', value: data.gender && data.gender.name},
      {
        title: '状态',
        value: data.isCancel ? '已取消' : data.status && data.status.name,
        type: data.isCancel ? 'cancel' : '',
        message: '订单已取消',
        hint: `失效备注:${data.cancelRemark}`
      }
    ],
    getPersonData: ({data}) => ({
      name: '负责人',
      isDel: false,
      // todo 暂停开放，后续根据状态控制
      edit: false,
      subname: '协同人',
      master: {...data.responsible, ico: data.responsible && data.responsible.avatar},
      pater: data.teamworkMans ? data.teamworkMans.map(item => ({
        id: item.userId,
        name: item.userName,
        ico: item.userHeardUrl
      })) : []
    }),
    getOtherParams: ({data}) => {
      let {carPrice, totalAmount, deposit, appearance, interior, contractUrl = [], depositVoucherUrl = [], certificateUrl = []} = data;
      let params = {};
      const outColor = appearance ? JSON.parse(appearance) : null;
      const inColor = interior ? JSON.parse(interior) : null;
      params.outColor = transformColorName(outColor) || '无';
      params.inColor = transformColorName(inColor) || '无';
      params.carPrice = Numeral(carPrice).format('0,0.00');
      params.totalAmount = Numeral(totalAmount).format('0,0.00');
      params.deposit = Numeral(deposit).format('0,0.00');
      params.orderFileCabinetList = [
        {
          title: '委托订购合同',
          images: contractUrl
        },
        {
          title: '身份证/企业营业执照',
          images: certificateUrl
        },
        {
          title: '定金付款凭证',
          images: depositVoucherUrl
        }
      ];
      return params;
    },
    getBottomButtons: () => {
      return [];
      // TODO 根据不同的状态显示不同的按钮
      // const onSuccess = () => instance.fetchData();
      // switch (data.status.name) {
      //   case '待确认合同':
      //     return [{
      //       title: '确认合同',
      //       icon: images.all.ico_config_order,
      //       click: () => RouteUtil.orderConfirm({
      //         params: instance.allData,
      //         state: 1,
      //         id: instance.id,
      //         onSuccess
      //       })
      //     }];
      //   case '待发起订车':
      //     return [{
      //       title: '发起订车',
      //       icon: images.all.ico_config_order,
      //       click: () => RouteUtil.orderConfirm({
      //         params: instance.allData,
      //         state: 2,
      //         id: instance.id,
      //         onSuccess
      //       })
      //     }];
      //   default:
      //     return [{
      //       title: '状态待定',
      //       icon: images.all.ico_config_order,
      //       click: () => RouteUtil.orderConfirm({
      //         params: instance.allData,
      //         id: instance.id,
      //         onSuccess
      //       })
      //     }];
      // }
    }
  },
  followUpPlans: {
    title: '计划详情',
    getTabConfig: () => [{title: '跟进记录', tab: 'FollowUpTab'}],
    getHintShowText: ({data}) => getStatusTime(data.plannedTime, data.status.code !== 1),
    getRightParams: ({instance, data}) => ({
      text: '...',
      onSuccess: () => {
        let items = [];
        if (data.status.code !== 1 && data.status.code !== 3 && data.status.code !== 2) {
          items.push({id: '1', text: '编辑计划'});
          items.push({id: '2', text: '取消计划'});
        }
        items.push({id: '3', text: '分享计划'});
        ddApi.setPopMenu({
          items,
          onSuccess: ({id}) => {
            switch (id) {
              case '1':
                RouteUtil.commonPlanEdit({
                  id: instance.id,
                  type: instance.type,
                  onSuccess: () => {
                    instance.fetchData();
                  }
                });
                break;
              case '2':
                AlertUtil.showInputPop({
                  title: '取消计划',
                  placeholder: '请输入取消理由…',
                  onSuccess: async (text, hide) => {
                    if (text.length < 5 || text.length > 100) {
                      AlertUtil.showToast({txt: '请输入5-100个字符'});
                      return;
                    }
                    if (text) {
                      hide();
                      await cancelFollowUpPlan({id: instance.id, reason: text});
                      AlertUtil.showToast({txt: '取消成功', type: 'success'});
                      instance.fetchData();
                    } else {
                      AlertUtil.showToast({txt: '请输入取消理由'});
                    }
                  }
                });
                break;
              case '3':
                share({module: instance.module, type: instance.type, id: instance.id});
                break;
              default:
                break;
            }
          }
        });
      }
    }),
    getInfoData: ({data}) => {
      const {targetMsg, status, actualTime, cancellationReasons} = data;
      const {mobile, number, gender, level, address} = targetMsg;
      let dataArray = [
        {title: '性别', value: gender && gender.name},
        {title: '编号', value: number, type: 'copy'},
        {title: '地址', value: address},
        {title: '等级', value: level && level.code, type: 'star'},
        {title: '电话', value: mobile, type: 'mobile'},
        {
          title: '状态',
          value: data.status && data.status.name,
          type: data.status.code === 3 ? 'cancel' : '',
          message: '计划已取消',
          hint: `计划取消理由:${cancellationReasons}`
        }
      ];
      if (status.code === 1) {
        dataArray.push({value: `计划执行时间${actualTime}`, type: 'single'});
      }
      return dataArray;
    },
    getPersonData: ({data}) => ({
      subname: '执行人',
      pater: data.planUser ? data.planUser.map(item => ({
        id: item.userId,
        name: item.userName,
        ico: item.userHeadUrl
      })) : []
    }),
    getNameData: ({data}) => ({
      name: data.targetMsg.name,
      remark: data.targetMsg.nickname,
      follow: data.hasFollow,
      showFollow: false
    }),
    getBottomButtons: ({instance, data}) => {
      if (data.status.code === 1 || data.status.code === 3 || data.status.code === 2) return [];
      return [{
        title: '跟进',
        icon: images.all.ico_go,
        click: () => RouteUtil.commonFollowUp({
          module: `${instance.type}s`,
          targetId: instance.allData.targetId,
          planId: instance.allData.id,
          targetName: instance.allData.targetMsg.name,
          onSuccess: () => {
            instance.fetchData();
          }
        })
      }, {
        title: '延期',
        icon: images.all.ic_clock,
        click: () => ddApi.datepicker({
          min: new Date(),
          onSuccess: async ({value}) => {
            await delayFollowUpPlan({id: instance.id, postponeTime: handleDateString(value)});
            AlertUtil.showToast({txt: '延期成功', type: 'success'});
            instance.fetchData();
          }
        })
      }];
    },
    customer: {
      getNameData: ({data}) => {
        const {targetMsg} = data;
        const {nickname, name, isAttention} = targetMsg;
        return {
          name,
          remark: nickname,
          follow: isAttention,
          showFollow: false
        };
      }
    },
    agent: {
      getInfoData: ({data}) => {
        const {targetMsg, address, status, actualTime, cancellationReasons} = data;
        const {mobile, number, gender, level} = targetMsg;
        let dataArray = [
          {title: '性别', value: gender && gender.name},
          {title: '编号', value: number, type: 'copy'},
          {title: '地址', value: address},
          {title: '等级', value: level && level.name},
          {title: '电话', value: mobile, type: 'mobile'},
          {
            title: '状态',
            value: data.status && data.status.name,
            type: data.status.code === 3 ? 'cancel' : '',
            message: '计划已取消',
            hint: `计划取消理由:${cancellationReasons}`
          }
        ];
        if (status.code === 1) {
          dataArray.push({value: `计划执行时间${actualTime}`, type: 'single'});
        }
        return dataArray;
      }
    },
    clue: {
      getNameData: ({data}) => ({
        carName: data.targetMsg.carName,
        follow: data.targetMsg.isAttention,
        showFollow: false
      }),
      getInfoData: ({data}) => {
        const {targetMsg, status, actualTime, cancellationReasons} = data;
        const {mobile, name, number} = targetMsg;
        let dataArray = [
          {title: '姓名', value: name},
          {title: '编号', value: number, type: 'copy'},
          {title: '性别', value: targetMsg.gender && targetMsg.gender.name},
          {title: '等级', value: targetMsg.level && targetMsg.level.name},
          {title: '电话', value: mobile, type: 'mobile'},
          {
            title: '状态',
            value: data.status && data.status.name,
            type: data.status.code === 3 ? 'cancel' : '',
            message: '计划已取消',
            hint: `计划取消理由:${cancellationReasons}`
          }
        ];
        if (status.code === 1) {
          dataArray.push({value: `计划执行时间${actualTime}`, type: 'single'});
        }
        return dataArray;
      }
    }
  },
  enquiryPrices: {
    title: '询价单',
    getTabConfig: () => [{title: '询价记录', tab: 'EnquiryRecordTab'},
      {title: '报价记录', tab: 'QuotedRecordTab'},
      {title: '变更记录', tab: 'ChangeTab'}
    ],
    getHintShowText: ({data}) => `订单更新时间 ：${data.updateTime}`,
    getNameData: ({data}) => ({
      carName: data.vehicleModel,
      showFollow: false,
      status: data.status && data.status.name
    }),
    getRightParams: ({instance, data}) => ({
      text: '...',
      onSuccess: () => {
        let items = [];
        if (data.status.code === 0) {
          items = [
            {id: '1', text: '编辑询价'},
            {id: '2', text: '取消询价'},
            {id: '3', text: '分享单据'}
          ];
        } else {
          items = [
            {id: '3', text: '分享单据'}
          ];
        }
        ddApi.setPopMenu({
          items,
          onSuccess: ({id}) => {
            switch (id) {
              case '1':
                RouteUtil.commonInquiry({
                  id: instance.id,
                  module: instance.module,
                  params: instance.allData,
                  type: 'edit',
                  onSuccess: () => {
                    instance.fetchData();
                    instance.tabFetchData('ChangeTab');
                  }
                });
                break;
              case '2':
                AlertUtil.showInputPop({
                  title: '取消询价',
                  placeholder: '请输入取消询价理由…',
                  onSuccess: async (text, hide) => {
                    if (text) {
                      hide();
                      await cancelEnquiryPrice({id: instance.id, cancelReason: text});
                      AlertUtil.showToast({txt: '取消成功', type: 'success'});
                      instance.fetchData();
                      instance.tabFetchData('ChangeTab');
                      instance.tabFetchData('QuotedRecordTab');
                    } else {
                      AlertUtil.showToast({txt: '请输入取消询价理由'});
                    }
                  }
                });
                break;
              case '3':
                share({module: instance.module, type: instance.type, id: instance.id});
                break;
              default:
                break;
            }
          }
        });
      }
    }),
    getInfoData: ({data}) => [
      {title: '姓名', value: data.customerName},
      {title: '编号', value: data.enquiryNo, type: 'copy'},
      {title: '电话', value: data.customerMobile, type: 'mobile'},
      {
        title: '状态',
        value: data.status.code === 2 ? '已取消' : data.status && data.status.name,
        type: data.status.code === 2 ? 'cancel' : '',
        message: '单据已取消',
        hint: `取消原因:${data.cancelReason}`
      }
    ],
    getPersonData: () => ({}),
    getBottomButtons: () => []
  },
  quotedPrices: {
    title: '报价单',
    getTabConfig: () => [{title: '询价记录', tab: 'EnquiryRecordTab'},
      {title: '报价记录', tab: 'QuotedRecordTab'}
    ],
    getHintShowText: ({data}) => `订单更新时间 ：${data.updateTime}`,
    getNameData: ({data}) => ({
      carName: data.vehicleModel,
      showFollow: false,
      status: data.status && data.status.name
    }),
    getRightParams: ({instance}) => ({
      text: '...',
      onSuccess: () => {
        let items = [{id: '3', text: '分享单据'}];
        ddApi.setPopMenu({
          items,
          onSuccess: ({id}) => {
            switch (id) {
              case '3':
                share({module: instance.module, type: instance.type, id: instance.id});
                break;
              default:
                break;
            }
          }
        });
      }
    }),
    getInfoData: ({data}) => [
      {title: '姓名', value: data.customerName},
      {title: '编号', value: data.quotedNo, type: 'copy'},
      {title: '电话', value: data.customerMobile, type: 'mobile'},
      {
        title: '状态',
        value: data.status.code === 2 ? '已取消' : data.status && data.status.name,
        type: data.status.code === 2 ? 'cancel' : '',
        message: '单据已取消',
        hint: `取消原因:${data.cancelReason}`
      }
    ],
    getPersonData: () => ({}),
    getBottomButtons: ({instance, data}) => {
      if (data.status.code !== 0) return [];
      return [{
        title: '提交报价',
        icon: images.all.ico_go,
        click: () => {
          // alert('提交报价');
          RouteUtil.quotedAdd({
            id: instance.id,
            module: instance.module,
            params: instance.allData,
            type: 'add',
            onSuccess: () => {
              instance.fetchData();
              instance.tabFetchData('QuotedRecordTab');
              instance.tabFetchData('EnquiryRecordTab');
            }
          });
        }
      }];
    }
  }
};
