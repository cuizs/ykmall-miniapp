/**
 * 网络请求处理
 */
import api from '../../api/index'
import { availableTimeFormat } from '../../utils/util'

export const demandList = cb => {
  api.demandList({
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

export const updataDemand = (params, cb) => {
  api.updataDemand(params.id, {
    loading: false,
    data: params,
    success: res => {
      cb && cb(res || [])
    }
  })
}

// 删除

export const delDemand = (id, cb) => {
  api.delDemand(id, {
    loading: true,
    success: res => {
      cb && cb(res || [])
    }
  })
}
