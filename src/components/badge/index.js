/**
 * badge组件
 */

Component({
  externalClasses: ['z-class'],
  properties: {
    // 角标红点
    dot: {
      type: Boolean,
      value: false
    },
    // 角标内容
    content: {
      type: String,
      optionalTypes: [Number, String],
      value: '',
      observer: '_contentChange'
    },
    // 角标最大值
    maxValue: {
      type: Number,
      value: 99
    }
  },
  data: {
    visibleContent: 0
  },
  methods: {
    _contentChange() {
      const { content, maxValue } = this.data
      const visibleContent = parseInt(content) > parseInt(maxValue) ? `${maxValue}+` : content
      this.setData({ visibleContent })
    }
  }
})
