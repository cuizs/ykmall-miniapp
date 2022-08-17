/**
 * ADAPTER-VIEW 组件
 */
import adapterBehavior from '../../_behavior/adapter-behavior'

Component({
  externalClasses: ['z-class'],
  behaviors: [adapterBehavior],
  properties: {
    // 是否适配iPhoneX
    isAdapterIpx: {
      type: Boolean,
      value: true
    },

    // 是否适配自定义标签栏
    isAdapterTabBar: {
      type: Boolean,
      valie: false
    },

    // 是否适配自定义导航栏
    isAdapterNaviBar: {
      type: Boolean,
      value: false
    }
  }
})
