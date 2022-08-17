/**
 * 页面分享混合器
 */
import sm from '../manager/share'
export default {
  data: {
    __options: {}
  },

  onLoad(options) {
    // 记录参数
    this.data.__options = options

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage() {
    return sm.userShare()
  }
}
