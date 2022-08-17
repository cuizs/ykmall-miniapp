import { getInvoiceList, putInvoiceDefault, delInvoice } from './_service'
import local from '../../utils/localStorage'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectPage: false,
    invoiceList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (options) {
    if (options.select) {
      this.setData({
        selectPage: true,
      })
    }
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    this.getList()
  },

  onSelect (e) {
    const { item } = e.currentTarget.dataset
    local.set('_invoice_', item)
    wx.navigateBack({
      delta: 1
    })
  },

  getList () {
    getInvoiceList((res) => {
      this.setData({
        invoiceList: res.results,
      })
    })
  },

  onDefaultChange (e) {
    const { id } = e.currentTarget.dataset
    this.data.invoiceList.forEach((item) => {
      if (item.id == id) {
        putInvoiceDefault(id, (res) => {
          this.getList((res_2) => {
            const default_invoice = res_2.find(item => item.isDefault)
            local.set('_invoice_default_', default_invoice)
          })
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 2000,
          })
        })
      }
    })
  },

  editInvoice (e) {
    const { id } = e.currentTarget.dataset
    this.$to(`invoiceDetail/invoiceDetail?id=${id}`, 'navigate')
  },

  delInvoice (e) {
    let self = this
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '提示',
      content: '确认删除此发票？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          delInvoice(id, (res) => {
            self.getList()
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000,
            })
          })
          const invoice = local.get('_invoice_') || {}
          const invoice_default = local.get('_invoice_default_') || {}

          if (invoice.id === id) {
            local.remove('_invoice_')
          }
          if (invoice_default.id === id) {
            local.remove('_invoice_default_')
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })
  },

  addNewInvoice () {
    this.$to(`invoiceDetail/invoiceDetail`, 'navigate')
  },
})
