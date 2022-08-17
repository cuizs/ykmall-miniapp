// /**
//  * 网络请求
//  */
import api from '../../api/index'

// 获取地址列表
export const addressList = (id, cb) => {
  api.addressList(id,{
    loading: false,
    success: res => {
      cb && cb(res.data || {})
    }
  })
}

// 删除地址
export const deladdress = (id, cb) => {
  api.deladdress(id, {
    loading: true,
    success: res => {
      cb && cb(res)
    }
  })
}

// 设置默认

export const setdefaultAddress = (id, cb) => {
  api.setdefaultAddress(id, {
    loading: false,
    success: res => {
      cb && cb(res)
    }
  })
}