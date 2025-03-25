Page({
    data: {
      avatar: "https://img.yzcdn.cn/vant/cat.jpeg", // 默认头像
      name: "未设置", // 用户名
      gender: "保密", // 性别
      phone: "188****8888", // 手机号（不可修改）
      signature: "这家伙很懒，什么都没写", // 默认签名
      address: "未设置", // 地址
      showAddressPopup: false, // 是否显示地址弹出框
      selectedAddress: "", // 当前选择的地址
      addressColumns: [
        {
          text: "同济学生宿舍",
          value: "xzy",
          children: [
            { text: "501-508栋", value: "501-508" },
            { text: "509-520栋", value: "509-520" }
          ]
        },
        {
          text: "韵苑公寓",
          value: "yy",
          children: [
            { text: "1栋-27栋", value: "1-27" }
          ]
        },
        {
          text: "紫菘公寓",
          value: "zs",
          children: [
            { text: "1栋-14栋", value: "1-14" }
          ]
        }
      ] // 地址选择数据
    },
  
    // 修改头像
    changeAvatar() {
      const that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success(res) {
          that.setData({
            avatar: res.tempFiles[0].tempFilePath
          });
        },
        fail() {
          wx.showToast({ title: "选择头像失败", icon: "none" });
        }
      });
    },
  
    // 修改名字
    editName() {
      const that = this;
      wx.showModal({
        title: "修改名字",
        editable: true,
        placeholderText: "请输入新的名字",
        success(res) {
          if (res.confirm && res.content.trim()) {
            that.setData({ name: res.content.trim() });
          }
        }
      });
    },
  
    // 选择性别
    selectGender() {
      const that = this;
      wx.showActionSheet({
        itemList: ["男", "女", "保密"],
        success(res) {
          const genders = ["男", "女", "保密"];
          that.setData({ gender: genders[res.tapIndex] });
        }
      });
    },
  
    // 修改签名（最多 30 字）
    editSignature() {
      const that = this;
      wx.showModal({
        title: "修改签名",
        editable: true,
        placeholderText: "最多 30 个字",
        success(res) {
          if (res.confirm && res.content.trim()) {
            let newSignature = res.content.trim();
            if (newSignature.length > 30) {
              wx.showToast({ title: "最多 30 个字", icon: "none" });
            } else {
              that.setData({ signature: newSignature });
            }
          }
        }
      });
    },
  
    // 修改地址
    editAddress() {
      console.log("editAddress triggered"); // 添加日志检查是否执行
      this.setData({
        showAddressPopup: true,
      }, () => {
        console.log("showAddressPopup is now true"); // 打印验证状态是否更新
      });
    },
  
    // 关闭地址弹出框
    closeAddressPopup() {
      this.setData({
        showAddressPopup: false,
      });
    },
  
    // 地址选择变化时
    onAddressChange(event) {
      const selectedAddress = event.detail.value;
      console.log("Address changed:", selectedAddress); // 输出变化的地址
      this.setData({
        selectedAddress: selectedAddress
      });
    },
  
    // 确定选择的地址
    confirmAddress() {
      const selectedAddress = this.data.selectedAddress;
      console.log("Confirmed Address:", selectedAddress); // 输出确认的地址
      if (selectedAddress) {
        this.setData({
          address: selectedAddress,
          showAddressPopup: false,
        });
      }
    }
  });
  