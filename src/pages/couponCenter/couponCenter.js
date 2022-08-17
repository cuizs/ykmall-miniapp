import { getDate } from '../../utils/util'
import { handleCouponUtilFun } from '../../mixins/coupon'
import { registerCoupon, getCouponlist, couponRedemption } from './_service'
import sm from '../../manager/share'
import um from '../../manager/userInfo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    title: '领券中心',
    // 优惠券列表
    couponList: [],
    registerCoupon: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
   
    registerCoupon(res => {
      if (res.length > 0) {
        this.setData({
          registerCoupon: res[0] ? handleCouponUtilFun(res[0]) : {}
        })
      }
    })
    this.getList()
  },

  // 获取列表
  getList() {
    getCouponlist({ status: 'pending' }, res => {
      
      res.forEach(item => {
        item.couponCue = item.minAmount > 0 ? `满${item.minAmount}元可用` : '优惠券'
        item.formatExpireTime = getDate('date', item.expireTime)
      })
      console.log('getCouponlist => ', handleCouponUtilFun(res))
      this.setData({
        couponList: handleCouponUtilFun(res)
      })
    })
  },

  // 点击新人优惠券
  onRegisterCouponClick() {
    this.$to('coupon/coupon', 'navigate')
  },

  // 领取优惠券
  onCouponClick(e) {
    const { id } = e.currentTarget.dataset
    let self = this;
    um.isVip(res => {
      if (!!res) {
        self.getCouponWithId(id);
      }
      // 打开弹窗
      this.setData({
        show:!res
      })
    })
  },

  // 领取优惠券
  getCouponWithId(id) {
    couponRedemption({ couponRuleId: id }, res => {
      this.getList()
      wx.showToast({
        title: '领取成功',
        icon: 'none',
        duration: 2000
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let title = '领券中心'
    let path = `/pages/couponCenter/couponCenter`
    let params = {
      title,
      path,
      query: {}
    }
    return sm.userShare(params);
  },

  onShareTimeline() {
    let title = '领券中心'
    let path = `/pages/couponCenter/couponCenter`
    let params = {
      title,
      path,
      query: {}
    }
    return sm.userShare(params);
  }
})
