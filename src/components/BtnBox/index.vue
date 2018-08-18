<template>
  <yi-touch class="btn-box" :disabled="disabled" @click="onBtnClick">
    <p class="p-name">
      <yi-image v-if="icon" class="icon" :src="icon"/>
      <img v-if="add" class="add" :src="$images.all.ico_add"/>
      {{ name }}
    </p>
  </yi-touch>
</template>

<script>

export default {
  name: 'index',
  props: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String
    },
    add: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    onBtnClick() {
      this.$emit('onBtnClick');
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"
  .btn-box {
    display flex
    background-color #348EED
    .icon{
      width px2rem(14)
      height px2rem(14)
      margin-right px2rem(4)
    }
    .add{
      width px2rem(11)
      height px2rem(11)
      margin-right px2rem(4)
    }
    .p-name {
      display flex
      flex 1
      height px2rem(50)
      justify-content center
      align-items center
      font-size px2rem(16)
      color white

      &:active {
        opacity .8
      }
    }
  }
</style>
