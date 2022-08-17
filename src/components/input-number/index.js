/**
 * inputNumber组件
 */

Component({
  externalClasses: ['z-class'],
  // 内置behaviors
  behaviors: ['wx://form-field'],
  options: {
    multipleSlots: true
  },
  properties: {
    // 总宽度
    width: {
      type: Number,
      value: 260
    },
    // 边框
    isBorder: {
      type: Boolean,
      value: false
    },
    // 是否可以计算小数(为true时,默认+/- 0.1)
    isDigit: {
      type: Boolean,
      value: false
    },
    // 默认值
    value: {
      type: Number,
      value: 0,
      observer: '_updateValue'
    },
    // 最小值
    min: {
      type: Number,
      value: 0
    },
    // 最大值
    max: {
      type: Number,
      value: null
    },
    // 自定义两端
    custom: {
      type: Boolean,
      value: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 数值
    val: 0,
    // 最大值禁用
    plusDisable: false
  },
  ready () {
    // 初始值判断
    const { val, min, value, isDigit } = this.data
    this.setData({
      val: min >= value ? min : value
    })
    if (isDigit) {
      this.setData({
        val: val.toFixed(2)
      })
    }
  },
  methods: {
    _updateValue () {
      this.setData({
        val: this.data.value
      })
    },
    // 失去焦点
    onBlur () {
      const { min, max, val, isDigit } = this.data
      console.log(val, min)
      if (isDigit) {
        this.setData({
          val: this.numberCheck(val)
        })
        this.handlerOnChange(val)
        return
      }
      if (isNaN(val) || min >= Number(val)) {
        this.setData({
          val: min
        })
        this.handlerOnChange(min)
        return
      }
      if (!!max && max <= Number(val)) {
        this.setData({
          val: max,
          plusDisable: true
        })
        this.handlerOnChange(max)
        return
      } else {
        this.setData({
          plusDisable: false
        })
      }
      this.syncFormValue(val)
      this.handlerOnChange(val)

    },
    // 输入时获取值
    onInput (e) {
      const { isDigit } = this.data
      const { value } = e.detail
      this.setData({
        val: parseInt(value)
      })
    },
    // 减法
    onDescClick (e) {
      if (!this.data.disabled) {
        this.handleCalculatorVal(e, 'desc')
      }
    },
    // 加法
    onPlusClick (e) {
      if (!this.data.disabled) {
        this.handleCalculatorVal(e, 'plus')
      }
    },

    // 计算加减法
    handleCalculatorVal (e, type) {
      const { isDigit, min, max } = this.data
      let number = e.currentTarget.dataset.val
      if (isDigit) {
        // 判断小数，+0.1 -0.1
        number = this.handleDigit(number, type, min, max)
      } else {
        //整数
        if (type === 'plus') {
          if (max > Number(number) || !max) {
            number++
          } else {
            wx._showToast({ title: `当前商品最多可购买${number}份` })
            return;
          }
        } else {
          if (min < Number(number)) number > 0 && number--
          this.setData({
            plusDisable: false
          })
        }
      }
      this.setData({
        val: number
      })
      this.syncFormValue(number)
      this.handlerOnChange(number)
    },
    // 处理小数-点击事件
    handleDigit (number, type, min, max) {
      const index = String(number).indexOf('.')
      const str = String(number).split('')
      let str1 = String(number).slice(0, index)
      let str2 = String(number).slice(index + 2, str.length)
      let str3 = String(number).slice(index + 1, index + 2)
      if (type === 'plus') {
        if (max > Number(number) || !max) {
          number = str1 + '.' + (Number(str3) + 1) + str2
          if (str3 === '9') {
            number = Number(str1) + 1 + '.' + '0' + str2
          }
        }
      } else {
        if (min < Number(number)) {
          if ((Number(str1) > 0 && Number(str3) >= 0) || (Number(str1) >= 0 && Number(str3) > 0)) {
            number = str1 + '.' + (str3 - 1) + str2
            if (str3 === '0') number = Number(str1) - 1 + '.' + '9' + str2
          }
        }
      }
      return number
    },
    // 输入验证
    numberCheck (num) {
      let str = String(num)
      let len1 = str.substr(0, 1)
      let len2 = str.substr(1, 1)
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != '.') str = str.substr(1, 1)
      //第一位不能是.
      if (len1 == '.') str = '.'
      //限制只能输入一个小数点
      if (str.indexOf('.') != -1) {
        let str_ = str.substr(str.indexOf('.') + 1)
        if (str_.indexOf('.') != -1) {
          str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
        }
      }
      //正则替换，保留数字和小数点
      str = str.replace(/[^\d^\.]+/g, '')
      return str
    },
    // 同步对form的value值
    syncFormValue (val) {
      this.setData({
        value: val
      })
    },
    handlerOnChange (value) {
      this.triggerEvent('onChange', { value: value })
    }
  }
})
