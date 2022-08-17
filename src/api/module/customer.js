/**
 * 注册模块模块
 */
import fetch from '../../utils/network/index'

// 获取验证码
const sendCode = (mobile, objc = {}) => {
  fetch.get(`/mp/api/v1/auth/${mobile}/sms`, objc)
}

// 绑定成为推销医生
const bindingDoctor = (objc = {}) => {
  fetch.post(`/mp/api/v1/customer/doctor`, objc)
}

// 获取医生列表
const getDoctors = (objc = {}) => {
  fetch.get(`/mp/api/v1/doctor`, objc)
}

// 绑定成为会员
const bindingMember = (objc = {}) => {
  fetch.put('/mp/api/v1/customer', objc)
}

// 查询用户信息
const getUserInfo = (objc = {}) => {
  fetch.get('/mp/api/v1/customer', objc)
}

// 成为推广商
const bindingPromoter = (objc = {}) => {
  fetch.put(`/mp/api/v1/customer/promoter`, objc)
}

export default {
  sendCode,
  bindingDoctor,
  getDoctors,
  bindingMember,
  getUserInfo,
  bindingPromoter,
}
