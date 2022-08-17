import { userInfo, getOrderCount,getPromoterCode} from './_service'
import um from '../../manager/userInfo'
import sm from '../../manager/share'
import { orderNav, list, channelMemberlist } from './_config'
import cnm from '../../manager/channel'
import apiConfig from '../../config/apiConfig'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNav,
    list,
    userInfo: {
      show: true
    },
    show: false,
    memberShow: false,
    inviteShow: false,
    currentChannel: '',
    channelInfo: {},
    memberChannel: false,
    channelMemberlist,
    inviteSrc: "",
    atavarSrc:
      "http://instruction-qf.oss-cn-shanghai.aliyuncs.com/dev/UgdsdQ1658048598179.png",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    // 获取用户信息
    userInfo(userInfo => {
      this.getOrderCount()
      let newUserInfo = this.secureUserMobile(userInfo)
      this.setData({
        userInfo: newUserInfo
      })
      //如果用户是推广人
      if (userInfo.promoterStatus == "Audited") {
        this.getPromoterInfo()
      }else{
        list.splice(5,2)
        this.setData({
          list:list
        })
      }
      console.log("newUserInfo", newUserInfo);
      this.setChannelTheme()

  
    })
  },

  setChannelTheme() {
    let self = this
    um.getChannelASync().then(channel => {
      let memberChannelList = [
        "rxga", "ykyw", "xcm", "ykneigou"
      ]
      let memberChannel = memberChannelList.includes(channel)
      self.setData({
        currentChannel: channel,
        memberChannel: memberChannel
      })
      wx.setNavigationBarColor({
        backgroundColor: cnm.getChannelMainColor(),
        frontColor: '#ffffff',
      })
    })
  },
  getPromoterInfo() {
    //获取渠道名称
    let channelInfo = cnm.getChannelInfos()
    console.log("channelInfo", channelInfo);
    this.setData({
      channelInfo: channelInfo
    })
    // 获取邀请关注二维码
    getPromoterCode(res=>{
      this.setData({
        inviteSrc:res.data
      })
    })
  },
  /**
   * 页面事件
   */
  // 跳转订单
  onClickOrder(e) {
    const { key } = e.currentTarget.dataset
    this.$setRouterQuery({
      key: 'routerQuery',
      query: { tab: key }
    })
    this.$to('order/order')
  },
  // 获取各订单数量
  getOrderCount() {
    getOrderCount(res => {
      let detail = res ? res : {}
      const { countAfterSale, countFinished, countPaid, countToBePaid } = detail
      let orderNav = []
      for (let i = 0; i < this.data.orderNav.length; i++) {
        let item = this.data.orderNav[i]
        if (i == 0) {
          item.num = countToBePaid
        }
        if (i == 1) {
          item.num = countPaid
        }
        if (i == 2) {
          item.num = countFinished
        }
        if (i == 3) {
          item.num = countAfterSale
        }
        orderNav.push(item)
      }
      this.setData({
        orderNav
      })
    })
  },
  // 跳转对应模块
  onClickItem(e) {
    const { item } = e.currentTarget.dataset
    switch (item.type) {
      // 走默认路径
      case 'path':
        this.$to(`${item.path}`)
        break
      // 成为推广商
      case 'promoter':
        this.checkCustomer(item)
        break
      //推广人邀请关注
      case 'inviteAttention':
        this.setData({
          inviteShow: true
        })
        break
      default: {
        console.log('')
      }
    }
  },
  // 授权后重新更新用户信息
  updateUserInfo(e) {
    let newUserInfo = this.secureUserMobile(e.detail)
    this.setData({
      userInfo: newUserInfo
    })
  },
  // 判断用户状态
  checkCustomer(item) {
    const { userInfo } = this.data;
    // 该用户是会员
    if (um.identityViewer().isMember) {
      this.checkPromoter()
    } else if (um.identityViewer().isAgent) {
      this.$to('distributor/distributor')
    } else {
      // 非会员
      wx.showModal({
        title: '温馨提示',
        content: '注册会员，可享受该权益！',
        confirmColor: '#498dff',
        success: res => {
          if (res.confirm) {
            this.$to('customerEquity/customerEquity')
          }
        }
      })
    }
  },
  //前往会员中心
  toVip() {
    um.isVip(res => {
      if (!!res) {
        this.toMemberCenter()
      } else {
        // 打开弹窗
        this.setData({
          memberShow: true
        })
      }

    })

  },
  //前往会员中心
  toMemberCenter() {
    let self = this
    // 获取用户信息
    userInfo(userInfo => {
      let newUserInfo = self.secureUserMobile(userInfo)
      self.setData({
        userInfo: newUserInfo
      })
      if (newUserInfo.customerType == "Vip") {
        wx._showToast({ title: '您已经注册会员' })
        self.toMemberCenterHome()
      } else {
        let currentChannel = channelMemberlist[self.data.currentChannel].name
        //跳转会员中心小程序
        wx.navigateToMiniProgram({
          appId: apiConfig.MEMBERAPPID, // 跳转会员中心小程序
          path: `pages/joinMember/joinMember?channel=` + currentChannel, // 跳转的目标页面
          extarData: {
            open: "auth",
          },
          envVersion: "trial",
          success(res) { },
        });
      }
    })

  },
  toMemberCenterHome() {
    let currentChannel = channelMemberlist[this.data.currentChannel].name
    //跳转会员中心小程序
    wx.navigateToMiniProgram({
      appId: apiConfig.MEMBERAPPID, // 跳转会员中心小程序
      path: `pages/home/home?channel=` + currentChannel, // 跳转的目标页面
      extarData: {
        open: "auth",
      },
      envVersion: "trial",
      success(res) { },
    });
  },
  // 判断推广商状态
  checkPromoter() {
    const { userInfo } = this.data
    if (userInfo.promoterStatus == 'Audited') {
      this.$to('agentManage/agentManage')
    } else if (userInfo.promoterStatus && userInfo.promoterStatus === 'ToAudit') {
      wx._showToast({ title: '申请正在审核中!' })
    } else {
      this.$to('registerPromoter/registerPromoter')
    }
  },
  // 注册会员
  onClickLogin() {
    const { userInfo } = this.data
    // 该用户是会员
    if (userInfo.level && userInfo.level === 'Vip') {
      this.$to('registerMember/registerMember')
    } else {
      this.$to('customerEquity/customerEquity')
    }
  },
  // 预览代理二维码
  onViewCode(e) {
    const { url } = e.currentTarget.dataset
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  // 下啦刷新
  onPullDownRefresh() {
    um.refresh(userInfo => {
      let newUserInfo = this.secureUserMobile(userInfo)
      this.setData({
        userInfo: newUserInfo
      })
      this.getOrderCount();
      wx.stopPullDownRefresh()
    })
  },
  secureUserMobile(userInfo) {
    if (userInfo.mobile) {
      userInfo.mobile = userInfo.mobile.replace(userInfo.mobile.substring(3, 7), '****')
    }
    return userInfo
  },
  checkVip() {
    um.isVip(res => {
      if (!!res) {
        return
      }
      // 打开弹窗
      this.setData({
        show: !res
      })
    })
  },
  // 隐私条例
  handlePrivacy() {
    this.$to('privacy/privacy');
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return sm.userShare()
  }
})
