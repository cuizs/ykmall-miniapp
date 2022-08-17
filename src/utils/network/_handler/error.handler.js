/**
 * error统一处理
 */
import { errorMsg } from '../../../config/errorMsgConfig'

// error处理
export const errorHandler = (error, cb) => {
  cb && cb(error)
}

// 创建服务器错误结构体
export const createServerErrStruct = error => {
  return {
    type: 'serveErr',
    code: error.statusCode || 'UNKNOWN',
    errMsg: error.errMsg || '网络异常, 请稍后再试！'
  }
}

// 创建接口请求错误结构体
export const createResponseErrorStruct = error => {
  const data = error.data || {}
  return {
    type: 'ResponseErr',
    code: data.code || 'UNKNOWN',
    errMsg: errorMsg[data.code] || '网络异常, 请稍后再试！'
  }
}
