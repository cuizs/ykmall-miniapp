/**
 * adapter组件
 * 用做IPhoneX机型适配
 */
import { naviBarHeight } from '../mixin'
import { isIpx } from '../../utils/util'

Component({
  externalClasses: ['z-class'],
  properties: {
    // 是否适配底部
    adapterBottom: {
      type: Boolean,
      value: true
    },
    // 是否适配导航栏
    adapterNaviBar: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isIpx: isIpx(),
    barHeight: naviBarHeight()
  }
})
