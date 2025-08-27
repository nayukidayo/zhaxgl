import { getMaxDate } from '../../../utils/utils'

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
  nomore: false,

  onSearch() {
    this.onRefresh()
  },

  onApproveChange(e) {
    this.setData({
      'status.value': e.detail.value
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

  async onRefresh() {
    this.setData({ isRefresh: true })
    await this.loadPageOne()
    this.setData({ isRefresh: false })
  },

  async onLower() {
    if (this.nomore) return
    this.pageNumber++
    this.setData({ isLower: true })
    const records = await this.loadPage()
    this.nomore = records.length < this.pageSize
    this.setData({
      records: this.data.records.concat(records),
      isLower: false,
    })
  },

  async onRecordTap(e) {
    const id = e.mark.id
    console.log(id);
    // const a = await wx.cloud.models.b.list({
    //   filter: { where: { _id: { $eq: 'C1ECBX97RS' } } },
    //   select: { c: { name: true } }
    // })
    // console.log(a);
  },

  onShow() {
    // if (typeof this.getTabBar === 'function') {
    //   this.getTabBar().setData({ value: 'report' })
    // }
    // this.onRefresh()
  },

  async loadPageOne() {
    this.nomore = false
    this.pageNumber = 1
    const records = await this.loadPage()
    this.setData({ records })
  },

  async loadPage() {
    // await new Promise(res => setTimeout(res, 300))
    return [
      {
        _id: Math.random().toString(),
        company: '无脑妇女我看妇女窝囊废',
        approve: 'tbd',
        publishedAt: Date.now()
      },
      {
        _id: Math.random().toString(),
        company: '无脑妇女我看妇女窝囊废无脑妇女我看妇女窝囊废无脑妇女我看妇女窝囊废无脑妇女我看妇女窝囊废',
        approve: 'ok',
        publishedAt: Date.now()
      },
    ]
    const start = new Date(this.data.start.value).getTime()
    const date = new Date(this.data.end.value)
    date.setMonth(date.getMonth() + 1)
    const end = date.getTime()
    const and = [
      { publish: { $eq: true } },
      { publishStreet: { $in: app.global.user.street_code } },
      { createdAt: { $gte: start } },
      { createdAt: { $lt: end } },
    ]
    const status = this.data.status.value
    if (status !== 'all') {
      and.push({ approve: { $eq: status } })
    }
    // const serach = this.data.search
    // if (serach) {
    //   and.push({})
    // }
    const { data } = await wx.cloud.models.reports.list({
      filter: { where: { $and: and } },
      orderBy: [{ createdAt: 'desc' }],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    })
    return data.records
  },

})