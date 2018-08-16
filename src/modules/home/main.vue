<template>
  <div v-if="menuLength !== 0" class="dragging-box" :class="'show'">
    <cube-scroll>
      <div class="drag-content" :class="'show'">
        <div class="menu-list">
          <template v-for="(item,i) in menus">
            <div :key="item.id" v-if="item.menus.length !== 0" class="menu-li">
              <p class="title">{{item.name}}</p>
              <ul class="item-box">
                <yi-touch
                  component-name="li"
                  v-for="(subItem,index) in item.menus"
                  :key="subItem.id"
                  class="item-li"
                  rel="subItem.id"
                  type="highLight" :auth="subItem.auth"
                  @click="selectById(i,index)"
                >
                  <div>
                    <p class="p-word">
                      <yi-image class="img" :src="subItem.icon"/>
                      <span class="name">{{subItem.name}}</span>
                    </p>
                  </div>
                </yi-touch>
              </ul>
            </div>
          </template>
          <div>我是测试员123</div>
        </div>
      </div>
    </cube-scroll>
  </div>
  <div v-else class="app-init">
    <yi-error-view message="您还未配置权限,请联系大区负责人开通" :src="$images.base.ic_key" :hide-btn="false"/>
  </div>
</template>

<script>

import Menus from '../../components/Mixins/Menus';
import {BackHandler} from '../../utils/handleBack';

export default {
  name: 'main-menu',
  mixins: [Menus],
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    menuData: {
      type: Array
    }
  },
  methods: {
    selectById(section, index) {
      console.log(section, index);
      this.menus[section].menus[index].route();
      // alert('点击');
    }
  },
  computed: {
    menuLength() {
      return this.menus.filter(item=>item.menus.length !== 0).length;
    }
  },
  activated() {
    BackHandler.addBackListener(() => {
    });
  },
  deactivated() {
    BackHandler.remove();
  },
  destroyed() {
    BackHandler.remove();
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/global.styl"
  .dragging-box {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: white;
    z-index: 1001;

    animation-duration: .5s;
    animation-fill-mode: both;

    .drag-content {
      display flex
      flex 1
      flex-direction column
      animation-duration: .3s;
      animation-fill-mode: both;

      .zhezhao {
        position: absolute;
        width: 100%
        height: 40px;
        top: 0px;
        left: 0px;
      }
    }
    .drag-content.show {
      /*animation-name: fadeInUp;*/
    }
    .drag-content.hide {
      /*animation-name: fadeOutDown;*/
    }
  }

  .dragging-box.show {
    animation-name: fadeIn;
  }

  .dragging-box.hide {
    animation-name: fadeOut;
  }

  .dragging-box .p-info {
    background-color: white;
    font-size: 14px;
    color: #c1c1c1;
    line-height: 20px;
    margin-bottom 12px
  }

  .dragging-box .menu-list {
    display: block;
    flex-direction: column;
    flex: 1;
    width: 100%;
    margin-top: 0px;
    background-color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow-y: auto;
  }

  .dragging-box .menu-li {
    width: 100%;
    padding-bottom 20px
    border-top: 10px solid #f3f3f3;

    &:nth-child(1) {
      border: none;
    }
  }

  .dragging-box .menu-li .title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 15px;
    font-size: 16px;
    color: #31363B;
    margin-top 20px
    padding-bottom 20px
    medium()
  }

  .dragging-box .menu-li .item-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    font-size: 12px;
    color: #8D8D8D;
    /*border-bottom: 1px solid #f3f3f3;*/
  }

  .dragging-box .menu-li .item-box .p-word {
    display flex
    flex-direction column
    align-items center
    padding 10px 0px
  }

  .dragging-box .menu-li .item-box .item-li {
    display: flex;
    width: 20%;
    flex-direction: column;
    justify-content: center;
    /*padding-top: 20px;*/
    /*padding-bottom: 10px;*/
  }

  .dragging-box .menu-li .item-box .item-li .img {
    width: px2rem(28);
    height: px2rem(28);
    display: inline-block;
    border-radius: 4px;
    margin-bottom: 4px;
  }

  .dragging-box .menu-li .item-box .item-li .name {
    line-height 17px
  }

  @keyframes fadeIn {
    from {
      opacity 0
    }

    to {
      z-index 1000
      opacity 1
    }
  }

  @keyframes fadeOut {
    from {
      opacity 1
    }

    to {
      z-index -1
      opacity 0
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
  }
</style>

