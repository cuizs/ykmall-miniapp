/**
 * 网络请求
 */
import api from '../../api/index'

// 获取优惠劵列表
export const getCouponlist = (params, cb) => {
  api.couponlist({
    data:params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

// 领取优惠券
export const couponRedemption = (params, cb) => {
  api.couponRedemption({
    data:params,
    success: res => {
      cb && cb(res)
    }
  })
}