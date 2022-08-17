/**
 * 价格显示组件
 * @description 如果价格为小数则保留小数点后两位，数值超过三位以“,”分隔。
 */
import { availableTimeFormat } from '../../utils/util'

Component({
  externalClasses: ['z-class'],
  properties: {
    // 金额数值
    value: {
      type: Object,
      value: {},
      observer: function (nVal) {
        if (nVal.campaignProduct) {
          const availableTime = new Date(
            availableTimeFormat(nVal.campaignProduct.endTime)
          ).getTime()
          nVal.campaignProduct['isAvailable'] =
            Date.now() < availableTime && nVal.campaignProduct.enabled && nVal.campaignProduct.stock

          this.setData({ value: nVal })
        }

        
      }
    }
  }
})
