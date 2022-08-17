/**
 * 商品模块
 */
import fetch from '../../utils/network/index'

// 根据分类 id 获取商品详情
const getGoodsDetailById = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/product/${id}`, objc)
}

// 获取所有商品列表
const getGoodsList = (objc = {}) => {
  fetch.get('/mp/api/v1/product', objc)
}

// 根据 sku id 列表，获取对应 sku 详情
const getSkusDetailByIds = (objc = {}) => {
  fetch.get('/mp/api/v1/product/sku', objc)
}

// 根据 sku id 列表，获取对应 diseases 详情
const getSkusDiseasesDetailByIds = (ids, objc = {}) => {
  fetch.get(`/mp/api/v1/product/sku/diseases?sku=${ids}`, objc)
}

// 获取商品详情页面中套装
const getGroup = (id, objc = {}) => {
  fetch.get(`/mp/api/v1/group/product/spu/${id}`, objc)
}
// 获取商品详情中评价
const getComment = (objc = {}) => {
  fetch.get(`/mp/api/v1/comment`, objc)
}

// 获取cms购物车推荐
const getCarCammom = (type, objc = {}) => {
  fetch.get(`/mp/api/v1/cms/type/${type}`, objc)
}

// 需求清单列表
const demandList = (objc = {}) => {
  fetch.get(`/mp/api/v1/demand-list`, objc)
}
// 添加需求清单
const addDemand = (objc = {}) => {
  fetch.post(`/mp/api/v1/demand-list`, objc)
}
// 删除需求清单
const delDemand = (id, objc = {}) => {
  fetch.delete(`/mp/api/v1/demand-list/${id}`, objc)
}
// 更新需求清单
const updataDemand = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/demand-list/${id}`, objc)
}
// 获取需求商品数量
const demandNumber = (objc = {}) => {
  fetch.get(`/mp/api/v1/demand-list/number`, objc)
}

// 购物车列表
const cartList = (objc = {}) => {
  fetch.get(`/mp/api/v1/cart`, objc)
}
// 添加至购物车
const addCart = (objc = {}) => {
  fetch.post(`/mp/api/v1/cart`, objc)
}
// 删除购物车商品
const delCart = (id, objc = {}) => {
  fetch.delete(`/mp/api/v1/cart/${id}`, objc)
}
// 更新购物车商品
const updataCart = (id, objc = {}) => {
  fetch.put(`/mp/api/v1/cart/${id}`, objc)
}
// 获取购物车商品数量
const cartNumber = (objc = {}) => {
  fetch.get(`/mp/api/v1/cart/number`, objc)
}

// 获取商品被关联的组合商品
const getProductRelationGoods = (productCode, objc = {}) => {
  fetch.get(`/mp/api/v1/product/group/${productCode}`, objc)
}

export default {
  getGroup,
  getComment,
  getGoodsList,
  getSkusDetailByIds,
  getSkusDiseasesDetailByIds,
  getGoodsDetailById,
  getCarCammom,
  addDemand,
  demandList,
  delDemand,
  demandNumber,
  updataDemand,
  cartList,
  addCart,
  delCart,
  updataCart,
  cartNumber,
  getProductRelationGoods
}
