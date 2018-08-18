<template>
  <div class="container">
    <div class="input-box2">
      <cube-scroll>
        <div class="content">
          <template v-for="(item,index) in form.data">
            <div v-if="item.attr === 'customerId'" :key="'index'+index" class="id-box" >
              <div
                :key="'index2'+index1"
                class="in-box"
                :class="{'self':item1.columnWidth===50}"
                v-for="(item1,index1) in form.info"
              >
                <yi-input
                  ref="info"
                  v-bind="item1"
                  v-model="item1.text"
                  :value.sync="item1.value"
                  :indent="true"
                  :selData="item1.selData || null"
                  :clearMR="item1.columnWidth===50"
                  :disable="true"
                />
              </div>
            </div>
            <div
              v-else-if="item.type==='groupHeader'"
              class="section-title section-margin-top"
              :key="'index'+index">
              {{item.title}}
            </div>
            <div
              v-else
              :key="'index'+index"
              class="in-box"
              :class="{'self':item.columnWidth===50}"
            >
              <yi-input
                :ref="'va'"
                :class="{'hide':item.attr==='orderNo'}"
                v-bind="item"
                v-model="item.text"
                :value.sync="item.value"
                :indent="true"
                :selData="item.selData || null"
                :clearMR="item.columnWidth===50"
                @onCarModel="onCarModel"
                @onGetName="onGetName"
              />
            </div>
          </template>
          <div class="space-box"></div>
        </div>
      </cube-scroll>
    </div>
    <yi-btn-box
      :name="btnName"
      @onBtnClick="onBtnClick"
    />
  </div>
</template>

<script>
import {
  getAddOrderModule,
  addOrderInfo,
  getEditOrderInfo,
  editOrderInfo
} from '../../../api/order';
import {getModelDetail} from '../../../api/carModel';
import {addUserInfo} from '../../../api/clue';
import {getOrderNo} from '../../../api/common';
import {inputType} from '../../../config/module';
import Page from '../../../components/Mixins/EditPage';
import {ddApi} from '../../../api/dingding';
import {validate} from '../../../config/validate';
import {isEmptyObject} from '../../../utils/commonUtil';

export default {
  name: 'order-add',
  extends: Page,
  created() {
    this.$nextTick(()=>{

      // 路由参数 判断是否为编辑状态或新增状态
      this.params = this.$route.params;
      console.log(this.params, '----------->0203');
      let params = this.params;
      if (params && params.id) {
        this.id = params.id;
        this.form.type = 'edit';
      } else {
        this.form.type = 'add';
      }
      if (this.form.type === 'add') {
        this.getPage({});
      } else {
        // 编辑赋初值
        getEditOrderInfo(this.id)
          .then((res)=>{
            this.edit = res;
            console.log(res, '--------------------0203');
            this.getPage(res);
          })
          .catch(err=>{ console.log(err); });
      }
    });
  },
  activated() {
    ddApi.setRight();
  },
  computed: {
    btnName() {
      let id = this.id;
      return id ? '编辑订单' : '创建订单';
    }
  },
  data() {
    return {
      initData: null,
      params: this.$route.params, // 路由参数
      clueId: '', // 线索id
      id: '',
      form: {
        type: 'add',
        info: [
          {
            attr: 'name',
            type: 'text',
            title: '客户名称',
            text: null,
            value: null,
            placeholder: '请选择客户名称1',
            required: false,
            indent: false
          },
          {
            attr: 'mobile',
            type: 'text',
            title: '联系电话',
            text: null,
            value: null,
            placeholder: '客户联系电话',
            required: false,
            indent: false
          },
          {
            attr: 'gender',
            type: 'text',
            title: '性别',
            text: null,
            value: null,
            placeholder: '请选择性别',
            required: false,
            indent: false
          }
        ],
        data: []
      },
      edit: null
    };
  },
  methods: {
    isEdit() {
      // console.log(this.initData);
      // console.log('--------------------');
      // console.log(JSON.stringify(this.form));
      return this.initData !== JSON.stringify(this.form);
    },
    onBtnClick() {
      console.log(this.form);
      const arr = [];
      this.$refs.va.forEach((item)=>{
        if (item.rules && !isEmptyObject(item)) {
          arr.push(item.changeV());
        }
      });
      console.log(arr, '--------');
      Promise.all(arr).then(data => {

        let state = data.every(item => item);
        if (state) {
          // 判断订单编号是否已存在
          let id = '';
          this.form.data.forEach((item) => {
            if (item.attr === 'orderNo') {
              id = item.text + item.value;
            }
          });
          console.log(id);
          // isOrderNoUnique(id)
          //   .then((res2) => {
          //     console.log(res2, '==>res2');
          console.log('可以创建');


          console.log('新建线索2', this.$refs.va);
          console.log(state);
          if (state) {
            console.log(this.form, '校验成功并提交数据');

            // 图片数据格式处理
            // this.form.data = this.form.data.map((item) => {
            //   // 委托订单合同
            //   if (item.attr === 'contractUrl' || item.attr === 'certificateUrl' || item.attr === 'depositVoucherUrl') {
            //     let vl = item.value || [];
            //     item.value = vl.map(item1 => item1.url);
            //   }
            //   return item;
            // });

            // todo
            if (this.form.type === 'add') {
              this.params.data3 = this.form.data;

              console.log(this.params, '4444');
              // 整理参数
              let nowData = this.params;
              let list = [];
              if (nowData.data1 instanceof Array) {
                list = list.concat(nowData.data1);
              }
              if (nowData.data2 instanceof Array) {
                list = list.concat(nowData.data2);
              }
              if (nowData.data3 instanceof Array) {
                list = list.concat(nowData.data3);
              }

              console.log(list);

              let items = list.filter((item) => {
                return item.attr !== 'group' && item.attr !== 'files';
              }).map((item) => {
                let val = '';
                if (item.value) {
                  val = item.value;
                } else {
                  val = item.value === 0 ? 0 : item.text;
                }
                // 地面店
                if (item.attr === 'belongStoreId') {
                  if (typeof item.value === 'object') {
                    val = item.value && item.value.id;
                  } else if (typeof item.value === 'string') {
                    val = item.value && JSON.parse(item.value).id;
                  }
                }
                return {
                  [item.attr]: val
                };
              });

              let lastItems = {};
              items.forEach((items1) => {
                for (let item in items1) {
                  lastItems[item] = items1[item];
                }
              });

              this.form.data.forEach((item) => {
                // 订单编号重新组装
                if (item.attr === 'orderNo') {
                  lastItems.orderNo = item.text + item.value;
                }
              });

              console.log(lastItems, 'itemssss');

              // 线索id为空串或null 不提交这个字段
              if (!lastItems.cluePK) {
                delete lastItems.cluePK;
              }

              // 处理android默认将数字类型转字符串问题
              lastItems.gender = parseInt(lastItems.gender);
              lastItems.shoppingWay = parseInt(lastItems.shoppingWay);

              addOrderInfo(lastItems).then((res) => {
                this.$RouteUtil.orderAddSuccess({
                  ...this.params,
                  name: '新建订单',
                  customerNo: res[0].orderNo,
                  id: res[0].id
                });
                console.log(res, '--------01---------');

              }).catch((err) => {
                console.log(err, '--------02---------');
              });
            } else if (this.form.type === 'edit') {
              console.log(this.form, '11111112');
              let items = {};
              this.form.data.forEach((item) => {
                if (item.attr !== 'group') {
                  let val = '';
                  if (item.value) {
                    val = item.value;
                  } else {
                    val = item.value === 0 ? 0 : item.text;
                  }
                  console.log(val, 'item');

                  items[item.attr] = val;

                  if (item.attr === 'vehicleModelId') {
                    items.carName = item.text;
                  }

                  // 订单编号重新组装
                  if (item.attr === 'orderNo') {
                    items.orderNo = item.text + item.value;
                  }
                }
              });
              console.log(this.form.data, '==>edit info');
              console.log(items, '==>edit info');
              items.orderId = this.id;
              items.customerId = this.edit.customerId;
              // 先判断用户名是否存在 name, mobile, gender
              let userInfo = {};
              userInfo.name = items.name;
              userInfo.mobile = items.mobile;
              userInfo.gender = items.gender;
              console.log(userInfo, '==>userInfo');

              // 判断用户是否被修改
              let initData = JSON.parse(this.initData);
              console.log(initData, '==>555');
              let isTrue = true;
              initData && initData.data.forEach((item6, index6) => {
                if (item6.attr === 'name' || item6.attr === 'mobile' || item6.attr === 'gender') {
                  if (JSON.stringify(item6) !== JSON.stringify(this.form.data[index6])) {
                    console.log(item6);
                    console.log('------------');
                    console.log(this.form.data[index6]);
                    isTrue = false;
                  }
                }
              });

              if (isTrue) {
                editOrderInfo(items)
                  .then((res1) => {
                    console.log(res1, '==>edit success');
                    this.params.onSuccess && this.params.onSuccess();
                    this.$router.go(-1);
                  })
                  .catch(err => console.log(err, '==>edit err'));
              } else {
                addUserInfo(userInfo)
                  .then((res) => {
                    // 用户已存在跳转失败页面
                    console.log(res, '==>failure success');
                    let info = res;
                    this.$RouteUtil.orderEditFail({
                      ...this.params,
                      info,
                      items
                    });

                  })
                  .catch(err => console.log(err, '==>user err'));

              }
            }
          }
        }

      });
    },
    // 回到获取姓名
    onGetName(name) {
      this.$refs.va.forEach((item)=>{
        console.log(item);
        if (item.$attrs.attr === 'name') {
          item.setText(name);
        }
      });
    },
    // 车信息回调
    onCarModel(obj, initial) {
      console.log(obj, 'data');
      // 设置外观和内饰
      let innerColors = obj.data.innerColors;
      let outerColors = obj.data.outerColors;
      this.form.data.forEach((item, index) => {
        if (item.attr === 'appearance') {
          if (!initial) {
            this.form.data[index].text = null;
            this.form.data[index].value = null;
          }
          if (outerColors) {
            this.form.data[index].selData = outerColors;
            this.form.data[index].disable = false;
            this.form.data[index].text = null;
          } else {
            this.form.data[index].selData = null;
            this.form.data[index].disable = true;
            this.form.data[index].text = '无';
          }
        }
        if (item.attr === 'interior') {
          if (!initial) {
            this.form.data[index].text = null;
            this.form.data[index].value = null;
          }
          if (innerColors) {
            this.form.data[index].selData = innerColors;
            this.form.data[index].disable = false;
            this.form.data[index].text = null;
          } else {
            this.form.data[index].selData = null;
            this.form.data[index].disable = true;
            this.form.data[index].text = '无';
          }
        }
      });

      // 初始数据保留
      if (initial) {
        this.initData = JSON.stringify(this.form);
      }
    },
    // 获取模版
    getPage(edit) {
      console.log(edit);
      // 获取枚举类别
      let form = this.menu;
      let clueAdditionalConfiguration = form.clueAdditionalConfiguration; // 车型信息
      let outerColor = null; // 外观
      let innerColor = null; // 内饰
      let clueIntentionType = form.clueIntentionType; // 意向类型
      let clueShoppingWay = form.clueShoppingWay; // 购买方式
      let genderData = form.gender; // 性别
      let customerOrigin = form.customerOrigin; // 客户来源
      let customer = form.customerType; // 客户类型


      // 获取添加模版
      getAddOrderModule()
        .then((res)=>{

          console.log(res, '=========================>success2');
          let data1 = [];
          res.forEach((item)=>{
            console.log(item);
            if (item.code === 'create-order' && this.form.type === 'add') {
              data1 = item.fields;
            }
            if (item.code === 'edit-order' && this.form.type === 'edit') {
              data1 = item.fields;
            }
          });
          // 升序
          data1.sort((a, b)=>a.sort - b.sort);
          this.allData = data1;

          console.log(data1, '=========================>data2');

          let data = [];
          if (this.form.type === 'add') {
            data = data1.filter((item)=>{
              return item.description === 'step5';
            });
          } else {
            data = data1;
          }
          console.log(data, '=========================>data2');

          let formData = [];
          data.forEach((item)=>{
            let obj = {
              attr: item.attr,
              type: inputType[item.configsObj.type],
              title: item.name,
              text: null,
              value: null,
              placeholder: item.configsObj.placeholder,
              indent: true,
              columnWidth: item.columnWidth,
              selData: {'source': [{'key': '选项一', 'value': 1}, {'key': '选项二', 'value': 2}], 'selectedKey': '下单客户1'}
            };

            if (obj.attr === 'vehicleModelId') {
              obj.singleChoose = true;
            }

            // 委托订单合同
            if (obj.attr === 'contractUrl') {
              obj.line = false;
            }

            // 身份证/企业执照
            if (obj.attr === 'certificateUrl') {
              obj.line = false;
            }

            // 订单付款凭证
            if (obj.attr === 'depositVoucherUrl') {
              obj.line = false;
            }

            // 编辑 数据绑定
            if (edit[obj.attr]) {
              obj.value = edit[obj.attr];
              obj.text = edit[obj.attr];

              // 编号
              if (item.attr === 'orderNo') {
                obj.text = obj.value && obj.value.substring(0, 8);
                obj.value = obj.value && obj.value.substring(9, obj.value.length);
                obj.disable = true;
              }
              //  性别
              if (obj.attr === 'gender') {
                obj.text = edit[obj.attr].name;
                obj.value = edit[obj.attr].code;
              }

              // 车型名称
              if (obj.attr === 'vehicleModelId') {
                obj.text = edit[obj.attr].carName;
                obj.value = edit[obj.attr].vehicleModelId;

                obj.value &&
                edit.carName !== '模糊意向' &&
                getModelDetail(edit[obj.attr].vehicleModelId)
                  .then((res1)=>this.onCarModel({data: res1}, true))
                  .catch((err)=>console.log(err));
              }

              // 外观
              if (obj.attr === 'appearance') {
                obj.text = edit[obj.attr] && JSON.parse(edit[obj.attr]) && JSON.parse(edit[obj.attr]).name;
                obj.value = edit[obj.attr] ? JSON.parse(edit[obj.attr]) : null;
              }

              // // 内饰
              if (obj.attr === 'interior') {
                let name = edit[obj.attr] && JSON.parse(edit[obj.attr]).colors && JSON.parse(edit[obj.attr]).colors[0].name;
                if (JSON.parse(edit[obj.attr]).colors && JSON.parse(edit[obj.attr]).colors[1]) {
                  name += `/${JSON.parse(edit[obj.attr]).colors[1].name}`;
                }
                obj.text = name;
                obj.value = edit[obj.attr] ? JSON.parse(edit[obj.attr]) : null;
              }

              // 购车方式
              if (obj.attr === 'shoppingWay') {
                obj.text = edit[obj.attr].name;
                obj.value = edit[obj.attr].code;
              }

              // 委托订单合同
              if (obj.attr === 'contractUrl') {
                let vl = obj.value || [];
                obj.value = vl.map(item1=>({url: item1}));
              }

              // 身份证/企业执照
              if (obj.attr === 'certificateUrl') {
                let vl = obj.value || [];
                obj.value = vl.map(item1=>({url: item1}));
              }

              // 订单付款凭证
              if (obj.attr === 'depositVoucherUrl') {
                let vl = obj.value || [];
                obj.value = vl.map(item1=>({url: item1}));
              }

            }

            // 是否必填
            let required = false;
            item.rulesObj && item.rulesObj.forEach((item2)=>{
              if (item2.type === 'required') {
                required = true;
              }
            });

            // 校验规则
            let rules = validate(item);
            if (required) { obj.required = required; }
            if (rules) { obj.rules = rules; }

            // 类别
            switch (item.attr) {
              case 'vehicleModelId':
                obj.selData.source = clueAdditionalConfiguration.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              case 'intentionType':
                obj.selData.source = clueIntentionType.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              case 'intentionGrade':
                obj.selData.source = clueIntentionType.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              case 'shoppingWay':
                obj.selData.source = clueShoppingWay.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              case 'appearance':
                obj.selData = outerColor;
                break;
              case 'interior':
                obj.selData = innerColor;
                break;
              case 'gender':
                obj.selData.source = genderData.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              case 'origin':
                obj.selData.source = customerOrigin.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              case 'type':
                obj.selData.source = customer.map((item1)=>{ return {key: item1.name, value: item1.code}; });
                break;
              default:

            }

            formData.push(obj);
          });
          this.form.data = formData;
          console.log(this.form.data, '---------->>>>>>>>>>');


          // 新建系统自动创建订单编号
          // 订单编号自动生产
          if (this.form.type === 'add') {
            console.log(this.params, '==>params');
            this.params && getOrderNo({
              code: this.params.belongStoreId,
              source: this.params.businessCode
            }).then((res1)=>{
              console.log(res1, 'res');
              this.form.data.forEach((item3, index) =>{
                if (item3.attr === 'orderNo') {
                  this.form.data[index].text = res1.substring(0, 8);
                  this.form.data[index].value = res1.substring(8, res1.length);
                }
              });

              // 初始数据保留
              this.initData = JSON.stringify(this.form);
            }).catch((err)=>{
              console.log(err, 'err');
            });
          }

          // 初始数据保留
          this.initData = JSON.stringify(this.form);
        })
        .catch((err)=>{ console.log(err, '==============================>err'); });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~styles/global.styl";
.hide{
  display none
}
.container {
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  display flex
  flex-direction column

  .section-title {
    width 100%
    font-size: px2rem(16);
    color: $deepBlack
    text-align left
    margin 0 px2rem(14)
    medium()
  }
  .section-margin-top {
    margin-top px2rem(28)
  }
  .input-box2 {
    display flex
    height calc(100% - 50px)
    flex-direction column
    flex 1
    overflow-y auto

    .content{
      display flex
      flex-direction row
      flex-wrap wrap
      .id-box{
        width 100%
        display flex
        flex-direction row
        flex-wrap wrap
      }
      .in-box{
        width 100%
      }
      .self {
        width 50%

        &:nth-child(even) .input-box{
          margin-right px2rem(14)
        }
      }

    }
  }

  .p-warm {
    width 100%
    background-color #FDFCEA
    height px2rem(28);
    line-height px2rem(28)
    font-size px2rem(12)
    color #EF465B
  }

  .space-box{
    display flex
    width 100%
    height px2rem(78)
  }
}
</style>
