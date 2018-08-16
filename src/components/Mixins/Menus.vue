<script>
import User from './User';
import {menus} from '../../config/menus';

export default {
  mixins: [User],
  computed: {
    menus() {
      // 用户权限列表读取成功过滤掉没有权限的按钮
      if (JSON.stringify(this.userAuths) === '{}') {
        return [];
      }
      let filter = (item) => {
        return !(item.auth && !this.userAuths[item.auth]);
      };
      let list = menus.filter(filter);
      list.forEach(item =>
        item.menus = item.menus.filter(filter)
      );
      return list;
    }
  }
};
</script>
