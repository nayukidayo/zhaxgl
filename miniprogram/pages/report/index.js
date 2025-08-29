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

  async onPublishTap() {
    try {
      wx.showLoading({ mask: true, title: '提交中' })
      await wx.cloud.models.huibao.update({
        filter: { where: { _id: { $eq: this.report } } },
        data: {
          publish: true,
          publishedAt: Date.now(),
          publishBy: app.global.user.name,
          publishPhone: app.global.user.phone,
        },
      })
      wx.hideLoading()
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

  async onApproveTap() {
    try {
      wx.showLoading({ mask: true, title: '提交中' })
      await wx.cloud.models.huibao.update({
        filter: { where: { _id: { $eq: this.report } } },
        data: {
          approve: this.data.admin.approve,
          approveMsg: this.data.admin.approveMsg,
          approvedAt: Date.now(),
          approveBy: app.global.user.name,
          approvePhone: app.global.user.phone,
        }
      })
      wx.hideLoading()
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
    const { data } = await wx.cloud.models.huibao.get({
      filter: { where: { _id: { $eq: report } } },
      select: { publish: true, approve: true, approvedAt: true, approveMsg: true, approveBy: true }
    })
    wx.setNavigationBarTitle({ title: data.publish ? '查看汇报' : '编辑汇报' })
    this.setData({ titles, record: data })
  },
})
