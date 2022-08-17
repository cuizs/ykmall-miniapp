/**
 * 将微信的API转化为Promise
 */

function toPromise(name, options) {
  for (const key in wx) {
    if (typeof wx[key] === 'function') {
      wx[`$${key}`] = options => {
        return new Promise((resolve, reject) => {
          wx[key](
            Object.assign({}, options, {
              success: res => {
                resolve(res)
              },
              fail: error => {
                reject(error)
              }
            })
          )
        })
      }
    }
  }
}

export default toPromise()
