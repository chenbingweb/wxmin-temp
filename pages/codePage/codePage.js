// pages/codePage/codePage.js
import { appointmentDetail, codeResult } from "./fn.js"
var QR = require("../../components/qr-code/qrcode/qrcode.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    imagePath:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.timmer=null;
    appointmentDetail(options.oid,this)
    // codeResult(options.oid, this)
    let obj = getApp().getPage("pages/appointment/appointment");
    if(obj)
    {
      obj.reloadFlag =true;
    }
    wx.getScreenBrightness({
      success: ({ value})=>{
        this._br=value;

       
        wx.setScreenBrightness({
          value:1
        })
      }
    })
    // this.createCode(options.oid)
  },
  createCode(text, callback) {
    var size = this.setCanvasSize();//动态设置画布大小
    this.createQrCode(text, "mycanvas", size.w, size.h, callback);
  },
  //适配不同屏幕大小的canvas
  setCanvasSize: function () {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686;///不同屏幕下canvas的适配比例；设计稿是750宽
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
    setTimeout(() => { this.canvasToTempImage(callback); }, 1000);

  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function (callback) {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        console.log(tempFilePath);
        that.setData({
          imagePath: tempFilePath,
          // canvasHidden:true
        },()=>{
          callback(tempFilePath)
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.timmer) {
      clearTimeout(this.timmer)
      
    }
    if (this._br) {
      wx.setScreenBrightness({
        value: this._br
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.timmer) {
      clearTimeout(this.timmer)
      
    }
    if(this._br)
    {
      wx.setScreenBrightness({
        value: this._br
      })
    }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   
  onShareAppMessage: function () {

  }*/
})