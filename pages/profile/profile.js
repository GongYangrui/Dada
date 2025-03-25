Page({
    data: {
        "avatar": "https://img.yzcdn.cn/vant/cat.jpeg", // 默认头像
        "name": "未设置", // 用户名
        "gender": "保密", // 性别
        "phone": "188****8888", // 手机号（不可修改）
        "signature": "这家伙很懒，什么都没写", // 默认签名
        "address": "未设置", // 地址
        "showAddressPopup": false, // 是否显示地址弹出框
        "selectedAddress": "", // 当前选择的地址
        "addressColumns": [
          {
            "text": "同济学生宿舍",
            "value": "xzy",
            "children": [
              { "text": "501栋", "value": "501" },
              { "text": "502栋", "value": "502" },
              { "text": "503栋", "value": "503" },
              { "text": "504栋", "value": "504" }
            ]
          },
          {
            "text": "韵苑公寓",
            "value": "yy",
            "children": (function() {
              const children = [];
              for (let i = 1; i <= 27; i++) {
                children.push({ "text": `${i}栋`, "value": `${i}` });
              }
              return children;
            })()
          },
          {
            "text": "紫菘公寓",
            "value": "zs",
            "children": (function() {
              const children = [];
              for (let i = 1; i <= 14; i++) {
                children.push({ "text": `${i}栋`, "value": `${i}` });
              }
              return children;
            })()
          }
        ],
        "selectedAddress": null,
        "currentBuildings": [], // 当前展示的楼栋列表
        "showBuildingSelection": false // 是否展示楼栋选择区域
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
              wx.showToast({ title: "签名最多 30 个字", icon: "none" });
            } else {
              that.setData({ signature: newSignature });
            }
          }
        }
      });
    },
  
    editAddress() {
        const that = this;
      
        // 提取所有公寓信息
        const dorms = that.data.addressColumns.map(item => item.text);
        console.log("公寓列表:", dorms);  // 查看获取的公寓列表
      
        wx.showActionSheet({
          itemList: dorms, // 展示公寓列表
          success(res) {
            if (res.tapIndex === undefined) {
              console.log("未选择任何公寓");
              wx.showToast({
                title: "未选择任何公寓",
                icon: "none"
              });
              return;
            }
      
            console.log("选中的公寓索引:", res.tapIndex);
            const selectedDorm = that.data.addressColumns[res.tapIndex];
            const buildings = selectedDorm.children.map(child => child.text);
            console.log("楼栋列表:", buildings);
      
            // 如果楼栋数量超过6个，则分批显示
            const chunkSize = 6;  // 每批显示的数量
            const totalChunks = Math.ceil(buildings.length / chunkSize);  // 总批次
      
            let currentPage = 0;  // 当前显示的批次
      
            // 递归函数显示每一批楼栋
            const showBuildingBatch = () => {
              const startIdx = currentPage * chunkSize;  // 当前批次的起始索引
              const endIdx = Math.min((currentPage + 1) * chunkSize, buildings.length);  // 当前批次的结束索引
              const batch = buildings.slice(startIdx, endIdx);  // 获取当前批次的楼栋
      
              wx.showActionSheet({
                itemList: batch,
                success(res2) {
                  if (res2.tapIndex === undefined) {
                    console.log("未选择任何楼栋");
                    wx.showToast({
                      title: "未选择任何楼栋",
                      icon: "none"
                    });
                    return;
                  }
      
                  const selectedBuilding = buildings[startIdx + res2.tapIndex]; // 获取楼栋名称
                  console.log("选中的楼栋:", selectedBuilding);
      
                  // 拼接完整地址
                  const fullAddress = `${selectedDorm.text} - ${selectedBuilding}`;
                  console.log("完整地址:", fullAddress);
      
                  // 更新 UI 显示
                  that.setData({
                    address: fullAddress
                  });
      
                  // 如果当前批次不是最后一批，继续显示下一批
                  if (currentPage < totalChunks - 1) {
                    currentPage++;  // 进入下一批次
                    showBuildingBatch();  // 递归调用，显示下一批次
                  }
                },
                fail(error) {
                  wx.showToast({ title: "选择楼栋失败", icon: "none" });
                  console.error("选择楼栋失败:", error);
                }
              });
            };
      
            // 如果楼栋数量大于6，使用分页显示
            if (buildings.length > 6) {
              showBuildingBatch();
            } else {
              // 如果楼栋数量不超过6，直接显示
              wx.showActionSheet({
                itemList: buildings,
                success(res2) {
                  if (res2.tapIndex === undefined) {
                    console.log("未选择任何楼栋");
                    return;
                  }
                  const selectedBuilding = buildings[res2.tapIndex]; // 获取楼栋名称
                  const fullAddress = `${selectedDorm.text} - ${selectedBuilding}`;
                  that.setData({
                    address: fullAddress
                  });
                },
                fail(error) {
                  wx.showToast({ title: "选择楼栋失败", icon: "none" });
                  console.error("选择楼栋失败:", error);
                }
              });
            }
          },
          fail(error) {
            console.error("选择公寓失败:", error);
            wx.showToast({ title: "选择公寓失败", icon: "none" });
          }
        });
      }, 
   
    // 获取手机号
    getPhoneNumber(e) {
      if (e.detail.errMsg === "getPhoneNumber:ok") {
        wx.request({
          url: "你的服务器地址", // 服务器接口地址
          method: "POST",
          data: {
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            code: this.data.code // 获取到的登录 code
          },
          success(res) {
            if (res.data && res.data.phoneNumber) {
              this.setData({
                phone: res.data.phoneNumber // 更新手机号
              });
            }
          },
          fail(error) {
            wx.showToast({ title: "获取手机号失败", icon: "none" });
          }
        });
      }
    },
  
    // 微信登录并获取 code
    onLoad() {
      wx.login({
        success: (res) => {
          if (res.code) {
            this.setData({ code: res.code }); // 保存 code
          } else {
            wx.showToast({ title: "登录失败", icon: "none" });
          }
        }
      });
    },
  
    // 显示修改手机号的按钮
    editPhoneNumber() {
      wx.getUserProfile({
        desc: "为了更好地服务您",
        success: (res) => {
          console.log(res.userInfo);
          // 用户点击允许后可以跳转到手机号授权
          wx.showModal({
            title: "授权手机号",
            content: "请授权手机号以便进行修改",
            success: (result) => {
              if (result.confirm) {
                wx.getPhoneNumber({
                  success: this.getPhoneNumber,
                  fail: () => {
                    wx.showToast({ title: "授权失败", icon: "none" });
                  }
                });
              }
            }
          });
        },
        fail: () => {
          wx.showToast({ title: "授权失败", icon: "none" });
        }
      });
    }
  });
  