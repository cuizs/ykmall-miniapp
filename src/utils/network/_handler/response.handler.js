/**
 * response统一处理
 */
import config from '../_config'
import ignoreError from '../../../constant/ignoreError'

export const responseHandler = function (res) {
  // 状态
  let status = 'none'
  // 状态判断
  if (_UTIL.checkReTry(res.statusCode)) {
    status = 'retry'
  } else if (_UTIL.checkToken(res.statusCode)) {
    status = 'refetch'
  } else if (_UTIL.checkSuccess(res.data.code)) {
    status = 'success'
  } else {
    status = 'failture'
  }
  // 用于链式调用
  this.isReTry = function (cb) {
    status === 'retry' && cb && cb(res)
    return this
  }
  this.isRefetch = function (cb) {
    status === 'refetch' && cb && cb(res)
    return this
  }
  this.isSuccess = function (cb) {
    if (_UTIL.checkIgnore(res.data.code)) {
      res.data['message'] = ignoreError[res.data.code]['hint']
    }
    status === 'success' && cb && cb(res.data || {})
    return this
  }
  this.isFailture = function (cb) {
    status === 'failture' && cb && cb(res)
    return this
  }
}

/**
 * 统一处理工具
 */
const _UTIL = {
  // 判断重试
  checkReTry(code) {
    return config.RETRY_CODE.includes(code)
  },
  // 判断token失效
  checkToken(code) {
    return config.HAS_CODE.includes(code)
  },
  // 判断异常是否忽略
  checkIgnore(code) {
    return ignoreError[code]
  },
  // 判读接口请求成功
  checkSuccess(code) {
    return config.SUCCESS_CODE.includes(code) || ignoreError[code]
  }
}
