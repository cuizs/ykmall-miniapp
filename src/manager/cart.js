/**
 * 需求清单
 */
 import api from '../api/index'

 class Cart {
   constructor() {}
   fetchCartCount(cb) {
     api.cartNumber({
       success: res => {
         const number = res.data || 0
         if (number > 0) {
           wx.setTabBarBadge({
             index: 3,
             text: `${number}`
           })
         } else {
           wx.removeTabBarBadge({
             index: 3,
             success: (res) => {
               console.log('removeTabBarBadge success: ', res)
             },
             fail: (error) => {
               console.log('removeTabBarBadge fail: ', error)
             },
           })
         }
           
 
         cb && cb(number)
       }
     })
   }
 }
 
 export default new Cart()