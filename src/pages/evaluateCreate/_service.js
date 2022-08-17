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

// 提交评价
export const postOrderComment = (params, cb) => {
  console.log("params====", params);
  api.postOrderComment({
    loading: false,
    data: params,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}
