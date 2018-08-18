<template>
  <AddSuccess
    :name="name"
    :id="id"
    :customerNo="customerNo"
    module="order"
  />
</template>

<script>
import AddSuccess from '../../../../views/AddSuccess/index';
import Page from '../../../../components/Mixins/BasePage';
import {ddApi} from '../../../../api/dingding';

export default {
  name: 'index',
  extends: Page,
  components: {
    AddSuccess
  },
  mounted() {
    // 接收参数
    console.log(this.$route);
    if (this.params) {
      this.name = this.params.name;
      this.id = this.params.id;
      this.customerNo = this.params.customerNo;
    }
  },
  activated() {
    ddApi.setRight();
  },
  data() {
    return {
      id: '',
      name: '',
      customerNo: ''
    };
  },
  methods: {
    canGoBack() {
      // 如果有传返回的控制参数,则拦截返回键
      if (this.params.BACK_ACTION) {
        this.$RouteUtil.back(this.params.BACK_ACTION);
        return false;
      }
      return true;
    }
  }
};
</script>

<style scoped>

</style>
