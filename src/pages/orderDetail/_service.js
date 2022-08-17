/**
 * 网络请求处理
 */
import api from '../../api/index'
import {ORDER_STATUS, ORDER_STATUS_COLOR } from '../../config/commonConfig'

// 获取订单详情
export const getOrderDetailById = (id, cb) => {
    api.getOrderDetailById(id, {
        loading: false,
        success: res => {
            const data = res.data || {}
            data['express'] = data.express || {}
            data['orderLines'] = data.orderLines || []
            data['_statusContext'] = ORDER_STATUS(data.status)
            data['_statusColor'] = ORDER_STATUS_COLOR (data.status)
            if (!!data.expireTime) {
                data['formatExpriseTime'] = new Date(data.expireTime.replace(/-/g, "/")).getTime() - Date.now()

            }
            // if (!!item.expireTime) {
            //   // item.formateExpireTime =
            //   item.formatExpireTime = new Date(item.expireTime.replace(/-/g, "/")).getTime() - Date.now()
            // }
            for (const orderLine of data.orderLines) {
                orderLine.specValueText = ''
                if (orderLine.specValueJson) {
                    for (const key in orderLine.specValueJson) {
                        orderLine.specValueText = `${orderLine.specValueText} ${orderLine.specValueJson[key]}`
                    }
                }
            }
            cb && cb(data)
        }
    })
}

// 申请退货
export const returnOrderById = (pamras, cb) => {
    api.returnOrderById(pamras.id, {
        loading: false,
        data: pamras,
        success: res => {
            cb && cb(res.data || {})
        }
    })
}

// 填写物流单号
export const fillExpressNumber = (pamras, cb) => {
    api.fillExpressNumber(pamras.id, {
        loading: false,
        data: pamras,
        success: res => {
            cb && cb(res.data || {})
        }
    })
}

// 获取订单物流信息
export const getOrderDeliveryById = (id, cb) => {
    api.getOrderDeliveryById(id, {
        loading: false,
        success: res => {
            cb && cb(res.data)
        }
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
// 确认收货
export const orderConfirm = (orderId, cb, fail) => {
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