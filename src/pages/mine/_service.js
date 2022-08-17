/**
 * 网络请求处理
 */
import api from '../../api/index'

// 查看用户信息
export const userInfo = (cb) => {
  api.getUserInfo({
    loading: false,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 查看用户信息
export const getOrderCount = (cb) => {
  api.getOrderCount({
    loading: false,
    success: res => {
      cb && cb(res.data)
    }
  })
}
// 获取推广二维码
export const getPromoterCode = (cb) => {
  api.getPromoterCode({
    success: res => {
      cb && cb(res)
    }
  })
}
