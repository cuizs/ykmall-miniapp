/**
 * 可忽略的异常状态码
 */

export default {
  // 活动相关
  Campaign_5: {
    code: 'Campaign_5',
    hint: '活动已结束',
    desc: '不可浏览CPP页面'
  },

  // 购物车相关
  Cart_5: {
    code: 'Cart_5',
    hint: '商品已经下架，请重新核对后结算',
    desc: '不可下单'
  },
  Cart_7: {
    code: 'Cart_7',
    hint: '商品有变动，请重新核对后结算',
    desc: '库存，上架状态，价格变化会报此异常，不可下单'
  },
  Cart_8: {
    code: 'Cart_8',
    hint: '商品回复正常状态！',
    desc: '不提示，静默刷新页面'
  },
  Cart_9: {
    code: 'Cart_9',
    hint: '商品价格有变动，是否继续下单',
    desc: '可以继续下单！'
  },

  // 订单相关
  Order_2: {
    code: 'Order_2',
    hint: '商品库存有变动，请重新核对后结算',
    desc: '不可下单'
  },
  Order_16: {
    code: 'Order_16',
    hint: '商品已下架',
    desc: '不可下单'
  },
  Order_23: {
    code: 'Order_23',
    desc: '修改订单状态时，订单状态不符'
  },
  Order_24: {
    code: 'Order_24',
    hint: '赠礼已下架，是否继续下单',
    desc: '可以继续下单！'
  },
  Order_25: {
    code: 'Order_25',
    hint: '您选择的赠品已下架，请重新选择',
    desc: '不可下单。'
  },

  // 库存相关
  Stock_1: {
    code: 'Stock_1',
    hint: '您选择的商品或赠品库存不足，请重新选择商品',
    desc: '检查商品库存不足！'
  },

  // CUSTOMER
  MaCustomer_4: {
    code: 'MaCustomer_4',
    hint: '注册会员失败，请联系客服',
    desc: '会员信息在 CRM 中存在异常'
  },

  // MA 错误码
  Ma_Backend_4: {
    code: 'Ma_Backend_4',
    hint: '商品不存在，请重新选购商品',
    desc: '商品被物理删除，或者原本不存在该商品'
  },
  Ma_Backend_5: {
    code: 'Ma_Backend_5',
    hint: '',
    desc: 'CMS BLOCK 不存在'
  }
}

// 静默式错误码
export const silentErrorCode = ['Cart_8', 1007/* 订单已下架 */, 900004/* 活动页已删除 */, 208/* 获取互医问诊室token根据UNIONID找不到用户 */]

// 非阻塞式错误码
export const nonBlockErrorCode = ['Cart_9', 'Order_24']

// 阻塞式错误码
export const blockErrorCode = ['Cart_7', 'Cart_5', 'Order_2', 'Order_16', 'Order_25', 'Stock_1']
