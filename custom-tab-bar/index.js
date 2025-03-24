const PUBLISH_INDEX = 2; // 假设“发布”按钮在 tabBar 第 3 项（index 从 0 开始）
Component({
  data: {
    active: 0,
    list: [
      { icon: "home-o", text: "首页", url: "/pages/home/home" },
      { icon: "comment-o", text: "论坛", url: "/pages/board/board" },
      { icon: "add-o", text: "发布", url: "/pages/publish/publish", isCenter: true },
      { icon: "cart-o", text: "交易", url: "/pages/deal/deal" },
      { icon: "user-o", text: "我的", url: "/pages/profile/profile" }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      // 从事件对象 e 中，取出当前点击元素（currentTarget）的自定义 data-* 属性，形成一个对象。
      // <view data-index="1" data-path="/pages/message/index"></view>
      /* -->
      {
        index: 1,
        path: "/pages/message/index"
      }
       */
      const data = e.currentTarget.dataset
      const url = data.path
      /*
      调用微信小程序的 API wx.switchTab 来跳转到底部 tabBar 配置里的页面地址。
      ⚠️ 只能跳转到 app.json 中配置过的 tabBar 页面。
      */
     if (data.index === PUBLISH_INDEX) {
      // 跳转发布页面，使用 navigateTo 让页面从右侧滑入
        wx.navigateTo({
          url: '/pages/publish/publish'
        });
      return;
     } else {
        wx.switchTab({url});
        this.setData({
          active: data.index
       });
     }
    },
  },
});
