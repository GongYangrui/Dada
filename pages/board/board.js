// todo: 在这个页面中获取数据库的数据并展示在页面中
/*
result = [
    {
        'id': post.id,
        'cover': post.cover,
        'avatar': post.avatar,
        'nickname': post.nickname,
        'title': post.title,
        'desc': post.content,
        'likeCount': post.like_count,
        'commentCount': post.comment_count,
        'images': post.images,
    }
*/
const { baseURL } = require("../../config");

Page({
  data: {
    postList: [
    ]
  },

  onLoad() {
    this.fetchPosts();
  },

  onPullDownRefresh() {
    this.fetchPosts(() => {
      wx.stopPullDownRefresh(); // 停止刷新动画
    });
  },
  

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1 // 对应 tabBar 中的索引
      });
    }

    this.fetchPosts();

    // const newPost = wx.getStorageSync('newPostData');

    // if (newPost) {
    //   const oldList = wx.getStorageSync('boardPostList') || [];
    //   const updatedList = [newPost, ...oldList];
    //   wx.setStorageSync('boardPostList', updatedList); // 可选，刷新缓存
  
    //   this.setData({
    //     postList: updatedList
    //   });
  
    //   wx.removeStorageSync('newPostData'); // 防止重复加载
    // } else {
    //   // 没新数据，正常加载
    //   const boardList = wx.getStorageSync('boardPostList') || [];
    //   this.setData({
    //     postList: boardList
    //   });
    // }
  },

  fetchPosts(callback) {
    // 接收回调函数，一般在请求完成后触发额外的行为
    const openid = wx.getStorageSync('openid');

    wx.request({
      url: `${baseURL}/api/get_all_posts/?openid=${openid}`,
      method: 'GET',
      success: res => {
        const posts = res.data.posts || [];
        this.setData({ postList: posts });

        if (callback) callback(); // 如果调用这个函数时传入了回调函数，就执行它（比如刷新结束）
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'none' });
        console.error('获取帖子失败:', err);
        if (callback) callback(); // 请求失败也调用回调，避免页面卡住
      }
    });
  },

  // 点赞处理
  onLike(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.postList;
    const item = list[index];

    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const newIsLiked = !item.isLiked;
    item.likeCount += newIsLiked ? 1 : -1;
    item.isLiked = newIsLiked;
    item.animating = true;

    this.setData({ postList: list });
  
  
    // 一段时间后移除动画 class，防止重复加不生效
    setTimeout(() => {
      list[index].animating = false;
      this.setData({ postList: list });
    }, 300);

    wx.request({
      url: `${baseURL}/api/update_like_count/`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        post_id: item.id,
        is_liked: newIsLiked
      },
      success: res => {
        // 如果需要更新 likeCount 以防前端不一致
        list[index].likeCount = res.data.likeCount || list[index].likeCount;
        this.setData({ postList: list });
      },
      fail: err => {
        console.error('点赞失败：', err);
        wx.showToast({ title: '点赞失败', icon: 'none' });
      }
    });
  },

  goToDetail(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/postDetail/postDetail?id=${postId}`
    });
  }
  
  
  

  // 其他交互方法...
})