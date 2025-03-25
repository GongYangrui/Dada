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
  }


})