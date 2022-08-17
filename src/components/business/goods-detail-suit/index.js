/**
 * 详情页面底部购买组件
 */
Component({
  externalClasses: ['z-class'],

  // 属性
  properties: {
    suit: {
      type: Array,
      value: []
    },
    type: {
      type: Number,
      value: 0
    }
  },
  // 组件方法
  methods: {
    /**
     * 页面事件
     */
    onAdd (e) {
      const { item } = e.currentTarget.dataset
      this.triggerEvent('buysuit',item)
    }
  }
})
