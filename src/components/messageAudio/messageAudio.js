// components/messageText.js
import { debounce } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (nVal) {
        console.log('')
        const inquiryContent = JSON.parse(nVal.content || JSON.stringify({}))
        const { path, duration } = inquiryContent
        this.setData({
          path,
          duration
        })
      }
    },
    index: {
      type: Number,
      value: 0
    },
    playIndex: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    path: '',
    duration: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playAudio: debounce(function (e) {
      console.log(e.currentTarget.dataset.audio)
      this.triggerEvent('click', { path: e.currentTarget.dataset.audio, index: this.properties.index, duration: this.data.duration })
    }, 300)
  }
})
