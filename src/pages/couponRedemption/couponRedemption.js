import um from '../../manager/userInfo'
import { getCouponlist, couponRedemption } from './_service'
import { throttle } from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    couponList: [],
    userinfo: {}
  },

  /**
   * 生命周期函数
   */
  onLoad() {
    um.get(userinfo => {
      this.setData({ userinfo })
    })
  },
  onShow() {
    // 获取优惠券
    this.getCouponList('pending', couponList => {
      couponList.forEach(item => {
        item.status = 'pending'
      })
      this.setData({ couponList })
    })
  },

  /**
   * 页面事件
   */
  onCouponClick(e) {
    const { value } = e.detail

    if (value.status == 'exchanged') {
      if (value.productScope === 'Product' || value.productScope === 'NotProduct') {
        this.$to(`goodsList/goodsList?couponCode=${value.couponCode}`, 'redirect')
      } else {
        this.$to('goodsList/goodsList', 'redirect')
      }
      return
    }
    throttle(() => {
      couponRedemption({ couponRuleId: value.couponRuleId }, res => {
        if (res.code == 0) {
          this.updateCoupon(value.couponRuleId)
          wx._showToast({ title: '优惠券领取成功' })
        }
      })
    })
  },
  // 数据处理
  updateCoupon(id) {
    const { couponList } = this.data
    this.getCouponItem(id, data => {
      couponList.forEach((item, index) => {
        if (item.couponRuleId === id) {
          couponList[index] = data
        }
      })
      this.setData({ couponList })
    })
  },
  // 根据券Id获取数据
  getCouponItem(couponRuleId, cb) {
    this.getCouponList('exchanged', list => {
      list.forEach(item => {
        if (item.couponRuleId === couponRuleId) {
          cb && cb(item)
        }
      })
    })
  },
  /**
   * 网络处理
   */
  getCouponList(status, cb) {
    getCouponlist({ status }, couponList => {
      cb && cb(couponList)
    })
  }
})
