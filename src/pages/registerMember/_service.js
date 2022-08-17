/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取验证码详情
export const sendCode = (mobile, cb) => {
  api.sendCode(mobile, {
    loading: false,
    success: res => {
      cb && cb(res)
    }
  })
}
export const bindingMember = (params, cb) => {
  api.bindingMember({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res)
    }
  })
}

