import { rules } from './_config'
import { validator } from '../../plugins/xy.validator'
import { addressList,deladdress,setdefaultAddress } from './_service'
import um from '../../manager/userInfo'
import local from '../../utils/localStorage'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数
   */
  onLoad (options) {
    this.$initLoading()
    this.$showLoading()
    this.from = options.from || null
  },
  onShow () {
    this.init()
  },
  init () {
    um.get(user => {
      addressList(user.id, list => {
        this.setData({ list })
        this.$hideLoading()
      })
    })
  },
  /**
   * 页面事件
   */
  onAddClick () {
    this.$to('checkout/checkout')
  },
  // 选择地址
  onselect (e) {
    console.log("执行选择");
    const { item } = e.currentTarget.dataset
    if (!this.from) return
    local.set('_address_', item)
    wx.navigateBack({
      delta: 1
    })
  },
  // 编辑
  onEdit (e) {
    const { item } = e.currentTarget.dataset
    local.set('_address_', item)
    this.$to('checkout/checkout')
  },
  // 设置默认
  onChange (e) {
    const { item } = e.currentTarget.dataset
    console.log(555456,item);
    setdefaultAddress(item.id, res => {
      this.init()
    })
   },
  // 删除
  ondel (e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '',
      content: '您确定删除该地址？',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          deladdress(id, res => {
            um.get(user => {
              addressList(user.id, list => {
                this.setData({ list })
                this.$hideLoading()
              })
            })
          })
        }
      }
    })
  },

})
