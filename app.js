// app.js
// app.js
App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    wx.getUserProfile({
      desc: '用于展示昵称',
      success: res => {
        this.globalData.userInfo = res.userInfo;

        // 也可以同时缓存到本地，防止刷新丢失
        wx.setStorageSync('userInfo', res.userInfo);
      },
      fail: () => {
        console.warn('用户拒绝授权');
      }
    });
  }
});

