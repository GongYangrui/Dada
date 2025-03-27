Component({
  data: {
    form: {
      title: '',
      description: '',
      price: '',
      contact: '',
      images: []
    }
  },

  methods: {
    onTitleInput(e) {
      this.setData({ 'form.title': e.detail.value });
    },
    onDescInput(e) {
      this.setData({ 'form.description': e.detail.value });
    },
    onPriceInput(e) {
      this.setData({ 'form.price': e.detail.value });
    },
    onContactInput(e) {
      this.setData({ 'form.contact': e.detail.value });
    },
    onChooseImage() {
      wx.chooseMedia({
        count: 3,
        mediaType: ['image'],
        success: res => {
          const paths = res.tempFiles.map(f => f.tempFilePath);
          this.setData({
            'form.images': this.data.form.images.concat(paths)
          });
        }
      });
    },
    onSubmit() {
      const { title, description, price, contact, images } = this.data.form;

      if (!title || !description || !price || !contact) {
        wx.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
      }

      const userInfo = wx.getStorageSync('userInfo') || {};
      const product = {
        title,
        description,
        price,
        contact,
        image: images.length > 0 ? images[0] : '/images/default-image.png',
        avatar: userInfo.avatarUrl || '/images/default-avatar.png',
        seller: userInfo.nickName || '匿名用户'
      };

      this.triggerEvent('submit', product);
      wx.showToast({ title: '发布成功', icon: 'success' });

      setTimeout(() => {
        wx.switchTab({ url: '/pages/deal/deal' });
      }, 800);
    }
  }
});
