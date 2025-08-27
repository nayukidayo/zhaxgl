import kinds from '../../utils/kinds'

const app = getApp()

Page({
  data: {
    admin: {
      isAdmin: app.global.user.role === 'admin',
      approve: 'ok',
      approveMsg: '',
    },
    titles: [],
    record: null,
  },

  async onKindClick(e) {
    const report = this.data.record._id
    const kind = `kind${e.mark.index + 1}`
    wx.navigateTo({ url: `/pages/report/kind/index?report=${report}&kind=${kind}` })
  },

  async onSubmitTap() {
    try {
      wx.showLoading({ mask: true, title: '提交中' })
      await wx.cloud.models.reports.update({
        filter: { where: { _id: { $eq: this.report } } },
        data: { publish: true, publishedAt: Date.now() },
      })
      wx.navigateBack()
    } catch (err) {
      wx.showToast({ mask: true, icon: 'error', title: '提交失败' })
      console.log(err)
    }
  },

  onApproveChange(e) {
    this.setData({ 'admin.approve': e.detail.value })
  },

  onApproveMsgChange(e) {
    this.setData({ 'admin.approveMsg': e.detail.value })
  },

  async onSaveTap() {
    try {
      wx.showLoading({ mask: true, title: '提交中' })
      await wx.cloud.models.reports.update({
        filter: { where: { _id: { $eq: this.report } } },
        data: {
          approve: this.data.admin.approve,
          approveMsg: this.data.admin.approveMsg,
          approvedAt: Date.now(),
          approveBy: { _id: app.global.user._id },
        }
      })
      wx.navigateBack()
    } catch (err) {
      wx.hideLoading()
      console.log(err)
    }
  },

  async onLoad({ report }) {
    this.report = report
    const titles = Array.from({ length: 5 }, (_, i) => {
      return kinds[`kind${i + 1}`].title
    })
    const { data } = await wx.cloud.models.reports.get({
      filter: { where: { _id: { $eq: report } } },
      select: { publish: true, publishedAt: true, author: { name: true }, approve: true, approvedAt: true, approveMsg: true, approveBy: { name: true } }
    })
    this.setData({ titles, record: data })
  },
})
