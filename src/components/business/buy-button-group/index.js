/**
 * 详情页面底部购买组件
 */
import um from '../../../manager/userInfo'
Component({
  externalClasses: ['z-class'],

  // 属性
  properties: {
    // 是否售罄
    isSoldOut: {
      type: Boolean,
      value: false,
      observer: 'updateSoldOutStatus'
    },
    type: {
      type: String,
      value: ''
    },
    move: {
      type: Boolean,
      value: false
    },
    number: {
      type: Number,
      value: 0
    }
  },

  // 组件数据
  data: {
    // 售罄状态
    soldOutStatus: false,
    show:false,
    currentChannel: ''
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show() {
      let self = this
      um.getChannelASync().then(channel=>{
        self.setData({
          currentChannel: channel
        })
      })
    }
  },

  // 组件方法
  methods: {
    /**
     * 页面事件
     */
    // 页面跳转
    onNavigateClick(e) {
      const { type } = e.currentTarget.dataset
      let path = ''
      let nav = 'switchTab'
      switch (type) {
        case 'home':
          path = '/pages/home/home'
          break
        case 'cart':
          path = '/pages/cart/cart'
          break
        case 'bill':
          path = '/pages/bill/bill'
          break
        default:
          console.warn(`Invalid type: ${type}`)
      }
      if (path) {
        wx[nav]({
          url: path
        })
      }
    },
    onDoctorClick() {
      this.triggerEvent('doctorClick')
    },
    // 点击添加购物车
    onAddCartClick () {
      this.checkVip(() => {
        this.triggerEvent('addCartClick')
      })
    },
     // 立即预约购买
     onAppointmentClick () {
      this.checkVip(() => {
        this.triggerEvent('appointmentClick')
      })
    },
    onSoldOutClick(){
      this.checkVip(() => {
        this.triggerEvent('soldOutClick')
      })
    },
    // 点击立即购买
    onBuyClick () {
      this.checkVip(() => {
        this.triggerEvent('buyClick')
      })
    },

    /**
     * 数据处理
     */
    // 更新售罄状态
    updateSoldOutStatus() {
      this.setData({
        soldOutStatus: this.data.isSoldOut
      })
    },
    /**
     * 判断是否是vip
     */
    checkVip (cb) {
      um.isVip(res => {
       
        if (!!res) {
          cb && cb()
          return 
        }
       
        this.setData({
          show:!res
        })
       })
    }
  }
})
