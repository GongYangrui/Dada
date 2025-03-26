Component({
  data: {
    show: false
  },

  lifetimes: {
    attached() {
      const userInfo = wx.getStorageSync('userInfo');
      if (!userInfo) {
        this.setData({ show: true });
      }
    }
  },

  methods: {
    onGetUserProfile() {
      wx.getUserProfile({
        desc: '用于展示昵称和头像',
        success: res => {
          const userInfo = res.userInfo;
          getApp().globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);
          this.setData({ show: false });
          this.triggerEvent('authorized', userInfo); // 可通知父页面
        },
        fail: () => {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          });
        }
      });
    }
  }
});
