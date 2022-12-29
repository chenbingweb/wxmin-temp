let config = require('./config.js');
let _interface = require('./utils/interface.js');
//获取假数据
let testData = require('./utils/data.js');
import Tool from "./libs/Tool.js";
import Login from "./libs/Login.js";
import Ajax from "./libs/Ajax.js";
import Upload from "./libs/Upload.js";
import {User} from "./model/user.js"
let job_data = require("./utils/job.js");
let appComm = require("./appComm.js")
let appObj = {
  onLaunch: function (res) {
    console.log(res)
    //获取手机信息 wx8fb5edc044b3efc6
    this.getPhoneInfo();
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    wx.removeStorage({
      key: 'cartlist',
      success(res) {
       
      }
    })
  },
  onShow: function (res) {
    // wx.setKeepScreenOn({
    //   keepScreenOn: true,
    //   success: () => {
    //     // wx.showToast({
    //     //   title: '已经开启保持常亮状态',
    //     //   icon:'none'
    //     // })
    //   }
    // })
  
    console.log('res=>', res)
    let { query } = res;
    let { income, sid, src } = query
    if(src)
    {
      this.globalData.src = src
    }
    if (income) {
      this.globalData.income = income
    }
    if(sid)
    {
      this.globalData.shopId=sid
    }
   
    this.removeStorageFn()
    //检查小程序版本
    Tool.Version()
    // this.SharaBtn()
    
  },
  onHide: function () {

  }, //全局参数
  globalData: {
    signOut: false,//退出
    userInfo: null,//用户信息，
    sysInfo: null,//用户手机信息
    screenWidth: 0,//屏幕宽度
    screenHeight: 0,//屏幕高度
    imgUrl: config.imgUrl,//图片地址
    navBar: config.navBar,//获取自定义导航相关配置（如果是自带的导航，请删除此字段）
    /***根据实际项目情况，自行添加全局字段***/
    self_shop_id: "",//店铺id 如果不是分享家，则为空字符串
    token: '',//用户id
    income: "",//分享家fan
    shareBtn:true,
    shopId:"",
    t:0,
    h:0,
  
  },
  testUrl: 'http://127.0.0.1:3000',
  share(imageUrl, title, path){
    
    return {
      imageUrl,
      title,
      path
    }
  }
};

appObj = Object.assign(appObj, appComm)

App(appObj)
