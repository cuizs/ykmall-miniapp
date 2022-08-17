/**
 * LOADING 组件
 */
import propertyBehavior from '../../_behavior/property-behavior'

Component({
  behaviors: [propertyBehavior],
  options: {
    addGlobalClass: true
  },
  properties: {
    // 是否蒙层
    mask: {
      type: Boolean,
      value: false
    },

    // 是否固定
    fixed: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 显示
    visible: false,
    // 动画
    hideAnimateClass: ''
  },
  methods: {
    _onTouchMove() {
      return
    },

    // 显示加载视图
    show(objc = {}) {
      objc = objc || {}
      this.setData({
        ...objc,
        visible: true
      })
    },

    // 隐藏加载视图
    hide() {
      this.setData({
        hideAnimateClass: 'animated faster fadeOut'
      })

      setTimeout(() => {
        this.setData({ visible: false })
      }, 500)
    }
  }
})
