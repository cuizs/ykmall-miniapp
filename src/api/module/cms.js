/**
 * CMS模块(首页和Series)
 */
import fetch from '../../utils/network/index'

// 根据类型请求cms数据
const getCmsByType = (type, objc = {}) => {
  if(type == "CateProduct"){
    fetch.get(`/mp/api/v1/cms/type/${type}?displayHidden=false`, objc)
  }else {
    fetch.get(`/mp/api/v1/cms/type/${type}`, objc)
  }
}

export default {
  getCmsByType
}
