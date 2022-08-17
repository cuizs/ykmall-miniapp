/**
 * list组件
 */
import { decryptMobile } from './_serevice'
import um from '../../manager/userInfo'
Component({
  externalClasses: ['z-class'],
  options: {
    multipleSlots: true
  },

  properties: {
    show: {
      type: Boolean,
      value: false
    },
    inviteSrc:{
      type: String,
      value: ""
    },
    channelName:{
      type: String,
      value: ""
    },
  },
  data: {
  },
  methods: {
    onClose () {
      this.setData({
        show:false
      })
     },
  }
})