/**
 * 分类模块
 */
import fetch from '../../utils/network/index'

const getCategoryList = (objc = {}) => {
  fetch.get('/mp/api/v1/category', objc)
}

export default {
  getCategoryList
}
