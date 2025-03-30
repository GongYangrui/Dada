import Notify from '@vant/weapp/notify/notify';
const { baseURL } = require('../../config');
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
  },

  onSubmitRequest(e) {
    const { form } = e.detail;
    const { title, desc, images, nickname, avatar } = form;

    // this.uploadImages(images, (uploadedUrls) => {
    //   console.log('所有上传完成后的地址是：', uploadedUrls);
    // });
  
    const finalPost = {
      title,
      desc,
      images: images,
      cover: images[0] || '/images/default-cover.png',
      avatar,
      nickname,
      likeCount: 0,
      commentCount: 0
    };
    wx.request({
      url: `${baseURL}/api/create_post/`, // 对应后端 create_post 路由
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: finalPost,
      success: res => {
        if (res.statusCode === 200) {
          wx.showToast({ title: '发布成功', icon: 'success' });
          // 可选：跳转到论坛页或清空表单
          wx.reLaunch({ url: '/pages/board/board' });
        } else {
          wx.showToast({ title: '发布失败', icon: 'none' });
          console.error(res.data);
        }
      },
      fail: err => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        console.error('请求失败:', err);
      }
    });
  },
  
})