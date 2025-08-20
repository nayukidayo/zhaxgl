const { init } = require("@cloudbase/wx-cloud-client-sdk");

App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-7gil3opk64fd4ba3",
    });
    init(wx.cloud)
  },
  global: {
    user: wx.getStorageSync('user') || {}
  }
});
