import eventBus from '../utils/eventBus'
import api from "../api/index"
import local from "../utils/localStorage"
import config from '../config/apiConfig'
const host = config.IM_WEBSOCKET_URL
const HEAD_BEAT_CODE = 'sys_ping'
export default class ImSocket {
  constructor({ heartBeat, onMessage, onFail }) {
    // 是否已连接
    this.connected = false

    // 当前网络状态
    this.netWorkState = true

    // 心跳检测频率
    this.timeout = 5000

    // 计时器ID
    this.timer = null

    // 当前重连次数
    this.connectNum = 0

    // 心跳检测和断线重连开关
    this.heartBeat = heartBeat

    // 心跳检测接受消息间隔时间
    this.heartBeatTimeout = 3000

    this.heartBeatTimer = null

    // 房间id
    this.token = null

    // 回调监听
    this.message = onMessage

    // 错误回调
    this.onFail = onFail

    // socketTask
    this.socketTask = null

    // 初始化
  }
  connect () {
    if (!this.token) {
      api.getHospitalToken({
        loading: false,
        success: (res) => {
          this.token = res.data
          if (res.data) {
            local.set('_inquiry_token_', res.data)
            this.initWebSocket()
          }
        },
      })
    }
  }
  initWebSocket () {
    const that = this
    if (this.connected) {
      console.log("socket已连接")
    } else {
      that.socketTask = wx.connectSocket({
        url: `${host}?token=${that.token}`,
        success (res) {
          console.log('socket连接成功', res)
          // 已连接
          that.connected = true
          that.connectNum = 0
        },

        fail (err) {
          console.log('socket连接失败', err)
        }

      })

      // 监听 WebSocket 连接打开事件
      that.onSocketOpened()

      // 监听 WebSocket 连接关闭事件
      that.onSocketClosed()

      // 接受消息
      that.onReceiveMessage()
    }
  }
  onSocketOpened () {
    const that = this
    that.socketTask.onOpen((res) => {
      console.log('onOpen===> ', res)
      // 检查心跳
      if (that.heartBeat) {
        that.startHeartBeat()
      }

    })
  }
  onSocketClosed () {
    const that = this
    that.socketTask.onClose(res => {
      console.log('onCLose', res)
    })
  }

  /**
    * 心跳检查重置
  */

  resetHeartBeat () {
    this.timer && clearTimeout(this.timer)
  }

  /**
    * 心跳检查开始
  */
  startHeartBeat () {
    const that = this
    this.resetHeartBeat()
    that.timer = setInterval(() => {
      that.sendTestMessage()

    }, that.timeout)
  }
  reconnect () {
    this.heartBeatTimer && clearTimeout(this.heartBeatTimer)
    this.close()
    this.connected = false
    if (this.connectNum <= 10) {
      this.initWebSocket()
      this.connectNum += 1
    } else {
      console.error('websocket 重连次数达到上限，连接失败')
    }
  }
  sendTestMessage () {
    console.log('...')
    const msg = JSON.stringify({ contentType: HEAD_BEAT_CODE })
    const that = this
    that.socketTask.send({
      data: msg,
      success: (res) => {
        // console.log('发送心跳检测信息成功', res)
        that.heartBeatTimer = setTimeout(() => {
          that.resetHeartBeat()
          console.log('心跳检测超时')
          that.reconnect()
        }, that.heartBeatTimeout);
      },
      fail: (err) => {
        console.error('发送心跳检测信息失败', err)
        that.resetHeartBeat()
        that.reconnect()
      }
    })
  }
  onReceiveMessage () {
    const that = this

    that.socketTask.onMessage((res) => {
      console.log(res)
      that.heartBeatTimer && clearTimeout(that.heartBeatTimer)
      console.log('that.heartBeatTimer', that.heartBeatTimer)
      const msg = JSON.parse(res.data || JSON.stringify({}))

      // 过滤掉心跳检测信息
      if (msg.contentType === HEAD_BEAT_CODE) return
      eventBus.emit('ON_INQUIRY_MSG', JSON.parse(res.data || JSON.stringify({})))
      // that.message && that.message(JSON.parse(res.data || JSON.stringify({})))
    })
  }

  close () {
    this.socketTask && this.socketTask.close()
    this.resetHeartBeat()
    this.heartBeatTimer && clearTimeout(this.heartBeatTimer)
  }
  isConnect () {
    return this.connected
  }
}