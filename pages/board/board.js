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
        commentCount: 389
      },
      {
        cover: 'https://img95.699pic.com/photo/50290/6402.jpg_wh860.jpg',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39
      },
      {
        cover: 'https://img95.699pic.com/photo/32152/5592.jpg_wh300.jpg!/fh/300/quality/90',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39
      },{
        cover: 'https://wenhui.whb.cn/u/cms/www/201905/01232221ygrs.jpg',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39
      },
      {
        cover: 'https://img95.699pic.com/element/40194/6514.png_860.png',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39
      },
      {
        cover: 'https://n.sinaimg.cn/sinakd202162s/600/w1920h1080/20210602/ae52-kquziik4831577.jpg',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39
      },
      {
        cover: 'https://img95.699pic.com/element/40138/0502.png_860.png',
        avatar: 'https://example.com/avatar2.jpg',
        username: '不吃香菜',
        title: '最有效的五个实战羽毛球技巧',
        desc: '最有效的五个实战羽毛球技巧如下所示...',
        likeCount: 256,
        commentCount: 39
      },
      // 更多测试数据...
    ]
  },

  onLoad() {
    // 这里可以添加数据请求逻辑
  },

  // 点赞处理
  handleLike(e) {
    const index = e.currentTarget.dataset.index
    const postList = this.data.postList
    postList[index].likeCount += postList[index].isLiked ? -1 : 1
    postList[index].isLiked = !postList[index].isLiked
    this.setData({ postList })
  },

  // 其他交互方法...
})