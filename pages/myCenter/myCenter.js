// pages/myCenter/myCenter.js
const { baseURL } = require("../../config");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    pageType: '', // created / joined / posts / deals
    activityList: [],
    postList: [],
    products: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = options.type || 'created'; // 默认展示已发布球局
    const openid = wx.getStorageSync('openid')
    this.setData({ pageType: type , openid: openid}, () => {
      console.log(this.data);
      switch (this.data.pageType) {
        case 'created':
          this.fetchActivities();
          break;
        case 'joined':
          this.fetchActivities();
          break;
        case 'posts':
          this.fetchUserPosts();
          break;
        case 'deals':
          this.fetchUserDeals();
          break;
        default:
          console.warn('未知页面类型:', this.data.pageType);
      }
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

  },

  fetchActivities() {
    wx.request({
      url: `${baseURL}/api/get_all_activities/`,  // ✅ 替换为实际后端地址
      method: 'GET',
      success: res => {
        if (res.statusCode === 200) {
          let list = res.data.activities || [];
          const pageType = this.data.pageType
          if (pageType === 'created') {
            list = list.filter(item => item.openid === this.data.openid);
          } else if (pageType === 'joined') {
            list = list.filter(item => {
              return item.joined && item.joined.some(j => j.openid === this.data.openid);
            });
          }
    
          this.setData({
            activityList: list
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
  },

  onJoin(e) {
    const index = e.currentTarget.dataset.index;
    const post = this.data.activityList[index];
    const postStr = encodeURIComponent(JSON.stringify(post));
    wx.navigateTo({
      url: `/pages/detail/detail?post=${postStr}`
    });
  },

  fetchUserPosts(callback) {
    wx.request({
      url: `${baseURL}/api/get_all_posts/?openid=${this.data.openid}}`,
      method: 'GET',
      success: res => {
        const posts = res.data.posts || [];
        const filteredPosts = posts.filter(post => post.openid === this.data.openid);
        this.setData({ postList: filteredPosts });

        if (callback) callback(); // 如果调用这个函数时传入了回调函数，就执行它（比如刷新结束）
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'none' });
        console.error('获取帖子失败:', err);
        if (callback) callback(); // 请求失败也调用回调，避免页面卡住
      }
    });
  },

  goToDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/postDetail/postDetail?id=${postId}`
    });
  },

  fetchUserDeals() {
    wx.request({
      url: `${baseURL}/api/get_all_deal_items/`, // 后端返回所有商品的接口
      method: 'GET',
      success: res => {
        const filteredDeals = (res.data || []).filter(item => item.openid === this.data.openid);
        this.setData({
          products: filteredDeals
        });
      },
      fail: err => {
        console.error('获取交易商品失败', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  viewProductDetails(event) {
    const productId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/dealDetail/dealDetail?id=${productId}`
    });
  },

})