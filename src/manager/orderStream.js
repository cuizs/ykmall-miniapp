/**
 * 订单流管理
 * @desc
 * 订单流：订单流分为 地址 和 orderLines 信息
 * 订单流来源：来源分为 有详情页到支付 和 购物车到支付
 */
import local from '../utils/localStorage'


const LOCAL_KEY = 'PAY_ORDER_STREAM'
const SOURCE_KEY = 'PAY_ORDER_STREAM_SOURCE'

const orderStreamManager = {
  // 存放订单流的来源
  setOrderStreamSource(source) {
    local.set(SOURCE_KEY, source)
  },

  // 获取订单流的来源
  getOrderStreamSource() {
    const source = local.get(SOURCE_KEY)
    return source
  },

  // 设置代理商ID
  setOrderStreamPromoterId(id) {
    const orderStream = local.get(LOCAL_KEY) || {}
    orderStream['doctorId'] = id
    local.set(LOCAL_KEY, orderStream)
  },

  // 存放订单的地址信息
  setOrderAddress(address) {
    const orderStream = local.get(LOCAL_KEY) || {}
    orderStream['orderAddress'] = address
    local.set(LOCAL_KEY, orderStream)
  },

  // 存放订单的商品列表
  setOrderSkus(skus) {
    const orderStream = local.get(LOCAL_KEY) || {}
    const lines = []
    console.log("skus====", skus);
    for (const sku of skus) {
      lines.push({
        ...sku,
        groupProductDetailResDtos: sku.groupDetail,
        skuId: sku.skuId || sku.id
      })
    }
    orderStream['orderLines'] = lines
    local.set(LOCAL_KEY, orderStream)
  },

  // 获取订单流
  getOrderStream() {
    const orderStream = local.get(LOCAL_KEY) || {}
    return orderStream
  }
}

export default orderStreamManager
