/**
 * 倒计时组件
 */

Component({
  externalClasses: ['z-class', 'title-class'],
  options: {
    multipleSlots: true
  },
  properties: {
    time: {
      type: Number,
      observers: function () {}
    },
    // 格式 (例如: [ '天', ':', ':', ':' ])
    format: {
      type: Array,
      value: [':', ':', ':', ':']
    },
    frontTitle: {
      type: String,
      value: ""
    }
  },
  data: {
    // 页面显示时间
    times: ''
  },
  observers: {
    time: function (time) {
      this.handelTime(time)
    }
  },
  methods: {
    endTime() {
      this.triggerEvent('endTimeFn', { lastTime: false })
    },
    // 处理时间戳
    handelTime(time = 0) {
      const items = setInterval(() => {
        if (time <= 0) {
          clearInterval(items)
          this.format(0)
          this.endTime()
          return
        } else {
          this.format(time)
        }
        time--
      }, 1000)
    },
    // 格式处理
    format(t) {
      let hour, minu, secs, lastTime
      const daySeconds = 24 * 60 * 60
      const hourSeconds = 1 * 60 * 60
      const minuteSecounds = 1 * 60
      const day = this.formatNum(parseInt(t / daySeconds))
      lastTime = t % daySeconds
      // 不显示天数时处理判断
      !!this.data.format[0]
        ? (hour = this.formatNum(parseInt(lastTime / hourSeconds)))
        : (hour = this.formatNum(parseInt(t / hourSeconds)))
      lastTime = lastTime % hourSeconds
      // 不显示小时时处理判断
      !!this.data.format[1]
        ? (minu = this.formatNum(parseInt(lastTime / minuteSecounds)))
        : (minu = this.formatNum(parseInt(t / minuteSecounds)))
      // 不显示分处理判断
      !!this.data.format[2]
        ? (secs = this.formatNum(lastTime % minuteSecounds))
        : (secs = this.formatNum(t))
      const times = {
        day,
        hour,
        minu,
        secs
      }
      this.setData({ times })
    },
    formatNum(num) {
      return num > 9 ? num : `0${num}`
    }
  }
})
