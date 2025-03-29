const { baseURL } = require('../../config');

Page({
  data: {
    avatar: "https://img.yzcdn.cn/vant/cat.jpeg",
    nickName: "微信用户",
    gender: "保密",
    phonePrivate: "155****5555",
    phone: null,
    dorm: null,
    building: null,
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
          const newName = res.content.trim();
          const openid = wx.getStorageSync('openid');
          that.updateUserInfoField('nickName', newName);

          wx.request({
            url: `${baseURL}/api/login/`,
            method: 'POST',
            data: {
              openid,
              nickName: newName
            },
            success: res => {
              wx.showToast({ title: '修改成功', icon: 'success' });
            },
            fail: () => {
              wx.showToast({ title: '修改失败', icon: 'none' });
            }
          });
        }
      }
    });
  },
  

  selectGender() {
    const genders = ["男", "女", "保密"];
    wx.showActionSheet({
      itemList: genders,
      success: res => {
        const selectedGender = genders[res.tapIndex];
        const openid = wx.getStorageSync('openid');

        this.updateUserInfoField('gender', selectedGender);

        wx.request({
          url: `${baseURL}/api/login/`,
          method: 'POST',
          data: {
            openid,
            gender: selectedGender
          },
          success: () => {
            wx.showToast({ title: '性别已更新', icon: 'success' });
          },
          fail: () => {
            wx.showToast({ title: '更新失败', icon: 'none' });
          }
        });
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
          const openid = wx.getStorageSync('openid');
          this.setData({
            phonePrivate: full.slice(0, 3) + '****' + full.slice(7),
          });
          this.updateUserInfoField('phone', full); // 保存完整手机号

          wx.request({
            url: `${baseURL}/api/login/`,
            method: 'POST',
            data: {
              openid,
              phone: full
            },
            success: () => {
              wx.showToast({ title: '手机号已更新', icon: 'success' });
            },
            fail: () => {
              wx.showToast({ title: '更新失败', icon: 'none' });
            }
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

  onClose() {
    this.setData({
      showAddressPicker: false
    });
  },
  
  onAddressSelect(e) {
    const selected = e.detail.selectedOptions.map(i => i.text).join(" - ");
    const selectedOptions = e.detail.selectedOptions;
    const dorm = selectedOptions[0]?.text || '';
    const building = selectedOptions[1]?.text || '';
    const address = `${dorm} - ${building}`;
    const openid = wx.getStorageSync('openid');
    this.setData({
      address: address,
      showAddressPicker: false
    });
    this.updateUserInfoField('dorm', dorm);
    this.updateUserInfoField('building', building);

    wx.request({
      url: `${baseURL}/api/login/`,
      method: 'POST',
      data: {
        openid,
        dorm,
        building
      },
      success: res => {
        wx.showToast({ title: '地址已更新', icon: 'success' });
      },
      fail: () => {
        wx.showToast({ title: '更新失败', icon: 'none' });
      }
    });
  },


  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 4 // 对应 tabBar 中的索引
      });
    }
  },

  onLoad() {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({ title: '未登录', icon: 'none' });
      return;
    }
    wx.request({
      url: `${baseURL}/api/user_info/?openid=${openid}`,
      method: 'GET',
      success: res => {
        const data = res.data; // 从响应中取出用户信息数据
  
        // 拼接地址用于展示
        const address = data.dorm && data.building ? `${data.dorm} - ${data.building}` : '';
        this.setData({
          avatar: data.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg',
          nickName: data.nickname || '微信用户',
          gender: data.gender || '保密',
          phonePrivate: data.phone ? data.phone.slice(0, 3) + '****' + data.phone.slice(7) : '',
          phone: data.phone || '',
          dorm: data.dorm || '',
          building: data.building || '',
          address
        });
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'none' });
        console.error('获取用户信息失败:', err);
      }
    });
  },

  updateUserInfoField(field, value) {
    // 更新 data 中对应字段（如果有）
    this.setData({ [field]: value });
  
    // 更新全局变量
    const app = getApp();
    if (!app.globalData.userInfo) {
      app.globalData.userInfo = {};
    }
    app.globalData.userInfo[field] = value;
  
    // 更新本地缓存
    const userInfo = wx.getStorageSync('userInfo') || {};
    userInfo[field] = value;
    wx.setStorageSync('userInfo', userInfo);
  }
  
});
