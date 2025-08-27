import kinds from '../../utils/kinds'

Page({
  data: {
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
