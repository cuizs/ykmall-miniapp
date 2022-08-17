/**
 * 网络请求
 **/
import Queue from './_queue'
import config from './_config'
import um from '../../manager/userInfo'
import apiConfig from '../../config/apiConfig'

import { log } from './_log'
import RetryHandler from './_handler/retry.handler'
import { getToken } from './_handler/token.handler'
import { authHeader } from './_handler/auth.handler'
import { responseHandler } from './_handler/response.handler'
import { showLoading, hideLoading, showToast } from './_handler/toast.handler'
import {
  errorHandler,
  createServerErrStruct,
  createResponseErrorStruct
} from './_handler/error.handler'

// 是否正在请求token
let isFetchToken = false

// 网络请求队列
const requestQueue = new Queue()
// 重试网络请求集合 && 队列
const retryRequestSet = {}
const retryRequestQueue = new Queue()

class Http {
  constructor() {
    this.baseUrl = apiConfig.BASEURL
  }

  // 发起请求
  request (url, method, objc = {}) {
    const token = um.getToken()

    requestQueue.push({ url, method, objc })
    if (!token) {
      if (isFetchToken) return

      isFetchToken = true
      getToken(() => {
        isFetchToken = false
        const tasks = requestQueue.get()
        for (const task of tasks) {
          this.resend(task.url, task.method, task.objc)
        }
      })
    }

    if (token) {
      this.send(url, method, objc)
    }
  }

  // 发送网络请求
  send (url, method, objc = {}) {
    const resUrl = `${this.baseUrl}${url}`

    objc.loading && showLoading()
    const startTime = new Date().getTime()
    wx.request({
      url: resUrl,
      data: objc.data,
      method: method || 'GET',
      timeout: config.TIMEOUT,
      header: authHeader(objc.header),
      dataType: objc.dataType || 'json',
      responseType: objc.responseType || 'text',
      fail: error => {
        errorHandler(error, results => {
          const errorStruct = createServerErrStruct(results)
          showToast(errorStruct.errMsg)
          objc.fail && objc.fail(errorStruct)
        })
      },
      complete: () => {
        objc.loading && hideLoading()
      },
      success: res => {
        log({
          url: url,
          response: res,
          params: objc.data,
          type: method || 'GET',
          interval: new Date().getTime() - startTime
        })

        const handler = new responseHandler(res)
        handler
          .isReTry(() => {
            // 重试队列中不存在该请求
            if (!retryRequestQueue.has({ url, method, objc })) {
              const retryInstance = new RetryHandler()

              retryRequestQueue.push({ url, method, objc })
              retryRequestSet[`${url}${method}`] = retryInstance

              retryInstance.action(() => {
                console.log(`----------- ${url} ${method} -----------`)
                console.log(`重试${retryInstance.times}次`)
                console.log(`----------- ${url} ${method} -----------`)

                retryInstance.add()
                this.resend(url, method, objc)
              })
            }
            // 重试队列中存在该请求
            else {
              const retryInstance = retryRequestSet[`${url}${method}`]
              retryInstance.action(() => {
                console.log(`----------- ${url} ${method} -----------`)
                console.log(`重试${retryInstance.times}次`)
                console.log(`----------- ${url} ${method} -----------`)

                retryInstance.add()
                this.resend(url, method, objc)
              })
            }
          })
          .isRefetch(() => {
            getToken(() => {
              this.resend(url, method, objc)
            })
          })
          .isSuccess(result => {
            requestQueue.removeByItem({ url, method, objc })
            retryRequestQueue.removeByItem({ url, method, objc })
            console.log('result', result)
            objc.success && objc.success(result)
          })
          .isFailture(result => {
            const errorStruct = createResponseErrorStruct(result)
            showToast(errorStruct)
            objc.fail && objc.fail(errorStruct)
          })
      }
    })
  }

  // 重新发送请求
  resend (url, method, objc = {}) {
    this.send(url, method, objc, true)
  }
}

export default Http
