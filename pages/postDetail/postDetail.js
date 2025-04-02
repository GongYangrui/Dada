// pages/postDetail/postDetail.js
const { baseURL } = require('../../config');

Page({
  data: {
    post: {
      images: [],
      avatar: '',
      nickname: '',
      title: '',
      content: '',
      comments: [], // 后期扩展评论
      commentCount: 0,
      likeCount: 0,
      is_liked: false
    },
    newComment: '',
    parentId: null,
    replyToNickname: '', // 显示“回复@xxx”
  },

  onLoad(options) {
    const postId = options.id;
    const openid = wx.getStorageSync('openid');
    this.fetchPostDetail(postId, openid);
  },

  onLike(e) {
    const post = this.data.post;
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }

    const newIsLiked = !post.is_liked;
    const newCount = post.likeCount + (newIsLiked ? 1 : -1);

    this.setData({
      "post.is_liked": newIsLiked,
      "post.likeCount": newCount
    });

    wx.request({
      url: `${baseURL}/api/update_like_count/`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        openid: openid,
        post_id: this.data.post.id,
        is_liked: this.data.post.is_liked
      },
      success: res => {
        // 如果需要更新 likeCount 以防前端不一致
        this.setData({
          likeCount: res.data.likeCount || post.likeCount
        });
      },
      fail: err => {
        console.error('点赞失败：', err);
        wx.showToast({ title: '点赞失败', icon: 'none' });
      }
    });
  },

  submitComment() {
    const content = this.data.newComment.trim();
    const post_id = this.data.post.id;
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
  
    if (!content) {
      wx.showToast({ title: '评论不能为空', icon: 'none' });
      return;
    }
  
    wx.request({
      url: `${baseURL}/api/submit_comment/`,
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        post_id,
        openid,
        nickname: userInfo.nickName,
        avatar: userInfo.avatar,
        content,
        parent_id: this.data.parentId
      },
      success: res => {
        wx.showToast({ title: '评论成功', icon: 'success' });
        this.setData({
          newComment: '',
          parentId: null,
          replyToNickname: ''
        });
        // 清空输入框 & 重新加载帖子详情
        this.fetchPostDetail(post_id, openid);
      },
      fail: () => {
        wx.showToast({ title: '评论失败', icon: 'none' });
      }
    });
  },

  onInput(e) {
    this.setData({
      newComment: e.detail.value
    });
  },

  fetchPostDetail(postId, openid) {
    wx.request({
      url: `${baseURL}/api/get_post_detail/?id=${postId}&openid=${openid}`,
      method: 'GET',
      success: res => {
        this.setData({
          post: res.data
        });
        this.fetchComments(postId);
      },
      fail: () => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  // 回复父评论 记录父评论的id和nickname
  startReply(e) {
    const { id, nickname } = e.currentTarget.dataset;
    this.setData({
      parentId: id,
      replyToNickname: nickname
    });
  },

  cancelReply() {
    this.setData({
      parentId: null,
      replyToNickname: '',
    });
  },

  fetchComments(postId) {
    wx.request({
      url: `${baseURL}/api/get_post_comments/?post_id=${postId}`,
      method: 'GET',
      success: res => {
        this.setData({
          'post.comments': res.data.comments
        });
      },
      fail: () => {
        wx.showToast({ title: '加载评论失败', icon: 'none' });
      }
    });
  }

});
