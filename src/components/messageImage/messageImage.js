// components/messageText.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (nVal) {
        console.log('')
        if (nVal.contentType === 'im_img') {
          this.setData({
            imgSrc: nVal.content
          })
        }

        if (nVal.contentType === 'im_fileVideo') {
          const content = JSON.parse(nVal.content || JSON.stringify({}))
          this.setData({
            videoSrc: content.path,
            videoDuration: content.duration,
            videoThumbTempFilePath: content.thumbTempFilePath
          })
        }
      }
    },
    inquiryList: {
      type: Array,
      value: [],
      observer: function (nVal) {
        console.log('....', nVal)
        const imageList = nVal
          .filter(val => val.contentType === 'im_img' || val.contentType === 'im_fileVideo')
          .map(val => {
            // val.content
            if (val.contentType === 'im_img') {
              return {
                url: val.content,
                type: 'image'
              }
            }
            if (val.contentType === 'im_fileVideo') {
              return {
                url: JSON.parse(val.content || JSON.stringify({})).path,
                type: 'video'
              }
            }
          })
        this.setData({
          imageList
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgSrc: '',
    videoSrc: '',
    videoDuration: 0,
    videoThumbTempFilePath: '',
    imageList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    previewImages (e) {
      const currentUrl = e.currentTarget.dataset.url
      const currentIndex = this.data.imageList.findIndex(val => val.url === currentUrl)
      console.log('currentIndex', currentIndex)
      console.log('currentUrl', currentUrl)

      wx.previewMedia({
        sources: this.data.imageList,
        current: currentIndex,
        url: currentUrl
      })
    }
  }
})
