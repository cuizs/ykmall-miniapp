/**
 * 网络请求处理
 */
import api from '../../api/index'
import { availableTimeFormat } from '../../utils/util'
export const getGoodsDetail = (id, success, fail) => {
  api.getGoodsDetailById(id, {
    loading: false,
    success: (res) => {
      const data = res.data || {}
      console.log('data', data);
      // banner数据处理
      data['_bannerList'] = []
      //如果有渠道商品图，首先展示
      if (data.distributorBanners && data.distributorBanners.length > 0) {
        data['_bannerList'] = [...data.distributorBanners]
        if (data.banners) {
          data['_bannerList'] = [...data.distributorBanners, ...data.banners]
        }
      } else {
        if (data.banners) {
          data['_bannerList'] = data.banners
        }
      }
      console.log('data.banners', data._bannerList)
      // description数据处理
      data['_descriptionList'] = []
      if (data.description) {
        data['_descriptionList'] = data.description.split(',')
      } else {
        //如果有渠道商品图，首先展示
        if (data.distributorBanners) {
          data['_descriptionList'] = [...data.distributorBanners]
          if (data.banners) {
            data['_descriptionList'] = [...data.distributorBanners, ...data.banners]
          }
        } else {
          if (data.banners) {
            data['_descriptionList'] = data.banners
          }
        }
      }
      success && success(data)
    },
    fail: (error) => {
      fail && fail(error)
    },
  })
}

// 收藏商品
export const collect = (params, cb) => {
  api.collect({
    loading: false,
    data: params,
    success: (res) => {
      cb && cb(res)
    },
  })
}

// 取消收藏商品
export const cancelCollect = (params, cb) => {
  api.cancelCollect({
    loading: false,
    data: params,
    success: (res) => {
      cb && cb(res)
    },
  })
}

// 获取待领取优惠券
export const getCouponlist = (params, cb) => {
  api.couponlist({
    data: params,
    success: (res) => {
      cb && cb(res.data || [])
    },
  })
}

// 获取商品可领取优惠券
export const getCouponByProduct = (id, cb) => {
  api.getCouponByProduct(id, {
    success: (res) => {
      const data = res.data || []
      for (const item of data) {
        if (!item.status) item['status'] = 'pending'
      }
      cb && cb(data)
    },
  })
}

// 领取优惠券
export const couponRedemption = (params, cb) => {
  api.couponRedemption({
    data: params,
    success: (res) => {
      cb && cb(res)
    },
  })
}

// 获取商品套组

export const getGroup = (id, cb) => {
  api.getGroup(id, {
    success: (res) => {
      let arrayList = res.data || []
      let list = []
      arrayList.forEach(item => {
        if (item.status == 'Enable') {
          list.push(item)
        }
      })
      cb && cb(list || [])
    },
  })
}

// 获取评价列表
export const getOrderComment = (pamras, cb) => {
  api.getOrderComment(pamras, {
    loading: false,
    success: (res) => {
      cb && cb(res.data || {})
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

export const demandNumber = (cb) => {
  api.demandNumber({
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

export const cartNumber = (cb) => {
  api.cartNumber({
    success: (res) => {
      cb && cb(res)
    },
  })
}

// 获取需求清单列表
export const getDemandList = cb => {
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
// 获取购物车列表
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

// 获取购物车列表
export const getRelationProducts = (code, cb) => {
  api.getProductRelationGoods(code, {
    loading: false,
    success: res => {
      console.log("res===", res);
      const data = res.data || []
      cb && cb(res.data || [])
    }
  })
}

// 查看用户信息
export const userInfo = (cb) => {
  api.getUserInfo({
    loading: false,
    success: res => {
      cb && cb(res.data)
    }
  })
}


