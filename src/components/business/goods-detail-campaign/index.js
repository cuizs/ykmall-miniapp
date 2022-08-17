/**
 * 详情页面底部购买组件
 */
import { availableTimeFormat } from '../../../utils/util'
Component({
  externalClasses: ['z-class'],

  // 属性
  properties: {
    campaign: {
      type: Object,
      value: {},
      observer: '_campaignChange'
    }
  },
  data: {
    timeData: {}
  },
  methods: {
    _campaignChange () {
      const { campaign } = this.data
      if (!campaign.id) return
      const s = new Date().getTime()
      const endTime = availableTimeFormat(campaign.endTime)
      const e = new Date(endTime).getTime()
      console.log(e-s)
      campaign.overTime = e - s
      this.setData({
        campaign
      })
    }
  },
})
