/**
 * 公共属性
 */

export default Behavior({
  properties: {
    // 大小: small, large, defalut
    size: {
      type: String
    },

    // 样式类型
    type: {
      type: String
    },

    // 开启震动
    vibrate: {
      type: Boolean,
      value: true
    },

    // 扩展字段
    extension: {
      type: String,
      value: ''
    }
  },

  methods: {
    _handleVibrate() {
      this.data.vibrate && wx.vibrateShort()
    }
  }
})
