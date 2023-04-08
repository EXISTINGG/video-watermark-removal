// pages/atlas/atlas.js
import request from '../../../utils/request'
import timesub from '../../../utils/timesub'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: "",
    atlasData: {},
    videoHidden: true,
    current: 0
  },
  handlecheck(e) {
    this.setData({
      current: e.detail.current
    })
  },
  handleChange(event) {
    this.setData({
      url: event.detail.value
    })
  },
  cleartext() {
    this.setData({
      url: '',
      videoHidden: true,
    })
  },
  handlePaste() {
    wx.getClipboardData({
      success: (res) => {
        let re = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
        this.setData({
          url: re.exec(res.data)[0]
        })
        wx.hideToast()
      }
    })
    wx.showToast({
      title: '请点击开始解析按钮',
      duration: 5000
    })
  },
  hanldeStart() {
    if (wx.getStorageSync('time') > 0) {
      let re = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
      this.setData({
        url: re.exec(this.data.url)[0]
      })
      // 点击开始按钮 回调函数
      request({
        url: `https://jd.518tv.cn/parse?url=${this.data.url}`,
        method: 'get',
      }).then(res => {
        console.log(res.data);
        timesub()
        // var reg = /^(https)/
        // var reg1 = /^(http)/
        // if (!reg.test(res.data.cover)) {
        //   console.log('不包含https');
        //   res.data.cover = res.data.cover.replace(reg1, 'https')
        // }
        this.setData({
          videoHidden: false,
          atlasData: res.data,
        })
      }).catch(error => {
        wx.showToast({
          icon: "error",
          title: '失败',
        })
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您的解析次数不足,请观看广告增加次数',
        success(res) {
          if (res.confirm) {
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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  SaveImg() {
    var index = this.data.current
    wx.downloadFile({
      url: this.data.atlasData.pics[index],
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
        })
      }
    })
  },
  SaveAllImg() {
    for (var i = 0; i < this.data.atlasData.pics.length; i++) {
      wx.showToast({
        title: `保存中${i}/${this.data.atlasData.pics.length}`,
        icon: 'success',
        duration: 500
      })
      wx.downloadFile({
        url: this.data.atlasData.pics[i],
        success: (res) => {
          // wx.showLoading({
          //   title: `保存中${i}/${this.data.atlasData.pics.length}`,
          // })
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {}
          })
        }
      })
    }
    // wx.hideLoading()
  },
  SaveCover() {
    wx.downloadFile({
      url: this.data.atlasData.cover,
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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