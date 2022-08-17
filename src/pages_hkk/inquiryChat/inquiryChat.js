const app = getApp();
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
import { getInquiryDetail, getInquiryMessageList, sendInquiryMessage } from './_service'
import local from '../../utils/localStorage';
import eventBus from '../../utils/eventBus.js';
import { trans } from './_transTime'
import Upload from '../../utils/network/upload.http'
import cnm from '../../manager/channel'
import ImSocket from '../../manager/im'

import { formatTime2Date } from '../../utils/util'
import { effectContentTypeList } from './_config'
const innerAudioContext = wx.createInnerAudioContext()

/**
 * 初始化数据
 */

Page({
  /**
  * 页面的初始数据
  */
  data: {
    platform: 'ios',
    scrollHeight: '100vh',
    inputBottom: 0,
    ws: null,
    inquiryList: [],
    inquiryBase: {},
    inquiryId: '',
    orderId: '',
    inquiryStatus: '',
    scrollWithAnimation: false,
    keyboardPush: false,
    innerAudioContext: null,
    playAudioIndex: 0
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.recheckIM()
    this.setPlatform()
    this.getInitData(options)
  },

  recheckIM () {
    // 检查ws连接状态，并保持连接
    const app = getApp()
    const { IM } = app.globalData
    if (IM && !IM.isConnect()) {
      console.log('websocket在app.js中连接失败，重新连接')
      app.globalData.IM = new ImSocket({ heartBeat: true })
      app.globalData.IM.connect()
    }
  },

  setPlatform () {
    try {
      const res = wx.getSystemInfoSync()
      if (res.platform == 'ios' && res.platform == 'devtools') { //ios && devtools
        this.setData({ platform: 'ios' })
      }
      if (res.platform == 'android') { //安卓
        this.setData({ platform: 'android' })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  getInitData (options) {
    const inquiryId = options.inquiryId;
    this.setData({
      inquiryId,
    })
    getInquiryDetail(inquiryId, (data) => {
      this.setData({
        orderId: data.orderId
      });
    })
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    wx.setInnerAudioOption({ obeyMuteSwitch: false })
    console.log('wx.env', wx.env)
    this.getMessageData()
    setTimeout(() => {
      this.setData({
        scrollWithAnimation: true
      })
    }, 2000)
    const that = this;
    eventBus.on('ON_INQUIRY_MSG', this, (data) => {
      console.log('ON_INQUIRY_MSG', data);
      that.getMessageData()
    })
    console.log('innerAudioContext', innerAudioContext)
    // 创建语音播放上下文
    innerAudioContext.onEnded(() => {
      console.log('.....onEnded.....')
      this.setData({
        playAudioIndex: 0
      })
    })
    innerAudioContext.onStop(() => {
      console.log('.....onStop.....')
      this.setData({
        playAudioIndex: 0
      })
    })
  },
  handleService () {
    cnm.openChannelCustomerService('/pages_hkk/inquiryChat/inquiryChat', '问诊室')
  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {
    eventBus.remove('ON_INQUIRY_MSG', this)
    innerAudioContext.stop()
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    eventBus.remove('ON_INQUIRY_MSG', this)
    innerAudioContext.stop()
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {

  },

  // 获取聊天消息
  getMessageData () {
    getInquiryMessageList(this.data.inquiryId, (res) => {
      const inquiryList = res.interactionMessageList
        // .filter(val => effectContentTypeList.some(el => el === val.contentType))
        .map((val, index) => {
          if (index !== 0) {
            console.log(trans(val.createdDate, res.interactionMessageList[index - 1].createdDate))
          }
          const fromHeadImageUrl = 'https://yiyunhp-miniapp.oss-cn-shanghai.aliyuncs.com/doctor/icon/sex-1.png'
          return {
            ...val,
            fromHeadImageUrl: val.role === '0' && !val.fromHeadImageUrl ? fromHeadImageUrl : val.fromHeadImageUrl,
            showTime: index === 0 ? '' : trans(val.createdDate, res.interactionMessageList[index - 1].createdDate)
          }
        });
      const inquiryBase = { ...res.inquiryBase, inquiryClosedDateFormat: res.inquiryBase.inquiryClosedDate ? formatTime2Date(res.inquiryBase.inquiryClosedDate) : '', createdFormat: res.inquiryBase.created ? formatTime2Date(res.inquiryBase.created) : '' }
      this.setData({
        inquiryList,
        inquiryBase,
        inquiryStatus: inquiryBase.status,
      }, () => {
        this.updateMsgPosition()
      })
    })
  },
  /**
  * 获取聚焦
  */
  focus: function (e) {
    console.log(this.data.ws)
    keyHeight = e.detail.height;
    this.setData({
      keyboardPush: true,
      scrollHeight: (windowHeight - keyHeight) + 'px',
      inputBottom: keyHeight + 'px'
    });
    this.updateMsgPosition()
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      keyboardPush: false,
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.updateMsgPosition()
  },

  /**
  * 消息上推到最新
  */

  updateMsgPosition () {
    const displayInquiryList = this.data.inquiryList.filter(val => effectContentTypeList.some(el => el === val.contentType))
    console.log('this.data.inquiryList[this.data.inquiryList.length - 1].id', displayInquiryList[displayInquiryList.length - 1].id)
    this.setData({
      toView: 'msg-' + (displayInquiryList[displayInquiryList.length - 1].id)
    })
  },
  inputValueChange (e) {
    const inputVal = e.detail.value;
    this.setData({
      inputVal
    });
  },
  handlePrescriptionClick () {
    this.$to(`orderDetail/orderDetail?id=${this.data.orderId}`, 'navigate')
  },
  sendMessage (params) {
    return new Promise((resolve, reject) => {
      sendInquiryMessage(params, (res) => {
        resolve(res)
      }, (err) => {
        reject(err)
      })
    })
  },
  /**
  * 发送点击监听
  */
  sendClick: function () {
    console.log(this.data.inputVal)
    let useText = this.data.inputVal.trim()
    if (useText.length < 1) {
      return;
    }
    const params = {
      content: this.data.inputVal,
      contentType: "im_text",
      inquiryId: this.data.inquiryId,
      role: "0",
      token: local.get('_inquiry_token_')
    }
    this.sendMessage(params).then(() => {
      const inputVal = '';
      this.setData({
        inputVal
      });
      this.getMessageData()
    })

    this.updateMsgPosition()
  },
  onAddImageClick () {
    Upload.image({
      count: 1,
      success: (res) => {
        const params = {
          content: res[0],
          contentType: "im_img",
          inquiryId: this.data.inquiryId,
          role: "0",
          token: local.get('_inquiry_token_')
        }
        this.sendMessage(params).then(() => {
          const inputVal = '';
          this.setData({
            inputVal
          });
          this.getMessageData()
        })

        this.updateMsgPosition()
      },
    })
  },
  handlePlayAudio (e) {
    console.log(e.detail)
    const { path, index } = e.detail
    const { playAudioIndex } = this.data
    if (playAudioIndex === index) {
      return innerAudioContext.stop()
    } else {
      return this.setData({ playAudioIndex: index }, () => {
        innerAudioContext.autoplay = true
        innerAudioContext.src = path
        innerAudioContext.play()
      })
    }
  }

})