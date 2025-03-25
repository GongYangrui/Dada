// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    matchList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.setData({
    //   matchList: [
    //     {
    //       id: 1,
    //       title: "羽毛球约战（双打）",
    //       location: "华中体育中心",
    //       field: "3号场地",
    //       time: "3/22/2025 19:00-21:00",
    //       people: "3 / 4人",
    //       user: "小明",
    //       note: "只限女生"
    //     },
    //     {
    //       id: 2,
    //       title: "羽毛球约战（单打）",
    //       location: "奥体中心",
    //       field: "5号场地",
    //       time: "3/23/2025 14:00-16:00",
    //       people: "1 / 2人",
    //       user: "阿强",
    //       note: "欢迎男生"
    //     }
    //   ]
    // })
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

    const newPost = wx.getStorageSync('newPost');
    if (newPost) {
      // 把新内容插入你的列表
      this.setData({
        matchList: [newPost, ...this.data.matchList]
      });
      // 清除缓存，避免重复添加
      wx.removeStorageSync('newPost');
    }
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

  }
})