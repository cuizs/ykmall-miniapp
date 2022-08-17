/**
 * 需求清单
 */
import api from '../api/index'

class Demand {
  constructor() {}

  fetchDemandCount(cb) {
    api.demandNumber({
      success: res => {
        const number = res.data || 0
        if (number > 0) {
          wx.setTabBarBadge({
            index: 2,
            text: `${number}`
          })
        } else {
          wx.removeTabBarBadge({
            index: 2,
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

export default new Demand()
