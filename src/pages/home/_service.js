/**
 * 网络请求
 */
import api from '../../api/index'

export const getCmsByType = (type, loading, cb) => {
  api.getCmsByType(type, {
    loading: loading,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

// 根据优惠券状态获取优惠券
export const getCouponlist = (params, cb) => {
  api.couponlist({
    data: params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}

export const getIsCampaignHomePage = (cb) => {
  api.hasCampaignHomePage({
    success: res => {
      cb && cb(res.data || null)
    }
  })
}