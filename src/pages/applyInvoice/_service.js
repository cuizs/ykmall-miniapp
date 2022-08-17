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


// 获取发票列表
export const getInvoiceList = (cb) => {
  api.getInvoiceList({
    loading: true,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}