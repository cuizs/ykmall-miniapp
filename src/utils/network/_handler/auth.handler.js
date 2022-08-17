/**
 * 认证header统一处理
 */

import config from '../_config'
import um from '../../../manager/userInfo'

export const authHeader = header => {
  header = header || {}
  return Object.assign(
    {
      ...config.DEFAULT_HEADER,
      Authorization: um.getToken(),
      // merchantCode:um.getCurrentChannel()
    },
    header
  )
}
