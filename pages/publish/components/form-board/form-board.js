Component({
  data: {
    form: {
      title: '',
      desc: '',
      images: []
    }
  },

  methods: {
    onTitleInput(e) {
      this.setData({
        'form.title': e.detail.value
      });
    },

    onDescInput(e) {
      this.setData({
        'form.desc': e.detail.value
      });
    },

    onChooseImage() {
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: res => {
          const paths = res.tempFiles.map(f => f.tempFilePath);
          this.setData({
            'form.images': this.data.form.images.concat(paths)
          });
        }
      });
    },


    onSubmit() {
      //  解构数据
      const { title, desc, images } = this.data.form;
      // 从本地缓存中读取用户数据
      const userInfo = wx.getStorageSync('userInfo');
    
      if (!title) {
        wx.showToast({ title: '标题不能为空', icon: 'none' });
        return;
      }
    
      const finalPost = {
        title,
        desc,
        images, // 保留原图数组（也可仅传封面）
        cover: images.length > 0 ? images[0] : '/images/default-cover.png',
        avatar: userInfo?.avatarUrl || '/images/default-avatar.png',
        username: userInfo?.nickName || '匿名用户',
        likeCount: 0,
        commentCount: 0
      };
    
      console.log('发帖数据：', finalPost);
      wx.showToast({ title: '发布成功', icon: 'success' });
    
      // 向父页面/页面发送提交事件
      this.triggerEvent('submit', finalPost);
    }
    
  }
});
