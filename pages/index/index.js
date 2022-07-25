// pages/index/index.js
let _interface = require("../../utils/interface.js")
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";
import { parsePos, getAll, getNearTeach,getIndex} from "./fn.js"
import  Tool  from "../../libs/Tool.js"
import Ani from "../../utils/anima.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [
      // {
      //   img_url:'../../images/img/1.jpg',
      //   id:1
      // }
    ],
    list:[],
    baseSet: {
      indicatorDots: false,//是否显示面板指示点
      indicatorColor: '#fb890b',//指示点颜色
      indicatorActiveColor: '#0a6fff',//当前选中的指示点颜色
      autoplay: true,//是否自动切换
      interval: 5000,//自动切换时间间隔
      duration: 1000,//滑动动画时长
      circular: true,//是否采用衔接滑动
      vertical: false//滑动方向是否为纵向
    },
    lid:"",
    city: '北京市',
    showPannel: false,
    hidden:false,
    showAddress: false,
    cityList: [{
      code: "000", name: "全城", city: [
        {
          code: "001", name: "全城", area: [
            { code: "002", name: "全城" }
          ]
        }
      ]
    }],
    addressFn:()=>{},
    area:'朝阳区',
    category:[],
    teacherList: [],
    points:[],
    tip:false,
    isLongP:0,
    categoryList:[],
    onConfirm:()=>{},
    showNav:false,
    dataObj:{},
    areaFn:()=>{},
    cateFn:()=>{},
    swh:490
  },
  onPageData({ detail }) { 
    let { list } = this.data;
    detail.forEach((item,index)=>{
      item.ani = Ani.opacity().step({delay:(index+5)*100}).export()
      item.logo = getApp().globalData.imgUrl + item.logo
    })
    list.push(...detail);
    this.setData({
      list
    })
  },


  onShowNav(){
    this.setData({
      showNav:!this.data.showNav
    })
  },
  onCloseNav() {
    this.setData({
      showNav: !this.data.showNav
    })
  },
  //选择地区
  oncitySelect({ detail: { selectCity: { name, code } } }) {
    console.log(name, code)
   
    this.setData({
      area:name,
     
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        hidden: false
      })
    }
   // getAll(code, this)
    if (User.location)
    {
     // getNearTeach(User.location, name, this)
    }
    
  },
  //取消地区选择
  onCancelCity(){
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        hidden: false
      })
    }
   
  },
  //swiper change事件
  change({ detail: { current, source }}){

    let { imgUrls } = this.data;
    //console.log(this.data.imgUrls[current].id)
    this.setData({
      lid: this.data.imgUrls[current].goods_id
    })
    if(this.customSwiper)
    {
      this.customSwiper.moveX(current)
    }
  },
  finish(){
    if (this.customSwiper) {
      this.customSwiper.changeX()
    }
  },
  //搜索
  onSearch({detail:{value}}){
    wx.navigateTo({
      url: `../lessonList/lessonList?cid=&key=${value}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      onConfirm: this.onConfirm,
      areaFn: this.areaFn,
      cateFn: this.cateFn
    })
    // wx.getSystemInfo({
    //   success: (res)=> {
    //     let { platform, model, windowHeight } =res;
    //    if ( windowHeight<700)
    //    {
    //      this.setData({
    //        swh:290
    //      })
    //    }
    //    console.log(res)
      
    //   },
    // })
   
    // this.customSwiper = this.selectComponent('#customSwiper')
    // this.setData({
    //   addressFn:this.addressFn,
    //   isLongP: Tool.isLongP()
    // })
    //默认为已经注册
    this.isLogin=true;
    wx.showLoading({
      title: '登录中...',
      mask:true
    })
    this.setData({
      dataObj: {
        url: _interface.getShopList || '',
        outData: {
          keyword:'',
          area_id:'',
          category_id:'',
        }
      }
    })
    User.UserToLogin(res => {
    
      getIndex(this)
    
      wx.hideLoading()
    
    })
    
  },
  areaFn(aid){
    /*
        keyword: '',
      area_id: '',
      category_id: '',
    */ 
    this.setData({
      list: [],
  
      'dataObj.outData.keyword': '',
      'dataObj.outData.area_id': aid,
      'dataObj.outData.category_id': '',

    })
  },
  cateFn(cid){
    this.setData({
      list: [],
      'dataObj.outData.keyword': '',
      'dataObj.outData.area_id': '',
      'dataObj.outData.category_id': cid,

      // 'dataObj.outData.category_id': cid

    })
  },
  //显示地址选择
  addressFn(){
    this.setData({
      showAddress:true
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        hidden: true
      })
    }
    
  },
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onConfirm(val){
    this.setData({
      list:[],
      'dataObj.outData.area_id': '',
      'dataObj.outData.category_id': '',
      'dataObj.outData.keyword':val

    })
    console.log(val)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.setData({
      autoplay: true
    })
    getApp().setTitleStyle(this) 
   
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
      // setTimeout(()=>{
      //   this.getTabBar().setData({
      //     hidden: true
      //   })
      // },5000)
      console.log(this.getTabBar())
    }
    // if (User.userId)
    // {
    //   if (getApp().globalData.src) {
    //     wx.reLaunch({
    //       url: '../cart/cart',
    //     })
    //     getApp().globalData.src = null;
    //   }
    // }
    
  },

  onClick(){
    wx.navigateTo({
      events:{
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      url: '../detail/detail?d=23',
      success:res=>{
        console.log(res)
        res.eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      autoplay:false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      autoplay: false
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
  //注册
  onGetUserInfo({detail}){
    console.log(detail)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(getApp().share('', '', `pages/index/index?income=${User.openId}`))
    return getApp().share('', '', `pages/index/index?income=${User.openId}`)
  }
 
})