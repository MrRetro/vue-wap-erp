<template>
  <yi-touch class="cell-contain touch-highlight box-shadow" :class="{'box-shadow':hasShadow}" @click="handleClick">
    <img class="level-icon" v-if="type !== 'customer'"
         :src="getLevelIcon(item.targetLevel ? item.targetLevel.name : '')"/>
    <div class="cell-item first">
      <span class="cell-name">{{item.targetName || '无'}}</span>
      <yi-star v-if="type === 'customer'" :disabled="true" :value="parseInt(item.targetLevel.code)"/>
    </div>
    <div class="cell-item second">
      <span>执行人:{{responiableName || '无'}}</span>
      <span>备注名称:{{item.targetNickname || '无'}}</span>
    </div>
    <div v-if="showCarName" class="cell-item second ellipsis" style="text-align: left">
      <span>车型信息:{{item.carName || '无'}}</span>
    </div>
    <div class="mix-column">
      <div class="cell-label-contain">
        <div v-for="(subItem,i) in labels" :key="i" class="cell-label" :class="{'cell-label-support':subItem.support}">
          {{subItem.name}}
        </div>
      </div>
      <span>跟进时间:{{item.executionTime || '无'}}</span>
    </div>
    <div class="line"></div>
    <yi-more-text ref="more" class="content" :length="39" :content="`变更内容:${item.record}`"/>
  </yi-touch>
</template>

<script>
import CommonCell from '../../components/Mixins/CommonCell';

export default {
  name: 'FollowUpRecordCell',
  mixins: [CommonCell],
  computed: {
    labels() {
      const list = [];
      list.push(this.item.way);
      if (this.item.isImportant) {
        list.push({code: this.item.followId, name: '重点用户', support: true});
      }
      return list;
    },
    showCarName() {
      return this.type === 'clue';
    },
    responiableName() {
      // if (this.type === 'clue' || this.type === 'agent') {
      return this.item.operatorName;
      // }
      // return this.item.responsible ? item.responsible.name : '';
    }
  },
  methods: {
    resetShow() {
      this.$refs.more.resetShow();
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~styles/cell.styl"


</style>

