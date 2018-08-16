<template>
  <cube-scroll
    class="scroll"
    ref="scroll"
    :data="data"
    :scroll-events="scrollEvents"
    :options="options"
    @scroll="scroll"
    @scroll-end="scrollEnd"
    @before-scroll-start="beforeScrollStart"
    @pulling-down="onPullingDown"
    @pulling-up="onPullingUp"
  >
    <!--下拉刷新组件-->
    <template slot="pulldown" slot-scope="props">
      <div
        v-if="props.pullDownRefresh"
        class="cube-pulldown-wrapper"
        :style="props.pullDownStyle">
        <!--<cube-loading-->
        <!--class="before-trigger"-->
        <!--:style="{paddingTop: props.bubbleY + 'px'}"-->
        <!--v-if="props.beforePullDown"/>-->
        <div
          v-if="props.beforePullDown"
          :style="{paddingTop: props.bubbleY + 'px'}"
        >
          <!--<span :class="{rotate: props.bubbleY > 40}">↓</span>-->
          <cube-loading/>
        </div>
        <div class="after-trigger text" v-if="!props.beforePullDown">
          <div v-if="props.isPullingDown">
            <cube-loading/>
          </div>
          <div v-else><span>刷新成功</span></div>
        </div>
      </div>
    </template>
    <!--下拉刷新组件-->

    <!--内容区域-->
    <slot name="header">
      <div class="place-view"></div>
    </slot>
    <slot v-for="(item,i) in data" :item="item" :index="i">
    </slot>
    <slot name="empty">
      <div v-if="showEmpty" class="empty-contain">
        <yi-image class="empty-icon" :src="emptyIcon"/>
        <div class="empty-text">{{emptyText}}</div>
      </div>
    </slot>
    <slot name="footer"/>
    <!--内容区域-->

    <!--上拉加载组件-->
    <template slot="pullup" slot-scope="props">
      <div
        v-if="props.pullUpLoad"
        class="cube-pullup-wrapper"
      >
        <div class="after-trigger text">
          <div style="display: flex;align-items: center;" v-if="props.isPullUpLoad && !noMoreData">
            <div>上拉加载中...</div>
            <cube-loading/>
          </div>
          <div v-else><span>{{pullUpText}}</span></div>
        </div>
      </div>
    </template>
    <!--上拉加载组件-->
  </cube-scroll>
</template>

<script>

export default {
  name: 'List',
  props: {
    data: Array,
    enabledPullDown: {
      type: Boolean,
      default: true
    },
    enabledPullUp: {
      type: Boolean,
      default: true
    },
    showEmptyView: {
      type: Boolean,
      default: true
    },
    noMoreData: Boolean,
    emptyText: {
      type: String,
      default: '暂无记录'
    },
    emptyIcon: {
      type: String,
      default: require('../../assets/images/base/img_record.png')
    },
    scrollEvents: {
      type: Array // 三个选择 ['scroll','before-scroll-start','scroll-end']
    }
  },
  computed: {
    showEmpty() {
      return this.data.length === 0 && this.showEmptyView;
    },
    pullUpText() {
      return this.noMoreData ? '数据已全部加载完成' : '加载更多';
    },
    options() {
      let options = {};
      if (this.enabledPullDown) {
        options.pullDownRefresh = {
          threshold: 90,
          stop: 40
        };
      }
      if (this.enabledPullUp && !this.showEmpty) {
        options.pullUpLoad = {
          threshold: 0
        };
      }
      return options;
    }
  },
  data() {
    return {
      showTop: false
    };
  },
  methods: {
    onPullingDown() {
      this.$emit('pulling-down');
    },
    onPullingUp() {
      if (this.showEmpty || this.noMoreData) return;
      this.$emit('pulling-up');
    },
    scroll(event) {
      this.$emit('scroll', event);
    },
    beforeScrollStart() {
      this.$emit('before-scroll-start');
    },
    scrollEnd(event) {
      this.$emit('scroll-end', event);
    },
    /**
       * 滑动到具体位置
       * @param x
       * @param y
       * @param time   时间
       * @param easing 缓动函数
       */
    scrollTo(x, y, time, easing) {
      this.$refs.scroll.scrollTo(x, y, time, easing);
    },
    forceUpdate() {
      this.$refs.scroll.forceUpdate();
    },
    enable() {
      this.$refs.scroll.enable();
    },
    disable() {
      this.$refs.scroll.disable();
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"

  .scroll {
    width 100%
    height 100%
  }

  .text {
    color $darkBlack
    regular()
    font-size px2rem(14)
  }

  .empty-text {
    color $darkBlack
    regular()
    font-size px2rem(14)
    margin-top px2rem(15)
  }

  .empty-icon {
    width px2rem(92)
    height px2rem(70)
    margin-top px2rem(50)
  }

  .empty-contain {
    display: flex;
    /*margin-top 50%*/
    flex-direction: column
    align-items center
    justify-content center
  }

  .place-view {
    height: px2rem(10)
  }

</style>
