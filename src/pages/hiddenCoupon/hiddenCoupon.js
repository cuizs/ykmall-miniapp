import { couponRedemption, getCouponByCode } from './_service'
import um from '../../manager/userInfo'
import { getDate } from '../../utils/util'
import { handleCouponUtilFun } from '../../mixins/coupon'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    currentStatus: '', // 活动信息: PENDING：进行中， END：已结束
    // 优惠券
    currentCoupon: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if(options.id) {
      this.getCurrentCouponWithCode(options.id)
    }
  },

  // 获取券详情
  getCurrentCouponWithCode(id) {
    getCouponByCode(id, res=>{
      let item = res || {}
      item.couponCue = item.minAmount > 0 ? `满${item.minAmount}元可用` : '优惠券'
      item.formatExpireTime = getDate('date', item.expireTime)
      let currentCoupon = handleCouponUtilFun(item);
      //  获取当前活动是否结束、用户是否已领取
      var timeStamp = Date.parse(new Date());
      let endTimeStrStamp = currentCoupon.endTime.replaceAll('-', '/');
      var endStamp = new Date(endTimeStrStamp).getTime();
      let currentStatus = ''
      if(timeStamp > endStamp) { // 活动过期
        currentStatus = "END"
      }else if(currentCoupon.stock == 0){ // 券领完
        currentStatus = "END"
      }else {
        currentStatus = "PENDING"
      }
      this.setData({
        currentStatus: currentStatus,
        currentCoupon: currentCoupon
      })
    })
  },

  // 领取优惠券
  onCouponClick(e) {
    const { id } = e.currentTarget.dataset
    let self = this;
    um.isVip(res => {
      if (!!res) {
        self.handleCouponTap(id);
      }
      // 打开弹窗
      this.setData({
        show:!res
      })
    })
  },

  handleCouponTap(id) {
    let { currentCoupon } = this.data
    // 存在未领取的情况
    if(currentCoupon.limitNumber > currentCoupon.couponList.length) {
      this.getCouponWithId(id);
    }else { // 去使用
      this.$to('coupon/coupon', 'redirect')
    }
  },

  onMyCouponClick() {
    this.$to('coupon/coupon', 'redirect')
  },

  // 领取优惠券
  getCouponWithId(id) {
    let self = this;
    couponRedemption({ couponRuleId: id }, res => {
      wx.showToast({
        title: '领取成功',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        self.$to('coupon/coupon', 'redirect')
      }, 2000);
    })
  },


})
