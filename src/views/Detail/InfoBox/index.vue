<template>
  <div class="info-box">
    <div class="items">
      <template v-for="(item,index) in data">
        <p v-if="item.type === 'star'" class="item" :key="index"><span class="left">{{item.title}}: </span>
          <yi-star v-model="item.value" :disabled="true"></yi-star>
        </p>
        <yi-touch v-else-if="item.type === 'mobile'" :key="index" @click="onTelClick(item.value)" class="item">
          <span class="left">{{item.title}}: </span>
          <span class="tel">
            <span>{{ item.value || '无'}}</span>
            <img v-if="item.value" :src="$images.all.ico_phone" alt="img">
          </span>
        </yi-touch>
        <p v-else-if="item.type === 'distance'" :key="index" class="item">
          <span class="left">{{item.title}}: </span>
          <span class="tel">
            <span>{{ item.value  || '无'}}</span>
            <img :src="$images.base.ic_map" alt="img">
          </span>
        </p>
        <yi-touch v-else-if="item.type === 'cancel'" :key="index" @click="onCancelClick(item)" class="item">
          <span class="left">{{item.title}}: </span>
          <span class="cancel">
            <span>{{ item.value  || '无'}}</span>
            <img :src="$images.order.ic_cancel" alt="img">
          </span>
        </yi-touch>
        <div v-else-if="item.type === 'single'" :key="index" class="item"
             style="width:100%;justify-content: center;padding: 0 10px">
          {{ sliceStr(item.value) }}
        </div>
        <yi-touch v-else-if="item.type === 'copy'" @click="onCopyClick(item.value)" class="item" :key="index"><span
          class="left">{{item.title}}:</span><span>{{ item.value  || '无'}}</span></yi-touch>
        <div v-else class="item ellipsis" :key="index"><span
          class="left">{{item.title}}:</span><span class="ellipsis">{{ item.value  || '无'}}
        </span>
        </div>
      </template>
      <yi-touch v-if="module !== 'followUpPlans'" class="item more" :class="{match: data.length%2 === 0}"
                @click="onMoreClick">
        <span class="left">更多资料</span>
        <yi-image class="img-angle" :src="$images.base.ic_next_grey" alt="img"/>
      </yi-touch>
    </div>
  </div>
</template>

<script>
import {ddApi} from '../../../api/dingding';
import {AlertUtil} from '../../../utils/AlertUtil';

export default {
  name: 'info-box',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      module: this.$route.params.module
    };
  },
  methods: {
    // 点击更多回调
    onMoreClick() {
      this.$emit('onMore');
    },
    sliceStr(value) {
      let l = 51;
      return value.length > l ? `${value.slice(0, l)}...` : value;
      // return value;
    },
    // 拨通电话号码
    onTelClick(tel) {
      if (!tel || !/^1\d{10}$/.test(tel)) return;
      ddApi.showCallMenu({phoneNumber: tel});
    },
    // 查看取消原因
    onCancelClick(item) {
      AlertUtil.showDialog({title: item.message, message: `${item.hint}`});
    },
    onCopyClick(text) {
      if (text) {
        ddApi.setData({text, onSuccess: () => AlertUtil.showToast({txt: `${text}已经复制到剪贴板`})});
      }
    }
  }

};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"
  .info-box {
    display flex
    flex-direction column

    .items {
      display flex
      width 100%
      flex-direction row
      flex-wrap wrap
      justify-content flex-start

      .item {
        font-size px2rem(14)
        color $darkBlack
        display flex
        position relative
        flex-direction row
        line-height px2rem(48)
        align-items center
        width 50%
        height px2rem(48)
        text-align left
        border-bottom 1px solid #f5f5f5

        &:nth-child(2n+1):before {
          content ''
          position absolute
          width 1px
          height 100%
          top 0
          right 0
          background-color #f5f5f5

        }

        .line2 {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        & >>> .cube-rate-item {
          width px2rem(15)
        }
        .left {
          margin-left px2rem(15)
          margin-right px2rem(2)
        }
        .tel {
          display flex
          height 100%
          flex-direction row
          align-items center
          color #348EED

          img {
            width px2rem(12)
            height px2rem(13)
            margin-left px2rem(6)
          }
        }
        .cancel {
          display flex
          height 100%
          flex-direction row
          align-items center
          color #EF465B

          img {
            width px2rem(13)
            height px2rem(13)
            margin-left px2rem(6)
            margin-bottom 1px
          }
        }
        .img-angle {
          width px2rem(10)
          height px2rem(10)
          margin-right px2rem(15)
          margin-left px2rem(10)
        }
        &.more {
          justify-content space-between
          color $darkBlack
        }
        &.match {
          width 100%
          justify-content center
          color $darkBlack
        }
      }
    }
  }
</style>
