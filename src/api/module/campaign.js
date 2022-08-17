/**
 * 优惠券模块
 */
import fetch from '../../utils/network/index'

//
const getCampaign = (objc = {}) => {
  fetch.get(`/mp/api/v1/campaign`, objc)
}

export default {
  getCampaign,
}
