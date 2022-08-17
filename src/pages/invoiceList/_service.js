/**
 * 网络请求处理
 */
import api from '../../api/index'

// 获取发票列表
export const getInvoiceList = (cb) => {
  api.getInvoiceList({
    loading: true,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 添加新发票
export const addInvoice = (pamras, cb) => {
  api.addInvoice({
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data || {})
    },
  })
}

// 更新发票
export const putInvoiceById = (id, pamras, cb) => {
  api.putInvoiceById(id, {
    loading: false,
    data: pamras,
    success: (res) => {
      cb && cb(res.data)
    },
  })
}

// 设为默认发票
export const putInvoiceDefault = (id, cb) => {
  api.putInvoiceDefault(id, {
    loading: false,
    success: (res) => {
      cb && cb(res.data)
    },
  })
}

// 删除发票
export const delInvoice = (id, cb) => {
  api.delInvoice(id, {
    loading: false,
    success: (res) => {
      cb && cb(res.data)
    },
  })
}
