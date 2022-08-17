/**
 * 网络请求处理
 */
import api from '../../api/index'
import { handleCouponUtilFun } from '../../mixins/coupon'

// 获取注册优惠券
export const registerCoupon = cb => {
  api.registerCoupon({
    loading: false,
    success: res => {
      const data = res.data || []
      for (const item of data) {
        handleCouponUtilFun(item)
      }

      console.log('data data => ', data)
      cb && cb(data)
    }
  })
}

// 根据优惠券状态获取优惠券
export const getCouponlist = (params, cb) => {
  api.couponlist({
    data: params,
    success: res => {
      const data = res.data || []
      for (const item of data) {
        handleCouponUtilFun(item)
      }

      cb && cb(data)
    }
  })
}

// 领取优惠券
export const couponRedemption = (params, cb) => {
  api.couponRedemption({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
