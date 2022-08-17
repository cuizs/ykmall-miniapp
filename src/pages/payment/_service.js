/**
 * 网络请求处理
 */
import api from '../../api/index'


// 获取默认地址

export const defaultAddress = (id, cb) => {
  api.defaultAddress(id, {
    loading: false,
    success: res => {
      cb && cb(res || {})
    }
  })
}

// 获取订单金额
export const getOrderAmount = (params, cb) => {
  api.getOrderAmount({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res.data || {})
    }
  })
}

// 创建订单
export const createOrder = (params, cb) => {
  api.createOrder({
    loading: true,
    data: params,
    success: res => {
      cb && cb(res.data || {})
    }
  })
}

// 根据优惠券获取金额
export const amoutByCoupon = (params, cb) => {
  api.amoutByCoupon({
    loading: false,
    data: params,
    success: res => {
      cb && cb(res.data || {})
    },
    fail: () => {
      cb && cb({ error: true })
    }
  })
}

// 获取优惠券
export const couponByOrder = (params, cb) => {
  api.couponByOrder({
    data: params,
    success: res => {
      const obj = res.data || {}
      obj.usable.forEach(item => {
        item.expireTime = item.expireTime.slice(0, 10)
      })
      obj.notUsable.forEach(item => {
        item.expireTime = item.expireTime.slice(0, 10)
      })
      cb && cb(obj || {})
    }
  })
}

// 领取优惠券
export const couponRedemption = (couponRuleId, cb) => {
  api.couponRedemption({
    data: { couponRuleId },
    success: res => {
      cb && cb(res)
    }
  })
}

export const getCouponGroupsAmountData = (list, cb) => {
  api.getCouponGroupsAmountData({
    data: list,
    success: res => {
      cb && cb(res)
    }
  })
}

// 获取用药人列表
export const getDragUserList = cb => {
  api.getDragUserList({
    loading: true,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 获取订单详情
export const getOrderDetailById = (id, cb) => {
  api.getOrderDetailById(id, {
    loading: false,
    success: (res) => {
      const data = res.data || {}
      // data['express'] = data.express || {}
      // data['orderLines'] = data.orderLines || []
      // data['_statusContext'] = ORDER_STATUS(data.status)

      // for (const orderLine of data.orderLines) {
      //   orderLine.specValueText = ''
      //   if (orderLine.specValueJson) {
      //     for (const key in orderLine.specValueJson) {
      //       orderLine.specValueText = `${orderLine.specValueText} ${orderLine.specValueJson[key]}`
      //     }
      //   }
      // }
      cb && cb(data)
    },
  })
}
