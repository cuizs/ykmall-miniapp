import handlerMixin from './_handler'
import { throttle, deepCopy } from '../../utils/util'
import { getContainOfArray } from '../../utils/util'
import local from '../../utils/localStorage'
import apiConfig from '../../config/apiConfig'
import um from '../../manager/userInfo'
import sm from '../../manager/share'
import cnm from '../../manager/channel'
import { channelMemberlist } from './_config'
import { getDemandList, userInfo, getCartList } from './_service'
//获取应用实例
var app = getApp()
import {
  getGoodsDetail,
  collect,
  cancelCollect,
  getCouponByProduct,
  couponRedemption,
  getGroup,
  addDemand,
  demandNumber,
  addCart,
  cartNumber,
  getOrderComment,
  getRelationProducts,
} from './_service'

const GOODS_BUY_OPER = {
  ADD: '_add_card_', // 添加购物车
  BUY: '_buy_goods_', // 立即购买商品
  SELECT: '_select_spec_', // 选择商品规格
}

Page({
  /**
   * 非页面渲染数据
   */
  extData: {
    // 页面传值
    options: {},
    // 记录选择的规格
    selectSpec: {},
    // 立即使用的优惠券
    toUseCoupon: null,
    // 推荐人信息
    referrerOptions: {
      referrer: null, // 推荐人（药师）的用户id, 如果是推荐，一定不为空
      referrerDoctorId: null, // 推荐人（药师）的药师id， 可能为空
      partnerReferrerId: null,//推广人， 可能为空
    }
  },
  mixins: [handlerMixin],
  /**
   * 页面的初始数据
   */
  data: {
    // 商品详情
    detail: {},
    // 用户信息
    userInfo: {},
    // 优惠券列表
    couponList: [],
    // sku 是否售罄
    isSoldOut: false,
    // 当前选择的sku
    currentSku: null,
    // 购买商品的操作
    goodsBuyOperType: '',
    // 添加购物车动效控制
    startAddCartAnimation: false,
    // 弹框类型
    popType: null,
    // 组合商品
    groupList: [],
    // 需求清单数量
    number: 0,
    // 商品评价总数
    commentTotal: 0,
    // 商品评价列表
    commentList: [],
    // 商品告知图： 处方药以及医疗器械
    tips_type_2: apiConfig.BASEIMGURL + '/static/tip_type2.png',
    tips_type_4: apiConfig.BASEIMGURL + '/static/tips_type4.png',
    tips_type_1and4: "https://ykyao-mall.oss-cn-shanghai.aliyuncs.com/prod/iwkeci1658819864850.jpg",
    cartAmount: 0,
    storeChannel: "",
    relationGroup: [],
    memberShow: false,
    memberChannel: false,
    currentChannel: "",
    channelMemberlist
  },

  /**
   * 生命周期函数
   */
  onLoad(options) {
    this.extData.options = options;
    // 获取商品推荐人信息
    this.setReferrerInfo(options);
    // 获取优惠券
    this.getCoupon(options.id)
    // 获取商品详情
    this.getGoodsDetail(options.id)
    //获取店铺渠道
    let storeChannel = um.getCurrentChannel()
    this.setData({ storeChannel: storeChannel })
    console.log('this.data.detail._bannerList', this.data.detail._bannerList);
  },
  onShow() {
    const { detail = {} } = this.data
    if (detail.goodsType && detail.goodsType == 2) {
      this.getdemandNumber()
    } else {
      this.getCartNumber()
    }
    this.setChannelTheme();
    this.getUserInfo()
  },
  onReady() {
    this.sizeGuide = this.selectComponent('#sizeGuide-modal')
    this.specDrawerDom = this.selectComponent('#z-spec-drawer')
    this.couponDrawerDom = this.selectComponent('#z-coupon-drawer')
    this.buyButtonGroupDom = this.selectComponent('#buy-button-group')
  },

  setChannelTheme() {
    um.getChannelASync().then(channel => {
      let memberChannelList = [
        "rxga", "ykyw", "xcm", "ykneigou"
      ]
      let memberChannel = memberChannelList.includes(channel)
      this.setData({
        memberChannel: memberChannel,
        currentChannel: channel
      })
      wx.setNavigationBarTitle({
        title: cnm.getChannelInfos().name ? cnm.getChannelInfos().name : '云开药网'
      })
    })
  },

  /**
   * 页面事件
   */
  // 获取商品推荐人信息
  setReferrerInfo(options) {
    let app = getApp()
    this.extData.referrerOptions = app.globalData.referrerOptions
  },

  // banner图片点击事件
  onBannerClick(e) {
    const { detail } = this.data
    const { index } = e.currentTarget.dataset
    const bannerItem = detail._bannerList[index]
    wx.previewImage({
      current: bannerItem,
      urls: detail._bannerList,
    })
  },
  // 点击收藏商品
  onCollectClick(e) {
    const { id } = this.data.detail
    const { type } = e.currentTarget.dataset

    const params = { productIds: [id] }
    type === 'cancel' &&
      cancelCollect(params, () => {
        wx._showToast({ title: '商品已取消收藏!' })
        this.setData({ 'detail.isFavorite': false })
      })
    type === 'certain' &&
      collect(params, () => {
        wx._showToast({ title: '商品收藏成功!' })
        this.setData({ 'detail.isFavorite': true })
      })
  },
  // 点击弹出Popup事件
  onPopupShowClick(e) {
    const { type } = e.currentTarget.dataset
    switch (type) {
      case 'spec':
        this.specDrawerDom.showDrawer()
        this.setGoodsBuyOperType(GOODS_BUY_OPER['SELECT'])
        break
      case 'coupon':
        this.couponDrawerDom.showDrawer()
        break
      default:
        console.warn('无效的类型：', type)
    }
    this.setData({ popType: 'spec' })
  },
  // 点击选择规格值事件
  onSpecValueClick(e) {
    const { detail } = this.data
    const { parent, child } = e.currentTarget.dataset
    const spec = detail.specs[parent]
    const value = spec.values[child]
    this.handleSpecSelect(parent, child)
    const currentSpec = { [spec.id]: value.id }
    for (const s of detail.specs) {
      if (s.id === spec.id) continue
      for (const v of s.values) {
        const compareSpecs = { ...currentSpec, [s.id]: v.id }
        const findSku = detail.sku.find((sku) => {
          const compareSpecsArray = this.getArrayOfSpecObject(compareSpecs)
          const skuSpecsArray = this.getArrayOfSpecObject(sku.skuSpecValues)
          if (getContainOfArray(skuSpecsArray, compareSpecsArray)) return sku
        })
        v['disabled'] =
          !findSku || !findSku.stock || !(findSku.status === 'Enable')
      }
    }
    this.setData({ detail })
  },
  // 点击尺寸指南
  onGuideSizeClick() {
    this.sizeGuide.show({
      top: 20,
      title: '',
      showTitle: false,
      autoClose: false,
      certainText: '我知道了',
      showCancel: false,
      certainFunc: () => {
        this.sizeGuide.close()
      },
    })
  },
  caculateAmount({ distributorLimitNum, stockTotal, limitNum, cartAmount, inputAmount }) {
    const { currentSku } = this.data
    const amount = parseInt(cartAmount) + parseInt(inputAmount)
    if (null !== distributorLimitNum) {
      if (0 !== parseInt(distributorLimitNum)) {
        console.log('经销商限购')
        // 经销商限购
        if (amount > parseInt(distributorLimitNum)) {
          wx._showToast({ title: '已超出最大购买数量!' })
          return parseInt(distributorLimitNum) - parseInt(cartAmount) >= 0 ? parseInt(distributorLimitNum) - parseInt(cartAmount) : 0
        }
      }
    } else {
      if (0 !== parseInt(limitNum)) {
        // 一体化限购
        console.log('一体化限购')
        if (amount > parseInt(limitNum)) {
          wx._showToast({ title: '已超出最大购买数量!' })
          return parseInt(limitNum) - parseInt(cartAmount) >= 0 ? parseInt(limitNum) - parseInt(cartAmount) : 0
        }
      }
    }
    if (parseInt(stockTotal) < amount) {
      wx._showToast({ title: '已超出库存数量!' })
      return parseInt(stockTotal) - parseInt(cartAmount) >= 0 ? parseInt(stockTotal) - parseInt(cartAmount) : 0

    }
    return inputAmount
  },
  // 修改 sku 数量
  onSkuQuantityChange(e) {
    console.log(this.data.detail)
    const { distributorLimitNum = null, limitNum = null, stockTotal = 0 } = this.data.detail
    console.log('经销商最大限制数量==>', distributorLimitNum)
    console.log('一体化最大限制数量==>', limitNum)
    console.log('购物车或需求清单中的数量==>', this.data.cartAmount)
    console.log('库存===>', stockTotal)
    console.log('goodsBuyOperType', this.data.goodsBuyOperType)
    let { value } = e.detail
    if (this.data.goodsBuyOperType == GOODS_BUY_OPER['ADD']) {
      // 添加购物车或需求清单
      value = this.caculateAmount({ distributorLimitNum, stockTotal, limitNum, cartAmount: this.data.cartAmount, inputAmount: value })
    } else {
      // 立即购买
      value = this.caculateAmount({ distributorLimitNum, stockTotal, limitNum, cartAmount: 0, inputAmount: value })
    }

    const { currentSku } = this.data
    this.setData({
      currentSku: Object.assign(currentSku, {
        quantity: value,
      }),
    })
  },
  // 点击立即购买事件
  onGoBuyClick(e) {
    const { detail } = this.data
    this.checkMemberGoods(detail, () => {
      this.setData({ popType: 'spec' })
      this.specDrawerDom.showDrawer()
      this.setGoodsBuyOperType(GOODS_BUY_OPER['BUY'])
    })
  },
  // 获取需求清单或者购物车中，该商品存在的数量
  fetchAmountAtCartOrBill() {
    return new Promise(resolve => {
      const { detail } = this.data
      if (detail.goodsType == 2) {
        // 处方，请求需求清单列表
        console.log('处方，请求需求清单列表');
        getDemandList((data) => {
          const currentGoodsInCart = (data || []).find(val => val.spuId === detail.id)
          const cartAmount = (currentGoodsInCart || {}).quantity || 0
          this.setData({ cartAmount })
          console.log(this.data.cartAmount)
          resolve(cartAmount)
        })
      } else {
        // 非处方，请求购物车列表
        console.log('非处方，请求购物车列表');
        getCartList((data) => {
          const currentGoodsInCart = (data || []).find(val => val.spuId === detail.id)
          const cartAmount = (currentGoodsInCart || {}).quantity || 0
          this.setData({ cartAmount })
          console.log(this.data.cartAmount)
          resolve(cartAmount)
        })
      }
    })

  },
  // 点击添加购物车事件
  onAddCartClick(e) {
    const { detail } = this.data
    const { distributorLimitNum = null, stockTotal, limitNum = null } = detail
    this.fetchAmountAtCartOrBill().then(cartAmount => {
      if (this.caculateAmount({ distributorLimitNum, stockTotal, limitNum, cartAmount, inputAmount: 1 })) {
        console.log('.............')
        this.setData({ popType: 'spec' })
        this.specDrawerDom.showDrawer()
        this.setGoodsBuyOperType(GOODS_BUY_OPER['ADD'])
      }
    });
  },
  // 立即预约购买
  onAppointmentClick(e) {
    console.log("立即预约购买");
    const { detail } = this.data
    this.checkMemberGoods(detail, () => {
      this.setData({ popType: 'spec' })
      this.specDrawerDom.showDrawer()
      this.setGoodsBuyOperType(GOODS_BUY_OPER['BUY'])
    })
  },
  // 添加套组
  onBuySuit(e) {
    const { detail } = this.data
    const currentSku = e.detail
    currentSku.skuName = currentSku.groupProductName
    currentSku.skuId = currentSku.id
    currentSku.groupDetail = currentSku.groupProductDetailResDtos
    currentSku.quantity = 1
    // 设置推荐人
    currentSku.referrer = this.extData.referrerOptions.referrer
    currentSku.referrerDoctorId = this.extData.referrerOptions.referrerDoctorId
    //设置推广人
    currentSku.partnerReferrerId = this.extData.referrerOptions.partnerReferrerId
    if (detail.goodsType == 2) {
      // 处方
      addDemand(currentSku, (res) => {
        this.getdemandNumber()
        wx._showToast({ title: '商品添加成功!' })
      })
    } else {
      // 非处方
      addCart(currentSku, (res) => {
        this.getCartNumber()
        wx._showToast({ title: '商品添加成功!' })
      })
    }
  },
  // 规格选择 && 优惠券 弹框确认事件
  onDrawerCertainClick(e) {
    const { type } = e.currentTarget.dataset
    const { currentSku, goodsBuyOperType, detail } = this.data
    console.log('onDrawerCertainClick--currentSku', currentSku);
    console.log("规格选择 && 优惠券 弹框确认事件", detail);
    currentSku.distributorProductName = detail.distributorProductName;
    if (goodsBuyOperType === GOODS_BUY_OPER['ADD']) {
      currentSku.goodsId = detail.id
      currentSku.isGroup = 0
      currentSku.skuName = currentSku.name
      currentSku.skuId = currentSku.id
      currentSku.spuId = detail.id;
      currentSku.distributorImgUrl = detail.distributorImgUrl || detail.imgUrl || '../../assets/image/defaultImg.png';
      // 设置推荐人
      currentSku.referrer = this.extData.referrerOptions.referrer
      currentSku.referrerDoctorId = this.extData.referrerOptions.referrerDoctorId
      //设置推广人
      currentSku.partnerReferrerId = this.extData.referrerOptions.partnerReferrerId
      this.specDrawerDom.hideDrawer()
      if (detail.goodsType == 2) { // 加入需求清单
        addDemand(currentSku, (res) => {
          this.getdemandNumber()
          wx._showToast({ title: '商品添加成功!' })
        })
      } else { // 加入购物车
        addCart(currentSku, (res) => {
          this.getCartNumber()
          wx._showToast({ title: '商品添加成功!' })
        })
      }
      return
    }
    switch (type) {
      case 'spec':
        goodsBuyOperType === GOODS_BUY_OPER['BUY'] && this.handleBuyGoods()
        this.specDrawerDom.hideDrawer()
        this.setData({ popType: null })
        break
      case 'coupon':
        this.couponDrawerDom.hideDrawer()
        break
      default:
        console.warn('无效的类型：', type)
    }
    this.setData({
      currentSku: currentSku
    })
  },
  // 规格选择弹框右上角关闭事件
  onSpecDrawerClose() {
    const { currentSku } = this.data
    const newCurrent = deepCopy(currentSku)
    this.setData({
      currentSku: this.createSkuStruct(newCurrent),
      type: null,
    })
    this.extData.toUseCoupon = null
  },
  //前往会员中心
  toVip() {
    um.isVip(res => {
      if (!!res) {
        this.toMemberCenter()
      }
      // 打开弹窗
      this.setData({
        memberShow: !res
      })
    })
  },
  //前往会员中心
  toMemberCenter() {
    console.log("onMallClick");
    // 获取用户信息
    userInfo(userInfo => {
      if (userInfo.level == "Vip") {
        wx._showToast({ title: '您已经注册会员' })
        this.setData({
          userInfo: userInfo
        })
        return
      }
      console.log("userInfo", userInfo);
    })
    let currentChannel = channelMemberlist[this.data.currentChannel].name
    console.log("currentChannel", currentChannel);
    console.log("apiConfig.MEMBERAPPID", apiConfig.MEMBERAPPID);
    //跳转会员中心小程序
    wx.navigateToMiniProgram({
      appId: apiConfig.MEMBERAPPID, // 跳转会员中心小程序
      path: `pages/joinMember/joinMember?channel=` + currentChannel, // 跳转的目标页面
      extarData: {
        open: "auth",
      },
      envVersion: "trial",
      success(res) { },
    });
  },
  // 点击选择优惠券事件
  onCouponSelectClick(e) {
    const { value } = e.detail
    if (value.status === 'exchanged') {
      this.extData.toUseCoupon = value
      this.couponDrawerDom.hideDrawer()
      setTimeout(() => {
        this.specDrawerDom.showDrawer()
        this.setGoodsBuyOperType(GOODS_BUY_OPER['BUY'])
      }, 150)
      return
    }

    throttle(() => {
      couponRedemption({ couponRuleId: value.couponRuleId }, (res) => {
        if (res.code == 0) {
          this.getCoupon(this.extData.options.id)
          wx._showToast({ title: '优惠券领取成功' })
        }
      })
    })
  },
  // 问医生
  onDoctorClick() {
    cnm.openChannelCustomerService("pages/goodsDetail/goodsDetail", `商品详情-${this.data.detail.name}`)
  },
  onBannerError(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.detail._bannerList
    let newList = JSON.parse(JSON.stringify(list));
    newList[index] = '../../assets/image/defaultImg.png'
    this.setData({
      "detail._bannerList": newList
    })
  },
  onImageError(e) {
    this.setData({
      "currentSku.imageUrl": "../../assets/image/defaultImg.png"
    })
  },
  /**
   * 网络请求
   */
  getGoodsDetail(id) {
    getGoodsDetail(
      id,
      (data) => {
        if (data.actualPrice == 0 || !data.actualPrice || data.status !== 'Enable') {
          this.setData({
            isSoldOut: true
          })
          this.showSoldOutModal()
        }
        this.getAllGroup(data.produceCode)
        this.getRelationProductList(data.produceCode)
        if (data.goodsType == 2) {
          this.getdemandNumber()
        }
        // 计算各sku总库存
        let sku = data.sku ? data.sku : []
        let stockTotal = 0
        sku.forEach(item => {
          stockTotal = stockTotal + item.stock
        });
        data.stockTotal = stockTotal;
        data.saleTotalStr = (data.saleTotal || 0) + (data.realSaleTotal || 0) > 9999 ? '9999+' : (data.saleTotal || 0) + (data.realSaleTotal || 0)
        if (data.specs.length == 1) {
          this.handleOneSpecs(data)
        } else {
          this.setData({ detail: data })
        }
        this.handleDefaultCurrentSku()
        this.getOrderCommentList()
      },
      (error) => {
        if (error.code === 1007) {
          this.showSoldOutModal()
        }
      }
    )
  },

  getRelationProductList(code) {
    getRelationProducts(code, data => {
      let dic = data || {}
      let relationGroup = []
      for (const key in dic) {
        let proItm = dic[key];
        if (proItm.status == "Enable" && (proItm.isRelationGroup == 1 || proItm.isRelationGroup == true)) {
          let name = ''
          proItm.relations.forEach((itm, idx) => {
            let str = `${itm.name}*${itm.relationQuantity}`
            if (idx == 0) {
              name = name + str;
            } else {
              name = name + ' + ' + str;
            }
          })
          let productItem = {
            id: key,
            name: name
          }
          relationGroup.push(productItem);
        }
      }
      this.setData({
        relationGroup: relationGroup
      })
    })
  },

  onGroupProductClick(e) {
    let product = e.currentTarget.dataset.product;
    this.$to(`goodsDetail/goodsDetail?id=${product.id}`, 'navigate')
  },


  showSoldOutModal() {
    wx.showModal({
      title: '温馨提示',
      content: '该商品已售罄，可联系药师预约',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          cnm.openChannelCustomerService("pages/goodsDetail/goodsDetail", `商品详情-${this.data.detail.name}`)
          console.log('点击联系客服')
        } else {
        }
      },
    })
  },

  // 获取评价列表
  getOrderCommentList() {
    let self = this
    getOrderComment({ userId: '', productId: self.data.detail.id, pageNo: 1 }, (data) => {
      self.setData({
        commentTotal: data.total,
      })
      if (data.results && data.results.length > 0) {
        self.setData({
          commentList: data.results,
        })
      }
    })
  },

  // 获取优惠券
  getCoupon(id) {
    getCouponByProduct(id, (couponList) => {
      this.setData({ couponList })
    })
  },
  // 商品套组
  getAllGroup(id) {
    getGroup(id, (data) => {
      this.setData({ groupList: data })
    })
  },
  getdemandNumber() {
    demandNumber((res) => {
      this.setData({ number: res.data || 0 })
    })
  },
  getCartNumber() {
    cartNumber((res) => {
      this.setData({ number: res.data || 0 })
    })
  },
  getUserInfo() {
    userInfo(userInfo => {
      this.setData({
        userInfo: userInfo
      })
    })
  },
  onShareAppMessage() {
    let title = this.data.detail.distributorProductName || this.data.currentSku.name
    let id = this.extData.options.id
    let path = `/pages/goodsDetail/goodsDetail`
    let params = {
      title,
      path,
      query: {
        id: id
      }
    }
    let customShareInfo = sm.userShare(params);
    return customShareInfo
  },

  onShareTimeline() {
    let title = this.data.detail.distributorProductName || this.data.currentSku.name
    let id = this.extData.options.id
    let path = `/pages/goodsDetail/goodsDetail`
    let params = {
      title,
      path,
      query: {
        id: id
      }
    }
    let customShareInfo = sm.userShare(params);
    return customShareInfo
  }
})
