import cm from '../../manager/cart'
import um from '../../manager/userInfo'
import sm from '../../manager/share'
import osm from '../../manager/orderStream'
import { add, mul } from '../../utils/util'
import { getCarCammom, getCartList, updataCart, delCart } from './_service'

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
    // 购物车推荐
    carCommom: [],
    show: false,
    storeChannel:null
  },

  /**
   * 生命周期函数
   */
  onShow () {
    this.getCartList(false)
    cm.fetchCartCount()
    getCarCammom('CartProduct', (data) => {
      if (!data.active) return
      const carCommom = (data.items || []).map(val => {
        const product = val.product
        product.saleTotalStr = (product.saleTotal || 0) + (product.realSaleTotal || 0) > 9999 ? '9999+' : (product.saleTotal || 0) + (product.realSaleTotal || 0)
        return { ...val, product }
      })
      this.setData({ carCommom })
      console.log('carCommom', this.data.carCommom);
    })
     //获取店铺渠道
     let storeChannel = um.getCurrentChannel()
     this.setData({ storeChannel: storeChannel})
     console.log('this.data.storeChannel',this.data.storeChannel);
  },

  /**
    * 页面事件
    */
  // 勾选购物车商品
  onGoodsCheckClick (e) {
    const { cartList } = this.data
    const { index } = e.currentTarget.dataset
    // 处理其余小店商品选择
    for (let i = 0; i < cartList.length; i++) {
      const item = cartList[i]
      if (index == i) {
        item['checked'] = !item['checked']
      }
    }
    this.setData({ cartList: cartList })
    // 更新商品总价
    this.updateTotalPrice()
    this.computedAllSelect()
  },

  // 单个仓库的全选和非全选
  onGoodsGroupCheckClick (e) {
    const { index, item } = e.currentTarget.dataset;
    const { cartList } = this.data
    let allChecked = !item['allChecked']
    for (let i = 0; i < cartList.length; i++) {
      const itm = cartList[i]
      if (item.distributorId == itm.distributorId) {
        itm['checked'] = allChecked;
      }
      if (index == i) {
        itm['allChecked'] = allChecked
      }
    }
    this.setData({ cartList: cartList })
    // 更新商品总价
    this.updateTotalPrice()
    this.computedAllSelect()
  },

  // 删除购物车
  onDeleteClick (e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '',
      content: '是否移除选中商品',
      confirmText: '移除',
      success: (res) => {
        if (res.confirm) {
          delCart(id, (res) => {
            if (res.code == 0) {
              this.getCartList()
              wx._showToast({ title: '移除成功!' })
              cm.fetchCartCount()
            }
          })
        }
      },
    })
  },
  caculateAmount ({ distributorLimitNum, stockTotal, limitNum, inputAmount }) {
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
    console.log('stockTotal', stockTotal)
    if (parseInt(stockTotal) < amount) {
      wx._showToast({ title: '已超出库存数量!' })
      return parseInt(stockTotal)
    }
    return inputAmount
  },
  // 商品数量改变
  onNumberChange (e) {
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
    if (value <= 1 && cartItem['quantity'] <= 1) {
      wx._showToast({ title: '数量不能小于一件' })
      return
    }
    cartItem['quantity'] = value
    updataCart(cartItem, (res) => {
      this.getCartList()
    })
  },
  // 前往选购
  onGoBuyClick () {
    this.$to('category/category', 'switchTab')
  },
  onScClick () {
    this.$to('collection/collection')
  },

  // 确定结算
  onSubmitClick () {
    this.checkVip(() => {
      let orderSku = this.data.cartList
      orderSku = this.getFilterOrderSku(orderSku)
      // 没有符合结算的商品就不处理
      if (!orderSku.length) {
        wx._showToast({ title: '请选择购买商品!' })
        return
      }
      let isOnlyOneDistributor = this.checkIsOnlyOneDistributor(orderSku)
      if (!isOnlyOneDistributor) {
        wx._showToast({ title: '因发货仓不同请分开结算部分商品!' })
        return
      }
      // 设置 orderLine 参数
      osm.setOrderSkus(orderSku)
      osm.setOrderStreamSource('cart')
      // 判断设置 doctorId 参数
      const firstSku = orderSku[0]
      if (firstSku.doctorId && firstSku.doctorId != 0) {
        osm.setOrderStreamPromoterId(firstSku.promoterId)
      }
      this.$to('payment/payment')
    })

  },
  checkIsOnlyOneDistributor (orderSku) {
    console.log(orderSku);
    let distributorId = orderSku[0].distributorId;
    let isTrue = true;
    orderSku.forEach(item => {
      if (item.distributorId != distributorId) {
        isTrue = false
      }
    })
    console.log(isTrue);
    return isTrue;
  },
  // 商品 cell 点击
  onCellClick (e) {
    const { id, disabled } = e.currentTarget.dataset
    if (!disabled) {
      this.$to(`goodsDetail/goodsDetail?id=${id}`, 'navigate')
    }
  },
  /**
   * 数据处理
   */
  // 计算更新总价
  updateTotalPrice () {
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
  getFilterOrderSku () {
    const { cartList } = this.data
    return cartList.filter((item) => {
      if (item.checked && item.status === 'Enable' && item.stock > 0) {
        return item
      }
    })
  },
  /** 网络请求 */
  getCartList (updateCheck = true) {
    let list = this.data.cartList ? this.data.cartList : []
    getCartList((data) => {
      // 根据经销商排序
      data.sort(this.compare("distributorId"));
      // 获取需要显示仓库名称的商品，为了不修改数据结构，暂时不将cartList变为二维数组
      let distributorList = [];
      let distributorIndexList = [];
      data.forEach((item, index) => {
        if (!distributorList.includes(item.distributorId)) {
          distributorList.push(item.distributorId);
          distributorIndexList.push(index);
        }
      })
      data.forEach((item, idx) => {
        // 设置勾选状态
        if (updateCheck) {
          let itms = list.filter(v => {
            return v.id == item.id
          })
          if (itms.length > 0) {
            item['checked'] = itms[0]['checked']
          } else {
            item['checked'] = !(item.stock === 0 || item.status === 'Disable')
          }
        }
        // else { // 默认为都勾选
        //   item['checked'] = !(item.stock === 0 || item.status === 'Disable')
        // }
        else { // 默认为都不勾选
          item['checked'] = false
        }

        // 经销商的第一个商品设置名称来显示仓库名称
        if (distributorIndexList.includes(idx)) {//
          item.distributorGroupName = item.distributorName;
          item.distributorGroupIndex = distributorIndexList.indexOf(idx);
          item.top = 92;
          let allChecked = false;
          item.allChecked = allChecked;
        } else {
          item.allChecked = false;
          item.top = 22;
        }
        item.name = item.skuName



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
      console.log("重新排序的购物车数据为：", data);
      this.setData({ cartList: data, pageShow: true })
      this.computedAllSelect()
      // 更新商品总价
      this.updateTotalPrice()
    })
  },

  compare (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop]; if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },

  // 计算是否全部选中了，每次改变一个商品的 check 都要计算
  computedAllSelect () {
    const { cartList } = this.data
    let hasNotChecked = false
    for (let i = 0; i < cartList.length; i++) {
      const item = cartList[i]
      if (!item['checked']) {
        hasNotChecked = true
      }
    }
    this.setData({
      allSelect: !hasNotChecked,
    })

    // 判定仓库的全选和非全选
    let list = cartList.filter(itm => {
      return itm.distributorGroupName;
    })
    list.forEach(item => {
      let allChecked = true;
      cartList.forEach(itm => {
        if (item.distributorId == itm.distributorId && itm.checked == false) {
          allChecked = false;
        }
      })
      item.allChecked = allChecked
    })

    cartList.forEach(item => {
      list.forEach(itm => {
        if (item.distributorGroupName && item.distributorId == itm.distributorId) {
          item.allChecked = itm.allChecked;
        }
      })
    })
    this.setData({
      cartList: cartList
    })

  },
  // 全选 click
  onSelectAllCheckClick (e) {
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
    })

    // 更新商品总价
    this.updateTotalPrice()
  },
  //判断是否是vip
  checkVip (cb) {
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
  onShareAppMessage () {
    return sm.userShare()
  },
  onShareTimeline () {
    return sm.userShare()
  }
})
