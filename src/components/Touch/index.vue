<template>
  <component
    :is="componentName"
    :style="style"
    v-if="isOpen"
    :src="src"
    @click.stop="click"
    @touchstart="touchStart"
    @touchend="touchEnd">
    <!--<div-->
    <!---->
    <!--&gt;-->
    <slot/>
    <!--</div>-->
  </component>
</template>

<script>
let lastExecuteTime = 0;
/**
   * 是否连续快速执行两次方法
   * @param time  延迟时间
   * @returns {boolean}
   */
const isFastExecute = (time = 100) => {
  if (Date.now() - lastExecuteTime < time) {
    return true;
  }
  lastExecuteTime = Date.now();
  return false;
};

export default {
  name: 'index',
  props: {
    componentName: {
      type: String,
      default: 'div'
    },
    auth: {
      type: String
    },
    type: {
      type: String, // 点击类型 enum('opacity','highLight')opacity点击0.5透明度 highLight点击灰色
      default: 'opacity'
    },
    underlayColor: {
      type: String,
      default: '#f6f6f6' // 点击的背景色
    },
    opacity: {
      type: Number,
      default: 0.5
    },
    disabled: {
      type: Boolean,
      default: false
    },
    src: {
      type: String
    }
  },
  data() {
    return {
      touch: false
    };
  },
  computed: {
    style() {
      if (!this.touch) return '';
      switch (this.type) {
        case 'opacity':
          return `opacity:${this.opacity}`;
        case 'highLight':
          return `background-color:${this.underlayColor}`;
        default:
          return '';
      }
    },
    /**
       * 根据权限是否显示按钮
       * @returns {auth|{type}|*|string}
       */
    isOpen() {
      return !this.auth || (this.auth && this.$store.state.user.userAuths[this.auth]);
    }
  },
  mounted() {
    this.callback = (ins) => {
      this.touch = ins === this;
    };
    // 设置监听,只有接收到的touch组件为自己，才改变
    $eventBus.$on('yi-touch-event', this.callback);
  },
  destroyed() {
    $eventBus.$off('yi-touch-event', this.callback);
  },
  methods: {
    touchStart() {
      // 只发送第一个触摸start事件
      if (!isFastExecute(200) && !this.disabled) {
        $eventBus.$emit('yi-touch-event', this);
      }
    },
    touchEnd() {
      this.touch = false;
    },
    click(e) {
      !this.disabled && this.$emit('click', e);
    }
  }
};
</script>
