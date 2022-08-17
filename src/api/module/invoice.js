/**
 * 发票模块
 */
import fetch from '../../utils/network/index'

//  获取列表
const getInvoiceList = (objc = {}) => {
  fetch.get(`/mp/api/v1/invoice`, objc)
}
//  添加新发票
const addInvoice = (objc = {}) => {
  fetch.post(`/mp/api/v1/invoice`, objc)
}
// 更新发票
const putInvoiceById = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/invoice/${id}`, objc)
}
// 设为默认发票
const putInvoiceDefault = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/invoice/${id}/default`, objc)
}
//  删除发票
const delInvoice = (id, objc = {}) => {
  fetch.delete(`/mp/api/v1/invoice/${id}`, objc)
}

const applyInvoice = (orderId, objc = {}) => {
  fetch.post(`/mp/api/v1/order/invoice/${orderId}`, objc)
}
export default {
  getInvoiceList,
  addInvoice,
  putInvoiceById,
  putInvoiceDefault,
  delInvoice,
  applyInvoice
}
