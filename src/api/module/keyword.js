/**
 * 关键词
 */
import fetch from '../../utils/network/index'

// 关键词列表
const keywordList = ( objc = {}) => {
  fetch.get(`/mp/api/v1/keyword`, objc)
}

export default {
  keywordList
}
