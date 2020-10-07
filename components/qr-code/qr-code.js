// components/qr-code/qr-code.js
var QR = require("./qrcode/qrcode.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    createCode(text, callback){
      var size = this.setCanvasSize();//动态设置画布大小
      this.createQrCode(text, "mycanvas", size.w, size.h, callback);
    },
    //适配不同屏幕大小的canvas
    setCanvasSize: function () {
      var size = {};
      try {
        var res = wx.getSystemInfoSync();
        var scale = 750 / 686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth / scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败" + e);
      }
      return size;
    },
    createQrCode: function (url, canvasId, cavW, cavH, callback) {
      //调用插件中的draw方法，绘制二维码图片
      QR.api.draw(url, canvasId, cavW, cavH);
      setTimeout(() => { this.canvasToTempImage(callback); }, 3000);

    },
    //获取临时缓存照片路径，存入data中
    canvasToTempImage: function (callback) {
      var that = this;
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          callback && callback(tempFilePath)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },
  }
})
