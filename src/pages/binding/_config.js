export const rules = {
  name: {
    required: true,
    msg: '请输入您的姓名'
  },
  mobile: {
    required: true,
    phone: true,
    msg: '请输入您的手机号'
  },
  smsCode: {
    required: true,
    msg: '请输入您的验证码 '
  }
}
