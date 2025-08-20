const app = getApp()

Page({
  data: {
    show: false
  },

  onReady() {
    const { _id } = app.global.user
    if (_id) {
      wx.switchTab({ url: '/pages/index/index' })
    } else {
      this.setData({ show: true })
    }
  },

  async getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      return
    }
    wx.showLoading({ mask: true, title: '登录中', })
    const { result } = await wx.cloud.callFunction({
      name: 'login',
      data: { code: e.detail.code }
    })
    app.global.user = result
    wx.setStorageSync('user', result)
    wx.hideLoading()
    wx.switchTab({ url: '/pages/index/index' })
  },
})