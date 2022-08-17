/**
 * 网络请求处理
 */
import api from '../../api/index'

export const registerCoupon = ( cb) => {
  api.registerCoupon({
    loading: false,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}


