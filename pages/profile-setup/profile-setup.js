Page({
  data: {
    phone: '',
    dorm: '',
    building: ''
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },
  onDormInput(e) {
    this.setData({ dorm: e.detail.value });
  },
  onBuildingInput(e) {
    this.setData({ building: e.detail.value });
  },

  submit() {
    const { phone, dorm, building } = this.data;
    const openid = wx.getStorageSync('openid');

    if (!phone || !dorm || !building) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    wx.request({
      url: 'https://你的ngrok地址/api/users/update/',
      method: 'POST',
      data: {
        openid,
        phone,
        dorm,
        building
      },
      success: res => {
        wx.showToast({ title: '信息保存成功' });
        wx.switchTab({ url: '/pages/index/index' }); // 跳回首页
      }
    });
  }
});
