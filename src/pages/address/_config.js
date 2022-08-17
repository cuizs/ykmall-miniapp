export const rules = {
  recipient: {
    required: true,
    msg: '请正确填写收件人姓名'
  },
  mobile: {
    required: true,
    phone: true,
    msg: '请正确填写收件人手机号'
  },
  province: {
    required: true,
    msg: '请正确选择收件人地区'
  },
  city: {
    required: true,
    msg: '请正确选择收件人地区'
  },
  district: {
    required: true,
    msg: '请正确选择收件人地区'
  },
  detailAddress: {
    required: true,
    msg: '请正确填写收件人详细地址'
  }
}