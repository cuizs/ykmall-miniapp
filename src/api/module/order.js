/**
 * 订单模块
 */
import fetch from '../../utils/network/index'

// 支付接口
const payOrder = (id, objc = {}) => {
  fetch.post(`/mp/api/v1/order/place_order/${id}`, objc)
}

// 运费支付接口
const freightPayOrder = (id, objc = {}) => {
  fetch.post(`/mp/api/v1/new/order/freight/${id}`, objc)
}

// 创建订单
const createOrder = (objc = {}) => {
  fetch.post('/mp/api/v1/order', objc)
}

// 获取订单金额
const getOrderAmount = (objc = {}) => {
  fetch.post('/mp/api/v1/order/amount', objc)
}

// 获取订单列表
const getOrderList = (objc = {}) => {
  fetch.get('/mp/api/v1/order', objc)
}

// 获取各订单数量
const getOrderCount = (objc = {}) => {
  fetch.get(
    `/mp/api/v1/order/count`,
    objc
  )
}

// 获取订单详情
const getOrderDetailById = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/order/${id}`, objc)
}

// 获取订单历史退款记录
const getOrderRefundList = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/order/${id}/find-refund-list`, objc)
}

// 提交退货订单号
const fillExpressNumber = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/order/${id}/express`, objc)
}
// 取消订单
const returnOrderById = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/order/${id}`, objc)
}
// 未发货时申请退款
const applyRefundById = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/order/${id}/apply-refund`, objc)
}
// 退货
const refundOrder = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/order/${id}/line/apply-return`, objc)
}
// 获取退货信息
const getRefundOrderInfo = (returnOrderNumber, objc = {}) => {
  fetch.get(`/mp/api/v1/order/${returnOrderNumber}/return-info`, objc)
}
// 提交退货物流信息
const putRefundOrderlogisticsInfo = (returnOrderNumber, objc = {}) => {
  fetch.put(`/mp/api/v1/order/${returnOrderNumber}/apply-refunding`, objc)
}
// 查看订单物流
const getOrderDeliveryById = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/order/${id}/express`, objc)
}

// 查看物流详细信息
const getOrderExpressByNumber = (number, objc = {}) => {
  fetch.get(`/mp/api/v1/product/logistics/${number}`, objc)
}

// 根据处方单号获取订单详情
const orderByRecipeNumber = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/order/recipe/${id}`, objc)
}
// 根据优惠券获取金额
const amoutByCoupon = (objc = {}) => {
  fetch.post('/mp/api/v1/order/amount', objc)
}

// 提交评价
const postOrderComment = (objc = {}) => {
  console.log("objc=====", objc);
  fetch.post('/mp/api/v1/comment', objc)
}

// 查看评价
const getOrderComment = (pamras, objc = {}) => {
  const { userId, productId, pageNo } = pamras
  fetch.get(
    `/mp/api/v1/comment?userId=${userId}&productId=${productId}&pageSize=10&pageNo=${pageNo}`,
    objc
  )
}

// 根据各种不同的优惠券组合获取各个组合返回的订单信息
const getCouponGroupsAmountData = (objc = []) => {
  fetch.post(
    `/mp/api/v1/order/amount-v2`,
    objc
  )
}

const checkOrderLimtNumUsingGET = (orderId, objc = {}) => {
  fetch.get(
    `/mp/api/v1/order/${orderId}/check-max-number`, objc
  )
}

const oneMoreOrder = (objc = {}) => {
  console.log(objc)
  fetch.post(
    `/mp/api/v1/order/${objc.id}/one-more-order`, objc
  )
}
// 确认收货
const orderConfirm = (orderId, objc = {}) => {
  fetch.put(`/mp/api/v1/order/${orderId}/confirm`, objc)
}

// 扫码记录-绑定推广人
const scanRecord = ( objc = {}) => {
  fetch.put(`/mp/api/v1/partner-referrer/scan-record`, objc)
}

export default {
  payOrder,
  createOrder,
  getOrderAmount,
  getOrderList,
  getOrderDetailById,
  returnOrderById,
  refundOrder,
  getRefundOrderInfo,
  putRefundOrderlogisticsInfo,
  getOrderDeliveryById,
  getOrderExpressByNumber,
  fillExpressNumber,
  orderByRecipeNumber,
  amoutByCoupon,
  postOrderComment,
  getOrderComment,
  applyRefundById,
  getOrderCount,
  getCouponGroupsAmountData,
  getOrderRefundList,
  checkOrderLimtNumUsingGET,
  oneMoreOrder,
  orderConfirm,
  freightPayOrder,
  scanRecord
}
