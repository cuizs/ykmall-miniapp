/**
 * 重试请求处理
 */
import config from '../_config'

class RetryHandler {
  constructor() {
    this.times = 1
  }

  add() {
    this.times += 1
  }
  action(cb) {
    if (this.times >= config.RETRY_TOTAL_TIMES) {
      wx.$showToast({ title: '网络重试失败' })
      return
    }

    cb && cb()
  }
}

export default RetryHandler
