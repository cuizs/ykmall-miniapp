import basisConfig from '../config/basisConfig'
import apiConfig from '../config/apiConfig'
import um from './userInfo'

const channelManager = {
  getChannelInfos () {
    let channel = um.getCurrentChannel()
    return basisConfig[channel]
  },

  getChannelMainColor () {
    let channel = um.getCurrentChannel()
    return basisConfig[channel] ? basisConfig[channel].mainColor : '#4389EF'
  },

  openChannelCustomerService (messagePath = '', messageTitle = '') {
    let channel = um.getCurrentChannel()
    let url = basisConfig[channel].customerServiceUrl
    console.log("url===", url);
    console.log("basisConfig===", basisConfig[channel]);
    console.log("apiConfig===", apiConfig);
    wx.openCustomerServiceChat({
      extInfo: {
        url: url
      },
      corpId: apiConfig.CUSTOM_SERVICE_ID,
      showMessageCard: true,
      /**
       * #todo
       * 这里的sendMessagePath设置后显示为页面不存在，目前官方给出的原因也是待修复。
       * 此外所有的页面分享需要带渠道及订单、商品id等参数
       * 所有目前这里参数不传，默认都是跳转首页
       */
      sendMessagePath: messagePath,
      sendMessageTitle: messageTitle,
      success (res) { },
      fail (error) { }
    })
  }
}
export default channelManager