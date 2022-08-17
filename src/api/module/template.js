/**
 * 模版消息模块
 */
import fetch from '../../utils/network/index'

// 搜集 formId
const collectFormId = (objc = {}) => {
  fetch.post('/mp/api/v1/template', objc)
}

export default {
  collectFormId
}
