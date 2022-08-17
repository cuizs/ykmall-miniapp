/**
 * 网络请求
 */
import api from '../../api/index'

// 创建处方单
export const postPrescription = (data, cb) => {
  api.postPrescription({
    loading: true,
    data,
    success: (res) => {
      cb && cb(res.data || [])
    },
  })
}

// 更新处方单
export const putPrescription = (id, data, cb) => {
  api.putPrescription(id, {
    loading: true,
    data,
    success: (res) => {
      cb && cb(res.data || [])
    },
  })
}

// 删除处方单
export const delPrescription = (id, cb) => {
  api.delPrescription(id, {
    loading: true,
    success: (res) => {
      cb && cb(res.data || [])
    },
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

// 获取用药人信息详情
export const getDragUserDetail = (id, cb) => {
  api.getDragUserDetail(id, {
    success: (res) => {
      cb && cb(res.data)
    },
  })
}

// 获取 SkusDiseases 详情
export const getSkusDiseasesDetailByIds = (params, cb) => {
  api.getSkusDiseasesDetailByIds(params, {
    loading: false,
    success: (res) => {
      cb && cb(res.data || [])
    },
  })
}
