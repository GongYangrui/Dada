import Toast from '@vant/weapp/toast/toast';
const { baseURL } = require('../../config');
const genderMap = {
  0: '未知',
  1: '男',
  2: '女'
};

/**
  avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
  city: ""
  country: ""
  gender: 0
  is_demote: true
  language: ""
  nickName: "微信用户"
  province: ""
 */

Page({
  data: {
    isAgree: false,
    openid: '',
    phoneNumber: null,
    dorm: null,
    building: null,
    show: false,
    step: 1,
    userInfo: null,
    dormOptions: [
      {
        name: '韵苑学生公寓',
        buildings: [
          '1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋',
          '8栋', '9栋', '10栋', '11栋', '12栋', '13栋', '14栋',
          '15栋', '16栋', '17栋', '18栋', '19栋', '20栋', '21栋',
          '22栋', '23栋', '24栋', '25栋', '26栋', '27栋', '28栋'
        ]
      },
      {
        name: '沁苑学生公寓',
        buildings: [
          '1栋', '2栋', '3栋', '4栋', '5栋', '6栋', '7栋', '8栋'
        ]
      }
    ],
    selectedDormIndex: 0,
    buildingIndex: 0,
    selectedBuilding: ''
  },

  onLoad() {
    // 拿 openid（你前面已经实现过）
    const openid = wx.getStorageSync('openid');
    if (openid) {
      this.setData({ openid });
    }
  },

  onAgreeChange(e) {
    this.setData({ isAgree: e.detail.value.includes('agree') });
  },

  goUserAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/user/user'  // 用户协议页面路径
    });
  },
  
  goPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/agreement/privacy/privacy'  // 隐私政策页面路径
    });
  },
  
  // 打开弹窗
  onQuickLogin() {
    this.setData({ show: true });
  },

  // 关闭弹窗
  onClose() {
    this.setData({ show: false });
  },

  // 第一步：授权头像昵称
  getUserProfileStep() {
    wx.getUserProfile({
      desc: '用于展示头像昵称',
      success: res => {
        Toast.success('授权成功');
        this.setData({
          userInfo: res.userInfo,
          step: 2  // 显示下一步
        });
      },
      fail: () => {
        wx.showToast({ title: '你取消了授权', icon: 'none' });
      }
    });
  },

  // 第二步：获取手机号（e.detail.code）
  getPhoneStep(e) {
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 code 给你后端
          wx.request({
            url: `${baseURL}/api/wechat_login/`,
            method: 'POST',
            data: {
              code: res.code
            },
            success: res => {
              Toast.success('授权成功');
              const openid = res.data.openid;
              this.setData({
                openid: openid,
                step: 3
              });
              // 存入本地缓存 & globalData
              wx.setStorageSync('openid', openid);
              getApp().globalData.openid = openid;
            },
            fail: err => {
              console.error('后端换取 openid 失败:', err);
            }
          });
        } else {
          console.warn('wx.login 获取 code 失败:', res.errMsg);
        }
      }
    });
    const phoneCode = e.detail.code;

    if (!phoneCode) {
      const fakePhone = '13800000000';
      console.warn('当前未获取到 code，使用假手机号:', fakePhone);
      // wx.showToast({ title: '授权手机号失败', icon: 'none' });
      // return;
      this.setData({
        phoneNumber: fakePhone
      });
    }
    // wx.request({
    //   url: `${baseURL}/api/login/`,
    //   method: 'POST',
    //   data: {
    //     openid,
    //     nickname: userInfo.nickName,
    //     avatar: userInfo.avatarUrl,
    //     gender: userInfo.gender === 1 ? '男' : '女',
    //     phone: '模拟手机号', // 后端需解密 phoneCode
    //     dorm: '',
    //     building: ''
    //   },
    //   success: res => {
    //     wx.setStorageSync('userInfo', res.data);
    //     wx.reLaunch({ url: '/pages/home/home' });
    //   },
    //   fail: () => {
    //     wx.showToast({ title: '登录失败', icon: 'none' });
    //   }
    // });
  },

  onDormChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      selectedDormIndex: index,
      selectedBuilding: '',
      buildingIndex: 0
    });
  },

  onBuildingChange(e) {
    const index = parseInt(e.detail.value);
    const name = this.data.dormOptions[this.data.selectedDormIndex].buildings[index];
    this.setData({
      buildingIndex: index,
      selectedBuilding: name
    });
  },

  submitDorm() {
    const dorm = this.data.dormOptions[this.data.selectedDormIndex].name;
    const building = this.data.selectedBuilding;
    const openid = this.data.openid;
    const nickName = this.data.userInfo["nickName"];
    const avatar = this.data.userInfo["avatarUrl"];
    const gender = genderMap[this.data.userInfo["gender"]];
    const phoneNumber = this.data.phoneNumber;

    if (!building) {
      wx.showToast({ title: '请选择宿舍楼栋', icon: 'none' });
      return;
    }
  
    wx.request({
      url: `${baseURL}/api/login/`,
      method: 'POST',
      data: {
        openid,
        nickName,
        avatar,
        gender,
        phoneNumber,
        dorm,
        building
      },
      success: res => {
        wx.showToast({ title: '提交成功', icon: 'success' });
        const userInfo = {
          nickName,
          avatar,
          gender,
          phone: phoneNumber,
          dorm,
          building
        };
        const app = getApp();
        app.globalData.openid = openid;
        app.globalData.userInfo = userInfo;

        wx.setStorageSync('openid', openid);
        wx.setStorageSync('userInfo', userInfo);
        wx.reLaunch({ url: '/pages/home/home' });
      },
      fail: err => {
        wx.showToast({ title: '提交失败', icon: 'none' });
        console.error(err);
      }
    });
  }
  
});
