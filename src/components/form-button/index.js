/**
 * 功能性button
 * @description formId收集 && 防止双击
 */
import { throttle } from '../../utils/util'

Component({
  externalClasses: ['z-class'],
  properties: {
    // 标题
    text: {
      type: String,
      value: ''
    },
    // 字体大小
    size: {
      type: Number,
      value: 28
    },
    // 字体颜色
    color: {
      type: String,
      value: '#000'
    },
    // 防止双击的等待时间(ms)
    waitTime: {
      type: Number,
      value: 0
    }
  },
  methods: {
    /**
     * 页面事件
     */
    // form submit 事件
    onFormSubmit(e) {
      this._handleTrigger()
    },
    // 点击事件
    onButtonClick() {
      this._handleTrigger()
    },

    /**
     * 数据处理
     */
    // 事件传递处理
    _handleTrigger() {
      throttle(() => {
        this.triggerEvent('customTap', {})
      }, this.properties.waitTime)
    }
  }
})
