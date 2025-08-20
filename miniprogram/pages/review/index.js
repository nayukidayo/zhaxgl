const app = getApp()

Page({
  data: {
    record: null,
    comment: '',
    role: app.global.user.role
  },

  onLoad() {
    this.getOpenerEventChannel().on('opener', data => {
      this.setData({ record: data })
    })
  },

  async onFulfill() {
    wx.showLoading({ mask: true, title: '提交中', })
    await wx.cloud.models.report.update({
      filter: { where: { _id: { $eq: this.data.record._id } } },
      data: {
        approver: { _id: app.global.user._id },
        approve: 'fulfilled',
        approvedAt: Date.now(),
        comment: this.data.comment
      }
    })
    wx.hideLoading()
    wx.navigateBack()
  },

  async onReject() {
    wx.showLoading({ mask: true, title: '提交中', })
    await wx.cloud.models.report.update({
      filter: { where: { _id: { $eq: this.data.record._id } } },
      data: {
        approver: { _id: app.global.user._id },
        approve: 'rejected',
        approvedAt: Date.now(),
        comment: this.data.comment
      }
    })
    wx.hideLoading()
    wx.navigateBack()
  },

})