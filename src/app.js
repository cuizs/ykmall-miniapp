import extend from './utils/extend/page-ext'
import './utils/extend/mount-fun-ext'
import './plugins/xy.toPromise'
import um from './manager/userInfo'
import eventBus from './utils/eventBus'
import ImSocket from './manager/im'
import api from './api/index'

App({
  globalData: {
    queryOption: {

    },
    // 因为杀死程序，这个存储即销毁，所以存在globalData中
    referrerOptions: {
      referrer: '',
      referrerDoctorId: '',
      partnerReferrerId:""
    },
    IM: null
  },
  onLaunch(opts) {
    Page = function (options) {
      return new extend.NewPage(options)
    }
  },
  onHide() {
    if (this.globalData.IM) {
      this.globalData.IM.close()
      this.globalData.IM = null
    }
  },
  onShow(options) {
    console.log("options===", options);
    console.log("options.scene", options.scene);
    console.log("options.query", options.query);
    this.globalData.queryOption = options.query ? options.query : {}
    // 来源店铺
    let storeChannel = this.globalData.queryOption.channel ? this.globalData.queryOption.channel : null
    let localChannel = um.getCurrentChannel() // 本地channel
    // 推荐人的Id（非小程序用户id，为管理端推荐人的id）
    let referrerDoctorId = this.globalData.queryOption.referrerDoctorId ? this.globalData.queryOption.referrerDoctorId : null
    let referrer = this.globalData.queryOption.referrer ? this.globalData.queryOption.referrer : null
    // 推广人的Id（非小程序用户id，为管理端b推广人的id）
    let partnerReferrerId = this.globalData.queryOption.partnerReferrerId ? this.globalData.queryOption.partnerReferrerId : null

    // 判断是否是扫码进入小程序，推广人记录要保存
    // if (options.scene == 1011) {
    if (options.query.partnerReferrerId) {
      api.getUserInfo({
        success: res => {
          const userInfo = res.data
          console.log("userInfo", userInfo);
          let params = {
            customerId: userInfo.id,
            partnerId: options.query.partnerId,
            partnerReferrerId: options.query.partnerReferrerId
          }
          console.log("推广人记录请求参数", params);
          api.scanRecord({
            data: params,
            success: res => {
              console.log("推广人记录请求结果", res);
            },
          })
        }

      })
      // }
    }
    if (storeChannel && storeChannel != localChannel) { // 路径中有渠道信息且和本地channel不同
      // 清空本地推荐人信息，因为此时，推荐人在其他渠道不存在
      this.globalData.referrerOptions = {
        referrer: '',
        referrerDoctorId: '',
        partnerReferrerId: ""
      }
      um.clearAllUserInfo() // 清除本地信息，再请求时，会触发重新请求token
      um.setCurrentChannel(storeChannel); // 重新设置channel
      const nowPages = getCurrentPages();
      if (nowPages.length > 0 && nowPages[0].hasOwnProperty("setChannelTheme")) { //页面主题元素重新加载
        nowPages[0].setChannelTheme()
      }
    }
    // 重新设置本地的推荐人信息
    if (referrerDoctorId) {
      this.globalData.referrerOptions = {
        referrer: referrer,
        referrerDoctorId: referrerDoctorId,
        partnerReferrerId: partnerReferrerId
      }
    }
    // 重新设置本地的推广人信息
    if (partnerReferrerId) {
      this.globalData.referrerOptions = {
        partnerReferrerId: partnerReferrerId
      }
    }

    // TODO 合康康渠道连接问诊室 websocket
    if (localChannel === 'hkk') {
      this.globalData.IM = new ImSocket({ heartBeat: true })
      this.globalData.IM.connect()
    }

  },

})
