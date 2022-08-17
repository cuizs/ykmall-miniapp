/**
 * list组件
 */

Component({
  externalClasses: ['z-class'],
  options: {
    multipleSlots: true
  },
  relations: {
    '../cell-group/index': {
      type: 'parent'
    }
  },
  properties: {
    // 是否存在下边框
    hasBorder: {
      type: Boolean,
      value: true
    },
    // 前缀
    suffixIcon: {
      type: String
    },
    // 后缀
    prefixIcon: {
      type: String
    },
    // 左侧标题
    title: {
      type: String
    },
    // 副标题
    subTitle: {
      type: String
    },
    // 右侧文字
    value: {
      type: String
    },
    // 跳转类型
    linkType: {
      type: String,
      value: 'navigateTo'
    },
    // 跳转的url
    url: {
      type: String,
      value: ''
    }
  },
  data: {
    // 最后一个cell不加 border
    isLastCell: false,
    // 短border-bottom样式
    hasShortBorder: false
  },
  methods: {
    // cell点击事件
    onClick() {
      this.navigateHandler()
    },

    updateIsLastCell(isLastCell) {
      this.setData({ isLastCell })
    },
    shortBorderCell(hasShortBorder) {
      this.setData({ hasShortBorder })
    },
    navigateHandler() {
      const { url, linkType } = this.data
      const naviTypes = ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch']
      // cell点击回调
      this.triggerEvent('click', {})
      // 判断是否跳转
      if (!url) return
      // 判断跳转类型
      if (naviTypes.indexOf(linkType) === -1) {
        console.warn(`linkType 属性可选值为 ${naviTypes.toString()}`, linkType)
        return
      }
      wx[linkType]({
        url: url,
        fail: function (error) {
          console.error('页面跳转失败！失败路径：', url, 'error:', error)
        }
      })
    }
  }
})