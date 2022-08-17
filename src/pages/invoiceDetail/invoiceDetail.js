import { addInvoice, putInvoiceById, getInvoiceList, putInvoiceDefault } from './_service'
import { debounce } from '../../utils/util'
import local from '../../utils/localStorage'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 如果是更新，则有 invoiceId
    invoiceId: null,
    customerId: null,
    merchantCode: null,
    isDefault: null,

    titleTypeConfig: [
      {
        label: '公司',
        value: 2,
      },
      {
        label: '个人',
        value: 1,
      },
    ],
    needInvoice: 'true',
    // 发票类型：电子发票
    type: 1,
    remark: '',
    // 发票抬头： 1： 个人， 2：公司
    titleType: 2,
    title: '',
    tariffItem: '',
    companyAddress: '',
    bankAccount: '',
  },
  /**
 * 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    console.info('options', options)
    if (options.id) {
      getInvoiceList((res) => {
        if (res.results && res.results.length > 0) {
          res.results.forEach((item) => {
            if (item.id == options.id) {
              this.setData({
                invoiceId: item.id,
                remark: item.remark,
                titleType: item.titleType,
                title: item.title,
                tariffItem: item.tariffItem,
                companyAddress: item.companyAddress,
                bankAccount: item.bankAccount,
                customerId: item.customerId,
                merchantCode: item.merchantCode,
                isDefault: item.isDefault,
              })
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom () { },

  onNeedInvoiceChange (e) {
    console.info('onNeedInvoiceChange', e)
    this.setData({
      needInvoice: e.detail,
    })
  },

  onTitleTypeChange (e) {
    const { value } = e.currentTarget.dataset
    this.setData({
      titleType: value,
      title: '',
      tariffItem: '',
      companyAddress: '',
      bankAccount: '',
    })
  },
  getWechatTitle () {
    let self = this;
    wx.chooseInvoiceTitle({
      success: function (res) {
        if (self.data.titleType == 1) { // 个人
          self.setData({
            title: res.title,
          })
        } else { // 公司
          self.setData({
            title: res.title,
            tariffItem: res.taxNumber,
            companyAddress: res.companyAddress,
            bankAccount: res.bankAccount,
          })
        }
      }
    })
  },
  saveInvoice: debounce(function () {
    console.info('saveInvoice')
    console.log(this.data)
    if (!this.data.remark) {
      wx.showToast({
        title: '请填写发票内容',
        icon: 'none',
        duration: 2000,
      })
      return false
    }
    if (this.data.titleType == 1) {
      if (!this.data.title) {
        wx.showToast({
          title: '请填写姓名',
          icon: 'none',
          duration: 2000,
        })
        return false
      }
    }
    if (this.data.titleType == 2) {
      if (!this.data.title) {
        wx.showToast({
          title: '请填写公司名称',
          icon: 'none',
          duration: 2000,
        })
        return false
      }
      if (!this.data.tariffItem) {
        wx.showToast({
          title: '请填写公司税号',
          icon: 'none',
          duration: 2000,
        })
        return false
      } else {
        const taxCodeReg = /^(([0-9A-Za-z]{15})|([0-9A-Za-z]{18})|([0-9A-Za-z]{20}))$/
        if (!taxCodeReg.test(this.data.tariffItem)) {
          wx.showToast({
            title: '税号为15到20位数字字母组合，请检查',
            icon: 'none',
            duration: 2000,
          })
          return false
        }
      }
      if (!this.data.companyAddress) {
        wx.showToast({
          title: '请填写公司地址',
          icon: 'none',
          duration: 2000,
        })
        return false
      }
      if (!this.data.bankAccount) {
        wx.showToast({
          title: '请填写公司银行账号',
          icon: 'none',
          duration: 2000,
        })
        return false
      }
    }
    let pamras = {
      type: 1,
      remark: this.data.remark,
      titleType: this.data.titleType,
      title: this.data.title,
      companyAddress: this.data.companyAddress,
      tariffItem: this.data.tariffItem,
      bankAccount: this.data.bankAccount,
    }
    let putPamras = {
      ...pamras,
      id: this.data.invoiceId,
      customerId: this.data.customerId,
      merchantCode: this.data.merchantCode,
      isDefault: this.data.isDefault,
    }
    wx.showLoading({
      title: '提交中...',
    })
    if (this.data.invoiceId) {
      putInvoiceById(this.data.invoiceId, putPamras, (res) => {
        wx.hideLoading()
        wx.navigateBack({
          delta: 1  // 返回上一级页面。
        })
      })
    } else {
      addInvoice(pamras, (res) => {
        getInvoiceList((res_2) => {
          console.log('res_2', res_2)
          if (res_2.results.length === 1) {
            putInvoiceDefault(res_2.results[0].id, (res_3) => {
              local.set('_invoice_default_', res_2.results[0])
              wx.hideLoading()
              wx.navigateBack({
                delta: 1  // 返回上一级页面。
              })
            })
          } else {
            wx.hideLoading()
            wx.navigateBack({
              delta: 1  // 返回上一级页面。
            })
          }
        })
      })
    }
  }, 1000),
  inputEdit (e) {
    console.log(e)
    let _this = this
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value
    let name = dataset.name
    console.log(name)
    this.data[name] = value
    // this.setData({ name: _this.data[name] })
    console.log(this.data[name])
  }
})
