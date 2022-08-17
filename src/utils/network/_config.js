/**
 * 网络请求的相关配置
 */
import { loginURL } from '../../api/path/login'

export default {
  // 开启debug模式（打印网络请求日志）
  debug: true,

  // header 默认设置
  DEFAULT_HEADER: {
    'content-type': 'application/json'
  },

  // 请求超时时间
  TIMEOUT: 60 * 1000,

  // 刷新 TOKEN 延时时长
  GET_TOKEN_DELAY: 600,

  // 重试请求总次数
  RETRY_TOTAL_TIMES: 5,

  // TOKEN 接口地址
  TOKEN_API: loginURL,

  // token刷新总次数
  TOKEN_REFRESH_TOTAL_TIMES: 5,

  // TOKEN 存储安全时间
  TOKEN_SAFE_TIME_DIFF: 45 * 1000,

  // 请求成功code码
  SUCCESS_CODE: [0],

  // token失效code码
  HAS_CODE: [401, 403],

  // 重试请求 HTTP CODE
  RETRY_CODE: [503, 504]
}
