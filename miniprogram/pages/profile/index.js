const { updateUser } = require("../../utils/utils")

const app = getApp()

Page({
  data: {
    role: app.global.user.role,
    profile: {
      avatar: '',
      name: '',
      phone: '',
      org_name: '',
      org_street: '1,2',
      street: [],
    },
    title: {
      name: '名字',
      phone: '手机号',
      org_name: '所属单位',
      org_street: '所属街道',
    },
    streetVisible: false,
    streetValue: [],
    streets: [
      { label: '万新街（临空经济区）', value: '0' },
      { label: '张贵庄街', value: '1' },
      { label: '华明街（华明高新区）', value: '2' },
      { label: '华新街', value: '3' },
      { label: '东丽开发区', value: '4' },
      { label: '丰年街', value: '5' },
      { label: '军粮城街', value: '6' },
      { label: '金桥街', value: '7' },
      { label: '金钟街', value: '8' },
      { label: '东丽湖街', value: '9' },
      { label: '无瑕街', value: '10' },
      { label: '新立街', value: '11' },
    ]
  },

  async onReady() {
    console.log(app.global.user);
    wx.showLoading({ mask: true, title: '加载中' })
    this.setData({ profile: app.global.user })
    wx.hideLoading()
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar(tabBar => {
        tabBar.setData({ value: 'profile' })
      })
    }
  },

  async updateUser(key, value) {
    const { _id } = app.global.user
    await wx.cloud.models.user.update({
      filter: { where: { _id: { $eq: _id } } },
      data: { [key]: value }
    })
    app.global.user[key] = value
    wx.setStorageSync('user', app.global.user)
  },

  async onChooseAvatar(e) {
    const avatar = e.detail.avatarUrl
    this.setData({ 'profile.avatar': avatar })
    const { fileID } = await wx.cloud.uploadFile({
      filePath: avatar,
      cloudPath: avatar.split('/').at(-1),
    })
    this.updateUser('avatar', fileID)
  },

  async onCellClick(e) {
    const key = e.currentTarget.dataset.key
    const res = await wx.navigateTo({
      url: '/pages/me/index',
      events: { opened: this.onOpened.bind(this) }
    })
    res.eventChannel.emit('opener', {
      key,
      value: this.data.profile[key],
      title: this.data.title[key]
    })
  },

  onOpened({ key, value }) {
    this.setData({ [`profile.${key}`]: value })
    this.updateUser(key, value)
  },

  onStreetClick() {
    this.setData({ streetVisible: true })
  },

  onStreetChange(e) {
    this.setData({
      streetVisible: false,
      'profile.street': e.detail.value,
      'profile.org_street': e.detail.label[0]
    })
    this.updateUser('street', e.detail.value)
    this.updateUser('org_street', e.detail.label[0])
  },

  onLogout() {
    app.global.user = {}
    wx.clearStorageSync()
    wx.reLaunch({ url: '/pages/login/index' })
  }

})