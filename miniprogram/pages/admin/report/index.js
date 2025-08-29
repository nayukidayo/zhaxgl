import { getMaxDate, toStartEnd } from '../../../utils/utils'

const app = getApp()
const max = getMaxDate()

Page({
  data: {
    search: '',
    approve: {
      value: 'tbd',
      options: [
        { value: 'all', label: '全部状态' },
        { value: 'tbd', label: '等待审核' },
        { value: 'ok', label: '审核通过' },
        { value: 'ng', label: '审核驳回' },
      ],
    },
    start: {
      visible: false,
      value: max,
      start: '2025-01',
      end: '',
    },
    end: {
      visible: false,
      value: max,
      start: '',
      end: max,
    },
    records: [],
    isRefresh: false,
    isLower: false,
  },

  pageSize: 10,
  pageNumber: 1,
  hasNextPage: false,

  onSearch() {
    this.onRefresh()
  },

  onApproveChange(e) {
    this.setData({
      'approve.value': e.detail.value
    }, () => this.onRefresh())
  },

  onStartTap() {
    this.setData({
      'start.visible': true,
      'start.end': this.data.end.value,
    })
  },

  onEndTap() {
    this.setData({
      'end.visible': true,
      'end.start': this.data.start.value,
    })
  },

  onStartChange(e) {
    this.setData({
      'start.visible': false,
      'start.value': e.detail.value,
    }, () => this.onSearch())
  },

  onEndChange(e) {
    this.setData({
      'end.visible': false,
      'end.value': e.detail.value,
    }, () => this.onSearch())
  },

  onRecordTap(e) {
    wx.navigateTo({ url: '/pages/report/index?report=' + e.mark.id })
  },

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
      this.getTabBar().setData({ value: 'report' })
    }
    this.onRefresh()
  },

  async loadPageOne() {
    this.pageNumber = 1
    const records = await this.loadPage()
    this.setData({ records })
  },

  async loadPage() {
    const { start, end } = toStartEnd(this.data.start.value, this.data.end.value)
    const where = {
      $and: [
        { publish: { $eq: true } },
        { publishedAt: { $gte: start } },
        { publishedAt: { $lt: end } },
      ]
    }
    if (this.data.approve.value !== 'all') {
      where.$and.push({ approve: { $eq: this.data.approve.value } })
    }
    const street = app.global.user.street.map(v => v.name)
    const relateWhere = { company: { where: { $and: [{ street: { $in: street } }] } } }
    const serach = this.data.search.trim()
    if (serach !== '') {
      relateWhere.company.where.$and.push({ name: { $search: serach } })
    }
    const { data } = await wx.cloud.models.huibao.list({
      filter: { relateWhere, where },
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      orderBy: [{ publishedAt: 'desc' }],
      select: { street: { name: true }, company: { name: true }, publishBy: true, publishedAt: true, approve: true },
      getCount: true
    })
    this.hasNextPage = data.records.length === this.pageSize
    return data.records
  },

})