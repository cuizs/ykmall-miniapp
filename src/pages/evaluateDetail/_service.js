/**
 * 网络请求处理
 */
import api from '../../api/index'
import { ORDER_STATUS } from '../../config/commonConfig'

// 获取评价列表
export const getOrderComment = (pamras, cb) => {
  api.getOrderComment(pamras, {
    loading: false,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 根据商品 id 获取商品评价
export const getGoodsDetailById = (id, success, fail) => {
  api.getGoodsDetailById(id, {
    loading: false,
    success: (res) => {
      const data = res.data || {}
      // banner数据处理
      data['_bannerList'] = []
      if (data.banners) {
        data['_bannerList'] = data.banners
      }

      // description数据处理
      data['_descriptionList'] = []
      if (data.description) {
        data['_descriptionList'] = data.description.split(',')
      }

      success && success(data)
    },
    fail: (error) => {
      fail && fail(error)
    },
  })
}
