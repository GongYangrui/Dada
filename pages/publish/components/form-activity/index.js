const { baseURL } = require('../../../../config');
Component({
  data: {
    form: {
      title: '',
      date: '',
      time: '',
      people: '',
      tags: []
    },
    venueList: [
      { name: '光谷体育馆 主馆羽毛球场', fields: ['1号场', '2号场', '3号场', '4号场', '5号场', '6号场', '7号场', '8号场', '9号场', '10号场', '11号场', '12号场', '13号场', '14号场', '15号场', '16号场', '17号场', '18号场', '19号场', '20号场', '21号场', '22号场'] },
      { name: '西边体育馆 羽毛球场', fields: ['1号场', '2号场', '3号场', '4号场', '5号场', '6号场', '7号场', '8号场', '9号场'] },
      { name: '游泳馆 二楼羽毛球', fields: ['1号场', '2号场', '3号场', '4号场', '5号场', '6号场', '7号场', '8号场', '9号场'] }
    ],
    selectedVenueIndex: -1,
    fieldList: [],
    selectedFieldIndex: 0,
    timeSlots: ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00','14:00 - 16:00', '16:00 - 18:00','18:00 - 20:00', '20:00 - 22:00',],
    tags: [
      { name: '#友好', selected: false },
      { name: '#高强度', selected: false },
      { name: '#交朋友', selected: false },
      { name: '#比赛练习', selected: false },
      { name: '#教学局', selected: false },
      { name: '#仅限男生', selected: false },
      { name: '#仅限女生', selected: false },
      { name: '#男女均可', selected: false }
    ],
    activeKey: 0
  },

  methods: {
    onTitleChange(e) {
      this.setData({ 'form.title': e.detail.value });
    },

    onVenueChange(e) {
      const index = e.detail.value;
      const fieldList = this.data.venueList[index].fields;
      this.setData({
        selectedVenueIndex: index,
        fieldList,
        selectedFieldIndex: 0
      });
    },

    onFieldChange(e) {
      this.setData({
        selectedFieldIndex: e.detail.value
      });
    },

    onDateChange(e) {
      this.setData({ 'form.date': e.detail.value });
    },

    onTimeChange(e) {
      this.setData({ 'form.time': this.data.timeSlots[e.detail.value] });
    },

    onPeopleChange(e) {
      this.setData({ 'form.people': e.detail.value });
    },

    toggleTag(e) {
      const index = e.currentTarget.dataset.index;
      const tags = this.data.tags;
      tags[index].selected = !tags[index].selected;
      this.setData({ tags });
    },

    onSubmit() {
      const { title, date, time, people } = this.data.form;
      const { selectedVenueIndex, venueList, selectedFieldIndex, tags } = this.data;

      if (!title.trim()) {
        return wx.showToast({ title: '请输入标题', icon: 'none' });
      }
      if (selectedVenueIndex === -1) {
        return wx.showToast({ title: '请选择体育馆', icon: 'none' });
      }
      if (!date) {
        return wx.showToast({ title: '请选择日期', icon: 'none' });
      }
      if (!time) {
        return wx.showToast({ title: '请选择时间段', icon: 'none' });
      }
      if (!people || isNaN(Number(people))) {
        return wx.showToast({ title: '请输入有效人数', icon: 'none' });
      }

      const selectedTags = tags.filter(tag => tag.selected).map(tag => tag.name);
      const venue = venueList[selectedVenueIndex].name;
      const field = this.data.fieldList[selectedFieldIndex];
      const userInfo = wx.getStorageSync('userInfo');
      const openid = wx.getStorageSync('openid');

      if (!openid) {
        return wx.showToast({ title: '请先登录', icon: 'none' });
      }

      const finalData = {
        title,
        venue,
        field,
        date,
        time,
        people,
        tags: selectedTags,
        activeKey: this.data.activeKey,
        nickname: userInfo ? userInfo.nickName : '匿名用户',
      };

      const postData = {
        openid,
        nickName: userInfo.nickName,
        avatar: userInfo.avatar,
        title,
        venue,
        field,
        date,
        time,
        people: Number(people), // 保证为数字类型
        tags: selectedTags
      };

      wx.request({
        url: `${baseURL}/api/publish_activity/`, // ✅ 替换为实际后端地址
        method: 'POST',
        data: JSON.stringify(postData),
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.statusCode === 200) {
            wx.showToast({ title: '发布成功', icon: 'success' });
            // 可以跳转回首页或清空表单
            wx.switchTab({ url: "/pages/home/home" });
          } else {
            wx.showToast({ title: res.data.error || '发布失败', icon: 'none' });
          }
        },
        fail: err => {
          console.error('请求失败：', err);
          wx.showToast({ title: '网络错误', icon: 'none' });
        }
      });

      // // 提交数据（可以传给父页面或发请求）
      // console.log('提交表单数据：', finalData);
      // wx.showToast({ title: '发布成功', icon: 'success' });
      
      // // 若需要传回父组件或页面，可使用 triggerEvent
      // this.triggerEvent('submit', finalData);
    }
  }
});
