const { baseURL } = require('../../config');
Page({
    data: {
      products: [
      ]
    },
  
    viewProductDetails(event) {
      const productId = event.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/dealDetail/dealDetail?id=${productId}`
      });
    },

    onShow() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          active: 3 // 对应 tabBar 中的索引
        });
      }
      this.fetchProducts();
    },

    fetchProducts() {
      wx.request({
        url: `${baseURL}/api/get_all_deal_items/`, // 后端返回所有商品的接口
        method: 'GET',
        success: res => {
          this.setData({
            products: res.data
          });
        },
        fail: err => {
          console.error('获取交易商品失败', err);
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      });
    },
  });
  