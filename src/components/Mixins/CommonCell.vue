<script>
export default {
  name: 'CommonCell',
  props: {
    sort: String,
    hasShadow: Boolean,
    item: Object,
    index: Number
  },
  data() {
    return {
      type: this.$route.params.type,
      module: this.$route.params.module
    };
  },
  computed: {
    showTimeText() {
      switch (this.sort) {
        case 'failTime':
          return `失效时间:${this.removeSecond(this.item.failTime) || '无'}`;
        case 'lastFollowUpTime':
          return `跟进时间:${this.removeSecond(this.item.lastFollowUpTime) || '无'}`;
        case 'nextFollowUpTime':
          return `跟进时间:${this.removeSecond(this.item.nextFollowUpTime) || '无'}`;
        case 'obtainTime':
          return `获取时间:${this.removeSecond(this.item.obtainTime) || '无'}`;
        case 'createTime':
          if (this.module === 'enquiryPrices' || this.module === 'quotedPrices') {
            return `发起询价时间:${this.removeSecond(this.item.createTime) || '无'}`;
          }
          return `创建时间:${this.removeSecond(this.item.createTime) || '无'}`;
        case 'deliveryTime':
          return `交车时间:${this.removeSecond(this.item.deliveryTime) || '无'}`;
        case 'finishTime':
          return `完成时间:${this.removeSecond(this.item.finishTime) || '无'}`;
        case 'updateTime':
          return `跟新时间:${this.removeSecond(this.item.updateTime) || '无'}`;
        case 'clueCreateTime':
          return `线索创建时间:${this.removeSecond(this.item.clueCreateTime) || '无'}`;
        case 'quotedTime':
          return `提交报价时间:${this.removeSecond(this.item.quotedTime) || '无'}`;
        default:
          return `创建时间:${this.removeSecond(this.item.createTime) || '无'}`;
      }

    }
  },
  methods: {
    handleClick() {
      this.$emit('onItemClick', this.item, this);
    },
    getLevelIcon(level) {
      switch (level) {
        case 'A':
          return this.$images.base.level_a;
        case 'B':
          return this.$images.base.level_b;
        case 'C':
          return this.$images.base.level_c;
        case 'H':
          return this.$images.base.level_h;
        case 'N':
          return this.$images.base.level_n;
        case 'S':
          return this.$images.base.level_s;
        default:
          return this.$images.base.level_no;
      }
    },
    removeSecond(dateStr) {
      if (!dateStr) return dateStr;
      return dateStr.split(' ')[0];
    }
  }
};
</script>
