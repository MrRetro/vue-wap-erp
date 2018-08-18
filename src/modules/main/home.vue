<template>
    <div class="home-box">
      <div class="head">
        <p class="left">
          <img src="" alt="" />
          <span class="title">数据看板</span>
        </p>
        <div class="right">
          <p class="sel-box">
            <span class="word">本月</span>
            <img src="" alt="" />
          </p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'home-box'
};
</script>

<style lang="stylus" scoped>
@import "~styles/global.styl";
.home-box{
  display flex
  flex-direction column
}
</style>
