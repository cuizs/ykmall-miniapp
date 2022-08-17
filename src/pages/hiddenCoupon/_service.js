/**
 * 网络请求处理
 */
import api from '../../api/index'
 
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

// 根据 code 获取 coupon
export const getCouponByCode = (code, cb) => {
  api.getCouponByCode(code, {
    loading: false,
    success: res => {
      cb && cb(res.data || {})
    },
    fail: () => {
      cb && cb({ error: true })
    }
  })
}