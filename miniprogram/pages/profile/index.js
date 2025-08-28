const app = getApp()

Page({
  data: {
    name: '',
    phone: '',
    company: '',
    address: '',
    street: ''
  },

  onLogoutClick() {
    app.global.user = {}
    wx.clearStorageSync()
    wx.reLaunch({ url: '/pages/login/index' })
  },

  onReady() {
    const { name, phone, company } = app.global.user
    this.setData({
      name, phone,
      company: company[0].name,
      address: company[0].address,
      street: company[0].street,
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'profile' })
    }
  },
})