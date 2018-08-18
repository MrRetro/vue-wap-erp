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
                :selData.sync="item.selData || null"
                :clearMR="item.columnWidth===50"
                @onCarModel="onCarModel"
                @selClue="selClue"
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
import {getAddOrderModule} from '../../../../api/order';
import {inputType} from '../../../../config/module';
import {addUserInfo} from '../../../../api/clue';
import Page from '../../../../components/Mixins/EditPage';
import {ddApi} from '../../../../api/dingding';
import {validate} from '../../../../config/validate';

export default {
  name: 'clue-add',
  extends: Page,
  created() {
    this.$nextTick(()=>{

      let params = this.$route.params;
      console.log(params, 'ddddd');
      let clueInfo = this.params.clueInfo; // 线索回调

      // 设置客户主键
      // this.customer.text = params.customer;

      console.log('--------11111');
      console.log(this.menu);

      let form = this.menu;
      let clueAdditionalConfiguration = form.clueAdditionalConfiguration; // 车型信息
      let outerColor = null; // 外观
      let innerColor = null; // 内饰
      let genderData = form.gender; // 性别
      let clueShoppingWay = form.clueShoppingWay; // 购买方式
      // 店铺


      // 获取添加模版
      getAddOrderModule()
        .then((res)=>{
          console.log(res, '=========================>success1');
          let data1 = [];
          res.forEach((item)=>{
            console.log(item);
            if (item.code === 'create-order') {
              data1 = item.fields;
            }
          });
          // 升序
          data1.sort((a, b)=>a.sort - b.sort);

          console.log(data1, '=========================>data1');
          let data = data1.filter((item)=>{
            return item.description === 'step1';
          });
          let formData = [];
          data.forEach((item)=>{
            let obj = {
              attr: item.attr,
              type: inputType[item.configsObj.type],
              title: item.name,
              text: '',
              value: null,
              placeholder: item.configsObj.placeholder,
              indent: true,
              columnWidth: item.columnWidth,
              selData: {'source': [{'key': '选项一', 'value': 1}, {'key': '选项二', 'value': 2}], 'selectedKey': '下单客户1'}
            };

            if (obj.attr === 'vehicleModelId') {
              obj.singleChoose = true;
            }

            // 跟线索人赋初值
            if (clueInfo && item.attr === 'cluePK') {
              obj.text = clueInfo.clueNo;
              obj.value = clueInfo.id;
              obj.disable = true;
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
              case 'gender':
                obj.selData.source = genderData.map((item1)=>{ return {key: item1.name, value: item1.code}; });
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
              default:

            }
            if ((item.name === '选择线索' || item.attr === 'cluePK') && !clueInfo) {
              console.log('111');
            } else {
              formData.push(obj);
            }
          });

          this.form.data = formData;
          console.log(this.form.data, '---------->>>>>>>>>>');

          clueInfo && this.selClue(clueInfo);

          // 初始数据保留
          this.initData = JSON.stringify(this.form);
        })
        .catch((err)=>{ console.log(err, '==============================>err'); });

    });
  },
  data() {
    return {
      initData: null,
      form: {
        type: 'add',
        // 客户主键
        customer: {
          attr: 'customerPK',
          title: '客户主键',
          text: null
        },
        carName: {
          attr: 'carName',
          title: '成型信息',
          text: null
        },
        data: []
      }
    };
  },
  methods: {
    canGoBack() {
      // 如果有传返回的控制参数,则拦截返回键
      if (this.params.BACK_ACTION) {
        this.$RouteUtil.back(this.params.BACK_ACTION);
        return false;
      }
      return true;
    },
    isEdit() {
      return this.initData !== JSON.stringify(this.form);
    },
    onBtnClick() {
      console.log('新建订单1');
      const arr = this.$refs.va.map((item)=>{
        return item.changeV();
      });
      Promise.all(arr).then(data => {
        let state = data.every(item => item);
        if (state) {
          console.log(this.form, '校验成功并提交数据');

          // todo
          let items = {};
          this.form.data.forEach((item)=>{
            if (item.attr !== 'group') {
              let val = '';
              if (item.value) {
                val = item.value;
              } else {
                val = item.value === 0 ? 0 : item.text;
              }
              console.log(val, 'item');

              if (item.attr === 'vehicleModelId') {
                this.form.carName.text = item.text;
              }

              items[item.attr] = val;
            }
          });
          console.log(items, '==>items');

          // 用户信息
          let userInfo = {};
          userInfo.name = items.name;
          userInfo.mobile = items.mobile;
          userInfo.gender = items.gender;

          addUserInfo(userInfo)
            .then((res)=>{
              console.log(res, 222);

              // 处理外观和内饰为无的情况
              let list = this.form.data;
              list.forEach((item, index)=>{
                let val = '';
                if (item.value) {
                  val = item.value;
                } else {
                  val = item.value === 0 ? 0 : item.text;
                }
                console.log(val, 'item');

                // 转换外观和内饰格式
                if (item.attr === 'appearance') {
                  if (val === '无') {
                    val = null;
                  } else {
                    val = val && JSON.stringify(val) || '';
                  }
                  list[index].text = val;
                  list[index].value = val;
                }

                // 转换外观和内饰格式
                if (item.attr === 'interior') {
                  if (val === '无') {
                    val = null;
                  } else {
                    val = val && JSON.stringify(val) || '';
                  }
                  list[index].text = val;
                  list[index].value = val;
                }
              });
              this.form.customer.text = res.id;
              list.push(this.form.customer);
              list.push(this.form.carName);

              console.log(list);

              if (res.isExist) {
                // 下一步
                this.$RouteUtil.orderAddTwo({...this.params, info: res, data1: list});
              } else {
                console.log(list);
                this.$RouteUtil.orderAddThree({
                  ...this.params,
                  data1: list
                });
              }
            })
            .catch((err)=>{ console.log(err, '888'); });

        }
      });
    },
    // 车信息回调
    onCarModel(obj, initial) {
      console.log(obj, '2233344');

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

      console.log(this.form, '2233355');
    },
    // 线索回调
    selClue(obj) {
      console.log(obj, ' 123 ');

      this.form.data.forEach((item, index)=>{
        if (item.attr === 'vehicleModelId') {
          this.form.data[index].text = obj.carName;
          this.form.data[index].value = obj.vehicleModelId;
        }
        // 外观
        if (item.attr === 'appearance') {
          let outColor = JSON.parse(obj.appearance);
          this.form.data[index].text = outColor && outColor.name;
          this.form.data[index].value = outColor || null;
        }

        // 内饰
        if (item.attr === 'interior') {
          let innerColor = JSON.parse(obj.interior);
          let name = innerColor && innerColor.colors && innerColor.colors[0].name;
          if (innerColor.colors && innerColor.colors[1]) {
            name += `/${innerColor.colors[1].name}`;
          }
          this.form.data[index].text = name;
          this.form.data[index].value = innerColor || null;
        }

        // 客户名称
        if (item.attr === 'name') {
          this.form.data[index].text = obj.name;
          this.form.data[index].value = obj.name;
        }

        // 客户电话
        if (item.attr === 'mobile') {
          this.form.data[index].text = obj.mobile;
          this.form.data[index].value = obj.mobile;
        }

        // 客户性别
        if (item.attr === 'gender') {
          this.form.data[index].text = obj.gender.name;
          this.form.data[index].value = obj.gender.code;
        }

        // 购车方式
        if (item.attr === 'shoppingWay') {
          this.form.data[index].text = obj.shoppingWay.name;
          this.form.data[index].value = obj.shoppingWay.code;
        }
      });

      obj.vehicleModelId && getModelDetail(obj.vehicleModelId)
        .then((res1)=>{
          console.log(res1, 'res1');
          this.onCarModel({data: res1}, true);
        })
        .catch((err)=>console.log(err));
    }
  },
  activated() {
    ddApi.setRight();
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
