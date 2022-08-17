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
    }
  },
  data: {
  },
  methods: {
    onClose () {
      this.setData({
        show:false
      })
     },
    onGetPhoneNumberClick(e) {
      const { iv, encryptedData } = e.detail
      if (!iv || !encryptedData) return
      let self = this;
      decryptMobile({ iv, encryptData: encryptedData }, () => {
        this.setData({
          show:false
        })
        // 更新本地用户信息
        um.refresh(userInfo=>{
          self.triggerEvent("updateUserInfo", userInfo);
        })
        wx.showToast({
          icon: 'none',
          title: '授权成功，优惠券已下发，请到“我的-优惠券”查看'
        })
      })
    }
  }
})