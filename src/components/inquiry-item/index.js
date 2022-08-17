/**
 * order item组件
 */

Component({
  externalClasses: ['z-class'],
  properties: {
    // 数据
    item: {
      type: Object,
      value: {
        title: '',
        subTitle: '',
        price: ''
      }
    },
    // 订单状态
    statusText: {
      type: String,
      value: ''
    },
    // 是否显示底部按钮
    optShow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 页面事件
   */
  methods: {
    onBtnClick (e) {
      const { id, type, status, detail } = e.currentTarget.dataset
      this.triggerEvent('optclick', { id, type, status, detail })
    }
  }
})
