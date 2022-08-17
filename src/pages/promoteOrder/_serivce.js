/**
 * 网络请求处理
 */
import api from '../../api/index'
import { ORDER_STATUS,ORDER_STATUS_COLOR} from '../../config/commonConfig'
import { getDate } from '../../utils/util'
export const getPromoterList = (params, loading = false, cb) => {
  api.getPromoterList({
    loading: false,
    data: params,
    success: (res) => {
      const data = res.data || {}
      const list = data.pageDto.results || []
      for (const item of list) {
        // 翻译订单状态
        item['_statusContext'] = ORDER_STATUS(item.status)
        item['_statusColor'] = ORDER_STATUS_COLOR(item.status)

        console.log('orderItem', item)
      }
      // list.forEach((item) => {
      //   for (const orderLine of item.orderLines) {
      //     orderLine.specValueText = ''
      //     if (orderLine.specValueJson) {
      //       for (const key in orderLine.specValueJson) {
      //         orderLine.specValueText = `${orderLine.specValueText} ${orderLine.specValueJson[key]}`
      //       }
      //     }
      //   }
      // })
      console.log(data)
      cb && cb(data)
    },
  })
}

// 查看物流
export const getOrderDeliveryById = (id, cb) => {
  api.getOrderDeliveryById(id, {
    loading: true,
    success: (res) => {
      cb && cb(res.data)
    },
  })
}

// 取消订单
export const returnOrderById = (id, pamras, cb) => {
  api.returnOrderById(id, {
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 未发货时，申请退款
export const applyRefundById = (id, pamras, cb) => {
  api.applyRefundById(id, {
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}


// 代付款点击付款按钮时，校验订单商品是否超出数量限制
export const checkOrderLimtNum = (orderId, params = {}, cb) => {
  api.checkOrderLimtNumUsingGET(orderId, {
    loading: false,
    data: params,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 获取商品详情
export const getGoodsDetail = (id, success, fail) => {
  api.getGoodsDetailById(id, {
    loading: true,
    success: (res) => {
      success && success(res)
    },
    fail: (error) => {
      console.log(error)
      fail && fail(error)
    },
  })
}

// 添加需求清单
export const addDemand = (params, cb) => {
  api.addDemand({
    data: params,
    success: (res) => {
      cb && cb(res)
    },
  })
}

// 添加购物车清单
export const addCart = (params, cb) => {
  api.addCart({
    data: params,
    success: (res) => {
      cb && cb(res)
    },
  })
}


export const getCartList = cb => {
  api.cartList({
    loading: false,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

// 获取需求清单列表
export const getDemandList = cb => {
  api.demandList({
    loading: false,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

// 再来一单
export const oneMoreOrder = (orderId, cb, fail) => {
  api.oneMoreOrder({
    loading: false,
    id: orderId,
    success: res => {
      cb && cb(res.data || [])
    },
    fail: (error) => {
      fail && fail(error)
    },
  })
}

export const orderConfirm = (orderId, cb, fail) => {
  console.log('....')
  api.orderConfirm(orderId, {
    loading: true,
    success: res => {
      cb && cb(res.data || [])
    },
    fail: (error) => {
      fail && fail(error)
    }
  })
}