export const rules = {
  name: {
    required: true,
    msg: '请输入您的姓名'
  },
  gender: {
    required: true,
    msg: '请选择您的性别'
  },
  birthday: {
    required: true,
    msg: '请选择您的生日'
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

export const gender=['男','女']