/**
 * 推广人模块
 */
 import fetch from '../../utils/network/index'

 //查看是否为推广人
const checkPromoter = (objc = {}) => {
  fetch.get(`/mp/api/v1/partner-referrer/status`, objc)
}
// 推广人订单
const getPromoterList = (objc = {}) => {
  fetch.get(`/mp/api/v1/partner-referrer/orders`, objc)
}
// 获取推广二维码
const getPromoterCode = (objc = {}) => {
  fetch.get(`/mp/api/v1/partner-referrer/qrcode`, objc)
}
// 注册成为推广人
const registerPromoter = (objc = {}) => {
  fetch.put(`/mp/api/v1/partner-referrer/regist`, objc)
}
//获取地区数据
const getAreaList  = (objc = {}) => {
  fetch.get(`/mp/api/v1/drag-user/area`, objc)
}

export default {
  checkPromoter,
  getPromoterList,
  getPromoterCode,
  registerPromoter,
  getAreaList
 }
 