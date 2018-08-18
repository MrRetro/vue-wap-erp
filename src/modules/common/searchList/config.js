/**
 * User: puti.
 * Time: 2018/6/11 下午4:12.
 */
import {RouteUtil} from '../../../utils/routeUtil';
import {getSearchList, getFollowUpRecordsList} from '../../../api/common';
import {ddApi} from '../../../api/dingding';

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

export const config = {
  fetchData: getSearchList,
  customers: {
    rightTitleParams: (instance) => ({
      auth: 'wap-crm-customer-add',
      text: '新建',
      onSuccess: () => {
        RouteUtil.clientAdd({params: instance.params, BACK_ACTION: {path: instance.ROUTE_PATH}});
      }
    }),
    onItemClick: ({id, module, type}) => RouteUtil.commonDetail({id, module, type}),
    chooseTitle: '选择客户',
    totalText: '名客户',
    searchText: '搜索姓名/手机/备注名称/客户编号',
    filterArray: ['sort', 'customerLevel',
      ['customerOrigin', 'customerType', 'lastFollowUpTime', 'nextFollowUpTime', 'customerCreateTime', 'customerObtainTime',
        'customerResponsible', 'customerTeamwork']],
    all: {
      title: '全部客户',
      filterArray: ['sort', 'customerLevel',
        ['customerOrigin', 'customerType', 'lastFollowUpTime', 'nextFollowUpTime', 'customerCreateTime',
          'customerObtainTime', 'customerResponsible', 'customerTeamwork']]
    },
    follow: {
      rightTitleParams: () => ({}),
      title: '重点客户',
      filterArray: ['sort', 'customerLevel',
        ['customerOrigin', 'customerType', 'lastFollowUpTime', 'nextFollowUpTime', 'customerCreateTime',
          'customerObtainTime', 'customerResponsible', 'customerTeamwork']]
    },
    sea: {
      rightTitleParams: () => ({}),
      title: '客户公海',
      filterArray: [
        ['customerOrigin', 'customerType', 'customerCreateTime']]
    }
  },
  agents: {
    rightTitleParams: () => ({
      // text: '开通',
      // onSuccess: () => {
      //   ddApi.setPopMenu({
      //     items: [
      //       {id: '1', text: '协助开通'},
      //       {id: '2', text: '二维码开通'}],
      //     onSuccess: ({id}) => {
      //       switch (id) {
      //         case '1':
      //           RouteUtil.assistOpen();
      //           break;
      //         case '2':
      //           RouteUtil.qrcodeOpen();
      //           break;
      //       //         default:
      //       //           break;
      //       //       }
      //       //     }
      //   });
      // }
    }),
    onItemClick: ({id, module, type}) => RouteUtil.commonDetail({id, module, type}),
    totalText: '名经纪人',
    searchText: '搜索姓名/手机/备注名称/经纪人编号',
    chooseTitle: '选择经纪人',
    all: {
      title: '全部经纪人',
      filterArray: ['agentSort', 'agentLevel',
        ['agentFollowUpStatus', 'agentOrigin', 'agentType', 'agentCategory', 'lastFollowUpTime', 'nextFollowUpTime',
          'agentObtainTime', 'agentCreateTime', 'agentResponsible', 'agentTeamwork']]
    },
    follow: {
      title: '重点经纪人',
      filterArray: ['agentSort', 'agentLevel',
        ['agentFollowUpStatus', 'agentOrigin', 'agentType', 'agentCategory', 'lastFollowUpTime', 'nextFollowUpTime',
          'agentObtainTime', 'agentCreateTime', 'agentResponsible', 'agentTeamwork']]
    },
    sea: {
      title: '经纪人公海',
      filterArray: [['agentOrigin', 'agentType', 'agentCreateTime']]
    }
  },
  clues: {
    rightTitleParams: (instance) => ({
      auth: 'wap-crm-clue-add',
      text: '新建',
      onSuccess: () => {
        RouteUtil.clueAdd({
          BACK_ACTION: {path: instance.ROUTE_PATH},
          onSuccess: () => {
            instance.refreshData();
          }
        });
      }
    }),
    onItemClick: ({id, module, type}) => RouteUtil.commonDetail({id, module, type}),
    chooseTitle: '选择线索',
    totalText: '条线索',
    searchText: '搜索姓名/手机/备注名称/线索编号',
    all: {
      title: '全部线索',
      filterArray: ['sort', 'clueIntentionGrade',
        ['clueStatus', 'clueOrigin', 'clueType', 'lastFollowUpTime', 'nextFollowUpTime', 'clueCreateTime', 'clueObtainTime', 'clueResponsible', 'clueTeamwork']]
    },
    follow: {
      rightTitleParams: () => ({}),
      title: '重点线索',
      filterArray: ['sort', 'clueIntentionGrade',
        ['clueStatus', 'clueOrigin', 'clueType', 'lastFollowUpTime', 'nextFollowUpTime', 'clueCreateTime', 'clueObtainTime', 'clueResponsible', 'clueTeamwork']]
    },
    sea: {
      rightTitleParams: () => ({}),
      title: '线索公海',
      filterArray: [['clueOrigin', 'clueType', 'clueCreateTime']]
    },
    invalid: {
      rightTitleParams: () => ({}),
      title: '无效线索',
      filterArray: ['clueFailSort',
        'clueIntentionGrade',
        ['clueOrigin', 'clueType', 'lastFollowUpTime', 'clueFailTime', 'clueCreateTime', 'clueResponsible', 'clueTeamwork']
      ]
    }
  },
  followUpRecords: {
    rightTitleParams: (vueInstance) => ({
      text: '新建',
      onSuccess: () => {
        RouteUtil.commonFollowUp({
          onSuccess: () => {
            vueInstance.refreshData();
          }
        });
      }
    }),
    fetchData: getFollowUpRecordsList,
    chooseTitle: '选择跟进记录',
    totalText: '条记录',
    searchText: '搜索姓名/手机/备注名称',
    onItemClick: ({cell}) => cell.resetShow(),
    customer: {
      title: '客户跟进记录',
      searchText: '搜索姓名/手机/备注名称/客户编号',
      rightTitleParams: (vueInstance) => ({
        text: '新建',
        onSuccess: () => {
          RouteUtil.commonFollowUp({
            module: 'customers',
            onSuccess: () => {
              vueInstance.refreshData();
            }
          });
        }
      }),
      filterArray: ['customerLevel',
        ['responsible']]
      // onItemClick: ({id, item, instance}) =>
      //   RouteUtil.commonFollowUp({
      //     id,
      //     module: 'customers',
      //     type: 'edit',
      //     targetId: item.targetId,
      //     targetName: item.targetName,
      //     onSuccess: () => {
      //       console.log(instance, '跟新成功');
      //       instance.refreshData();
      //     }
      //   })
    },
    clue: {
      title: '线索跟进记录',
      searchText: '搜索姓名/手机/备注名称/线索编号',
      rightTitleParams: (vueInstance) => ({
        text: '新建',
        onSuccess: () => {
          RouteUtil.commonFollowUp({
            module: 'clues',
            onSuccess: () => {
              vueInstance.refreshData();
            }
          });
        }
      }),
      filterArray: ['clueIntentionGrade',
        ['responsible']]
      // onItemClick: ({id, item, instance}) => RouteUtil.commonFollowUp({
      //   id,
      //   module: 'clues',
      //   type: 'edit',
      //   targetId: item.targetId,
      //   targetName: item.targetName,
      //   onSuccess: () => instance.refreshData()
      // })
    },
    agent: {
      title: '经纪人跟进记录',
      searchText: '搜索姓名/手机/备注名称/经纪人编号',
      rightTitleParams: (vueInstance) => ({
        text: '新建',
        onSuccess: () => {
          RouteUtil.commonFollowUp({
            module: 'agents',
            onSuccess: () => {
              vueInstance.refreshData();
            }
          });
        }
      }),
      filterArray: ['agentLevel', ['responsible']]
      // onItemClick: ({id, item, instance}) => RouteUtil.commonFollowUp({
      //   id,
      //   module: 'agents',
      //   type: 'edit',
      //   targetId: item.targetId,
      //   targetName: item.targetName,
      //   onSuccess: () => instance.refreshData()
      // })
    }
  },
  order: {
    rightTitleParams: (vueInstance) => ({
      text: '新建',
      onSuccess: () => {
        ddApi.actionSheet(
          {
            'title': '选择',
            'cancelButton': '取消',
            'otherButtons': ['直接创建', '选择线索'],
            'onSuccess': (data) => {
              console.log(data, '---');
              let index = data.buttonIndex || data.value;
              if (data.buttonIndex === 0) {
                index = 0;
              }
              console.log(index, '---');
              switch (index) {
                case 0:
                  console.log('直接创建');
                  RouteUtil.orderAddOne({...vueInstance.$route.params, BACK_ACTION: {path: vueInstance.ROUTE_PATH}});
                  break;
                case 1:
                  console.log('选取线索');
                  vueInstance.$RouteUtil.searchList({
                    module: 'clues',
                    type: 'all',
                    needBack: false,
                    choose: true,
                    onSuccess: (res) => {
                      console.log('线索选择成功', res);
                      RouteUtil.orderAddOne({
                        ...vueInstance.params,
                        BACK_ACTION: {path: vueInstance.ROUTE_PATH},
                        clueInfo: res
                      });
                    }
                  });
                  break;
                default:
                  break;
              }
            }
          }
        );
      }
    }),
    title: '合同订单',
    onItemClick: ({id, module, type}) => RouteUtil.commonDetail({id, module, type}),
    chooseTitle: '选择合同订单',
    totalText: '条合同订单',
    searchText: '搜索姓名/手机/备注名称',
    filterArray: ['orderSort',
      ['orderType', 'orderStatus', 'orderContractStatus', 'orderBelongPlaceId', 'orderBelongStoreId', 'orderCreateTime', 'orderResponsible', 'orderTeamwork']]
  },
  enquiryPrices: {
    rightTitleParams: (vueInstance) => ({
      text: '新建',
      auth: 'wap-inquiry-add',
      onSuccess: () => {
        RouteUtil.commonInquiry({
          BACK_ACTION: {path: vueInstance.ROUTE_PATH},
          id: vueInstance.userId,
          module: vueInstance.module,
          params: vueInstance.allData,
          type: 'add',
          onSuccess: () => {
            console.log('==>inquiry add success');
            vueInstance.refreshData();
            // vueInstance.tabFetchData('OfferTab');
          }
        });
      }
    }),
    title: '询价单',
    onItemClick: ({id, module, type}) => RouteUtil.commonDetail({id, module, type}),
    chooseTitle: '选择询价单',
    totalText: '条询价单',
    searchText: '搜索姓名/手机/备注名称',
    filterArray: ['enquirySort',
      ['enquiryStatus', 'clueLevel', 'enquiryStore', 'enquiryCreateTime', 'enquiryBelongPlaceId',
        'enquiryArea', 'enquiryUpdateTime', 'quotedTime', 'clueShoppingWay']]
  },
  quotedPrices: {
    rightTitleParams: () => ({
      // text: '新建',
      // onSuccess: () => {
      //   alert('提交报价？');
      //   // RouteUtil.quotedAdd({
      //   // id: vueInstance.id,
      //   // module: vueInstance.module,
      //   // params: vueInstance.allData,
      //   // type: 'add',
      //   // onSuccess: () => {
      //   //   // vueInstance.tabFetchData('OfferTab');
      //   // }
      //   // });
      // }
    }),
    title: '报价单',
    onItemClick: ({id, module, type}) => RouteUtil.commonDetail({id, module, type}),
    chooseTitle: '选择报价单',
    totalText: '条报价单',
    searchText: '搜索姓名/手机/备注名称',
    filterArray: ['enquirySort',
      ['enquiryStatus', 'clueLevel', 'enquiryStore', 'enquiryCreateTime', 'enquiryBelongPlaceId',
        'enquiryArea', 'enquiryUpdateTime', 'quotedTime', 'clueShoppingWay']]
  },
  quotedRecords: {
    rightTitleParams: (vueInstance) => ({
      text: '新建',
      auth: 'wap-quoted-records-add',
      onSuccess: () => {
        // alert('新建询价单');
        RouteUtil.quotedRecordAdd({
          BACK_ACTION: {path: vueInstance.ROUTE_PATH},
          id: vueInstance.id,
          module: vueInstance.module,
          params: vueInstance.allData,
          type: 'add',
          onSuccess: () => {
            vueInstance.refreshData();
            // vueInstance.tabFetchData('OfferTab');
          }
        });
      }
    }),
    title: '报价记录',
    onItemClick: ({item, module, type}) => RouteUtil.offerDetail({id: item.enquiryAndQuotedId, module, type}),
    chooseTitle: '选择报价记录',
    totalText: '条报价单',
    searchText: '搜索姓名/手机/备注名称',
    filterArray: ['enquirySort',
      ['enquiryStatus', 'clueLevel', 'enquiryStore', 'enquiryCreateTime', 'enquiryBelongPlaceId',
        'enquiryArea', 'enquiryUpdateTime', 'quotedTime', 'clueShoppingWay', 'invoiceType', 'insuranceType']]
  }
};
