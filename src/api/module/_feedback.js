/**
 * 分类模块
 */
 import fetch from '../../utils/network/index'

 const feedback = (objc = {}) => {
   fetch.post('/mp/api/v1/feedback', objc)
 }
 
 export default {
  feedback
 }
 