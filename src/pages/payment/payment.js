import um from '../../manager/userInfo'
import pay from '../../manager/payment'
import osm from '../../manager/orderStream'
import local from '../../utils/localStorage'
import { privacyContext, serviceContext, couponTab, express, buyBtnText } from './_config.js'
import {
  createOrder,
  couponRedemption,
  couponByOrder,
  amoutByCoupon,
  defaultAddress,
  getCouponGroupsAmountData,
  getDragUserList,
  getOrderDetailById
} from './_service'
import { numSub, debounce } from '../../utils/util'
import cnm from '../../manager/channel'

const CAN_SELECTED_COUPON_NUMBER = 2

const CASH_COUPON_TYPE = ['CashVoucher', 'Full']

const DISCOUNT_COUPON_TYPE = ['FullDiscount', 'Discount']

Page({
  /**
   * 非页面渲染数据
   */
  extData: {
    // 记录参数
    options: {},
    // 条款 modal
    policyModal: null,
    // 记录可用的优惠券
    recodeCanUsableCoupon: []
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 基本信息
    formdata: {
      logisticsMode: '1',
      remark: ''
    },
    logisticsModeDisable: false,
    currentChannel: '',
    // 订单流信息
    orderStreamDetail: {},
    // 运费
    freightAmount: 0,
    // 订单金额信息
    amountDetail: {
      amountPayable: 0
    },
    // 优惠券信息
    couponDetail: {},
    // 输入优惠码
    inputCouponCode: '',
    // 是否同意条款
    isAgree: false,
    // 是否存在优惠卷
    couponName: false,
    // 模态框文案
    policyText: '',
    // 订单地址
    orderAddress: {},
    // 金额数据
    amoutData: {},
    // 数量
    num: 0,
    // 优惠券tab
    couponTab: couponTab,
    // 可用优惠券列表
    canUsableCoupon: [],
    // 不可用优惠券
    notUsableCoupon: [],
    // 选择的优惠券
    selectedCoupon: [],
    // 选中的券 code
    selectCouponCode: [],
    // 当前优惠券tab
    currentCouponTab: couponTab[0],
    // 隐私政策
    privacyContext: privacyContext,
    // 服务条款
    serviceContext: serviceContext,
    // 配送方式
    express,
    // 需求清单
    recipeNumber: null,
    // 订单类型
    goodsType: null,
    buyBtnText: '立即支付',
    prescriptionData: null,
    pollingTimer: null,
    pollingTimes: 0
  },

  /**
   * 生命周期函数
   */
  onLoad (options) {
    local.remove('_recipeNumber_')
    local.remove('_prescriptionData_')
    local.remove('_invoice_')
    local.remove('_address_')
    this.extData.options = options
    this.getUserChannel()
    //合康康渠道 => 立即支付改为预约支付
    if (this.data.currentChannel = 'hkk') {
      let color = cnm.getChannelMainColor()
      this.setData({
        from: options.from || null,
        themeColor: color
      })
    }
    um.get(user => {
      defaultAddress(user.id, res => {
        if (res.data) {
          this.setData({ orderAddress: res.data || local.get('_address_') || {} })
        }
        this.handelData()
        // 获取优惠券
        this.handleCouponList((data) => {
          // 计算订单价格
          this.getOrderAmountData()
        })
      })
    })
  },
  onShow () {
    // 首次加载不会执行以下方法，从其他页面才会执行，避免和onload中方法重复调用
    if (this.data.currentChannel) {
      this.handelData()
      // 获取优惠券
      this.handleCouponList((data) => {
        // 计算价格
        this.getOrderAmountData()
      })
    }
  },
  getUserChannel () {
    let self = this
    um.getChannelASync().then(channel => {
      // const _buyBtnText = Object.keys(buyBtnText).some(val => val === channel) ? buyBtnText[channel] : '立即支付'
      self.setData({
        currentChannel: channel,
        // buyBtnText: _buyBtnText
      })
      if (channel != 'hkk') {
        let express = [
          {
            name: '普通快递',
            type: '1',
          }
        ]
        self.setData({
          express: express,

        })
      }

    })
  },
  // 数据处理
  handelData () {
    let num = 0
    // 金额信息 及 订单流信息
    const orderStreamDetail = osm.getOrderStream()
    const { orderLines = [] } = orderStreamDetail
    console.log("orderStreamDetail",orderStreamDetail);
    console.log('orderLines', orderLines);
    orderLines.forEach(item => {
      num = num + item.quantity * 1
    })
    const goodsType = orderLines[0] && orderLines[0].goodsType ? orderLines[0].goodsType : null
    this.setData({
      num,
      recipeNumber: local.get('_recipeNumber_'),
      goodsType,
      orderStreamDetail,
      orderAddress: local.get('_address_') ? local.get('_address_') : this.data.orderAddress,
      ['formdata.isInvoice']: !!local.get('_invoice_'),
      ['formdata.invoice']: local.get('_invoice_') || {}
    })
    if (goodsType === 2) {
      const _buyBtnText = Object.keys(buyBtnText).some(val => val === this.data.currentChannel) ? buyBtnText[this.data.currentChannel] : '立即支付'
      this.setData({
        buyBtnText: _buyBtnText
      })
      // 获取用药人id
      const dragUserId = JSON.parse(local.get('_prescriptionData_') || JSON.stringify({})).dragUserId
      getDragUserList(data => {
        let list = data ? data : []
        this.setData({
          prescriptionData: list.length > 0 ? list.find(val => val.id === dragUserId) : null
        })
      })
    }
  },
  onReady () {
    this.extData.policyModal = this.selectComponent('#policy-modal')
    this.drawerDom = this.selectComponent('#z-drawer')
  },

  /**
   * 页面事件
   */
  // 跳转选地址
  onSelectRegion () {
    this.$to('address/address?from=payment')
  },

  // 展示优惠券
  onShowCoupon () {
    this.drawerDom.showDrawer()
  },
  // 关闭优惠券
  onCloseDrawer () {
    this.drawerDom.onCloseClick()
  },
  // 领取优惠券
  onReceiveClick (e) {
    const { item } = e.currentTarget.dataset
    wx.showLoading({ mask: true })
    let self = this;
    couponRedemption(item.couponRuleId, cb => {
      setTimeout(() => {
        this.handleCouponList(cb => {
          wx._showToast({ title: '领取成功！' })
          self.getOrderAmountData()
        })
      }, 500)
    })
  },
  // 条款 check
  onCheckChange (e) {
    const { value } = e.detail
    this.setData({
      isAgree: value[0]
    })
  },
  // 点击条款
  onPolicyClick (e) {
    let { policyModal } = this.extData
    const { type } = e.currentTarget.dataset
    switch (type) {
      case 'privacy':
        policyModal.show({
          title: '隐私政策',
          certainText: '关闭',
          showCancel: false
        })
        this.setData({
          policyText: this.data.privacyContext
        })
        break
      case 'service':
        policyModal.show({
          title: '服务条款',
          certainText: '关闭',
          showCancel: false
        })
        this.setData({
          policyText: this.data.serviceContext
        })
        break
      default:
        console.warn(`Invalid type: ${type}`)
    }
  },
  onInput (e) {
    this.setData({
      ['formdata.remark']: e.detail.value
    })
  },
  // 选择快递
  onChange (e) {
    const { type } = e.currentTarget.dataset
    this.setData({
      ['formdata.logisticsMode']: type
    })
    this.getOrderAmountData()
  },
  // 跳转需求清单
  onRecipeClick () {
    const ids = this.data.orderStreamDetail.orderLines.map(item => {
      return item.skuId
    })
    const skuIds = ids.join(',')
    um.getChannelASync().then(channel => {
      if (channel === 'hkk') {
        wx.navigateTo({
          url: `/pages_hkk/prescribe/prescribe?skuIds=${skuIds}`,
        });
      } else {
        this.$to(`prescribe/prescribe?skuIds=${skuIds}`)
      }
    })
  },
  oninvoice () {
    this.$to('invoiceList/invoiceList?select=true')
  },
  pollingInquiryId (id) {
    const onFail = (_this) => {
      clearInterval(_this.data.pollingTimer)
      _this.setData({
        pollingTimer: null
      })
      _this.$setRouterQuery({
        key: 'routerQuery',
        query: { tab: 2, modal: true },
      })
      um.refresh()
      this.$to('order/order', 'redirect')
    }
    if (this.data.pollingTimes >= 10 && this.data.pollingTimer) {
      onFail(this)
      return
    }
    getOrderDetailById(id, (res) => {
      this.setData({
        pollingTimes: this.data.pollingTimes + 1
      })
      // inquiryStatus === -1 问诊未创建
      if (res.inquiryStatus === -1 && this.data.pollingTimer) {
        onFail(this)
        return
      }
      if (res.inquiryId) {
        clearInterval(this.data.pollingTimer)
        this.setData({
          pollingTimer: null
        })
        wx.navigateTo({
          url: '/pages_hkk/inquiryChat/inquiryChat?inquiryId=' + res.inquiryId,
        })
        return
      }
    })
  },
  // 立即购买
  onBuyClick: debounce(function (e) {
    const {
      isAgree,
      amoutData,
      orderStreamDetail,
      inputCouponCode,
      freightAmount,
      orderAddress,
      recipeNumber,
      goodsType
    } = this.data
    console.log("orderStreamDetail",orderStreamDetail);
    // if (!isAgree) {
    //   wx._showToast({ title: '请阅读并同意相关条款' })
    //   return
    // }
    if (!orderAddress || !orderAddress.telephone) {
      wx._showToast({ title: '请填写收货地址!' })
      return
    }
    if (goodsType == 2 && !recipeNumber) {
      wx._showToast({ title: '请添加问诊信息!' })
      return
    }
    if (!this.data.formdata.logisticsMode) {
      wx._showToast({ title: '请选择配送方式!' })
      return
    }
    const orderLines = this.getOrderLinesStruct(orderStreamDetail.orderLines)
    const params = Object.assign(osm.getOrderStream(), {
      ...this.data.formdata,
      orderAddress,
      recipeNumber,
      ...amoutData,
      orderLines: this.handelOrderline(orderLines),
      couponCodes: this.getSelectedCoupon().map(item => item.couponCode),
      isCart: osm.getOrderStreamSource() == 'cart' ? true : false // 订单来自购物车，则设置为true, 其他为false
    })
    console.log("生成订单params=====", params);
    createOrder(params, id => {
      // 重置优惠券选择
      this.resetSelectedCoupon()
      pay({
        orderId: id,
        success: () => {
          // 跳转到订单列表 待发货
          const channel = um.getCurrentChannel()
          console.log('channel', channel)
          if (channel === 'hkk') {
            console.log('payment goodsType', goodsType)
            if (goodsType === 2) {
              // 获取订单详情，去出问诊室id(inquiryId)
              const timer = setInterval(() => this.pollingInquiryId(id), 1000)
              this.setData({
                pollingTimer: timer
              })
              return
            }
            this.$setRouterQuery({
              key: 'routerQuery',
              query: { tab: 2, modal: true },
            })
          } else {
            this.$setRouterQuery({
              key: 'routerQuery',
              query: { tab: 2 },
            })
          }
          // this.$setRouterQuery({
          //   key: 'routerQuery',
          //   query: { tab: 2 }
          // })
          um.refresh()
          this.$to('order/order', 'redirect')
        },
        fail: () => {
          um.refresh()
          //  跳转到订单列表 待支付
          this.$setRouterQuery({
            key: 'routerQuery',
            query: { tab: 1 }
          })
          this.$to('order/order', 'redirect')
        }
      })
    })
  }, 1000),
  // 优惠券tab点击
  onCouponTabClick (e) {
    const { item } = e.currentTarget.dataset
    this.setData({
      currentCouponTab: item
    })
  },
  // 选中优惠券
  onSelectCouponClick (e) {
    const { canUsableCoupon } = this.data
    const { index } = e.currentTarget.dataset
    const currentSelectedCoupon = canUsableCoupon[index]

    // 取消勾选
    if (currentSelectedCoupon.check) {
      console.log("取消勾选被执行");
      currentSelectedCoupon.check = false
      this.setData({ canUsableCoupon })
      this.extData.recodeCanUsableCoupon = canUsableCoupon
      this.getOrderAmountData()
      return
    }

    const selectedCoupon = this.getSelectedCoupon()
    // 选择优惠券数量不得超过最大值
    if (selectedCoupon.length >= CAN_SELECTED_COUPON_NUMBER) {
      wx._showToast({ title: '最多可两张券叠加使用！' })
      return
    }

    const hasSelectedCoupon = selectedCoupon[0] || {}
    // 可叠加优惠券判断处理
    if (currentSelectedCoupon.isOverlay || hasSelectedCoupon.isOverlay) {
      if (
        CASH_COUPON_TYPE.includes(currentSelectedCoupon.type) &&
        CASH_COUPON_TYPE.includes(hasSelectedCoupon.type)
      ) {
        wx._showToast({ title: '金额券不能相互叠加使用！' })
        return
      }

      if (
        DISCOUNT_COUPON_TYPE.includes(currentSelectedCoupon.type) &&
        DISCOUNT_COUPON_TYPE.includes(hasSelectedCoupon.type)
      ) {
        wx._showToast({ title: '折扣券不能相互叠加使用！' })
        return
      }
    }
    // 不可叠加优惠券判断处理
    if (!currentSelectedCoupon.isOverlay) {
      canUsableCoupon.forEach((item, itemIndex) => {
        if (itemIndex != index && !item.isOverlay) item.check = false
      })
    }

    // 确定勾选
    currentSelectedCoupon.check = true
    this.setData({ canUsableCoupon })
    this.extData.recodeCanUsableCoupon = canUsableCoupon

    // 计算订单金额
    this.getOrderAmountData({
      error: () => {
        // 选择优惠券不满足下单条件时
        currentSelectedCoupon.check = false
        this.setData({ canUsableCoupon })
        this.extData.recodeCanUsableCoupon = canUsableCoupon
      }
    })
  },

  /**
   * 数据处理
   */
  // 处理选择的coupon
  getSelectedCoupon () {
    const { canUsableCoupon } = this.data
    this.setData({
      selectedCoupon: canUsableCoupon.filter(item => item.check)
    })
    return this.data.selectedCoupon
  },

  // 重置优惠券选择
  resetSelectedCoupon () {
    const { canUsableCoupon } = this.data
    for (const item of canUsableCoupon) {
      item.check = false
    }

    this.setData({
      canUsableCoupon
    })
  },

  // 获取优惠券列表
  handleCouponList (cb) {
    const orderLines = this.getOrderLinesStruct(osm.getOrderStream().orderLines)
    const skuList = this.getSkuList(orderLines)
    couponByOrder({ skus: skuList }, data => {
      this.setData({
        canUsableCoupon: data.usable,
        notUsableCoupon: data.notUsable
      })

      //  商品详情页面点击立即使用跳转过来的
      const { options } = this.extData
      if (options.coupon) {
        for (let i = 0; i < data.usable.length; i++) {
          const item = data.usable[i]
          if (item.couponCode === options.coupon) {
            let fakeEventData = { currentTarget: { dataset: { index: i } } }
            this.onSelectCouponClick(fakeEventData)
          }
        }
        cb && cb(data)
      } else {
        // 获取最优的优惠券组合，自动选中
        this.getOptimalCouponGroup(() => {
          cb && cb(data)
        })
      }
    })
  },

  // 设置优惠券选中状态
  setCouponSelected () {
    const { selectedCoupon, canUsableCoupon } = this.data
    for (let i = 0; i < selectedCoupon.length; i++) {
      const recordItem = selectedCoupon[i]
      for (let j = 0; j < canUsableCoupon.length; j++) {
        const usableItem = canUsableCoupon[j]
        if (recordItem.couponCode === usableItem.couponCode) {
          let fakeEventData = { currentTarget: { dataset: { index: j } } }
          this.onSelectCouponClick(fakeEventData)
        }
      }
    }
  },

  // 重置 coupon 信息
  resetCouponDetail () {
    const amountDetail = this.data.amountDetail
    amountDetail.amountPayable = amountDetail.totalAmount
    amountDetail.discountAmount = 0
    this.setData({
      couponDetail: {},
      inputCouponCode: '',
      couponName: false,
      amountDetail: amountDetail
    })
  },

  // 组装 orderLines 信息
  getOrderLinesStruct (list) {
    const orderLines = []
    list.forEach(item => {
      const objc = {}
      for (const key in item) {
        if (key !== 'status') {
          objc[key] = item[key]
        }
      }
      orderLines.push(objc)
    })
    return orderLines
  },

  // 获取金额
  getOrderAmountData (obj = {}) {
    const { success, error } = obj

    const { orderAddress = {}, formdata = {}, currentChannel } = this.data
    const selectedCoupon = this.getSelectedCoupon()
    const orderLines = this.getOrderLinesStruct(osm.getOrderStream().orderLines)
    const params = {
      logisticsMode: formdata.logisticsMode,
      orderAddress: orderAddress,
      orderLines: this.getOrderLinesStruct(orderLines),
      couponCodes: selectedCoupon.map(item => item.couponCode)
    }

    amoutByCoupon(params, data => {
      if (data.error) {
        error && error()
        return
      }
      this.setData({
        amoutData: data
      })
      success && success(data)
      this.handelOrderline(orderLines)
      if (currentChannel == 'hkk') {
        console.log("formdata.logisticsMode===", formdata.logisticsMode);
        if (formdata.logisticsMode != 2 && numSub(data.amountPayable, data.freightAmount) >= 800) {
          this.setData({
            ['formdata.logisticsMode']: 2,
            logisticsModeDisable: true,
          }, () => {
            this.getOrderAmountData()
          })
        } else if (formdata.logisticsMode == 2 && numSub(data.amountPayable, data.freightAmount) >= 800) {
          this.setData({
            logisticsModeDisable: true,
          })
        } else {
          this.setData({
            logisticsModeDisable: false,
          })
        }
      }
    })
  },

  // 获取sku数据
  getSkuList (list = []) {
    let skus = []
    list.forEach(item => {
      skus.push({
        qty: item.quantity,
        serialNumber: item.serialNumber,
        skuId:item.skuId
      })
    })
    return skus
  },

  handelOrderline (orderLines) {
    const { amoutData } = this.data
    orderLines.forEach((item, index) => {
      if (amoutData.skuAmounts[item.serialNumber]) {
        orderLines[index] = {
          ...item,
          ...amoutData.skuAmounts[item.serialNumber]
        }
      }
    })
    this.setData({
      'orderStreamDetail.orderLines': orderLines
    })
    return orderLines
  },
  setCanUseCoupon (coupon) {
    this.setData({ canUsableCoupon: coupon })
    this.extData.recodeCanUsableCoupon = coupon
  },
  // 默认获取最佳的优惠券组合
  getOptimalCouponGroup (cb) {
    let groups = this.getCouponGroups();
    if (groups.length == 0) { // 没有优惠券时，无需自动选中优惠券
      cb && cb()
      return;
    }
    const { orderAddress = {}, canUsableCoupon } = this.data
    const orderLines = this.getOrderLinesStruct(osm.getOrderStream().orderLines)
    let paramList = groups.map((itm) => {
      return {
        couponCodes: itm,
        orderAddress: orderAddress,
        orderLines: orderLines
      }
    })
    // 所有优惠券组合的列表的订单价格计算
    getCouponGroupsAmountData(paramList, res => {
      const amountDataList = res.data;
      // 找出最大金额的组合
      let index = 0;
      let max = amountDataList[0].discountAmount
      for (let i = 1; i < amountDataList.length; i++) {
        if (amountDataList[i].discountAmount > max) {
          max = amountDataList[i].discountAmount
          index = i;
        }
      }
      let codes = amountDataList[index].couponCodes;
      let selectedCoupon = []
      for (let j = 0; j < codes.length; j++) {
        for (let i = 0; i < canUsableCoupon.length; i++) {
          const element = canUsableCoupon[i];
          if (element.couponCode == codes[j]) {
            selectedCoupon.push(element)
            break;
          }
        }
      }

      let canUsableCouponList = []
      for (let i = 0; i < canUsableCoupon.length; i++) {
        const element = canUsableCoupon[i];
        for (let j = 0; j < selectedCoupon.length; j++) {
          if (element.couponCode == selectedCoupon[j].couponCode && element.id == selectedCoupon[j].id) {
            element.check = true;
          }
        }
        canUsableCouponList.push(element);
      }
      this.setData({
        selectedCoupon: selectedCoupon,
        canUsableCoupon: canUsableCouponList
      })
      cb && cb()
    })
  },
  // 获取优惠券组合列表
  getCouponGroups () {
    const { canUsableCoupon } = this.data;
    // 单个券列表
    let list = canUsableCoupon.map(itm => {
      return [itm.couponCode]
    })
    let groupList = []
    // 获取券组合列表
    for (let i = 0; i < canUsableCoupon.length; i++) {
      let hasSelectedCoupon = canUsableCoupon[i]; // 假设该券已经选取
      for (let j = i + 1; j < canUsableCoupon.length; j++) {
        // 找出可以与上述券搭配的券
        const currentSelectedCoupon = canUsableCoupon[j]
        // 可叠加优惠券判断处理
        if (currentSelectedCoupon.isOverlay || hasSelectedCoupon.isOverlay) {
          if (
            CASH_COUPON_TYPE.includes(currentSelectedCoupon.type) &&
            CASH_COUPON_TYPE.includes(hasSelectedCoupon.type)
          ) {
            console.log("不可以不可以")
            // 金额券不能相互叠加使用！
            continue;
          }

          if (
            DISCOUNT_COUPON_TYPE.includes(currentSelectedCoupon.type) &&
            DISCOUNT_COUPON_TYPE.includes(hasSelectedCoupon.type)
          ) {
            // 折扣券不能相互叠加使用
            continue;
          }
          let list = [hasSelectedCoupon.couponCode, currentSelectedCoupon.couponCode];
          groupList.push(list);
        }
      }
    }
    return list.concat(groupList);
  },
  // 运费计算规则
  freightAmountClick () {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '这是一个运费的说明'
    })
  }
})
