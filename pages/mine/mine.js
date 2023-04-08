// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: "点我登录",
    },
    time: '请登录'
  },
  handleHelp() {
    wx.navigateTo({
      url: '/restPage/pages/help/help',
    })
  },
  handleTop() {
    if (!wx.getStorageSync('userInfo')) {
      wx.getUserProfile({
        desc: 'desc',
        success: res => {
          this.setData({
            userInfo: {
              ...res.userInfo,
            }
          })
          this.setData({
            time: 3
          })
          wx.setStorageSync('userInfo', res.userInfo)
          wx.setStorageSync('time', 3)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    if (wx.getStorageSync('time')) {
      this.setData({
        time: wx.getStorageSync('time')
      })
    }
  },
  jiaTIme() {
    wx.showModal({
      title: '提示',
      content: '解析一次赠送2次解析次数'
    })
    // 暂时无流量主
    let videoAd = null
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-54e9da7a83dbc3c7'
      })
      videoAd.onLoad(() => {})
      videoAd.onError((err) => {})
      videoAd.onClose(res => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          var time = wx.getStorageSync('time') + 1
          wx.setStorageSync('time', time)
          this.setData({
            time: time
          })
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }

    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        videoAd.load()
          .then(() => videoAd.show())
          .catch(err => {
            console.log('激励视频 广告显示失败')
          })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      time: wx.getStorageSync('time')
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})