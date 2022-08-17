//js
import cnm from '../../manager/channel'
Component({
  /**
   * 组件的属性列表（iconList为步骤条个数，iconIndex:当前步骤）
   */
  properties: {
    iconList: {
      type: Array,
      value: [],
    },
    iconIndex: {
      type: Number,
      value: 1,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,//获取屏幕宽度
  },
  methods: {
    // 重新问诊
    toCart() {
      wx.switchTab({
        url: '/pages/bill/bill'
      })
    },
    onCheckClick(){
      console.log(65555);
      this.triggerEvent('onCheckClick');//如果需要传递参数，直接写在triggerEvent的参数里即可
    },
    onCustomerServiceClick(){
      cnm.openChannelCustomerService(this.properties.pagePath, this.properties.pageName)
    }
  }
})

