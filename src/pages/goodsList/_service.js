/**
 * 网络请求处理
 */
import api from '../../api/index'

export const getGoodsList = (params, loading, cb) => {
  api.getGoodsList({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

export const getCouponGoodsList = (params, loading, cb) => {
  api.getProductByCoupon({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}
