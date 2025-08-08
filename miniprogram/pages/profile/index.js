const { getProfile, updateProfile } = require('../../utils/utils')

Page({
  data: {
    profile: {
      avatar: '',
      name: '',
      phone: '',
      org_name: '',
      org_address: '',
    },
    title: {
      name: '名字',
      phone: '手机号',
      org_name: '所属单位',
      org_address: '单位地址',
    }
  },

  async onReady() {
    wx.showLoading({ mask: true, title: '加载中' })
    const profile = await getProfile()
    this.setData({ profile })
    wx.hideLoading()
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar(tabBar => {
        tabBar.setData({ value: 'profile' })
      })
    }
  },

  async onChooseAvatar(e) {
    const avatar = e.detail.avatarUrl
    this.setData({ 'profile.avatar': avatar })
    const { fileID } = await wx.cloud.uploadFile({
      filePath: avatar,
      cloudPath: avatar.split('/').at(-1),
    })
    await updateProfile('avatar', fileID)
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
    updateProfile(key, value)
  }

})