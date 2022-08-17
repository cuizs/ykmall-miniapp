/**
 * 网络请求处理
 */
import api from '../../api/index'
import { ORDER_STATUS,ORDER_STATUS_COLOR } from '../../config/commonConfig'

// 获取订单详情
export const getOrderDetailById = (id, cb) => {
  api.getOrderDetailById(id, {
    loading: false,
    success: (res) => {
      const data = res.data || {}
      data['express'] = data.express || {}
      data['orderLines'] = data.orderLines || []
      data['_statusContext'] = ORDER_STATUS(data.status)
      data['_statusColor'] = ORDER_STATUS_COLOR (data.status)


      for (const orderLine of data.orderLines) {
        orderLine.specValueText = ''
        if (orderLine.specValueJson) {
          for (const key in orderLine.specValueJson) {
            orderLine.specValueText = `${orderLine.specValueText} ${orderLine.specValueJson[key]}`
          }
        }
      }
      cb && cb(data)
    },
  })
}

// 申请退货 refundOrder
export const refundOrder = (id, pamras, cb) => {
  api.refundOrder(id, {
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 获取退货信息
export const getRefundOrderInfo = (returnOrderNumber, cb) => {
  api.getRefundOrderInfo(returnOrderNumber, {
    loading: false,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 提交退货物流信息
export const putRefundOrderlogisticsInfo = (returnOrderNumber, pamras, cb) => {
  api.putRefundOrderlogisticsInfo(returnOrderNumber, {
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 填写物流单号
export const fillExpressNumber = (pamras, cb) => {
  api.fillExpressNumber(pamras.id, {
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 未发货时，申请退款
export const getOrderRefundListById = (id, cb) => {
  api.getOrderRefundList(id, {
    loading: false,
    data: {},
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}
