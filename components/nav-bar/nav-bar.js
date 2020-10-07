// components/nav-bar/nav-bar.js
/***************组件说明**************************************************************/
/**
 * (一) 在config.js中navBar添加底部导航配置内容，
 *  [//导航信息
      {
        name: '养老院查询',//标题
        selected: true,//默认第一个为选择
        icon: '../../images/search_bh.png',//未选择的图片路径
        icon_s: '../../images/search_bh_s.png',//已选的图片路径
        path: '../index/index'//跳转路径
      }
    ]
  (二) 在app.js文件中,添加globalData属性，为Object类型，
      globalData：{
        navBar：config.navBar
      }
 * 
 * 
 */
import Ajax from "../../libs/Ajax.js";
// import { Index } from "../../model/index.js"
let _interface = require("../../utils/interface.js")
import Tool from "../../libs/Tool.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   currentNav:{
     type:Number,
     value:1,
     observer: function (newVal, oldVal) {
       if (newVal){
         console.log(newVal)
       }
     }
   },
    height: {
      type: Number,
      value: 10.78
    },
    color: {
      type: String,
      value: '#cca27e',
    },
    navBarKey: {
      type: String,
      value: 'navBar',
    },
    navBar: {
      type: Array,
      value: getApp().globalData.navBar || [],
      observer: function (newVal, oldVal) {
        if (Array.isArray(newVal) && newVal.length) {
          let navBarKey = this.properties.navBarKey;
          newVal.forEach((item, index) => {
            item.nid = index;
          })
          getApp().globalData[navBarKey] = Object.assign(getApp().globalData[navBarKey], newVal)
        }

      }
    },
    navType: {
      type: String,
      value: 'reLaunch',
      observer: function (newVal, oldVal) {

      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBox:false,
    navBar: [],//底部导航条
    color: '',
    isLongP:0,
  },
  created: function () {
    let navBarKey = this.properties.navBarKey;
    let barItems = getApp().globalData[navBarKey];
    //生成navId
    barItems.forEach((item, index) => {
      item.nid = index;
    })
    getApp().globalData[navBarKey] = Object.assign(getApp().globalData[navBarKey], barItems)

  },
  ready: function () {
    let navBarKey = this.properties.navBarKey;
    this.setData({
      isLongP: Tool.isLongP(),
      navBar: getApp().globalData[navBarKey]
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转
    selectNav: function ({ currentTarget, detail}) {
      console.log(detail)
      getApp().globalData.userInfo = detail.userInfo;
      let navBarKey = this.properties.navBarKey;
      let navId = currentTarget.id
      let navBarArr = this.data.navBar;
      let path = "";
      let navType=""
      // if(navId==0)
      // {
      //   Index._getPageInfo(false)
      // }
      navBarArr.forEach((item, index) => {
        if (parseInt(item.nid) == parseInt(navId)) {
          item.selected = true
          if (item.path) {
            path = item.path
            navType = item.navType
          }
        }
        else {
          item.selected = false
        }
      })
      
      if (this.properties.navType == 'redirectTo') {
        console.log('redirectTo')
        wx.redirectTo({
          url: path,
          success() {
            getApp().globalData[navBarKey] = navBarArr;

          }
        })
      }
      else if (this.properties.navType == 'reLaunch') {
        console.log('reLaunch')
        if (path == '') {

        }
        else {
          if (navType =='navigateTo')
          {
            wx.navigateTo({
              url: path,
            })
          }
          else
          {
            wx.reLaunch({
              url: path,
              success() {
                getApp().globalData[navBarKey] = navBarArr;
              }
            })
          }
          
        }

      }
      else if (this.properties.navType == 'navigateTo')
      {
        wx.navigateTo({
          url: path,
        })
      }


    },

    showSelectTab: function ({ detail }) {
      console.log(detail)
      if (detail.errMsg != 'getUserInfo:ok') {
        return
      }
        // wx.checkSession({
        //   success:() =>{
        //     console.log('未过期')
        //   },
        //   fail: ()=> {
        //     console.log('过期')
        //     //发送用户信息到后台
        //     getApp().UserToLogin((res) => {
        //       console.log(res)
        //     }, detail, _interface.getUserInfo)
        //   }
        // })
        getApp().globalData.userInfo = detail.userInfo
        //发送用户信息到后台
        getApp().UserToLogin((res) => {
          console.log(res)
        }, detail, _interface.getUserInfo)
       
    }


    //登录
    // login:function(){
    //   console.log(33333333)
    //   var myEventDetail = { }  // detail对象，提供给事件监听函数
    //   var myEventOption = {
    //     bubbles: false,
    //     composed: false,
    //     capturePhase: false
    //   } // 触发事件的选项
    //   this.triggerEvent('userLogin', myEventDetail, myEventOption)
    // }
  }
})
