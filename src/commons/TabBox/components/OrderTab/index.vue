<template>
  <div class="contain">
    <div class="section-title">订单信息</div>
    <!--<div class="info-contain">-->
    <list-box :form="orderInfo"/>
    <!--<div>-->
    <!--<div v-for="(item,index) in orderInfo" :key="index" class="item">{{item.title}}：</div>-->
    <!--</div>-->
    <!--<div>-->
    <!--<div v-for="(item,index) in orderInfo" :key="index" class="item value">{{item.value || '无'}}</div>-->
    <!--</div>-->
    <!--</div>-->
    <div v-if="!showEmpty" class="section-title accessory">附件信息</div>
    <MoreImages v-for="(item,index) in allData.orderFileCabinetList" :key="index"
                :all-data="allData.orderFileCabinetList"
                :title="item.title" :images="item.images"/>
  </div>
</template>

<script>
import CommonTab from '../CommonTab';
import MoreImages from '../../../MoreImages';
import ListBox from '../../../../views/ListBox';


export default {
  components: {
    CommonTab,
    MoreImages,
    ListBox
  },
  name: 'OrderTab',
  props: ['allData'],
  computed: {
    orderInfo() {
      const {carName, name, mobile, carPrice, deposit, totalAmount, outColor, inColor} = this.allData;
      return [
        {title: '姓名', value: name},
        {title: '电话', value: mobile},
        {title: '车型信息', value: carName},
        {title: '外观', value: outColor},
        {title: '内饰', value: inColor},
        {title: '合同应收款', value: `￥${totalAmount}`},
        {title: '客户定金收取', value: `￥${deposit}`},
        {title: '车身售价', value: `￥${carPrice}`}
      ];
    },
    showEmpty() {
      return this.allData.orderFileCabinetList.filter(item => item.images.length !== 0).length === 0;
    }
  },
  data() {
    return {
      module: this.$route.params.module,
      type: this.$route.params.type
    };
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"

  .contain {
    margin-top px2rem(4)
  }

  .section-title {
    medium()
    margin-left px2rem(14)
    color $deepBlack
    font-size px2rem(16)
    padding-top px2rem(16)
    margin-bottom px2rem(6)
    line-height px2rem(22)
    text-align left
  }

  .accessory {
    margin-bottom px2rem(16)
  }

  .info-contain {
    margin 0 px2rem(14)
    display flex
    .item {
      color $darkBlack
      font-size px2rem(14)
      line-height px2rem(20)
      text-align left
      margin px2rem(8) 0
    }

    .value {
      color $deepBlack
    }
  }

</style>
