/**
 * 网络请求
 */
import api from '../../api/index'
// 根据优惠券状态获取优惠券
export const getCouponlist = (params, cb) => {
  api.couponlist({
    data: params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
export const couponRedemption = (params, cb) => {
  api.couponRedemption({
    data: params,
    success: res => {
      cb && cb(res)
    }
  })
}
