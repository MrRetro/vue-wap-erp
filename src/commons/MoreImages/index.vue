<template>
  <div class="contain">
    <div v-if="showTitle" class="title">{{title}}</div>
    <div class="image-contain">
      <yi-image style="background-size: cover" v-for="(item,index) in showImage" :key="index" :src="item"
                class="image" @click="handleImageClick(index)"/>
    </div>
    <yi-touch v-if="showMore" @click="isShowMore = !isShowMore" class="more-text">{{isShowMore ? '收起图片':'展开图片'}}
      <yi-image class="more-icon" :style="{transform:`rotate(${isShowMore ?  180 : 0}deg)`}"
                :src="$images.base.ic_order_arrow"/>
    </yi-touch>
  </div>
</template>

<script>

import {ddApi} from '../../api/dingding';

export default {
  name: 'MoreImages',
  props: ['title', 'images', 'allData'],
  computed: {
    showImage() {
      return this.showMore && this.isShowMore ? this.images : this.images.filter((item, index) => index < 4);
    },
    showMore() {
      return this.images.length > 4;
    },
    showTitle() {
      return this.images.length !== 0;
    }
  },
  data() {
    return {
      isShowMore: false
    };
  },
  methods: {
    handleImageClick(index) {
      const images = [];
      this.allData.forEach(item=>images.push(...item.images));
      ddApi.previewImage({urls: images, current: this.images[index]});
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/cell.styl"

  .contain {
    margin-bottom px2rem(24)
  }

  .title {
    font-size px2rem(14)
    color $deepBlack
    regular()
    text-align left
    padding-left px2rem(14)
  }

  .image-contain {
    display flex
    flex-wrap wrap
    margin-left px2rem(14)
  }

  .more-text {
    color $themeColor
    font-size px2rem(14)
    line-height px2rem(20)
    regular()
    display flex
    align-items center
    justify-content center
    margin-top px2rem(4)
  }

  .more-icon {
    width px2rem(10)
    height px2rem(6)

    margin-left px2rem(4)
  }

  .image {
    width px2rem(70)
    height px2rem(70)
    border-radius px2rem(4)
    margin px2rem(8) px2rem(16) px2rem(8) 0
  }
</style>
