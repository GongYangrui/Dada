Page({
  data: {
    post: {},
    members: [],
    maxPeople: null,
    hasJoined: false,
    remain: [] // 用来渲染空位
  },

  onLoad(options) {
    let post = {};
    if (options.post) {
      try {
        post = JSON.parse(decodeURIComponent(options.post));
      } catch (e) {
        console.error('解析 post 参数失败', e);
      }
    }

    const members = (post.joined || []).map(item => ({
      nickname: item.nickname,
      avatar: item.avatar,
    }));
  
    // 判断当前用户是否已经加入球局
    const openid = wx.getStorageSync('openid');
    const hasJoined = (post.joined || []).some(
      member => member.openid === openid
    );
  
    this.setData({
      post,
      members,
      maxPeople: Number(post.people) || null,
      hasJoined
    }, this.updateRemain);
  },
  

  updateRemain() {
    const remain = new Array(this.data.maxPeople - this.data.members.length).fill({});
    this.setData({ remain });
  },

  onJoin() {
    // 能进入到这个函数就说明是有空位或者该用户不在对应的joined中
    const openid = wx.getStorageSync('openid');
    const userInfo = wx.getStorageSync('userInfo');
    const post = this.data.post;

    const newMember = {
      openid: openid,
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl
    };
    const updatedJoined = [...(post.joined || []), newMember];

    const updatedPost = {
      ...post,
      joined: updatedJoined,
      status: updatedJoined.length == post.people ? 'full' : post.status
    };

    wx.request({
      url: `${baseURL}/api/update_activity/`,
      method: 'POST',
      data: updatedPost,
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.statusCode === 200) {
          this.setData({
            post: updatedPost,
            members: updatedPost.joined,
            hasJoined: true
          }, this.updateRemain);
    
          wx.showToast({ title: '加入成功', icon: 'success' });
        } else {
          wx.showToast({ title: res.data.error || '加入失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('加入失败', err);
        wx.showToast({ title: '网络错误', icon: 'none' });
      }
    });
  }

});
