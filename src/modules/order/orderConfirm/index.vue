<template>
  <yi-container>
    <cube-scroll>
      <div v-for="(item,index) in orderInfo" :key="index" class="item-contain">
        <div class="section-text">{{item.title}}</div>
        <div v-if="!item.isFileInfo" class="info-contain">
          <div>
            <div v-for="(t,index) in item.data" :key="index" class="item">{{t.title}}：</div>
          </div>
          <div>
            <div v-for="(t,index) in item.data" :key="index" class="item value">{{t.value}}</div>
          </div>
        </div>
        <div v-else class="file-contain">
          <MoreImages v-for="(t,index) in item.data" :key="index" :all-data="item.data" :title="t.title" :images="t.images"/>
        </div>
        <div v-if="index !== orderInfo.length-1" class="line-space"></div>
      </div>
    </cube-scroll>
    <yi-btn-box :name="btnTitle" @onBtnClick="handleSureClick"/>
  </yi-container>
</template>

<script>

import CommonTab from '../../../commons/TabBox/components/CommonTab/index';
import MoreImages from '../../../commons/MoreImages/index';
import {affirmOrder} from '../../../api/order';
import Page from '../../../components/Mixins/BasePage';
import {ddApi} from '../../../api/dingding';

export default {
  name: 'OrderConfirm',
  extends: Page,
  components: {MoreImages, CommonTab},
  data() {
    const {orderFileCabinetList, deposit, totalAmount, gender, carPrice, carName, outColor, inColor, orderNo, name, mobile}
        = this.$route.params.params;
    return {
      state: this.$route.params.state,
      orderInfo: [
        {
          title: '客户信息',
          data: [{title: '姓名', value: name},
            {title: '电话', value: mobile},
            {title: '性别', value: gender && gender.name},
            {title: '订单编号', value: orderNo}]
        },
        {
          title: '车型信息',
          data: [{title: '车型信息', value: carName},
            {title: '外观', value: outColor},
            {title: '内饰', value: inColor}]
        },
        {
          title: '合同信息',
          data: [{title: '合同应收款', value: `￥${totalAmount}`},
            {title: '客户定金收取', value: `￥${deposit}`},
            {title: '车身售价', value: `￥${carPrice}`}]
        },
        {
          title: '附件信息',
          isFileInfo: true,
          data: orderFileCabinetList
        }]
    };
  },
  computed: {
    btnTitle() {
      switch (this.state) {
        case 1:
          return '确认合同';
        case 2:
          return '发起订车';
        default:
          return '确认合同';
      }
    }
  },
  activated() {
    ddApi.setRight({
      text: '编辑',
      onSuccess: () => {

      }
    });
  },
  methods: {
    async handleSureClick() {
      const {id, onSuccess} = this.params;
      await affirmOrder(id);
      onSuccess && onSuccess();
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"

  .line-space {
    height px2rem(10)
    background-color #f3f3f3
  }

  .item-contain {
    margin px2rem(16) 0
  }

  .section-text {
    line-height px2rem(22)
    margin-top px2rem(4)
    color $deepBlack
    font-size px2rem(16)
    padding-left px2rem(14)
    text-align left
    medium()
  }

  .info-contain {
    margin px2rem(8) px2rem(14)
    display flex
    .item {
      color $darkBlack
      font-size px2rem(14)
      line-height px2rem(20)
      text-align left
      padding px2rem(8) 0
    }

    .value {
      color $deepBlack
    }
  }

  .file-contain {
    margin-top px2rem(16)
    padding-bottom px2rem(20)
  }

</style>
