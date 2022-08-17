import local from '../utils/localStorage'

const KEYWORD = '_keyword_'
class Keyword {
  constructor() { }
  // 获取关键词列表
  get (cb) {
    cb && cb(local.get(KEYWORD) || [])
  }
  set (key, cb) {
    let keyList = local.get(KEYWORD) || []
    const flag = keyList.some(item => {
      return key === item
    })
    !flag && keyList.unshift(key)
    keyList = keyList.slice(0,10)
    local.set(KEYWORD,keyList)
    cb && cb(keyList)
  }
  remove () {
    local.remove(KEYWORD)

  }
}

export default new Keyword()