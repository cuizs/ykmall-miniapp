/**
 * coupon-item 组件
 */
import { handleCouponUtilFun } from '../../mixins/coupon'

Component({
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (nVal) {
        this.handleCouponData(nVal)
      }
    },
    type: {
      type: String,
      value: ''
    },
    hasBtn: {
      type: Boolean,
      value: true
    },
    btnText: {
      type: String,
      value: ''
    },
    reverseSuffix: {
      type: Boolean,
      value: false
    }
  },
  methods: {
    /**
     * 事件处理
     */
    onCouponClick(e) {
      console.info('xxxxxxx', this.data.data)
      this.triggerEvent('couponclick', { value: this.data.data })
    },

    onDescClick(e) {
      this.triggerEvent('coupondescclick', { value: this.data.data })
    },

    /**
     * 数据处理
     */
    handleCouponData(coupon) {
      this.setData({
        data: handleCouponUtilFun(coupon)
      })
    }
  }
})
