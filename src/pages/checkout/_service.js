import api from '../../api/index'

export const addaddress = (params, cb) => {
  api.addaddress({
    loading: true,
    data: params,
    success: res => {
      cb && cb(res || {})
    }
  })
}


export const updataaddress = (params, cb) => {
  api.updataaddress(params.id,{
    loading: true,
    data: params,
    success: res => {
      cb && cb(res || {})
    }
  })
}