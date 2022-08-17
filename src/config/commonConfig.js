/**
 * 项目公共 map
 */

// 订单状态
export const ORDER_STATUS = (status) => {
  const orderStatus = {
    Created: '已创建',
    ToBePaid: '待付款',
    Paid: '待发货',
    Delivered: '待收货',
    ReturnApproving: '退货审批中',
    ReturnApproved: '退货已审批',
    ReturnRejected: '退货申请已驳回',
    ApplyRefunding: '申请退款中',
    PartialRefund: '已部分退货',
    ReturnApplySuccess: '退货申请创建成功',
    ReturnSuccess: '退货已完成',
    Refunding: '退款中',
    Refunded: '已退款',
    Completed: '已完成',
    Cancelled: '已取消',
    Closed: '已关闭',
    AfterSale: '售后',
    Finished: '已发货或已完成',
  }
  const translationStatus = orderStatus[status]
  if (!translationStatus) {
    console.warn(`与已知状态key不匹配: ${status}`)
    return
  }
  return translationStatus
}


// 订单状态颜色
export const ORDER_STATUS_COLOR = (status) => {
  const orderStatus = {
    Created: '#5972F6',
    ToBePaid: '#ED5D40',
    Paid: '#5972F6',
    Delivered: '#5972F6',
    ReturnApproving: '#ED5D40',
    ReturnApproved: '#5972F6',
    ReturnRejected: '#ED5D40',
    ApplyRefunding: '#ED5D40',
    PartialRefund: '#5972F6',
    ReturnApplySuccess: '#5972F6',
    ReturnSuccess: '#5972F6',
    Refunding: '#ED5D40',
    Refunded: '#5972F6',
    Completed: '#5972F6',
    Cancelled: '#AAAAAF',
    Closed: '#AAAAAF',
    AfterSale: '#5972F6',
    Finished: '#5972F6',
  }
  const translationStatus = orderStatus[status]
  if (!translationStatus) {
    translationStatus = "#5972F6"
  }
  return translationStatus
}