/**
 * 优惠券模块
 */
import fetch from '../../utils/network/index'

// 根据 code 请求优惠券信息
const getCouponByCode = (code, objc = {}) => {
  fetch.get(`/mp/api/v1/coupon/code/${code}`, objc)
}

// 获取注册优惠券
const registerCoupon = (objc = {}) => {
  fetch.get('/mp/api/v1/coupon/scope/Register', objc)
}

// 根据优惠券状态获取优惠券
const couponlist = (objc = {}) => {
  fetch.get('/mp/api/v1/coupon', objc)
}

// 领取优惠券
const couponRedemption = (objc = {}) => {
  fetch.post('/mp/api/v1/coupon', objc)
}

// 根据订单获取可用优惠券
const couponByOrder = (objc = {}) => {
  fetch.post(`/mp/api/v1/coupon/order`, objc)
}

// 获取商品可用优惠券
const getCouponByProduct = (productId, objc = {}) => {
  fetch.get(`/mp/api/v1/coupon/product/${productId}`, objc)
}

const getProductByCoupon = (objc = {}) => {
  fetch.get('/mp/api/v1/coupon/product', objc)
}

export default {
  getCouponByCode,
  couponlist,
  couponRedemption,
  registerCoupon,
  couponByOrder,
  getCouponByProduct,
  getProductByCoupon,
}
