function timesub() {
  if (wx.getStorageSync('time')) {
    // 解析一次增加/减少次数
    wx.setStorageSync('time', wx.getStorageSync('time') + 2)
  } else {
    // 默认次数
    wx.setStorageSync('time', 3)
  }
}
export default timesub