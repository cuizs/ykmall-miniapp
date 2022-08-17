import dm from '../../manager/demand'
import osm from '../../manager/orderStream'
import um from '../../manager/userInfo'
import { add, mul } from '../../utils/util'
import { applyInvoice, getInvoiceList } from './_service'
import sm from '../../manager/share'
import local from '../../utils/localStorage'
import { debounce } from '../../utils/util'


Page({
  /**
   * 页面的初始数据
   */
  data: {
    fetching: false,
    id: '',
    amount: '0.00',
    type: '', typeName: '', title: '', tariffItem: '', remark: '', titleType: '', titleTypeName: '', companyAddress: '', bankAccount: '', selectContent: '请选择发票'
  },
  // "bankAccount": "",
  // "bankName": "",
  // "companyAddress": "",
  // "mobile": "",
  // "picUrl": "",
  // "remark": "",
  // "status": 0,
  // "tariffItem": "",
  // "title": "",
  // "titleType": 0,
  // "type": 0

  /**
   * 生命周期函数
   */
  onLoad (options) {
    console.log('options', options)
    const { id = '', amount = '0.00' } = options
    this.setData({
      id, amount
    })
  },
  onShow () {
    this.handleData()
  },
  handleData () {
    getInvoiceList((res => {
      let invoice = {}
      let _invoice_default_ = null  // 默认发票
      let _select_invoice_ = local.get('_invoice_')  // 选中的发票
      if (res.results.length > 0) {
        _invoice_default_ = res.results.find(r => r.isDefault)
      }
      // 优先取从发票列表选中的发票，其次是默认发票
      if (_select_invoice_) {
        invoice = _select_invoice_
      } else if (_invoice_default_) {
        invoice = _invoice_default_
      }
      console.log('invoice', invoice)
      const { type = "--", title = '--', tariffItem = '--', remark = '--', titleType = '--', companyAddress = '--', bankAccount = '--' } = invoice
      const selectContent = title && title !== '--' ? `已选：${title}` : '请选择发票'
      const typeName = type && type !== '--' ? type === 1 ? `电子发票` : '纸质发票' : '--'
      const titleTypeName = titleType && titleType !== '--' ? titleType === 1 ? `个人` : '公司' : '--'
      this.setData({ type, typeName, titleTypeName, title, tariffItem, remark, titleType, companyAddress, bankAccount, selectContent })

      // 删除选中发票
      local.remove('_invoice_')
    }))
  },
  onApplyClick: debounce(function () {
    // () {
    // console.log('.........')
    // return
    const _this = this
    if (!this.data.title || this.data.title === '--') {
      wx._showToast({ title: `请选择发票信息！` })
      return
    }
    if (this.data.fetching) return
    this.setData({
      fetching: true
    })
    const orderId = this.data.id
    const params = {
      type: this.data.type,
      title: this.data.title,
      tariffItem: this.data.tariffItem,
      remark: this.data.remark,
      titleType: this.data.titleType,
      companyAddress: this.data.companyAddress,
      bankAccount: this.data.bankAccount
    }
    applyInvoice(orderId, params,
      (res) => {
        console.log(res)
        console.log(_this)
        _this.setData({
          fetching: false
        })

        _this.$setRouterQuery({
          key: 'routerQuery',
          query: { tab: 0, applyInvoice: true }
        })
        // _this.$to('order/order', 'redirectTo')
        wx.redirectTo({
          url: '/pages/order/order'
        })
      },
      () => {
        _this.setData({
          fetching: false
        })
      })
  }, 1000)
})
