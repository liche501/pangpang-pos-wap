import axios from 'axios'
import wx from 'weixin-js-sdk'

const WXAPI_CONFIG_API_URL = 'http://staging.p2shop.cn:60100'
export default {
  /**
   * /v1/fashion/wxconfig/{location}
   * location: bj or sh
   */
  setWexinConfig: (debugMode, apiList, url) => {
    const api = `${WXAPI_CONFIG_API_URL}/v1/fashion/wxconfig/bj?url=${url}`
    console.log(api)
    return axios.get(api)
      .then(res => {
        return res.data.result
      })
      .then(wxconfig => {
        wx.config({
          debug: debugMode,
          appId: wxconfig.appId,
          timestamp: wxconfig.timestamp,
          nonceStr: wxconfig.nonceStr,
          signature: wxconfig.signature,
          jsApiList: apiList
        })
        return wxconfig
      })
      .catch(err => {
        console.log(err)
      })
  }
}

