import { getDoctors } from './_serivce'
import cnm from '../../manager/channel'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 医生列表
    doctors: [],
    // 名片信息
    cardInfo: {},
    // 名片显示
    cardVisible: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let parms = {
      pageNo: 1,
      pageSize: 100
    }
    getDoctors(parms, data => {
      this.setData({
        doctors: data.results
      })
    })
  },
  call(e) {
    let { phone } = e.currentTarget.dataset
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },
  customerService() {
    cnm.openChannelCustomerService("", ``)

  },
  goUrl(e) {
    let { url } = e.currentTarget.dataset
    this.$to(`webView/webView?url=${url}`, 'navigate')
  },
  onQrcodeClick(e) {
    const { index } = e.currentTarget.dataset
    const item = this.data.doctors[index]

    this.setData({
      cardVisible: true,
      cardInfo: { ...item }
    })
  },
  onCardPopupCloseClick() {
    this.setData({ cardVisible: false })
  }
})
