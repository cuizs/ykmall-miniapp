/**
 * 网络日志打印
 */
import config from './_config'
import evnConfig from '../../config/evnConfig'

export const log = (objc = {}) => {
  const { url, type, interval, params, response } = objc
  return;
  // debug 模式关闭
  if (!config.debug) return

  // 分割
  console.log('')

  console.log(`******************** ${evnConfig.EVN} ${type} ${url} ********************`)

  console.log(`请求时长: ${interval}ms`)
  console.log('参数: ', params || '无')
  console.log('返回值: ', response)

  console.log(`******************** ${evnConfig.EVN} ${type} ${url} ********************`)

  // 分割
  console.log('')
}
