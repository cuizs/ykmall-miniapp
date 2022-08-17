/**
 * 二维码管理
 */

import { getCurrentPage } from '../utils/util'

const qrcodeManager = (cb = {}) => {
  let currentPage = getCurrentPage()
  let options = currentPage.options
  if (!options.scene) {
    console.warn(`code: scene is null, Please check the qrcode configuration`)
    return
  }
}

export default {
  qrcodeManager
}
