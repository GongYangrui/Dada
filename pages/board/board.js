Page({
  data: {
    postList: [
      {
        cover: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.vCJQr-Gl9BW1VBwfGZ9CJgHaEo?rs=1&pid=ImgDetMain',
        avatar: 'https://example.com/avatar1.jpg',
        username: '小妾要努力',
        title: '春季羽毛球穿搭指南',
        desc: '今年春天最值得入手的5件羽毛球单品...',
        likeCount: 2356,
        commentCount: 389,
        isLiked: false
      },
      {
        cover: 'https://img95.699pic.com/photo/50290/6402.jpg_wh860.jpg',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39,
        isLiked: false
      },
      {
        cover: 'https://img95.699pic.com/photo/32152/5592.jpg_wh300.jpg!/fh/300/quality/90',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39,
        isLiked: false
      },{
        cover: 'https://wenhui.whb.cn/u/cms/www/201905/01232221ygrs.jpg',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39,
        isLiked: false
      },
      {
        cover: 'https://img95.699pic.com/element/40194/6514.png_860.png',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39,
        isLiked: false
      },
      {
        cover: 'https://n.sinaimg.cn/sinakd202162s/600/w1920h1080/20210602/ae52-kquziik4831577.jpg',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39,
        isLiked: false
      },
      {
        cover: 'https://img95.699pic.com/element/40138/0502.png_860.png',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39,
        isLiked: false
      },
      // 更多测试数据...
    ]
  },

  onLoad() {
    const existing = wx.getStorageSync('boardPostList');
    if (!existing || existing.length === 0) {
      wx.setStorageSync('boardPostList', this.data.postList);
    }
  },
  

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        active: 1 // 对应 tabBar 中的索引
      });
    }

    const newPost = wx.getStorageSync('newPostData');

    if (newPost) {
      const oldList = wx.getStorageSync('boardPostList') || [];
      const updatedList = [newPost, ...oldList];
      wx.setStorageSync('boardPostList', updatedList); // 可选，刷新缓存
  
      this.setData({
        postList: updatedList
      });
  
      wx.removeStorageSync('newPostData'); // 防止重复加载
    } else {
      // 没新数据，正常加载
      const boardList = wx.getStorageSync('boardPostList') || [];
      this.setData({
        postList: boardList
      });
    }
  },

  // 点赞处理
  onLike(e) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.postList;
  
    const item = list[index];
    if (item.isLiked) {
      item.likeCount--;
    } else {
      item.likeCount++;
    }
    item.isLiked = !item.isLiked;
  
    // 点赞时加动画 class
    item.animating = true;
    this.setData({ postList: list });
  
    // 一段时间后移除动画 class，防止重复加不生效
    setTimeout(() => {
      list[index].animating = false;
      this.setData({ postList: list });
    }, 300);
  }
  
  

  // 其他交互方法...
})