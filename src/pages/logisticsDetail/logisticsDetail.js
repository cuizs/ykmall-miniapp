import { getOrderExpressByNumber } from './_service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    logisticsSteps: [],
    logisticsActive: 0,
    expressCompany: '',
    expressNumber: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      expressCompany: options.expressCompany,
      expressNumber: options.expressNumber,
    })
    if (options.orderNumber) {
      getOrderExpressByNumber(options.orderNumber, (data) => {
        let temp = []
        data.forEach((item) => {
          temp.unshift({
            text: item.desc,
            desc: item.time,
          })
        })
        this.setData({
          logisticsSteps: temp,
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

})
