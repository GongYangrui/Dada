Page({
  data: {
    post: {},
    members: [],
    maxPeople: null,
    hasJoined: false,
    remain: [] // 用来渲染空位
  },

  onLoad(options) {
    console.log((options.post));
    let post = {};
    if (options.post) {
      try {
        post = JSON.parse(decodeURIComponent(options.post));
      } catch (e) {
        console.error('解析 post 参数失败', e);
      }
    }
  
    const userInfo = wx.getStorageSync('userInfo') || {
      nickName: '微信用户',
      avatarUrl: '/images/default-avatar.png'
    };
  
    const starter = {
      nickname: post.nickname || '微信用户',
      avatar: post.avatarUrl || '/images/default-avatar.png'
    };
  
    const members = [starter];
  
    const hasJoined = members.some(
      m => m.nickname === userInfo.nickName
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
    if (this.data.hasJoined || this.data.members.length >= this.data.maxPeople) return;

    const userInfo = wx.getStorageSync('userInfo') || {
      nickName: '微信用户',
      avatarUrl: '/images/default-avatar.png'
    };

    const newMember = {
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl
    };

    const updated = [...this.data.members, newMember];

    this.setData({
      members: updated,
      hasJoined: true
    }, this.updateRemain);
  }
});
