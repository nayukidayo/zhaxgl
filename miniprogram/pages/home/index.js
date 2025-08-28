import { getMaxDate, toStartEnd } from '../../utils/utils'

const app = getApp()
const max = getMaxDate()

Page({
  data: {
    date: {
      visible: false,
      value: max,
      start: '2025-01',
      end: max,
    },
    records: [],
    isRefresh: false,
    isLower: false,
  },

  pageSize: 10,
  pageNumber: 1,
  hasNextPage: false,

  onDateClick() {
    this.setData({ 'date.visible': true })
  },

  onDateChange(e) {
    this.setData({
      'date.visible': false,
      'date.value': e.detail.value,
    }, () => this.onRefresh())
  },

  async onAddClick() {
    try {
      wx.showLoading({ mask: true, title: '加载中' })
      const { data } = await wx.cloud.models.huibao.create({
        data: { company: { _id: app.global.user.company[0]._id } }
      })
      wx.hideLoading()
      wx.navigateTo({ url: '/pages/report/index?report=' + data.id })
    } catch (err) {
      wx.showToast({ mask: true, icon: 'error', title: '新建失败' })
      console.log(err)
    }
  },

  onEdit(e) {
    wx.navigateTo({ url: '/pages/report/index?report=' + e.mark.id })
  },

  // async onDelete(e) {
  //   const { index } = e.mark
  //   const { records } = this.data
  //   const res = await wx.showModal({ title: '确认删除' })
  //   if (!res.confirm) return
  //   await wx.cloud.models.huibao.delete({
  //     filter: { where: { _id: { $eq: records[index]._id } } }
  //   })
  //   records.splice(index, 1)
  //   this.setData({ records })
  // },

  async onRefresh() {
    this.setData({ isRefresh: true })
    await this.loadPageOne()
    this.setData({ isRefresh: false })
  },

  async onLower() {
    if (!this.hasNextPage) return
    this.pageNumber++
    this.setData({ isLower: true })
    const records = await this.loadPage()
    this.setData({
      isLower: false,
      records: this.data.records.concat(records),
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'home' })
    }
    this.onRefresh()
  },

  async loadPageOne() {
    this.pageNumber = 1
    const records = await this.loadPage()
    this.setData({ records })
  },

  async loadPage() {
    const { start, end } = toStartEnd(this.data.date.value)
    const relateWhere = { company: { where: { staffPhone: { $eq: app.global.user.phone } } } }
    const where = { $and: [{ createdAt: { $gte: start } }, { createdAt: { $lt: end } }] }
    const { data } = await wx.cloud.models.huibao.list({
      filter: { relateWhere, where },
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      orderBy: [{ createdAt: 'desc' }],
      select: { company: { name: true, staffName: true }, publish: true, publishedAt: true, approve: true, createdAt: true, },
    })
    this.hasNextPage = data.records.length === this.pageSize
    return data.records
  },
})