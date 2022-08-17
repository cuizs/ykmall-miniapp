/**
 * 数据处理混合器
 */
import um from '../../manager/userInfo'
import osm from '../../manager/orderStream'
import { availableTimeFormat } from '../../utils/util'

export default {
  data: {},

  onLoad(options) {
    console.log('mixin onload')
  },

  onShow() {
    console.log('mixin onShow')
  },

  // 处理立即购买商品
  handleBuyGoods() {
    const { currentSku } = this.data
    console.log('currentSku===处理立即购买商品',currentSku);
    if (!currentSku) {
      this.specDrawerDom.showDrawer()
      return
    }

    const { options, toUseCoupon, referrerOptions } = this.extData
    // 设置推荐人
    currentSku.referrer = referrerOptions.referrer
    currentSku.referrerDoctorId = referrerOptions.referrerDoctorId
    //设置推广人
    currentSku.partnerReferrerId = referrerOptions.partnerReferrerId

    osm.setOrderSkus([currentSku])
    options.promoterId && osm.setOrderStreamPromoterId(options.promoterId)
    osm.setOrderStreamSource('goodsDetail')

    const query = toUseCoupon ? `?coupon=${toUseCoupon.couponCode}` : ''
    const page = currentSku.goodsType == 2 ?"demandList":"cart"
    this.$to(`payment/payment${query}?from=${page}`, 'navigate')
  },
  // 处理默认选中sku
  handleDefaultCurrentSku() {
    const { detail } = this.data
    const { sku, specs } = detail
    let effectiveSku = {}
    try {
      let specsValue = specs[0].values
      specsValue.forEach(item => {
        sku.forEach((i, index) => {
          let specIndex = Object.keys(i.skuSpecValues)[0]
          let specId = i.skuSpecValues[specIndex]
          if (sku[index].stock > 0 && sku[index].status == 'Enable') {
            if (item.id == specId) {
              effectiveSku = sku[index]
              throw new Error('终止循环');
            }
          }
        })
      })
    } catch (e) {
    }
    console.log("effectiveSku", effectiveSku);
    for (const specId in effectiveSku.skuSpecValues) {
      const spec = specs.find(item => item.id == specId)
      const value = spec.values.find(item => item.id == effectiveSku['skuSpecValues'][specId])
      // 设置规格值选中状态
      value['selected'] = true
      // 设置 sku 展示图片
      if (value.banners && value.banners.length) {
        detail['_bannerList'] = value.banners
        effectiveSku['imageUrl'] = value.banners[0]
      }
    }
    this.setData({
      detail,
      currentSku: this.createSkuStruct(effectiveSku)
    })
  },
  // 处理规格选择
  handleSpecSelect(parentIdx, childIdx) {
    const { selectSpec } = this.extData
    const { detail } = this.data
    const parentItem = detail.specs[parentIdx]
    let bannerList = []
    parentItem.values.forEach((item, index) => {
      if (index === childIdx) {
        item.banners && item.banners.length && (bannerList = item.banners)
        item.selected = true
        selectSpec[parentItem.id] = item.id
        this.handleCurrentSkuBySelectSpec(selectSpec, bannerList[0] || '')
      } else {
        item.selected = false
      }
    })

    this.setData({
      detail: Object.assign(detail, {
        _bannerList: bannerList.length ? bannerList : detail._bannerList
      })
    })
  },

  // 处理当前选择sku
  handleCurrentSkuBySelectSpec(spec, specImage) {
    const { detail } = this.data
    const currentSku = detail.sku.find(
      item => JSON.stringify(item.skuSpecValues) === JSON.stringify(spec)
    )
    if (!currentSku) return

    specImage && (currentSku['imageUrl'] = specImage)
    const skuStatus = currentSku.status != 'Enable' ? true : false
    this.setData({
      currentSku: this.createSkuStruct(currentSku),
      isSoldOut: skuStatus || currentSku.stock <= 0
    })
  },

  // 处理只有一种规格数据
  handleOneSpecs(data) {
    const { sku, specs } = data
    const lastSpecs = specs[0]
    for (let value of lastSpecs.values) {
      const objSpec = {
        [lastSpecs.id]: value.id
      }
      let findSku = sku.find(item => {
        if (JSON.stringify(item.skuSpecValues) === JSON.stringify(objSpec)) return item
      })
      value['disabled'] = !findSku || !findSku.stock || findSku.status === 'Disable'
    }
    this.setData({
      detail: data
    })
  },

  // 构造 sku 数据（填充页面显示所需字段）
  createSkuStruct(sku) {
    const { detail } = this.data
    sku['quantity'] = 1
    sku['name'] = detail.name
    sku['specValueArr'] = []
    sku['specValueJson'] = {}
    sku['specValueText'] = ''
    sku['imageUrl'] = sku['imageUrl'] ? sku['imageUrl'] : detail._bannerList[0]
    for (const key in sku.skuSpecValues) {
      const findSpec = detail.specs.find(spec => {
        if (key == spec.id) return spec
      })
      const findValue = findSpec.values.find(value => {
        if (sku.skuSpecValues[key] == value.id) return value
      })
      sku['specValueArr'].push({
        name: findSpec.name,
        value: findValue.value
      })
      sku['specValueJson'][findSpec.name] = findValue.value
      sku['specValueText'] = sku['specValueText']
        ? `${sku['specValueText']} ${findValue.value}`
        : findValue.value
    }

    if (sku.campaignProduct) {
      const availableTime = new Date(availableTimeFormat(sku.campaignProduct.endTime)).getTime()
      sku.campaignProduct['isAvailable'] =
        Date.now() < availableTime && sku.campaignProduct.enabled && sku.campaignProduct.stock
    }

    // 设置最大购买数量
    let limitNum = detail.limitNum ? detail.limitNum : 0
    let stock = sku.stock
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
    sku.maxNum = maxNum
    return sku
  },

  // 判断会员商品
  checkMemberGoods(goods, cb) {
    um.get(userInfo => {
      this.setData({ userInfo })
      cb && cb()
    })
  },

  // 添加购物车动效
  startAddCartAnimation() {
    this.setData({ startAddCartAnimation: true })
    setTimeout(() => {
      this.setData({ startAddCartAnimation: false })
    }, 2500)
  },
  // 设置用户操作类型
  setGoodsBuyOperType(value) {
    this.setData({
      goodsBuyOperType: value
    })
  },
  // 将规格 Object 遍历为 Array
  getArrayOfSpecObject(objc) {
    const array = []
    for (const key in objc) {
      array.push(`${key}:${objc[key]}`)
    }
    return array
  }
}
