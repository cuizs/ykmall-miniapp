/**
 * 价格显示组件
 * @description 如果价格为小数则保留小数点后两位，数值超过三位以“,”分隔。
 */

Component({
  externalClasses: ['z-class'],
  properties: {
    // 金额数值
    value: {
      type: String,
      observer: function(newVal) {
        setTimeout(() => {
          this.setData({
            price: this.formatNum(newVal)
          })
        }, 100)
      }
    },
    // 单位（¥, $）
    unit: {
      type: String,
      value: ''
    },
    // 字体大小
    fontSize: {
      type: Number,
      value: 28
    },
    color: {
      type: String,
      value: ''
    },
  },
  data: {
    price: 0
  },
  methods: {
    // 格式化金额数值
    formatNum: function(value) {
      let newStr = ''
      let count = 0
      if (value.indexOf('.') == -1) {
        for (let i = value.length - 1; i >= 0; i--) {
          if (count % 3 == 0 && count != 0) {
            newStr = value.charAt(i) + ',' + newStr
          } else {
            newStr = value.charAt(i) + newStr
          }
          count++
        }
        value = newStr
        return value
      } else {
        for (let i = value.indexOf('.') - 1; i >= 0; i--) {
          if (count % 3 == 0 && count != 0) {
            newStr = value.charAt(i) + ',' + newStr
          } else {
            newStr = value.charAt(i) + newStr
          }
          count++
        }
        value = newStr + (value + '00').substr((value + '00').indexOf('.'), 3)
        return value
      }
    }
  }
})
