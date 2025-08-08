const { init } = require("@cloudbase/wx-cloud-client-sdk");

App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-1g13x2oo3d8984d5",
      traceUser: true,
    });
    init(wx.cloud)
  },
});
