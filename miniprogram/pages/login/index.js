const app = getApp()

Page({
  data: {},

  async getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') return
    try {
      wx.showLoading({ mask: true, title: '登录中' })
      const { result } = await wx.cloud.callFunction({
        name: 'login',
        data: { code: e.detail.code }
      })
      if (!result) {
        wx.hideLoading()
        wx.showModal({
          title: '登录失败',
          content: '此手机号未在系统内注册',
          showCancel: false,
        })
        return
      }
      app.global.user = result
      wx.setStorageSync('phone', result.phone)
      if (result.role === 'admin') {
        wx.switchTab({ url: '/pages/admin/report/index' })
      } else {
        wx.switchTab({ url: '/pages/home/index' })
      }
    } catch (err) {
      wx.showToast({ mask: true, icon: 'error', title: '请稍后重试' })
      console.log(err)
    }
  },
})