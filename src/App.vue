<template>
  <yi-container id="app" :show-loading="showLoading" :show-error="showError" :error-message="errorMessage"
                :error-btn-params="errorBtnParams">
    <NavBar v-if="DEV" :title="title" :right="right" :menus="menus"/>
    <transition :name="transitionName">
      <!--<navigation>-->
      <!--<router-view></router-view>-->
      <!--</navigation>-->
      <!--<router-view v-if="!isPush"></router-view>-->
      <keep-alive>
        <router-view v-if="!showLoading && !showError" :key="$route.path"></router-view>
      </keep-alive>
      <!--<keep-alive v-else>-->
      <!--<router-view :key="$route.path"></router-view>-->
      <!--</keep-alive>-->
    </transition>
    <GlobalWindow/>
  </yi-container>
</template>
<script>
import {mapState} from 'vuex';
import NavBar from './components/Container/components/NavBar';
import {RUN_IN_DD} from './config';
import {setVue} from './api/dingding';
import GlobalWindow from './components/PopWindow';
import {AlertUtil} from './utils/AlertUtil';
import {authConfig} from './config/dingding';

export default {
  name: 'App',
  components: {
    NavBar,
    GlobalWindow
  },
  data() {
    return {
      transitionName: 'slide-go',
      isPush: true,
      DEV: !RUN_IN_DD,
      showError: false,
      showLoading: true,
      errorMessage: '',
      errorBtnParams: {
        title: '重试',
        click: () => this.authConfig()
      }
    };
  },
  computed: {
    ...mapState({
      title: state => state.nav.title,
      right: state => state.nav.right,
      menus: state => state.nav.menus
    })
  },
  watch: {
    $route() {
      let isPush = this.$router.isPush;
      let anim = this.$router.anim;
      this.isPush = isPush;
      this.transitionName = isPush ? 'slide-go' : 'slide-back';
      if (!anim) this.transitionName = '';
      this.$router.isPush = false;
      this.$router.anim = true;
      // 路由变化时隐藏所有全局弹窗
      AlertUtil.hide();
    }
  },
  methods: {
    authConfig() {
      this.showLoading = true;
      authConfig(this.$store)
        .then(() => {
          this.showError = false;
          this.showLoading = false;
        })
        .catch(e => {
          this.showError = true;
          this.showLoading = false;
          this.errorMessage = e.message;
        })
        .finally(() => {
          // 隐藏启动页
          let elementById = document.getElementById('appSplashScreen');
          if (elementById) {
            elementById.style.opacity = 0;
            setTimeout(() => elementById.remove(), 1000);
          }
        })
      ;
    }
  },
  mounted() {
    AlertUtil.vueInstance = this;
    setVue(this);
    // 配置钉钉
    this.authConfig();
    // 调用 $eventBus.$emit('reInit') 重新配置
    $eventBus.$on('reInit', () => this.authConfig());
  },
  destroyed() {
    $eventBus.$off('reInit');
  }
};
</script>

<style lang="stylus">
  @import "~styles/global.styl"
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    display: flex;
    flex: 1;
    font-size: px2rem(16) !important;
    regular()
  }

  .cube-view {
    position absolute
    top 0
    bottom 0
    left 0
    right 0
  }

  .v--modal {
    background transparent
  }

  .bg >>> .v--modal-overlay {
    background transparent
  }

</style>
