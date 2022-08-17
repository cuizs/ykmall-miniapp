/**
 * order item组件
 */

Component({
  externalClasses: ['z-class'],
  properties: {
    // 券样式
    type:{
      type: Number,
      value: 0
    },
    // 券信息
    item:{
      type: Object,
      value: {}
    }
  },

  /**
   * 页面事件
   */
  methods: {
    onClickCard(e){
      const {item} = this.data
      this.triggerEvent('cardClick', item)
    },
  }
})
