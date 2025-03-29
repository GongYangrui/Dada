// app.js
const { baseURL } = require('./config');


App({
  globalData: {
    userInfo: {
      nickName: '',
      avatar: '',
      gender: '',
      phone: '',
      dorm: '',
      building: ''
    },
    openid: null,
  },

  onLaunch() {
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    console.log("缓存的openid", openid);
    console.log("缓存的用户数据", userInfo);
  // 用 setTimeout 确保跳转在页面栈准备后进行
    setTimeout(() => {
      if (openid && userInfo) {
        wx.reLaunch({ url: '/pages/home/home' });
      } else {
        wx.reLaunch({ url: '/pages/login/login' });
      }
    }, 300); // 延迟 300ms 一般比较保险
  }
});
