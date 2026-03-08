import { TUICallKitAPI } from '../../TUICallKit/TUICallService/index'
import { CallManager } from '../../TUICallKit/TUICallService/serve/callManager'
import * as GenerateTestUserSig from '../../TUICallKit/debug/GenerateTestUserSig-es.js'

const app = getApp()
wx.CallManager = new CallManager()

Page({
  data: {
    name: '',
    phone: '',
    street: '',
    online: false,
  },

  async callTap() {
    try {
      await TUICallKitAPI.calls({ userIDList: [this.data.phone], type: 2, })
    } catch (err) {
      wx.showModal({
        icon: 'none',
        title: '错误',
        content: err.message,
        showCancel: false,
      })
    }
  },

  async refreshTap() {
    const tim = TUICallKitAPI.getTim()
    if (!tim) return
    const res = await tim.getUserProfile({ userIDList: [this.data.phone] })
    this.setData({ online: res.data.length !== 0 })
  },

  async onLoad() {
    const userID = app.global.user.phone
    if (!userID) return
    const { userSig, SDKAppID } = GenerateTestUserSig.genTestUserSig({ userID: userID })
    const street = app.global.user.company[0].street

    const [_, contact] = await Promise.all([
      wx.CallManager.init({
        sdkAppID: SDKAppID,
        userID: userID,
        userSig: userSig,
        globalCallPagePath: 'TUICallKit/pages/globalCall/globalCall',
      }),
      wx.cloud.models.streets.get({
        filter: { where: { name: { $eq: street } } },
        select: { contactName: true, contactPhone: true }
      })
    ])

    this.setData({
      name: contact.data.contactName,
      phone: contact.data.contactPhone,
      street
    })
  },

  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({ value: 'live' })
    }
  },

})