import { feedback } from './_service'
import um from '../../manager/userInfo'
Page({

    /**
     * 页面的初始数据
     */
    data: {
    value: '',
    show:false,
  },
  onsave () {
    console.log(1111,this.data.value);
    if (!this.data.value) {
      return 
    }
    um.get(user => {
      feedback({ content: this.data.value, customerId: user.id }, res => {
        this.setData({
          show:true
        })
      })
    })
    
   },
   bindinput(e) {
    this.setData({
      value:e.detail.value
    })
  },
})
