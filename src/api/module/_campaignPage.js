/**
 * 活动页模块
 */
import fetch from '../../utils/network/index'

//
const getCampaignPage = (params, objc = {}) => {
  fetch.get(`/mp/api/v1/campaignPage/${params.id}`, objc)
}

const hasCampaignHomePage = (objc = {}) => {
  fetch.get(`/mp/api/v1/campaignPage`, objc)
}
export default {
  getCampaignPage,
  hasCampaignHomePage
}
