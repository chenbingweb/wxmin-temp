// pages/myCenter/myCenter.js
import { User } from "../../model/user.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navs:[
      {
        url:'../myLessonList/myLessonList',
        icon:'lesson_order.png',
        title:'课程订单',
        width:34,
        height:38
      },
      {
        url: '../reservationOrder/reservationOrder',
        icon: 'yuyue_order.png',
        title: '预约订单',
        width: 40,
        height: 34
      },
      {
        url:'../refundRecord/refundRecord',
        icon:"tui_kuan_order.png",
        title: '退款订单',
        width: 42,
        height: 42
      },
      {
        url: '../addressList/addressList?src=manager',
        icon: "address_manager.png",
        title: '地址管理',
        width: 38,
        height: 42
      },
      {
        url: '../aboutUs/aboutUs',
        icon: "about_us.png",
        title: '关于我们',
        width:42,
        height: 42
      },
      {
        url: '',
        icon: "kf.png",
        title: '联系我们',
        width: 43,
        height: 43
      }
      
    ],
    isSign:false,
    mobile:'',
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu({
      
    })
    if (!getApp().globalData.t) {
      let { height, top } = wx.getMenuButtonBoundingClientRect();
      this.h = height;
      this.t = top;
    }
    else {
      this.h = getApp().globalData.h;
      this.t = getApp().globalData.t;
    }
    this.setData({
   
      paddingTop: this.t + this.h + 10,
      height: this.t + this.h,
      lineHeight: this.h,
      isSign: User.isSign,
      userInfo: User.userInfo,
      mobile: User.mobile
    })
   
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
    getApp().setTitleStyle(this)
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    User.getUserInfo(()=>{
      this.setData({
        isSign: User.isSign,
        mobile: User.mobile,
        userInfo: User.userInfo
      })
    })
    if (User.userId !== '') {
      User.getOrderNum()
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
   */
  onShareAppMessage: function () {

  },
  onToSign(){
    wx.navigateTo({
      url: '../login/login',
    })
  },
  onMakePhone({currentTarget:{dataset:{url}}}){
    if(url=='')
    {
      wx.makePhoneCall({
        phoneNumber: '1234455',
      })
    }
  },
  onNavTo(){
    if(User.isSign)
    {
      wx.navigateTo({
        url: '../personInfo/personInfo',
      })
    }
    else
    {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  }
})