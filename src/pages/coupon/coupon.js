import { tabList } from './_config'
import { getCouponlist, couponRedemption } from './_service'

let refreshTimer = null

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // tab 列表
    tabList: tabList,
    // 当前 tab 位置
    currentTab: tabList[0],
    // 礼券列表
    couponList: {
      expired: [], // 过期
      redeemed: [], // 已使用
      exchanged: [], // 待使用
    },
  },

  /**
   * 生命周期函数
   */
  onShow() {
    this.handleCouponlist()
  },
  onHide() {
    clearTimeout(refreshTimer)
    refreshTimer = null
  },

  /**
   * 页面事件
   */
  // tab切换
  onTabClick(e) {
    const { item } = e.currentTarget.dataset
    this.setData({ currentTab: item })

    this.handleCouponlist()
  },

  // 立即使用
  onToUserClick(e) {
    const { item } = e.currentTarget.dataset
    this.$to(`goodsList/goodsList?couponCode=${item.couponCode}`)
  },

  /**
   * 数据处理
   */
  // 优惠券列表
  handleCouponlist() {
    const { couponList, currentTab } = this.data
    const { requireStatus } = currentTab

    for (let i = 0; i < requireStatus.length; i++) {
      const status = requireStatus[i]
      getCouponlist({ status }, (list) => {
        couponList[status] = list
        this.setData({
          couponList,
        })
      })
    }
  },
})
