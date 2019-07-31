const axios = require('axios')

// 创建一个错误
function errorCreate(err) {
  console.log('>>>>>> request Error >>>>>>')
  console.log(err)
  if (process.env.NODE_ENV === 'development') {
  }
}


// 创建一个 axios 实例
const service = axios.create({
  baseURL: 'https://teda-magento.wudizu.com', 
  timeout: 1000 * 60,
  headers: {
    'content-type': 'application/json',// 默认值，
    'Authorization': 'Bearer u9kxjgz3j5saoch8ffy9xizbw99jzo8l'  //改成teda的token
  }
})

// const getBaseUrl = locale => {
//   return locale === 'zh-CN' ? '/index.php/rest/zh_cn/V1' : '/index.php/rest/en_us/V1'
// }



// 请求拦截器
service.interceptors.request.use(
  config => {
    console.log('查看当前的全局变量' + global.lang )
    const middleBaseUrl = !!global.lang ? `/index.php/rest/${global.lang}/V1`: `/index.php/rest/V1`
    console.log('查看当前URl' + middleBaseUrl )
    
    config.baseURL += middleBaseUrl
    console.log('查看当前的请求' + JSON.stringify(config) )
    return config
  },
  error => {
    // 发送失败
    errorCreate(error)
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const dataAxios = response.data
    return dataAxios
  },
  error => {
    let errorMessage = null
    if (!error.response) {
      errorMessage = {
        status: '500',
        data: {
          message: '服务器错误'
        }
      }
    } else {
      const { status, statusText, data } = error.response
      errorMessage = {
        status,
        statusText,
        data
      }
    }
    errorCreate(errorMessage.data)
    return Promise.reject(JSON.stringify(errorMessage))
  }
)

module.exports = service