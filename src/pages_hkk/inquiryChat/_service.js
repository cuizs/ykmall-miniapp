/**
 * 网络请求
 */
import api from '../../api/index'

// 获取互联网医院问诊室token
export const getHospitalToken = (cb) => {
  api.getHospitalToken({
    loading: false,
    success: (res) => {
      cb && cb(res.data || [])
    },
  })
}

export const getInquiryMessageList = (inquiryId, cb) => {
  api.getInquiryMessageList(inquiryId, {
    loading: false,
    success: (res) => {
      cb && cb(res.data || [])
    }
  })
}

export const sendInquiryMessage = (data, cb, fail) => {
  api.sendInquiryMessage({
    loading: false,
    data,
    success: (res) => {
      cb && cb(res.data || [])
    },
    fail: (err) => {
      fail && fail(err)
    }
  })
}

export const getInquiryDetail = (inquiryId, cb, fail = null) => {
  api.getInquiryDetail(inquiryId, {
    loading: false,
    success: (res) => {
      cb && cb(res.data || [])
    },
    fail: (err) => {
      fail && fail(err)
    }
  })
}