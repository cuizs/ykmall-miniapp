/**
 * 认证模块
 */
import fetch from '../../utils/network/index'

// 解密手机号
const decryptMobile = (objc = {}) => {
  fetch.get('/mp/api/v1/auth/mobile', objc)
}

export default {
  decryptMobile
}
