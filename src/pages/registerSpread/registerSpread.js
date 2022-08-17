import { areaList, checkPromoter, registerPromoterApi, userInfo } from './_service'
import um from '../../manager/userInfo'
import { getDate } from '../../utils/util'
import { handleCouponUtilFun } from '../../mixins/coupon'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    addressShow: false,
    partnerId: null,
    currentchannel: null,
    address: null,
    areaList: {},
    promoterStatus: false,
    name: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("options====", options);
    let { partnerId, channel } = options
    this.setData({
      partnerId: partnerId,
      currentchannel: channel
    })
    this.checkPromoterStatus()
    this.getAearList()
  },
  onShow(options) {
  },
  toMinePage() {
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/mine/mine'
      })
    }, 500);

  },
  checkPromoterStatus() {
    checkPromoter({}, res => {
      if (res.status) {
        wx._showToast({ title: '已存在绑定关系，无法继续绑定' })
      }
      this.setData({
        name: res.name,
        address: res.address || "",
        promoterStatus: res.status
      })
    })

  },
  //注册推广人
  registerPromoter() {
    if (!this.data.name) {
      wx._showToast({ title: '请输入姓名' })
      return
    }
    if (!this.data.address) {
      wx._showToast({ title: '请选择所在地区' })
      return
    }
    userInfo(userInfo => {
      console.log("userInf=====", userInfo);
      let self = this
      if (!!userInfo.mobile) {
        let { address, currentchannel, name, partnerId } = this.data
        let params = {
          address: address,
          merchantCode: currentchannel,
          mobile: userInfo.mobile,
          name: name,
          partnerId: parseInt(partnerId),
          // parentId:  parseInt(partnerId)
        }
        console.log(111);
        registerPromoterApi(params, res => {
          console.log(22);
          if (res.code == 0) {
            wx._showToast({ title: '绑定成功' })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            }, 1000);

          }
        })
      } else {
        // 打开弹窗
        this.setData({
          show: true
        })
      }

    })
  },
  onAdressChange() {
    if (this.data.promoterStatus) {
      return
    }
    this.setData({
      addressShow: true,
    })
  },
  onSelectAddress(event) {
    let areaList = event.detail.values;
    console.log(" event.target.values", event.detail.values)
    if (areaList && areaList.length > 0) {
      let province = areaList[0]?.name || "";
      let city = areaList[1]?.name || "";
      let county = areaList[2]?.name || "";
      this.setData({
        address: province + city + county,
      })
    }
    this.setData({
      addressShow: false,
    })
  },
  onClose() {
    this.setData({
      addressShow: false,
    })
  },
  getAearList() {
    areaList(res => {
      let areaList = {
        province_list: res.provinces,
        city_list: res.cities,
        county_list: res.counties,
      };
      this.setData({
        areaList: areaList
      })
    });
  },
  // 输入时获取值
  onInput(e) {
    const { value } = e.detail
    const { key } = e.currentTarget.dataset
    this.setData({
      name: value
    })
    console.log(value);
  }
})
