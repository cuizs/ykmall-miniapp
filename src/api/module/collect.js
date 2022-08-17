/**
 * 商品收藏模块
 */
import fetch from '../../utils/network/index'

// 收藏商品
const collect = (objc = {}) => {
  fetch.post(`/mp/api/v1/customer/favorite/product`, objc)
}
// 取消收藏商品
const cancelCollect = (objc = {}) => {
  fetch.delete(`/mp/api/v1/customer/favorite/product`, objc)
}
// 获取收藏商品列表
const collectGoods = (objc = {}) => {
  fetch.get(`/mp/api/v1/customer/favorite/product`, objc)
}

export default {
  collect,
  collectGoods,
  cancelCollect
}
