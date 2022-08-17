

/**
 * 网络请求
 */
 import api from '../../api/index'

 export const keywordList = (cb) => {
   api.keywordList({
     success: res => {
       cb && cb(res.data || [])
     }
   })
 }
 
//  关键词搜索

export const getGoodsList = (params,cb) => {
  api.getGoodsList({
    data:params,
    success: res => {
      cb && cb(res.data || [])
    }
  })
}