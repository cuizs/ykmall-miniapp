/**
 * 网络请求处理
 */
import api from '../../api/index'

export const applyInvoice = (orderId, data, cb, failcb) => {
  api.applyInvoice(orderId, {
    loading: false,
    data,
    success: res => {
      const data = res.data || []
      cb && cb(data)
    },
    fail: error => {
      console.log('error', error)
      failcb && failcb()
    }
  })
}
