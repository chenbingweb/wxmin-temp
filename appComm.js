let config = require('./config.js');
let _interface = require('./utils/interface.js');
//获取假数据
let testData = require('./utils/data.js');
import Tool from "./libs/Tool.js";
import Login from "./libs/Login.js";
import Ajax from "./libs/Ajax.js";
import Upload from "./libs/Upload.js";
let job_data = require("./utils/job.js");
import {User} from "./model/user.js"
// import { ConfirmOrder} from "./model/confirmOrder.js"
module.exports={ 
 
  queryKey(url) {
    let urlArr = url.slice(url.indexOf('?') + 1).split('&');
    let obj = {};
    for (let i = 0; i < urlArr.length; i++) {
      let key = urlArr[i].split('=')[0];
      let value = urlArr[i].split('=')[1]
      obj[key] = value
    }
    return obj
  },
  //设置自定义title样式
  setTitleStyle(that, callBack){
    if (!getApp().globalData.t) {
      let { height, top } = wx.getMenuButtonBoundingClientRect();
      that.h = height;
      that.t = top;
    }
    else {
      that.h = getApp().globalData.h;
      that.t = getApp().globalData.t;
    }
    that.setData({
      paddingTop: that.t + that.h + 10,
      height: that.t + that.h,
      lineHeight: that.h
    },()=>{
      callBack && callBack({h:that.h,t:that.t})
    })
  },
  //获取手机信息
  getPhoneInfo: function (options) {
    var me = this;
    wx.getSystemInfo({
      success: function (res) {
        me.globalData.screenWidth = res.windowWidth;
        me.globalData.screenHeight = res.windowHeight;
        me.globalData.sysInfo = res;
        let SDKVersion = res.SDKVersion.split('.');
        console.log(SDKVersion)
        let cur = parseInt(SDKVersion[0]) + parseInt(SDKVersion[1])
        if (cur<6){
          wx.showModal({
            title: '温馨提示',
            content: '您的微信版本不是最新版本，请升级到最新版本',
            success:res=>{

            }
          })
        }
      }
    })

  },
  //移除本地缓存数据参数 
  removeStorageFn: function () {
    var list = ['goodsList', 'buyGood', 'cityName', 'brandListCbChild', 'indexData', 'brandChildCb_bid','isEval'];
    for (let i = 0; i < list.length; i++) {
      wx.removeStorage({
        key: list[i]
      })
    }

  },
  //用户登录
  UserLogin: function (callback) {
    var that = this;
    let login = new Login();
    if (!this.globalData.token) {
      login.resolveLogin({
        path: _interface.login,//接口地址，默认为空(必传)
        loginSucc(res) { //登录成功(必传)
          console.log(res)
          //设置用户UserId
          console.log(that.globalData)
          if (parseInt(res.errcode) == 0) {
            that.globalData.self_shop_id = res.data.self_shop_id||'';
            if (res.data.token && (that.globalData.token == '')) {
              that.globalData.token = res.data.token;//用户token
            }
           
            that.globalData.share_code = res.data.share_code || '';//分享家code
            that.globalData.getUserInfo = res.data.getUserInfo||false;
            that.globalData.level = res.data.level || '';//等级 1:一级分享家;2:二级分享家
            callback(res.data.userId)
          }
          else {
            if (getApp().globalData.userId == '') {
              wx.showToast({
                title: '登录失败',
                icon: "none",
                mask: true
              })
            }

          }

        },
        loginFail(err) { //登录失败(必传)
          if (getApp().globalData.userId == '') {
            wx.showToast({
              title: '登录失败',
              icon: "none",
              mask: true
            })
          }

          callback(err)

        }
      })
    }
    else {
      callback(that.globalData.UserId)
    }

  },
  //新版
  UserToLogin: function (callback) {
    var that = this;
    let login = new Login();

    //if (!this.globalData.token) {
      login.userToLogin({
        data: arguments[1] || undefined,
        path: arguments[2] || _interface.login,//接口地址，默认为空(必传)
        loginSucc(res) { //登录成功(必传)
          //设置用户UserId
          console.log(that.globalData)
          if (parseInt(res.errcode) == 0) {
            that.globalData.self_shop_id = res.data.self_shop_id || '';
            if (res.data.token && (that.globalData.token == '')) {
              that.globalData.token = res.data.token;//用户token
            }

            that.globalData.share_code = res.data.share_code || '';//分享家code
            that.globalData.level = res.data.level || '';//等级 1:一级分享家;2:二级分享家
            that.globalData.getUserInfo = res.data.getUserInfo || false;
            callback(res.data.token)
          }
          else {
            if (getApp().globalData.token == '') {
              wx.showToast({
                title: '登录失败',
                icon: "none",
                mask: true
              })
            }

          }

        },
        loginFail(err) { //登录失败(必传)
          if (getApp().globalData.token == '') {
            wx.showToast({
              title: '登录失败',
              icon: "none",
              mask: true
            })
          }
          console.log(err)
          callback(err)

        }
      })
   //}
  //  else {
   //   callback(that.globalData.token)
  //  }
  },
  //添加优惠券到卡包  id=13&AccessToken
  AddCoupon: function (id) {
    console.log(typeof arguments[2])
    wx.showLoading({
      title: '加载中...',
    })
    var data = {
      userId: getApp().globalData.userId,
      id: id
    }
    //如果不是免费，则把订单号传给后台

    var ajax = new Ajax({
      data,
      path: _interface.addCard
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {
        Tool.addCard([res.data]).then(res => {
          console.log(res)

        }).catch(err => {
          console.log(err)
        })
      }
      else {
        wx.showToast({
          title: res.msg || '',
          icon: 'none'
        })
      }

      console.log(res)
    })
    ajax.catch(err => {
      wx.hideLoading()
    })
  },
  //发起微信支付id=13&AccessToken
  WXpay: function (id, callBack) {
    var data = {
      token: User.token,
      id: id
    }
    var ajax = new Ajax({
      data,
      path: _interface.prepay
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {     
          Tool.WXpay(res.data).then(res => {
            console.log(res)
            ConfirmOrder.confirmPayment(id)
            // this.globalData.isOk=true;
            callBack(res)
          }).catch(err => {
            wx.hideLoading()
            wx.showToast({
              title: '取消支付',
              icon: 'none'
            })
            console.log(err)
          })
        
      }
      else if (res.errcode == 1) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: 'none'
        })
      }


      console.log(res)
    })
    ajax.catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  UpdatePhoto(that, callBack) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showLoading({
          title: '正在上传...',
          mask: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];

        let upload = new Upload({
          path: _interface.updataImg,
          filePath: tempFilePaths,
          formData: {
            userid: getApp().globalData.userId
          }
        })
        console.log({
          userid: getApp().globalData.userId
        })
        upload.then(res => {
          wx.hideLoading()
          //let res = JSON.parse(res)
          // that.setData({
          //   img_url: app.globalData.imgUrl + res.img_url
          // })
          if (res.errcode == 0) {
            //that.oneCallBack(res.data)
            callBack(res.data)
          }
          console.log(res)
        }).catch(err => {
          console.log(err)
          wx.showToast({
            title: '上传图片失败',
            icon: 'none',
            mask: true
          })
          wx.hideLoading()
        })
      }
    })
  },
  //多张上传图片
  uploadImgs(that,path) {
    let imgArr = [];
    let tempFilePaths = that.tempFilePaths
    return () => {

      (function iter(i) {

        if (i >= tempFilePaths.length) {
          if (that.callBack && imgArr.length) {
            that.callBack(imgArr)
          }
          else {
            that.callBack(false)
          }
          return
        }
        let formData = {
          userId: getApp().globalData.userId
        }
        //添加其他信息
        if (that.outData) {
          formData = Object.assign(formData, that.outData)
        }
        let upload = new Upload({
          path: _interface.updataImg || path,
          filePath: tempFilePaths[i],
          formData: formData
        })
        upload.then(res => {
          console.log(res)
          if (res.errcode == 0) {
            imgArr.push(res.data);
          }
          i++
          iter(i)

        }).catch(err => {
          i++
          iter(i)
          wx.showToast({
            title: '上传图片失败',
            icon: 'none',
            mask: true
          })

          wx.hideLoading()
        })

      })(0)


    }
  },
  //发送手机验证码
  getCode(data) {
    wx.showLoading({
      title: '正在发送...',
    })
    let ajax = new Ajax({
      data,
      path: _interface.getCode
    })
    ajax.then(res => {
      if (res.errcode == 0) {
        wx.showToast({
          title: '发送成功',
          mask: true
        })
      }
      else {
        wx.showToast({
          title: '发送失败',
          icon: 'none'
        })
      }

    })
    ajax.catch(err => {
      wx.showToast({
        title: '发送失败',
        icon: 'none'
      })
    })
  },
  //验证手机码
  checkCode(data, callBack) {
    wx.showLoading({
      title: '正在发送...',
    })
    let ajax = new Ajax({
      data,
      path: _interface.checkCode
    })
    ajax.then(res => {
      if (res.errcode == 0) {
        callBack()
      }
      else {
        wx.showToast({
          title: '验证码错误',
          icon: 'none'
        })
      }

    })
    ajax.catch(err => {
      wx.showToast({
        title: '服务报错',
        icon: 'none'
      })
    })
  },
  ShareFn: Tool.ShareFn,
    //修改自定义导航位置
  updataNav(num){
    getApp().globalData.navBar.forEach((item, index) => {
      if (index == num) {
        item.selected = true
      }
      else {
        item.selected = false
      }
    })
  },
  //删除图片
  deleImg(img, callBack, ty){
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          let ajax = new Ajax({
            data: {
              path: img,
              ['type']: ty
            },
            path: _interface.deleImg
          })
          ajax.then(res => {
            if (res.errcode == 0) {
              if (callBack) {
                callBack(true)
              }
            }
          })
          ajax.catch(err => {
            wx.showToast({
              title: '服务器报错..',
              icon: 'none'
            })
          })
        }
      }
    })

  },
  //AJax Wrap
  AjaxWrap(callBack){
    if (getApp().globalData.token=='')
    {
      this.UserToLogin(callBack, arguments[1], arguments[2])
    }
    else
    {
      wx.checkSession({
        success: callBack,
        fail: () => {
          this.UserToLogin(callBack, arguments[1], arguments[2])
        }
      })
    }
    
  },
  //分享按钮控制
  SharaBtn(callBack){
    let ajax = new Ajax({
      data: {
        
      },
      reqtype:"GET",
      path: _interface.site_v
    })
    ajax.then(res => {
      console.log(!res.ver)
      callBack && callBack(!res.ver)
    })
    ajax.catch(err => {
      wx.showToast({
        title: err.msg,
        icon: 'none'
      })
    })
  },
  getPage(route){
    let page=null
    getCurrentPages().forEach(item=>{
      if(item.route==route)
      {
        page=item;
      }
    })
    return page
  },
  //是否是苹果手机
  isIos(){
    let ios=true;
    try{
      let sys = wx.getSystemInfoSync().system;
      if(/ios/gi.test(sys))
      {
        ios=true
      }
      else
      {
        ios = false
      }
    }catch(e){

    }
    return ios
    
   
  },
  //打开文档
  openDoc(url){
    wx.showLoading({
      title: '打开中...',
      mask:true
    })
    wx.downloadFile({
      // 示例 url，并非真实存在
      url,
      success: function (res) {
        wx.hideLoading()
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail:()=>{
            wx.showToast({
              title: '打开失败',
              icon: 'none'
            })
          }
        })
      },
      fail:err=>{
        wx.hideLoading()
        wx.showToast({
          title: '打开失败',
          icon:'none'
        })
      }
    })
  },
  getCartNum(callBack) {
    var data = {
      token: this.token
    }
    var ajax = new Ajax({
      data,
      path: _interface.getCartNum,
    //  _path: 'http://127.0.0.1:3000' + _interface.getCartNum
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {

        
        callBack && callBack(res.data.num)
      }
      else if (res.errcode == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none"
        })
      }
      console.log(res)
    })
    ajax.catch(err => {
      wx.hideLoading()
      wx.showToast({
        title: '系统繁忙',
        icon: "none"
      })
      console.log(err)
    })
  }
}