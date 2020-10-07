import { User } from "../model/user.js"
Component({
  data: {
    selected: 0,
    "color": "#a0a0a0",
    "selectedColor": "#121212",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "../index/index",
        "iconPath": "/images/nav_icon/index_no.png",
        "selectedIconPath": "/images/nav_icon/index_s.png",
        "text": "首页",
        "width":'52rpx',
        "height":'52rpx'
      },
      {
        "pagePath": "../tipPage/tipPage",
        "iconPath": "/images/nav_icon/j_c_no.png",
        "selectedIconPath": "/images/nav_icon/j_c_yes.png",
        "text": "规则",
        "width": '52rpx',
        "height": '52rpx'
      },
      {
        "pagePath": "../appointment/appointment",
        "iconPath": "/images/nav_icon/my_no.png",
        "selectedIconPath": "/images/nav_icon/my_yes.png",
        "text": "我的预约",
        "width": "52rpx",
        "height": "52rpx"
      }
    ],
    hidden:false,
    num:0,
    src:'',
    imgHidden:true,
    width:740,
    height:0,
    showTip:false
  },
  attached() {
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log('页面被展示')
    },
    ready:function(){
     
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  ready(){
    //var num = parseInt(Math.random() * 10);
 

    
   
  },

  methods: {
   
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      console.log(data.index)
      // if (data.index==1)
      // {
      //   wx.navigateTo({
      //     url: url,
      //   })
      // }
      wx.switchTab({
        url,
        success: res => {
          this.setData({
            selected: data.index
          })
         
          
          // var num = parseInt(Math.random() * 10);
          // console.log(num)
          // this.setData({
          //   num
          // })
        }
      })
   
     
    }
  }
})