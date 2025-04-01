const { baseURL } = require('../../config');
Page({
  data: {
    product: {},
    avatar: '',
    nickname: '',
    nativeOpenid: ''
  },


  onLoad(options) {
    const openid = wx.getStorageSync('openid');
    this.setData({ nativeOpenid: openid });


    const id = options.id;
    wx.request({
      url: `${baseURL}/api/get_deal_item/?id=${id}`,
      method: 'GET',
      success: res => {
        this.setData({
          product: res.data
        });
        const openidOfDeal = res.data.openid;
        wx.request({
          url: `${baseURL}/api/user_info/?openid=${openidOfDeal}`,
          method: 'GET',
          success: res => {
            this.setData({
              avatar: res.data.avatar,
              nickname: res.data.nickname
            })
          },
          fail: () => {
            wx.showToast({ title: '原始用户信息加载失败', icon: 'none' });
          }
        })
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  copyContact() {
    const contact = this.data.product.contact;
    if (contact) {
      wx.setClipboardData({
        data: contact,
        success: () => {
          wx.showToast({ title: '已复制联系方式', icon: 'success' });
        }
      });
    }
  },

  markAsSold() {
    const id = this.data.product.id;

    wx.request({
      url: `${baseURL}/api/mark_deal_as_sold/`,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: { id },
      success: res => {
        wx.showToast({ title: '已标记为卖出', icon: 'success' });
        this.setData({
          'product.is_active': false
        });
      },
      fail: () => {
        wx.showToast({ title: '操作失败', icon: 'none' });
      }
    });
  }
  
});
