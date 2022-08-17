/**
 * 统一导出API
 **/

import cmsAPI from './module/cms'
import goodsAPI from './module/goods'
import orderAPI from './module/order'
import couponAPI from './module/coupon'
import categoryAPI from './module/category'
import templateAPI from './module/template'
import customerAPI from './module/customer'
import keywordAPI from './module/keyword'
import collectAPI from './module/collect'
import prescriptionAPI from './module/prescription'
import feedback from './module/_feedback'
import address from './module/_address'
import invoice from './module/invoice'
import campaign from './module/campaign'
import auth from './module/auth'
import campaignPage from './module/_campaignPage'
import inquiry from './module/_inquiry'
import common from './module/common'
import promoter from './module//_promoter'

export default {
  ...cmsAPI,
  ...goodsAPI,
  ...orderAPI,
  ...couponAPI,
  ...categoryAPI,
  ...templateAPI,
  ...customerAPI,
  ...collectAPI,
  ...keywordAPI,
  ...prescriptionAPI,
  ...feedback,
  ...address,
  ...invoice,
  ...campaign,
  ...auth,
  ...campaignPage,
  ...inquiry,
  ...common,
  ...promoter
}
