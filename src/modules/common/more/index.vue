<template>
  <div class="more-box">
    <cube-scroll>
      <template v-if="form.type === 'section'">
        <div v-for="(item,index) in form.data" :key="index">
          <p v-show="item.data.length !== 0" class="title">{{item.title}}</p>
          <list-box
            :form="item.data"
          />
          <!--<p class="bord" v-if="index !== form.data.length -1"></p>-->
        </div>
      </template>
      <list-box
        v-else
        :form="form.data"
      />
    </cube-scroll>
  </div>
</template>

<script>
import {ddApi} from '../../../api/dingding';
import ListBox from '../../../views/ListBox/index';
import {config} from './config';
import Page from '../../../components/Mixins/BasePage';

export default {
  name: 'CommonDetailMore',
  extends: Page,
  components: {
    ListBox
  },
  data() {
    return {
      id: this.$route.params.id
    };
  },
  computed: {
    form() {
      return config[this.params.module].transformData(this.params.params);
    }
  },
  activated() {
    ddApi.setRight(config[this.params.module].rightTitleParams(this));
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"
  .more-box {
    display flex
    flex 1
    flex-direction column
    overflow-y auto
    position absolute
    left 0
    top 0
    width 100%
    height 100%
  }

  .title {
    text-align left
    font-size px2rem(16)
    color $deepBlack
    padding-left px2rem(14)
    margin-top px2rem(28)
    line-height px2rem(20)
    semibold()
  }

  .bord {
    display flex
    width 100%
    height px2rem(10)
    background-color #f3f3f3
    margin-top px2rem(24)
    margin-bottom px2rem(20)
  }
</style>
