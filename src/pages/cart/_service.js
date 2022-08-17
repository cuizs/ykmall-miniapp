/**
 * 网络请求处理
 */
import api from '../../api/index'
import { availableTimeFormat } from '../../utils/util'


export const getCarCammom = (type, cb) => {
  api.getCarCammom(type,{
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

export const getCartList = cb => {
  api.cartList({
    loading: false,
    success: res => {
      const data = res.data || []
      for (const sku of data) {
        
        // 活动是否结束
        if (!sku.campaignProduct) continue
        const availableTime = new Date(availableTimeFormat(sku.campaignProduct.endTime)).getTime()
        sku.campaignProduct['isAvailable'] =
          Date.now() < availableTime && sku.campaignProduct.enabled && sku.campaignProduct.stock
      }
      cb && cb(res.data || [])
    }
  })
}

export const updataCart = (params, cb) => {
  api.updataCart(params.id, {
    loading: false,
    data: params,
    success: res => {
      cb && cb(res || [])
    }
  })
}

// 删除
export const delCart = (id, cb) => {
  api.delCart(id, {
    loading: true,
    success: res => {
      cb && cb(res || [])
    }
  })
}