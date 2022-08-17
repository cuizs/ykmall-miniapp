import api from '../../api/index'
import http from '../../utils/network/_third.http'
export const createOrder = (params, cb) => {
  api.createOrder({
    loading: true,
    data: params,
    success: res => {
      cb && cb(res.data || {})
    }
  })
}

// 根据处方单号获取订单
export const orderByRecipeNumber = (id, cb) => {
  api.orderByRecipeNumber(id, {
    loading: true,
    success: res => {
      cb && cb(res.data || {})
    }
  })
}
// 获取第三方订单
export const prescriptionDetail = (params, cb) => {
  http({
    loading: true,
    url: '/api/v1/prescription/app_pres',
    data: params,
    success: res => {
      const data = res.data || {}
      let { sku = [] } = data.presData
      sku.forEach(item => {
        delete item.status
      })
      cb && cb(res.data || {})
    }
  })
}
