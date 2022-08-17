/**
 * 客服悬浮组件
 * @description 可支持移动，后续可支持设置默认初始位置
 */
 import cnm from '../../manager/channel' 
 import um from '../../manager/userInfo'

 Component({
  properties: {
    // 是否售罄
    pagePath: {
      type: String,
      value: '',
    },
    pageName: {
      type: String,
      value: ''
    },
    distinguishChannel: {
      type: Boolean,
      default: false
    }
  },
  data: {
    currentChannel: '',
    hidden: false,
  },
  lifetimes: {
    created: function() {
      // 在组件实例刚刚被创建时执行
      console.log('子组件————————created')
    },
    attached: function() {
      let self = this
      um.getChannelASync().then(channel=>{
        self.setData({
          currentChannel: channel
        })
        if(channel != 'hkk' && this.properties.distinguishChannel == true) {
          self.setData({
            hidden: true
          })
        }
      })
    },
  },
  methods: {
    handleService() {
      cnm.openChannelCustomerService(this.properties.pagePath, this.properties.pageName)
    }
  }
})