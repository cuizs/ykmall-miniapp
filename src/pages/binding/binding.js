import { rules } from './_config'
import { sendCode, bindingDoctor } from './_service'
import { validator } from '../../plugins/xy.validator'
import { throttle, isPhone } from '../../utils/util'
import um from '../../manager/userInfo'

Page({
  /**
   * 额外数据
   */
  extends: {
    timer: null
  },
  /**
   * 页面的初始数据
   */
  data: {
    formData: {},
    // 倒计时时间
    countDown: '发送验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    um.get(user => {
      if (user.customerType) {
        this.$to('distributor/distributor', 'redirectTo')
      } else {
        const { profitSetId } = options
        const { formData } = this.data
        formData.profitSetId = profitSetId || ''
        this.setData({
          formData
        })
      }
    })
  },
  /**
   * 页面事件
   */
  onInput(e) {
    const { value } = e.detail
    const { key } = e.currentTarget.dataset
    const { formData } = this.data
    formData[key] = value
    this.setData({
      formData
    })
  },
  // 提交
  onSubmitClick() {
    throttle(() => {
      const { formData } = this.data
      validator({
        rules: rules,
        formData: formData,
        result: (judgeResults, validResults, reasonText) => {
          if (!judgeResults) {
            wx._showToast({ title: reasonText || '请填写正确信息!' })
            return
          }
          um.get(user => {
            formData.id = user.id
            bindingDoctor(formData, data => {
              if (data.code == 0) {
                wx._showToast({ title: '绑定成功' })
                um.refresh(() => {
                  this.$to('distributor/distributor', 'redirectTo')
                })
              }
            })
          })
        }
      })
    })
  },
  // 发送验证码
  onSendCode() {
    const { formData } = this.data
    if (this.extends.timer) return
    if (!isPhone(formData.mobile)) {
      wx._showToast({ title: '请输入正确的手机号' })
      return
    }
    throttle(() => {
      sendCode(formData.mobile, data => {
        if (data.code == 0) {
          wx._showToast({ title: '验证码发送成功' })
          this.countDown()
        }
      })
    }, 3000)
  },
  countDown() {
    let time = 60
    this.extends.timer = setInterval(() => {
      time--
      if (time < 0) {
        clearInterval(this.extends.timer)
        this.setData({
          countDown: '重新发送'
        })
        this.extends.timer = null
      } else {
        this.setData({
          countDown: `${time}s`
        })
      }
    }, 1000)
  }
})
