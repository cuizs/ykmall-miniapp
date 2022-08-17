/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取订单物流信息详情
export const getOrderExpressByNumber = (number, cb) => {
  api.getOrderExpressByNumber(number, {
    loading: false,
    success: (res) => {
      cb && cb(res.data)
    },
  })
}
