export const rules = {
  userName: {
    required: true,
    msg: '请正确填写收件人姓名'
  },
  telephone: {
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
  area: {
    required: true,
    msg: '请正确选择收件人地区'
  },
  address: {
    required: true,
    msg: '请正确选择收件人详细地址'
  }
}
