const { baseURL } = require('../../../../config');

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
      const that = this; // 🔒 锁定 this 避免作用域丢失
    
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: res => {
          const tempPaths = res.tempFiles.map(f => f.tempFilePath);
          if (tempPaths.length === 0) return;
    
          wx.showLoading({ title: '上传中...' });
    
          that.uploadImages(tempPaths, (uploadedUrls = []) => {
            wx.hideLoading();
    
            if (!Array.isArray(uploadedUrls) || uploadedUrls.length === 0) {
              wx.showToast({ title: '图片上传失败', icon: 'none' });
              return;
            }
    
            that.setData({
              'form.images': [...(that.data.form.images || []), ...uploadedUrls]
            });
    
            wx.showToast({ title: '上传成功', icon: 'success' });
          });
        },
        fail: err => {
          console.error('图片选择失败:', err);
          wx.showToast({ title: '选择图片失败', icon: 'none' });
        }
      });
    },
    
    


    onSubmit() {
      const { title, desc, images } = this.data.form;
      const userInfo = wx.getStorageSync('userInfo');
    
      if (!title) {
        wx.showToast({ title: '标题不能为空', icon: 'none' });
        return;
      }
    
      const postData = {
        title,
        desc,
        images,
        nickname: userInfo?.nickName,
        avatar: userInfo?.avatar
      };
    
      this.triggerEvent('submitRequest', { form: postData });
    },

    uploadImages(paths, callback) {
      const uploaded = [];
      let index = 0;
    
      const uploadNext = () => {
        if (index >= paths.length) {
          callback(uploaded); // 所有上传完成
          return;
        }
    
        wx.uploadFile({
          url: `${baseURL}/utils/upload_image/`,
          filePath: paths[index],
          name: 'image',
          success: res => {
            try {
              const data = JSON.parse(res.data);
              if (data.url) {
                uploaded.push(data.url);
              } else {
                console.warn('上传成功但无 URL');
              }
            } catch (e) {
              console.error('解析失败:', e);
            }
          },
          fail: err => {
            console.error('上传失败:', err);
          },
          complete: () => {
            index++;
            uploadNext(); // 上传下一张
          }
        });
      };
    
      uploadNext(); // 开始第一个
    }
    
  },
  
});
