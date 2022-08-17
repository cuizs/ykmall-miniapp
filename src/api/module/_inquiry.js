/**
 * 地址模块
 */
import fetch from '../../utils/network/index'

// 获取互联网医院问诊室token
const getHospitalToken = (objc = {}) => {
  fetch.get(`/mp/api/v1/customer/hospital/token`, objc)
}

// 获取问诊室历史消息记录
const getInquiryMessageList = (inquiryId, objc = {}) => {
  fetch.get(`/mp/api/v1/customer/hospital/im/msgs/${inquiryId}`, objc)
}

// 用户发送问诊信息
const sendInquiryMessage = (objc = {}) => {
  fetch.post(`/mp/api/v1/customer/hospital/im/send`, objc)
}

// 根据问诊单号查询问诊状态和订单id
const getInquiryDetail = (inquiryId, objc = {}) => {
  fetch.get(`/mp/api/v1/order/order-inquiryid/${inquiryId}`, objc)
}

export default {
  getHospitalToken,
  getInquiryMessageList,
  sendInquiryMessage,
  getInquiryDetail,
}