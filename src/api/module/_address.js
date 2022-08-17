/**
 * 地址模块
 */
 import fetch from '../../utils/network/index'

//  获取列表
 const addressList = (customerId,objc = {}) => {
   fetch.get(`/mp/api/v1/customer-address/${customerId}`, objc)
 }
//  添加新地址
const addaddress = (objc = {}) => {
  fetch.post(`/mp/api/v1/customer-address`, objc)
}
// 更新
const updataaddress = (customerId,objc = {}) => {
  fetch.put(`/mp/api/v1/customer-address/${customerId}`, objc)
}
//  删除地址
const deladdress = (customerId,objc = {}) => {
  fetch.delete(`/mp/api/v1/customer-address/${customerId}`, objc)
}
// 获取默认地址
const defaultAddress = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/customer-address/default/${id}`, objc)
}
// 设置默认
const setdefaultAddress = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/customer-address/${id}/default`, objc)
}
const getRegionList  = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/drag-user/area/${id}`, objc)
}

export default {
  defaultAddress,
  addressList,
  addaddress,
  deladdress,
  updataaddress,
  setdefaultAddress,
  getRegionList,
  
 }
 