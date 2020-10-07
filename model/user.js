let _interface=require("../utils/interface.js")
import Ajax from "../libs/Ajax.js";
import { Location } from "./map.js";
import Tool from "../libs/Tool.js";
import Upload from "../libs/Upload.js";
import Login from "../libs/Login.js";
import { UIEvent } from "../libs/UIEvent.js";

import UserPower from "../libs/getUserPower.js";


class User{
  constructor(){
    this.power = new UserPower();
   //  this.isPower()
    this.isSign=false;//默认未注册
    this.mobile='';
    this.userId='';//用户id
    this.fromId="";
    this.userInfo=null;
  //  this._initEvent()
    // this.UserToLogin()
    this.time = 10000
    this.wxUser={}
    this.reload=false;
   // this.getPos()
    this.ispos=false;
    this.Map = Location;
    this.addressList=[];
    this.cityInfo = { code: "110100", name: "北京市" }
  
  }
  
  _initEvent(){
    //登录
    this.login = new UIEvent();
    this.getLocalSucc=new UIEvent();
    this.getLocalFail=new UIEvent();
    this.isLocationPower=new UIEvent();
    this.getOrderEvent=new UIEvent();

    this.getCartCount=new UIEvent();
    this.getOrderTJ = new UIEvent();
    this.showImgEvent = new UIEvent();
  }
  //获取用户地理位置是否授权
  isPower(){
    let that=this;
    this.power.resolveEvent({
      auth: 'scope.userLocation',
      succ(res) {//成功
        console.log(res)
        that.isLocationPower.Emit(true)
      },
      fail(err) {//失败
        console.log(err)
        that.isLocationPower.Emit(false)
      }

    })
  }
  //第一次登录
  UserToLogin(callback) {
    console.log(arguments)
    var that = this;
    let login = new Login();
    login.userToLogin({
    //  contentType:"application/x-www-form-urlencoded" ,
      data: arguments[1] || undefined,
      path: arguments[2] || _interface.login,//接口地址，默认为空(必传)
      loginSucc(res) { //登录成功(必传)
        if (parseInt(res.errcode) == 200) {
        

          //是否注册
          that.isSign = true;
          that.userId ='Bearer '+res.data.access_token;
          that.userInfo = res.data;
          callback && callback(res.data);
 
        }
        if (parseInt(res.errcode) == 404){
          //触发事件
          that.isSign=false;
          callback && callback(res.data)
        }
        else if (parseInt(res.errcode) == 1){
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
        else 
        {
          if (that.token  == '') {
            wx.showToast({
              title: '系统繁忙',
              icon: "none",
              mask: true
            })
          }

        }

      },
      loginFail(err) { //登录失败(必传)
      //  that.UserToLoginTwo()
        if (that.token  == '') {
          wx.showToast({
            title: '登录失败',
            icon: "none",
            mask: true
          })
        }
        console.log(err)
        callback && callback(err)

      }
    })
  }
 
  //获取附近店铺列表
  getPos(callBack){


    Tool.getLocation({}).then(res=>{
      wx.hideLoading()
      this.Map.init('map')
      console.log(res)
     // this.savePos(res)
      this.location=res;
      this.location.flag=true
      callBack && callBack(this.location)
      //this.getLocalSucc.Emit(res)
    }).catch(err=>{
    
     // this.getLocalFail.Emit(false)
      wx.showToast({
        title: '定位失败',
        icon:'none'
      })
      setTimeout(()=>{
        callBack && callBack({ flag: false })
      },2000)
      // wx.showModal({
      //   title: '提示',
      //   content: '您已取消定位',
      //   showCancel:false,
      //   success:res=>{
      //     if(res.confirm)
      //     {
            
      //     }
      //   }
      // })
      
      console.log(err)
     
    })
  }
  getCartNum(callBack) {
    
    var ajax = new Ajax({
    
      header: {
        Token: this.userId
      },
      path: _interface.getCartNum,
    //  _path: 'http://127.0.0.1:3000' + _interface.getCartNum
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {
       
        this.count = res.data.count
        callBack && callBack(this.count)
        this.getCartCount.Emit(this.count)
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
  //获取订单统计数量
  getOrderNum() {

    var ajax = new Ajax({

      header: {
        Token: this.userId
      },
      path: _interface.getOrderNum,
     
    })
    ajax.then(res => {
      
      if (res.errcode == 0) {
        let { has_pay, has_submit, wait_pay} = res.data;
        this.orderTJ.has_pay = Number(has_pay)
        this.orderTJ.has_submit = Number(has_submit)
        this.orderTJ.wait_pay = Number(wait_pay)
        this.orderTJ.total = Number(has_pay) + Number(has_submit) + Number(wait_pay) 
        this.getOrderTJ.Emit(this.orderTJ);
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
  //绑定分享者
  bindShare() {
    if (getApp().globalData.income == '' || getApp().globalData.income == this.openId) return 
    var ajax = new Ajax({
      data:{
        open_id: getApp().globalData.income
      },
      header: {
        Token: this.userId
      },
      path: _interface.bindShare,

    })
    ajax.then(res => {

      if (res.errcode == 0) {
        
      }
      else if (res.errcode == 1) {
        // wx.showToast({
        //   title: res.msg,
        //   icon: "none"
        // })
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
  //获取订单列表
  getOrderList(show=true,callBack){
    if (show)
    {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }
  
    var data = {
      token: this.token
    }
    var ajax = new Ajax({
      data,
      path: _interface.orderList
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {

        this.getOrderEvent.Emit(res.data)

        callBack && callBack(res.data)
       
       
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
  
  //确认订单
  confirmOrder(id,callBack) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var data = {
      token: this.token,
      id:id
    }
    var ajax = new Ajax({
      data,
      path: _interface.confirmOrder
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {

        callBack && callBack(res.data)


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
  //保存个人信息
  saveUserInfo(userInfo, callBack) {
    let data = {
      token: this.token,
      ...userInfo
    }
    var ajax = new Ajax({
      data,
      path: _interface.saveUserInfo
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {
        callBack(true)


      } else if (parseInt(res.errcode) == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })


      }

      console.log(res)
    })
    ajax.catch(err => {

      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  //保存用户地理位置
  savePos(pos) {
    let data = {
      user_id: this.userId,
      ...pos
    }
    var ajax = new Ajax({
      data,
      path: _interface.set_pos
    })
    ajax.then(res => {
      wx.hideLoading()
      // setTimeout(()=>{
      //   this.getPos()
      // },this.time)
      this.ispos=true
      if (res.errcode == 0) {
       
        

      } else if (parseInt(res.errcode) == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })
      }
    })
    ajax.catch(err => {
      setTimeout(() => {
        this.getPos()
      }, this.time)
      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  //地址 
  getAddressList(){
    let data = { "page_size": 10, "page": 1 };
    var ajax = new Ajax({
      data,
      header: {
        Token: this.userId 
      },
      path: _interface.getAddressList
    })
    this.trust_defult={}
    this.send_defult = {}
    this.pick_defult = {}
    ajax.then(res => {
      wx.hideLoading()

      this.ispos = true
      if (res.errcode == 0) {
        /*
        is_pick_defult: "0"
        is_send_defult: "0"
        is_trust_defult: "1"
        
        */
        res.data.forEach(item=>{
          if (Number(item.is_trust_defult) && Object.keys(this.trust_defult).length==0){
            this.trust_defult = item;
          }
          
          if (Number(item.is_send_defult) && Object.keys(this.send_defult).length == 0) {
            this.send_defult = item;
          }
          if (Number(item.is_pick_defult) && Object.keys(this.pick_defult).length == 0) {
            this.pick_defult = item;
          }
        })
        //console.log(res.data)
      } else if (parseInt(res.errcode) == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })
      }
    })
    ajax.catch(err => {

      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  
  /**********************标准****************************/
  //注册
  register(data, callBack, path = _interface.register) {
    wx.showLoading({
      title: '注册中...',
     
    })
    let that = this;
    wx.login({
      success: res => {
        let sendData = {
          ...res,
          id: getApp().globalData.income
        }
        wx.getUserInfo({
          withCredentials:true,
          success:(result)=>{
            sendData = Object.assign(sendData, data, result);
            console.log(sendData)
            let ajax = new Ajax({
              data: sendData,
              path: path,
              contentType: "application/json" 
            })
            ajax.then(res => {
              wx.hideLoading()
              if (res.errcode == 0) {
                //是否注册
                that.isSign = res.data.mobile == '' ? false : true;
                that.userInfo = res.data.userInfo;
                that.userId = res.data.access_token;
              
              // that.login.Emit(true);
                callBack && callBack()
                that.UserToLogin()
              }
              if (res.errcode == 1) {
                wx.showToast({
                  title: res.msg,
                  icon: 'none'
                })
              }
            })
            ajax.catch(err => {
              wx.hideLoading();
              console.log(err)
            })
          }
        })
      }
    })

  }
 //首页loading图展示
  getShowImg() {
   
    let data = {
     
    }
    var ajax = new Ajax({
      data,
      path: _interface.getShowImg||''
    })
    ajax.then(res => {
   
      if (res.errcode == 0) {
        this._showTip_ = res.data.status;
        wx.getStorage({
          key: 'imgId',
          success: result=> {
            
           console.log(result)
            if (!result.data)
            {
              setTimeout(() => {
                this.showImgEvent.Emit({
                  img_url: res.data.img_url,
                  show: res.data.status //false 不显示， true 显示
                })
              }, 2000)
              wx.setStorageSync('imgId', res.data.time);
            }
            else
            {
              if (result.data !== res.data.time)
              {
                setTimeout(() => {
                  this.showImgEvent.Emit({
                    img_url: res.data.img_url,
                    show: res.data.status //false 不显示， true 显示
                  })
                }, 2000)
                wx.setStorageSync('imgId', res.data.time);
              }
            }

          },
          fail:err=>{
            wx.setStorageSync('imgId', res.data.time);
            setTimeout(() => {
              this.showImgEvent.Emit({
                img_url: res.data.img_url,
                show: res.data.status //false 不显示， true 显示
              })
            }, 2000)

          }
        })
        
      
      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })
      }
    })
    ajax.catch(err => {
   
      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
  
    })
  }
  //获取验证码
  getCode(mobile,callBack){
    wx.showLoading({
      title: '发送中...',
      mask:true
    })
    let data = {
      user_id:this.userId,
      userphone:mobile
    }
    var ajax = new Ajax({
      data,
      path: _interface.get_code
    })
    ajax.then(res => {
      wx.hideLoading()
  

      if (res.errcode == 0) {
        callBack && callBack()


      } 
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })
      }
    })
    ajax.catch(err => {
      setTimeout(() => {
        this.getPos()
      }, this.time)
      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  
  //获取用户信息 
  getUserInfo(callBack) {
    let data = {
      token: this.token
    }
    var ajax = new Ajax({
      data,
      header: {
        Token: this.userId
      },
      path: _interface.getUserInfo
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {
        this.userInfo = Object.assign(this.userInfo,res.data);
        console.log(this.userInfo)
        this.userBaseInfo=res.data
        this.visble=res.data.visble;
        this.mobile = res.data.mobile;
        this.user_type = res.data.user_type;
        this.company_id = res.data.company_id;
      
        callBack && callBack(this.userInfo ,res.data);

      } else if (parseInt(res.errcode) == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })


      }

      console.log(res)
    })
    ajax.catch(err => {

      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  //获取地址列表
  getList(cb){
    var ajax = new Ajax({
      data:{},
      path: _interface.getCityList
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {
        this.addressList=res.data;
        cb && cb(res.data)

      } else if (parseInt(res.errcode) == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })


      }

      console.log(res)
    })
    ajax.catch(err => {

      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  getThreeList(cb) {
    var ajax = new Ajax({
      data: {
        
      },
      header: {
        Token: this.userId
      },
      path: _interface.getThreeCity
    })
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {
        this.addressThreeList = res.data;
        cb && cb(res.data)

      } else if (parseInt(res.errcode) == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })

      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none",
          mask: true
        })


      }

      console.log(res)
    })
    ajax.catch(err => {

      wx.showToast({
        title: '系统繁忙',
        icon: "none",
        mask: true
      })
      console.log(err)
    })
  }
  //getThreeCity
}
let user=new User();
export { user as User }