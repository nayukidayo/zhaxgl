const app = getApp()

Page({
  data: {
    name: '',
    phone: '',
    street: [],
  },

  onLogoutClick() {
    app.global.user = {}
    wx.clearStorageSync()
    wx.reLaunch({ url: '/pages/login/index' })
  },

  onReady() {
    const { name, phone, street } = app.global.user
    this.setData({ name, phone, street })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'me' })
    }
  },
})