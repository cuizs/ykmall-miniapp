import dm from '../../manager/demand'
import osm from '../../manager/orderStream'
import um from '../../manager/userInfo'
import { add, mul } from '../../utils/util'
import { demandList, updataDemand, delDemand } from './_service'
import sm from '../../manager/share'
import cnm from '../../manager/channel'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 购物车列表
    cartList: [],
    // 总金额
    totalPrice: 0,
    // 判断空购物车样式是否显示
    pageShow: false,
    // 判断商品全选
    allSelect: false,
    pageShow: false,
    show: false,
    newChecked: [],
    currentChannel: "",
    themeColor: '#0091FF',
    maxChecked: false
  },

  /**
   * 生命周期函数
   */
  onShow() {
    this.getDemandList(false)
    dm.fetchDemandCount()
    let self = this
    um.getChannelASync().then(channel => {
      self.setData({
        currentChannel: channel
      })
      if (channel == 'hkk') {
        let color = cnm.getChannelMainColor()
        self.setData({
          themeColor: color,
          maxChecked: false,
          newChecked: []
        })
      }
    })

  },

  /**
   * 页面事件
   */
  // 勾选购物车商品
  onGoodsCheckClick(e) {
    const { index } = e.currentTarget.dataset
    const { cartList } = this.data
    if (!e.currentTarget.dataset.item.checked) {
      console.log('this.data.maxChecked', this.data.maxChecked);
      if (this.data.maxChecked && this.data.currentChannel == 'hkk') {
        wx._showToast({ title: '单次最多结算5种药品，请单独勾选结算！' })
        return
      }
    }
    // 处理其余小店商品选择
    let newChecked = new Set(this.data.newChecked)
    for (let i = 0; i < cartList.length; i++) {
      const item = cartList[i]
      if (index == i) {
        item['checked'] = !item['checked']
        if (item.checked) {
          // console.log('item.checked', item.checked);
          newChecked.add(item)
        } else {
          if (newChecked.has(item)) {
            newChecked.delete(item)
          }
        }
      }
    }
    newChecked = Array.from(newChecked)
    console.log('newChecked', newChecked)
    if (newChecked.length >= 5) {
      this.setData({ maxChecked: true })
    } else {
      this.setData({ maxChecked: false })
    }
    this.setData({ cartList: cartList })
    this.setData({ newChecked: newChecked })
    // console.log("cartList", cartList);
    // 更新商品总价
    this.updateTotalPrice()
    this.computedAllSelect()
  },

  // 删除购物车
  onDeleteClick(e) {
    let a = this.data.newChecked
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '',
      content: '是否移除选中商品',
      confirmText: '移除',
      success: (res) => {
        if (res.confirm) {
          // a.forEach((item, index) => {
          //   if (item.id == e.currentTarget.dataset.id) {
          //     a.splice(index)
          //   }
          // })
          // this.setData({
          //   newChecked: a,
          //   maxChecked: false
          // })
          delDemand(id, (res) => {
            if (res.code == 0) {
              this.setData({
                newChecked: [],
                maxChecked: false
              })
              this.getDemandList()
              wx._showToast({ title: '移除成功!' })
              dm.fetchDemandCount()
            }
          })
        }
      },
    })
  },
  caculateAmount({ distributorLimitNum, stockTotal, limitNum, inputAmount }) {
    const { currentSku } = this.data
    const amount = parseInt(inputAmount)
    if (null !== distributorLimitNum) {
      if (0 !== parseInt(distributorLimitNum)) {
        console.log('经销商限购')
        // 经销商限购
        if (amount > parseInt(distributorLimitNum)) {
          wx._showToast({ title: '已超出最大购买数量!' })
          return parseInt(distributorLimitNum)
        }
      }
    } else {
      if (0 !== parseInt(limitNum)) {
        // 一体化限购
        console.log('一体化限购')
        if (amount > parseInt(limitNum)) {
          wx._showToast({ title: '已超出最大购买数量!' })
          return parseInt(limitNum)
        }
      }
    }
    if (parseInt(stockTotal) < amount) {
      wx._showToast({ title: '已超出库存数量!' })
      return parseInt(stockTotal)
    }
    return inputAmount
  },
  // 商品数量改变
  onNumberChange(e) {
    let { value } = e.detail;
    const { cartList } = this.data,
      { item } = e.currentTarget.dataset,
      cartItem = item,
      { distributorLimitNum = null, limitNum = null, stock = 0 } = cartItem
    console.log('经销商最大限制数量==>', distributorLimitNum)
    console.log('一体化最大限制数量==>', limitNum)
    console.log('购物车或需求清单中的数量==>', this.data.cartAmount)
    console.log('库存===>', stock)
    value = this.caculateAmount({ distributorLimitNum, stockTotal: stock, limitNum, inputAmount: value })
    console.log(value)
    if (value < 1 && cartItem['quantity'] < 1) {
      wx._showToast({ title: '数量不能小于一件' })
      return
    }
    cartItem['quantity'] = value
    updataDemand(cartItem, (res) => {
      this.getDemandList()
    })
  },
  // 前往选购
  onGoBuyClick() {
    this.$to('category/category', 'switchTab')
  },
  onScClick() {
    this.$to('collection/collection')
  },

  // 确定结算
  onSubmitClick() {
    this.checkVip(() => {
      let orderSku = this.data.cartList
      orderSku = this.getFilterOrderSku(orderSku)
      // 没有符合结算的商品就不处理
      if (!orderSku.length) {
        wx._showToast({ title: '请选择购买商品!' })
        return
      }
      // 设置 orderLine 参数
      osm.setOrderSkus(orderSku)

      // 判断设置 doctorId 参数
      const firstSku = orderSku[0]
      if (firstSku.doctorId && firstSku.doctorId != 0) {
        osm.setOrderStreamPromoterId(firstSku.promoterId)
      }
      const page = firstSku.goodsType == 2 ? "demandList" : "cart"
      this.$to(`payment/payment?from=${page}`)
    })

  },
  // 商品 cell 点击
  onCellClick(e) {
    const { id, disabled } = e.currentTarget.dataset
    if (!disabled) {
      this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
    }
  },
  onImageError(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.cartList
    let newList = JSON.parse(JSON.stringify(list));
    newList[index].imageUrl = '../../assets/image/defaultImg.png'
    this.setData({
      cartList: newList
    })
  },
  /**
   * 数据处理
   */
  // 计算更新总价
  updateTotalPrice() {
    const { cartList } = this.data
    let totalPrice = 0
    cartList.forEach((item) => {
      if (item.checked) {
        const price =
          item.campaignProduct && item.campaignProduct.isAvailable
            ? item.campaignProduct.salePrice
            : item.actualPrice

        totalPrice = add(totalPrice, mul(price, item.quantity))
      }
    })
    this.setData({ totalPrice })
  },

  // 生成订单时只保存没有下架和有库存的商品 && 被选择的商品
  getFilterOrderSku() {
    const { cartList } = this.data
    return cartList.filter((item) => {
      if (item.checked && item.status === 'Enable' && item.stock > 0) {
        item.goodsType = 2
        return item
      }
    })
  },
  /** 网络请求 */
  getDemandList(updateCheck = true) {
    let list = this.data.cartList ? this.data.cartList : []
    console.log('list', list);
    demandList((data) => {
      data.forEach((item) => {
        item.name = item.skuName
        // 设置勾选状态
        // if (updateCheck) {
        //   let itms = list.filter(v => {
        //     return v.id == item.id
        //   })
        //   if (itms.length > 0) {
        //     item['checked'] = itms[0]['checked']
        //   } else {
        //     item['checked'] = !(item.stock === 0 || item.status === 'Disable')
        //   }
        // } else { // 默认为都勾选
        //   item['checked'] = !(item.stock === 0 || item.status === 'Disable')
        // }

        // 设置最大可买量
        let limitNum = item.limitNum
        let stock = item.stock
        let maxNum = 0
        if (stock == 0) { // 库存为0，最大值为0
          maxNum = stock
        } else {
          if (limitNum == 0) { // 最大销售量为0，即不限制最大销售量,根据库存决定最大可销售量
            maxNum = stock
          } else { // 根据库存和限制的销售量更小的值来确定最大购买量
            maxNum = limitNum > stock ? stock : limitNum
          }
        }
        item.maxNum = maxNum
      })
      this.setData({ cartList: data, pageShow: true })
      this.computedAllSelect()
      // 更新商品总价
      this.updateTotalPrice()
    })
  },

  // 计算是否全部选中了，每次改变一个商品的 check 都要计算
  computedAllSelect() {
    let hasNotChecked = false
    for (let i = 0; i < this.data.cartList.length; i++) {
      const item = this.data.cartList[i]
      if (!item['checked']) {
        hasNotChecked = true
      }
    }
    this.setData({
      allSelect: !hasNotChecked,
    })
  },
  // 全选 click
  onSelectAllCheckClick(e) {
    if (this.data.cartList.length > 5 && this.data.currentChannel == 'hkk') {
      wx._showToast({ title: '单次最多结算5种药品，请单独勾选结算!' })
      return
    }
    let checkedStatus = e.detail
    for (let i = 0; i < this.data.cartList.length; i++) {
      const item = this.data.cartList[i]
      if (item.status != 'Disable' && item.stock > 0) {
        item['checked'] = checkedStatus
      }
    }
    this.setData({
      allSelect: checkedStatus,
      cartList: this.data.cartList,
      newChecked: this.data.cartList
    })
    if (!checkedStatus) {
      this.setData({
        newChecked: [], 
        maxChecked: false
      })
    }

    // 更新商品总价
    this.updateTotalPrice()
  },
  //判断是否是vip
  checkVip(cb) {
    um.isVip(res => {

      if (!!res) {
        cb && cb()
        return
      }

      this.setData({
        show: !res
      })
    })
  },
  onShareAppMessage() {
    return sm.userShare()
  },

  onShareTimeline() {
    return sm.userShare()
  }
})
