// pages/home/home.js

const { baseURL } = require("../../config");

/**
userInfo: {
  nickName: '',
  avatar: '',
  gender: '',
  phone: '',
  dorm: '',
  building: ''
},
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    matchList: [],
    loading: false
  },

  onJoin(e) {
    const index = e.currentTarget.dataset.index;
    const post = this.data.matchList[index];
    const postStr = encodeURIComponent(JSON.stringify(post));
    wx.navigateTo({
      url: `/pages/detail/detail?post=${postStr}`
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   * 页面加载亟需获取用户的信息，从全局变量或者本地缓存中读取，存在data中备用
   */
  onLoad() {
    const app = getApp();
    let userInfo = app.globalData.userInfo;
  
    // 如果全局变量中没有，再尝试从本地缓存读取
    if (!userInfo || !userInfo.nickName) {
      userInfo = wx.getStorageSync('userInfo') || {};
    }
  
    // 更新到当前页面 data 中
    this.setData({
      userInfo
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 0 // 对应 tabBar 中的索引
      });
    }

    this.fetchActivities(); 
    console.log("首页更新");
  },
  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.fetchActivities();  // 支持下拉刷新
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  /**
   * 获取所有约球信息
   */
  fetchActivities() {
    this.setData({ loading: true });

    wx.request({
      url: `${baseURL}/api/get_all_activities/`,  // ✅ 替换为实际后端地址
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          this.setData({
            matchList: res.data.activities || []
          });
        } else {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('请求失败：', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
        wx.stopPullDownRefresh();  // 停止下拉刷新动画
      }
    });
  }
})