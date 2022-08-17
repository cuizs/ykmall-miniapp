/**
 * 公共通用模块
 */
 import fetch from '../../utils/network/index'

 // 分享行为记录
 const shareRecord = (objc = {}) => {
   fetch.post(`/mp/api/v1/customer-share`, objc)
 }

 export default {
  shareRecord
 }
 