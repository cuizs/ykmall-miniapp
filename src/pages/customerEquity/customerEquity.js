
import {registerCoupon} from './_service'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      couponList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      registerCoupon(couponList=>{
        this.setData({couponList})
      })
    },

// 注册会员
onLoginClick(){
  this.$to('registerMember/registerMember','redirectTo')
},
})
