

import { navigateByInfo } from '../../manager/navigate'
import { getPageDetail } from './_service'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layout: [],
    ratioTo375: 1,
    pageStatus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const pageId = options.id
    this.getPageDetail(pageId)


  },
  getPageDetail (pageId) {
    getPageDetail({ id: pageId }, (res) => {
      this.setData({
        layout: JSON.parse(res.layout),
        pageStatus: res.status === 'Enable' ? true : false
      }, () => {
        console.log('layout', this.data.layout)
        const ratioTo375 = 375 / 375
        console.log(ratioTo375)
        this.setData({
          ratioTo375
        })
        // wx.nextTick(() => {
        //   console.log(wx.createSelectorQuery().in(this).select('.layout'))
        //   wx.createSelectorQuery().in(this).selectAll('#layout').boundingClientRect().exec((res) => {
        //     console.log('layout', res[0][0])
        //     const ratioTo375 = res[0][0].width / 375
        //     console.log(ratioTo375)
        //     this.setData({
        //       ratioTo375
        //     })
        //   })
        // });
      })
    }, () => {
      this.setData({
        pageStatus: false
      })
    })
  },
  // banner点击
  onBannerClick (e) {
    const { item } = e.currentTarget.dataset
    navigateByInfo(item)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return sm.userShare()
  }
})