Page({
  data: {
    avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
    name: "微信用户",
    gender: "保密",
    phone: "155****5555",
    address: '',
    showAddressPicker: false,
    options: [
      {
        text: "韵苑学生公寓",
        children: Array.from({ length: 28 }, (_, i) => ({
          text: `${i + 1}栋`,
          value: `yunyuan-${i + 1}`
        }))
      },
      {
        text: "沁苑学生公寓",
        children: Array.from({ length: 8 }, (_, i) => ({
          text: `${i + 1}栋`,
          value: `qinyuan-${i + 1}`
        }))
      }
    ]
  },

  changeAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: res => {
        this.setData({
          avatar: res.tempFiles[0].tempFilePath
        });
      }
    });
  },

  editName() {
    const that = this;
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入昵称',
      success(res) {
        if (res.confirm && res.content.trim()) {
          that.setData({ name: res.content.trim() });
        }
      }
    });
  },
  

  selectGender() {
    wx.showActionSheet({
      itemList: ["男", "女", "保密"],
      success: res => {
        const genders = ["男", "女", "保密"];
        this.setData({ gender: genders[res.tapIndex] });
      }
    });
  },

  editPhone() {
    wx.showModal({
      title: "输入手机号",
      editable: true,
      placeholderText: "请输入手机号",
      success: res => {
        if (res.confirm && /^1\d{10}$/.test(res.content.trim())) {
          const full = res.content.trim();
          this.setData({
            phone: full.slice(0, 3) + '****' + full.slice(7)
          });
        } else if (res.confirm) {
          wx.showToast({ title: '格式错误', icon: 'none' });
        }
      }
    });
  },

  editAddress() {
    this.setData({ showAddressPicker: true });
  },

  onAddressSelect(e) {
    const selected = e.detail.selectedOptions.map(i => i.text).join(" - ");
    this.setData({
      address: selected,
      showAddressPicker: false
    });
  },

  onClose() {
    this.setData({ showAddressPicker: false });
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 4 // 对应 tabBar 中的索引
      });
    }
  }
});
