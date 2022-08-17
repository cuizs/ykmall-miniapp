/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取用药人列表
export const getDragUserList = cb => {
  api.getDragUserList({
    loading: true,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 删除用药人
export const delDragUser = (id, cb) => {
  api.delDragUser(id, {
    loading: true,
    success: res => {
      cb && cb(res.data)
    }
  })
}

// 设置默认用药人
export const setDefaultDrugUser = (id, cb) => {
  api.setDefaultDrugUser(id, {
    loading: false,
    success: res => {
      cb && cb(res)
    }
  })
}
