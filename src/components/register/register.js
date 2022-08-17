import { decryptMobile } from './_serevice'

Page({
  data: {},

  onLoad(options) {},

  onGetPhoneNumberClick(e) {
    const { iv, encryptedData } = e.detail
    if (!iv || !encryptedData) return

    decryptMobile({ iv, encryptData: encryptedData }, () => {
      this.$to('', 'navigateBack')
    })
  }
})
