import { getCmsByType } from './_service'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数
   */
  onLoad() {
    this.handleCms(true)
  },
  onPullDownRefresh() {
    this.handleCms(false)
  },
  onShow() {
    const isRefresh = this.$getRouterQuery('isRefresh')
    if (isRefresh) {
      this.handleCms(true)
    }
  },
  /**
   * 页面事件
   */
  // 打开产品详情
  openProductDetail(e) {
    const { id } = e.currentTarget.dataset
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },
  // 系列点击
  onSeriesClick(e) {
    const { item } = e.currentTarget.dataset
    this.$to(`goodsList/goodsList?id=${item.externalIdentity}`, 'navigate')
  },
  // 跳转页面
  onJumpClick(e) {
    const type = e.currentTarget.dataset.type
    wx.switchTab({
      url: `../${type}/${type}`
    })
  },

  /**
   * 数据处理
   */
  handleCms(loading) {
    getCmsByType('CateProduct', loading, data => {
      wx.stopPullDownRefresh()
      this.setData({
        list: data.items
      })
    })
  }
})
