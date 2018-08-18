<template>
  <div class="suc-box">
    <img class="img" :src="$images.all.ico_ok" alt="img">
    <p class="p-name">创建成功</p>
    <p class="p-word"><span v-if="name">{{ name }} </span><span v-if="customerNo">(客户编号:{{ customerNo }})</span></p>
    <yi-touch component-name="p" class="p-btn" @click="onBtnClick">
      <span>查看详情</span></yi-touch>
  </div>
</template>

<script>

export default {
  name: 'add-success',
  props: {
    name: {
      type: String
    },
    customerNo: {
      type: String
    },
    id: {
      type: String
    },
    module: String,
    type: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      params: this.$route.params
    };
  },
  methods: {
    onBtnClick() {
      this.$RouteUtil.commonDetail({...this.params, id: this.id, module: this.module, type: this.type});
      console.log('订单id:', this.id);

      // 路由后退
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"
  .suc-box {
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    display flex
    flex 1
    overflow-y auto
    flex-direction column
    align-items center

    .img {
      width px2rem(60)
      margin-top px2rem(60)
    }
    .p-name {
      font-size px2rem(20)
      color #31363B
      margin-top px2rem(30)
    }
    .p-word {
      font-size px2rem(14)
      color $darkBlack
      margin-top px2rem(10)
    }
    .p-btn {
      display flex
      flex-direction row
      justify-content center
      width calc(100% - 30px)
      margin px2rem(0) px2rem(15)
      border-radius px2rem(4)
      height px2rem(50)
      line-height px2rem(50)
      text-align center
      background-color #348EED
      color white
      font-size px2rem(16)
      margin-top px2rem(60)

      &:active {
        opacity .8
      }
    }
  }
</style>
