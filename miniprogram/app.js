const { init } = require("@cloudbase/wx-cloud-client-sdk");
// MySQL kita s7QmN_{,Eu82

App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-7gil3opk64fd4ba3",
    });
    init(wx.cloud)
  },
  global: {
    user: {}
  }
});
