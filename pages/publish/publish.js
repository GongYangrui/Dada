import Notify from '@vant/weapp/notify/notify';
// pages/publish/publish.js
Page({
  data: {
    activeKey: 0,
  },

  onLoad(options) {
    // 页面加载时执行
  },

  onReady() {
    // 页面初次渲染完成时执行
  },

  onShow() {
    // 页面显示时执行
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 2 // 对应 tabBar 中的索引
      });
    }
  },

  onHide() {
    // 页面隐藏时执行
  },

  onUnload() {
    // 页面卸载时执行
  },

  // 发布约球卡片
  onSidebarChange(event) {
    this.setData({
      activeKey: event.detail
    })
  },

    // 接收子组件传来的 finalData
    onFormSubmit(e) {
      const finalData = e.detail; // e.detail 就是子组件 triggerEvent 传来的数据
      console.log('接收到发布数据：', finalData);
  
      let targetUrl = '';
      switch (this.data.activeKey) {
        case 0:
          targetUrl = '/pages/home/home';
          break;
        case 1:
          targetUrl = '/pages/board/board';
          break;
        case 2:
          targetUrl = '/pages/deal/deal';
          break;
        default:
          wx.navigateBack();
          return;
      }
      
      wx.setStorageSync('newPostData', finalData); // 存储到本地
      wx.switchTab({ url: targetUrl });
    }
})