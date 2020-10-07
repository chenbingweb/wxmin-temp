// pages/appointment/appointment.js
let _interface = require("../../utils/interface.js")
import { cancelAppoints } from "./fn.js"
import { User} from "../../model/user.js"
import Ani from "../../utils/anima.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLongP:0,
    dataObj:{},
    list:[],
    an:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reloadFlag = false;
    User.reload =false;
    if (User.isSign)
    {
      this.reload()
    }
    
   
  },
  reload(){
    this.setData({
      list: [],
      dataObj: {
        url: _interface.myAppointment || '',
        outData: {
          //userId: getApp().globalData.userId,
          // village_id: getApp().globalData.village_id,
          // key: '',
          // collect: ''//
        }
      }
    })
  },
  onPageData({ detail }) { 
    let { list } = this.data;
    detail.forEach((item,index)=>{
      item.an = null
      
      item.ani = Ani.opacity().step({ delay: (index + 3) * 100 }).export()
      item.shop.logo = getApp().globalData.imgUrl + item.shop.logo 
    })
    list.push(...detail);
    this.setData({
      // an:false,
      list
    },()=>{
      this.setData({
        an:true
      })
    })
  },
   

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //<!-- ,normal:正常，canceled：已取消，consumed：已核销，expired：已过期 <string> -->
  onNav({currentTarget:{dataset:{url,status}}}){
    if (status =='normal')
    {
      wx.navigateTo({
        url
      })
      return
    }

    // wx.showModal({
    //   title: '提示',
    //   content: '',
    //   showCancel:false,
    //   success:res=>{

    //   }
    // })

  },
  //取消预约
  onCancel({ currentTarget: { dataset: { aid} } }){
    wx.showModal({
      title: '提示',
      content: '确认取消预约？',
      success:res=>{
        if(res.confirm)
        {
          cancelAppoints(aid,this)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
   
    if(!User.isSign)
    {
      wx.showModal({
        title: '提示',
        content: '您尚未注册，是否前往注册？',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
           
          }
          else {
            wx.switchTab({
              url: '../index/index',
            })
          }
        }
      })
    }
    else
    {
      if (this.reloadFlag || User.reload) {
        this.reload()
        User.reload = false;
        this.reloadFlag = false
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      an: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      an: false
    })
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

  }
})