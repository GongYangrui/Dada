Page({
    data: {
      products: [
        {
          image: 'https://example.com/image1.jpg',
          description: '商品1简短描述',
          brand: '品牌1',
          model: '型号1',
          price: '199.99'
        },
        {
          image: 'https://example.com/image2.jpg',
          description: '商品2简短描述',
          brand: '品牌2',
          model: '型号2',
          price: '299.99'
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
    }
  });
  