import { rules } from './_config'
import { validator } from '../../plugins/xy.validator'
import { addaddress,updataaddress } from './_service'
import um from '../../manager/userInfo'
import local from '../../utils/localStorage'
import { throttle } from '../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      userName: '',
      telephone: '',
      province: '',
      city: '',
      area: '',
      address: ''
    }
  },

  /**
   * 生命周期函数
   */
  onLoad(options) {
    this.setData({
      formData: local.get('_address_') || {}
    })
    local.remove('_address_')
  },
  onShow() {

  },
  /**
   * 页面事件
   */
  // 授权
  onAuthAddressCilck() {
    wx._getAuthAddress().then(res => {
      this.mergeWxAddressInfo(res)
    })
  },
  // 城市选择
  onPickerChange(e) {
    const { value } = e.detail
    this.setData({
      'formData.province': value[0],
      'formData.city': value[1],
      'formData.area': value[2]
    })
  },
  onChange (event) {
    this.setData({
      ['formData.isDefault']: event.detail,
    })
  },
  // 提交
  onSubmit(e) {
    const { value } = e.detail
    const { formData } = this.data
    // 填写项验证
    validator({
      rules: rules,
      formData: value,
      result: (judgeResults, validResults) => {
        if (!judgeResults) {
          wx._showToast({ title: '请填写正确收件信息!' })
          return
        }
        throttle(()=>{
          um.get(user => {
            value.customerId = user.id
            if (formData.id) { 
              updataaddress({ ...formData,...value }, res => {
                if (res.code == 0) {
                wx._showToast({ title: '地址更新成功' })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                },1500)
                }
              })
            } else{
              addaddress({ ...formData,...value }, res => {
                if (res.code == 0) {
                wx._showToast({ title: '地址创建成功' })
                setTimeout(() => {
                  wx.navigateBack({
                    delta: 1
                  })
                },1500)
                }
              })
            }
          })
        })
      }
    })
  },

  /**
   * 数据处理
   */
  mergeWxAddressInfo(info) {
    const temp = {
      userName: info.userName || '',
      telephone: info.telNumber || '',
      province: info.provinceName,
      city: info.cityName,
      area: info.countyName,
      address: info.detailInfo || ''
    }
    this.setData({
      formData: temp
    })
  }
})
