Page({
    data: {
      products: [
        {
          title: '闲置羽毛球拍转卖',
          description: '八成新，适合新手练习，两只一起买还有赠品~',
          price: '88.00',
          contact: '微信：xxx',
          image: 'https://xxx.com/img1.jpg'
        }
        // 你可以继续添加更多商品
      ]
    },
  
    viewProductDetails(event) {
      const productIndex = event.currentTarget.dataset.index;
      const product = this.data.products[productIndex];
      // 跳转到商品详情页（例如通过 wx.navigateTo）
      wx.navigateTo({
        url: `/pages/product-detail/product-detail?id=${productIndex}`
      });
    },

    onShow() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          active: 3 // 对应 tabBar 中的索引
        });
      }
    
      const newProduct = wx.getStorageSync('newPostData');
    
      if (newProduct) {
        const oldList = this.data.products || [];
        const updatedList = [newProduct, ...oldList];
    
        this.setData({
          products: updatedList
        });
    
        wx.setStorageSync('dealProductList', updatedList); // 可选：持久化保存
        wx.removeStorageSync('newPostData'); // 防止重复添加
      } else {
        // 如果没新发布内容，可以从本地缓存恢复
        const cached = wx.getStorageSync('dealProductList') || this.data.products;
        this.setData({
          products: cached
        });
      }
    }    
  });
  