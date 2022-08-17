/**
 * 网络请求
 **/
import Http from './_http'

/**
 * @param url 网络请求地址
 *
 * @param objc 网络请求配置, 具体参数设置参考微信小程序文档
 * {
 *  loading: boolean                              是否启用加载动画
 *  data: string/object/ArrayBuffer               请求的参数
 *  header: object                                设置请求的 header
 *  dataType: string                              返回的数据格式
 *  responseType: string                          响应的数据类型
 *  catch: boolean                                数据缓存
 *  catchConfig: object                           数据缓存相关配置
 * }
 *
 * * catchConfig - (key: 非必填, timer: 非必填)
 */

class Fetch {
  constructor() {
    this.http = new Http()
  }

  // GET
  get(url, objc = {}) {
    return this.http.request(url, 'GET', objc)
  }
  // POST
  post(url, objc = {}) {
    return this.http.request(url, 'POST', objc)
  }
  // PUT
  put(url, objc = {}) {
    return this.http.request(url, 'PUT', objc)
  }
  // DELETE
  delete(url, objc = {}) {
    return this.http.request(url, 'DELETE', objc)
  }
  // OPTIONS
  options(url, objc = {}) {
    return this.http.request(url, 'OPTIONS', objc)
  }
  // HEAD
  head(url, objc = {}) {
    return this.http.request(url, 'HEAD', objc)
  }
  // TRACE
  trace(url, objc = {}) {
    return this.http.request(url, 'TRACE', objc)
  }
  // CONNECT
  connect(url, objc = {}) {
    return this.http.request(url, 'CONNECT', objc)
  }
}

export default new Fetch()
