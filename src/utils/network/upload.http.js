import apiConfig from "../../config/apiConfig"
import { authHeader } from "./_handler/auth.handler"
import { getToken } from './_handler/token.handler'

const mediaApi = '/mp/api/v1/document/images'
// 文件限制
const CONFIG = {
  imageLimit: 5 * 1024 * 1024,
  videoLimit: 10 * 1024 * 1024,
  video: {
    duration: 60,
    maxDuration: 60,
  }
}
class Upload {
  constructor(baseUrl, url) {
    this.baseUrl = apiConfig.BASEURL
  }
  image (objc = {}) {
    getToken(() => {
      wx.chooseImage({
        count: objc["count"] || 5,
        success: (res) => {
          if (res.errMsg != "chooseImage:ok") return
          const imgList = res.tempFilePaths
          const imgObjc = res.tempFiles
          let promiseList = []
          imgList.forEach((item, index) => {
            if (imgObjc[index].size > CONFIG["imageLimit"]) {
              wx._showToast({
                title: "图片大小超出限制",
              })
              return
            }
            let prms =  this.uploadFile(mediaApi, {file: item})
            promiseList.push(prms);
          })
          Promise.all(promiseList).then(res=>{
            let newImgList = []
            res.forEach(item=>{
              if(item.code == 0){
                newImgList.push(item.data);
              }
            })
            objc.success && objc.success(newImgList)
          }).catch((error)=>{
            wx._showToast({
              title: "图片上传失败",
            })
            console.log("上传失败", error)
          })
        }
      })
    })
  }
  uploadFile (api, objc = {}) {
    return new Promise((resolve, reject)=>{
      wx.uploadFile({
        url: `${this.baseUrl}${api}?module=prescription`,
        filePath: objc.file,
        name: "file",
        dataType: objc.dataType || "json",
        header: authHeader(objc.data, objc.header),
        success: (res) => {
          resolve(JSON.parse(res.data))
          // objc.success && objc.success(JSON.parse(res.data))
        },
        fail: (error) => {
          reject(error)
          // console.log('error',error)
        }
      })
    })
   }
}

export default new Upload()