const app = getApp()

Page({
  data: {
    show: false,
  },

  checked: false,

  onCheckChange(e) {
    this.checked = e.detail.context.checked
  },

  async onReady() {
    const phone = wx.getStorageSync('phone')
    if (!phone) return this.setData({ show: true })
    wx.showLoading({ mask: true, title: '加载中' })
    const { data } = await wx.cloud.models.users.get({
      filter: { where: { phone: { $eq: phone } } },
      select: { name: true, phone: true, role: true, street: { name: true, code: true }, company: { name: true, address: true } }
    })
    app.global.user = data
    if (data.role === 'admin') {
      wx.switchTab({ url: '/pages/admin/report/index' })
    } else {
      wx.switchTab({ url: '/pages/home/index' })
    }
  },

  async getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') return
    wx.showLoading({ mask: true, title: '登录中' })
    const { result } = await wx.cloud.callFunction({
      name: 'login',
      data: { code: e.detail.code }
    })
    app.global.user = result
    console.log(result);
    wx.setStorageSync('phone', result.phone)
    if (result.role === 'admin') {
      wx.switchTab({ url: '/pages/admin/report/index' })
    } else {
      wx.switchTab({ url: '/pages/home/index' })
    }
  },
})