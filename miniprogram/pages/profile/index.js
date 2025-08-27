const app = getApp()

Page({
  data: {
    name: '',
    phone: '',
    company: {
      name: '',
      street: '',
      address: '',
    }
  },

  onLogoutClick() {
    app.global.user = {}
    wx.clearStorageSync()
    wx.reLaunch({ url: '/pages/login/index' })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'profile' })
    }
    const user = app.global.user
    this.setData({
      name: user.name || '',
      phone: user.phone || '',
      company: user.company || {}
    })
  },
})