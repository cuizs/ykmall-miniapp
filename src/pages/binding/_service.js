/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取 skus 详情
export const sendCode = (mobile, cb) => {
  api.sendCode(mobile, {
    loading: false,
    success: res => {
      cb && cb(res)
    }
  })
}
export const bindingDoctor = (params, cb) => {
  api.bindingDoctor({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res)
    }
  })
}
