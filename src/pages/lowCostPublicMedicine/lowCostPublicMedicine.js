import { getCampaign } from './_service'
import { availableTimeFormat } from '../../utils/util'
import sm from '../../manager/share'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播列表
    bannerList: [],
    // 商品列表
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.title) {
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    this.getList()
  },

  // banner点击
  onBannerClick(e) {
    const { item } = e.currentTarget.dataset
    navigateByInfo(item)
  },

  onGoodsRowClick(e) {
    const { id } = e.detail
    this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
  },

  // 获取列表
  getList() {
    let pamras = {
      pageNo: 1,
      pageSize: 100,
      type: 'LOW_PRICE',
      enabled: true
    }
    getCampaign(pamras, res => {
      if (res.results && res.results.length > 0) {
        const campaignInfo = res.results[0] || {}
        const availableTime = new Date(availableTimeFormat(campaignInfo.endTime)).getTime()
        const isAvailable = Date.now() < availableTime && campaignInfo.enabled

        if (!isAvailable) {
          wx.showModal({
            title: '提示',
            content: `该活动已经${!campaignInfo.enabled ? '下架' : '过期'}！`,
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#008DF9',
            success: res => {
              if (res.confirm) wx.navigateBack({})
            }
          })

          return
        }

        this.setData({
          bannerList: campaignInfo.bannerUrl,
          goodsList: this.handlerProduct(campaignInfo.products)
        })
      
      }
    })
  },
  // 禁用的商品不显示
  handlerProduct(list) {
    return list.filter(item => {
      return !!item.enabled
    })
  },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage() {
    let title = '公益低价药'
    let path = `/pages/lowCostPublicMedicine/lowCostPublicMedicine`
    let params = {
      title,
      path,
      query: {}
    }
    return sm.userShare(params);
  },

  onShareTimeline() {
    let title = '公益低价药'
    let path = `/pages/lowCostPublicMedicine/lowCostPublicMedicine`
    let params = {
      title,
      path,
      query: {}
    }
    return sm.userShare(params);
  }

})
