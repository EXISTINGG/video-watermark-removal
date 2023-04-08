// 封装request
function request(params) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      ...params,
      success: (res) => {
        resolve(res.data)
      },
      fail: (error) => {
        reject(error)
      },
      complete: () => {
        // 成功失败都会执行
        wx.hideLoading()
      }
    })
  })
}
export default request