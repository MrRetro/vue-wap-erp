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
                :ref="item.rules.required ? 'va' : null"
                v-bind="item"
                v-model="item.text"
                :value.sync="item.value"
                :indent="true"
                :selData="item.selData || null"
                :clearMR="item.columnWidth===50"
                @onCarModel="onCarModel"
                @onGetMan="onGetMan"
                @onStore="onStore"
              />
            </div>
          </template>
          <div class="space-box"></div>
        </div>
      </cube-scroll>
    </div>
    <yi-btn-box
      name="下一步"
      @onBtnClick="onBtnClick"
    />
  </div>
</template>

<script>
import {getAddOrderModule, getStoresByUserId} from '../../../../api/order';
import {inputType} from '../../../../config/module';
import Page from '../../../../components/Mixins/EditPage';
import {ddApi} from '../../../../api/dingding';
import {validate} from '../../../../config/validate';

export default {
  name: 'order-add-four',
  extends: Page,
  created() {
    this.$nextTick(()=>{
      console.log('--------11111');
      console.log(this.menu);

      let form = this.menu;
      let orderType = form.orderType; // 业务类型
      console.log(orderType, 'type--------------------');
      // 店铺


      // 获取添加模版
      getAddOrderModule()
        .then((res)=>{
          console.log(res, '=========================>success2');
          let data1 = [];
          res.forEach((item)=>{
            console.log(item);
            if (item.code === 'create-order') {
              data1 = item.fields;
            }
          });
          // 升序
          data1.sort((a, b)=>a.sort - b.sort);
          this.allData = data1;

          console.log(data1, '=========================>data2');
          let data = data1.filter((item)=>{
            return item.description === 'step4';
          });
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
              selData: {'source': [{'key': '无', 'value': '-1'}], 'selectedKey': '无'}
            };

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
              case 'orderType':
                obj.selData.source = orderType.map((item1)=>{ return {key: item1.name, value: JSON.stringify(item1)}; });
                break;
              default:

            }

            formData.push(obj);
          });
          this.form.data = formData;
          console.log(this.form.data, '---------->>>>>>>>>>');

          // 初始数据保留
          this.initData = JSON.stringify(this.form);
        })
        .catch((err)=>{ console.log(err, '==============================>err'); });

      // 编辑初始赋值
      let params = this.$route.params;
      console.log(params, '22222');
      this.params = params;

    });
  },
  activated() {
    ddApi.setRight();
  },
  data() {
    return {
      initData: null,
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
            placeholder: '请选择客户名称1',
            rules: {required: true},
            required: false,
            indent: false,
            disable: true
          },
          {
            attr: 'mobile',
            type: 'text',
            title: '联系电话',
            text: null,
            placeholder: '客户联系电话',
            rules: {required: true},
            required: false,
            indent: false,
            disable: true
          },
          {
            attr: 'gender',
            type: 'text',
            title: '性别',
            text: null,
            placeholder: '请选择性别',
            rules: {required: true},
            required: false,
            indent: false,
            disable: true
          }
        ],
        data: []
      },
      params: {},
      stores: {} // 地面店数据
    };
  },
  methods: {
    isEdit() {
      return this.initData !== JSON.stringify(this.form);
    },
    onBtnClick() {
      console.log('新建订单4');
      const arr = this.$refs.va.map((item)=>{
        return item.changeV();
      });
      Promise.all(arr).then(data => {
        console.log('新建线索2', this.$refs.va);
        let state = data.every(item => item);
        console.log(state);
        if (state) {
          console.log(this.form, '校验成功并提交数据');

          // todo
          // 门店号
          let belongStoreId = '';
          // 业务类型
          let businessCode = '';
          this.form.data.forEach((item, index)=>{
            if (item.attr === 'belongStoreId') {
              let value = item.value;
              if (typeof item.value === 'string') {
                value = JSON.parse(item.value);
              }
              belongStoreId = this.stores[value.id];
            }
            if (item.attr === 'orderType') {
              let newItem = JSON.parse(item.value);
              businessCode = newItem.businessCode;
              this.form.data[index].value = newItem.code;
            }
          });

          console.log(this.params, 'ddd');
          console.log(this.stores);
          console.log(belongStoreId);

          this.$RouteUtil.orderAdd({
            ...this.params,
            belongStoreId,
            businessCode,
            data2: this.form.data
          });
        }
      });
    },
    // 通过负责人联动地面店
    onGetMan(id, initial) {
      console.log(id);
      id && getStoresByUserId(id)
        .then((res)=>{
          console.log(res);
          let isUser = true; // 是否是当前负责人 如果不是的话清空地面店和省市区
          this.form.data.forEach((item, index)=>{
            if (item.attr === 'belongStoreId') {
              this.stores = {};
              res.stores.map((item1)=>{
                this.stores[item1.id] = item1.no;
                return false;
              });

              this.form.data[index].selData.source = res.stores.map((item1, index2) => {
                return {key: item1.name, value: {id: item1.id, ...res.areas[index2]}};
              });
            }
          });

          // 清空联动内容数据
          if (isUser) {
            this.form.data.forEach((item, index)=>{
              if (item.attr === 'belongStoreId' || item.attr === 'belongPlaceId') {
                this.form.data[index].text = '';
                this.form.data[index].value = '';
              }
            });
          }

          // 初始数据保留
          if (initial) {
            this.initData = JSON.stringify(this.form);
          }
        })
        .catch(err=>console.log(err));
    },
    // 选择地面店联动地址
    onStore(obj, initial = false) {
      if (obj) {
        console.log(typeof obj, '==>000');
        if (typeof obj === 'string') {
          obj = JSON.parse(obj);
        }
        if (typeof obj === 'string') {
          obj = JSON.parse(obj);
        }
        console.log(typeof obj, '==>000==>000');
        this.form.data.forEach((item, index) => {
          if (item.attr === 'belongPlaceId') {
            if (!initial) {
              console.log(obj, '==>666');
              console.log(this.form.data[index], '==>111');
              console.log(this.form.data[index].attr, '==>222');
              console.log(obj.address, '==>333');
              console.log(obj.codes, '==>444');
              console.log(obj.codes[obj.codes.length - 1], '==>555');

              this.form.data[index].text = obj.address;
              this.form.data[index].value = obj.codes && `${obj.codes[obj.codes.length - 1]}`;
            }
          }
        });
      }
    },
    // 车信息回调
    onCarModel(obj) {
      console.log(obj, '2233344');
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl";
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
        .self{
          width 48%
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
