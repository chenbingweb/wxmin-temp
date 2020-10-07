import config from "../config.js";//相关配置文件
import datas from "../utils/data.js";//假数据
import Ajax from "./Ajax.js";//引入Ajax
import UserPower from "./getUserPower.js"
class Login extends UserPower{
  
  constructor(){
    super()
    this.loginSucc = null;
    return this
  }
  //微信登录
  wxLogin(resolve, reject){
    wx.login({
      success: res=>{
        wx.getUserInfo({
          withCredentials:true,
          success: data=>{
            var data=Object.assign(data,res)
            resolve(data)
            //获取getApp对象
            let app=getApp();
            //添加全局用户基本信息
            app.globalData.userInfo=data.userInfo;
          
            // if (bindInfo) {
            //   res = Object.assign(res, bindInfo)
            // }
            // that.userLogin(res, data, callback);
            // console.log(data.userInfo)
            // that.globalData.userInfo = data.userInfo;
            // typeof cb == "function" && cb(that.globalData.userInfo)
          },
          fail: () => {
            //设置用户信息
            if (this.defalutValue && typeof this.defalutValue=='object')
            {
              reject(this.defalutValue)
            }
            else
            {
              reject()
            }
            
            //登录失败或拒绝登录设置默认信息
            // var defalutValue = { userId: '', type: 0 }
            // callback(defalutValue)
          }
        })
      }
    })
  }
  //用户自动登录
  toLogin(obj){
    if (typeof obj != 'object') {
     throw new Error(`请传入Object对象,其中的参数格式：
        {
          path:'',//接口地址，默认为空(必传)
          loginSucc(res){}//登录成功(必传)
          loginFail(err){}//登录失败(必传)
          data:object类型，
          reqtype:undefined,//默认为undefined，表示请求类型是POST
          contentType: undefined,//默认为undefined，表示发送内容类型是application/json
         
        }

      `)
      return
    }

    let param = obj||{};
    //获取用户信息
    let promise = new Promise((resolve, reject) => {
      this.wxLogin(resolve, reject)
    })
    promise.then(res=>{
      let ajaxData={}
      for (let key in param) {
        if (key == "path" || key == 'reqtype' || key =='contentType')
        {
          ajaxData[key]=param[key]
        }
      }
      console.log(res)
      let { iv, code, encryptedData } = res;
      let mobile=getApp().globalData.mobile;//手机号
      let detail = getApp().globalData.bindUserDetail;//微信加密信息
     
      if (mobile)
      {
        ajaxData.data = { iv, code, encryptedData, mobile }
      }
      else if (detail)//微信绑定手机号
      {
        // let encryptedMobile = detail.encryptedData
        ajaxData.data = { iv, code, encryptedData, detail }
        // ajaxData.data = Object.assign(ajaxData.data, detail)
      }
      else
      {
        ajaxData.data = { iv, code, encryptedData }
      }
     
      
      
      console.log(ajaxData)
      let ajaxPromise = new Ajax(ajaxData);
      if (typeof param.loginSucc == 'function' && typeof param.loginFail == 'function')
      {
        ajaxPromise.then(param.loginSucc).catch(param.loginFail)
      }
      else
      {
        
        console.log('请传入loginSucc和loginFail方法')
      }
     
      
    }).catch(err=>{
      console.log(err)
    })
    return this;
  }
  //用户手动登录
  resolveLogin(options){
    var that=this;
    //调用父级的的方法
    super.resolveEvent({
      succ(res){
        if(res)
        {
          //添加登录成功和失败方法
          //that.loginSucc = options.loginSucc;
          //that.loginFail = options.loginFail;
          that.toLogin(options)
        }
        console.log('OK', res)
      },
      fail(){
        options.loginFail('err')
        console.log('err')
      }
    })
  }

  //获取用户openid参数
  userLogin(resolve, reject){
    wx.login({
      success: res => {
        resolve(res)
      },
      fail: () => {
        //设置用户信息
        if (this.defalutValue && typeof this.defalutValue == 'object') {
          reject(this.defalutValue)
        }
        else {
          reject()
        }

        //登录失败或拒绝登录设置默认信息
        // var defalutValue = { userId: '', type: 0 }
        // callback(defalutValue)
      }
      
    })
  }
  userToLogin(obj) {
    if (typeof obj != 'object') {
      throw new Error(`请传入Object对象,其中的参数格式：
        {
          path:'',//接口地址，默认为空(必传)
          loginSucc(res){}//登录成功(必传)
          loginFail(err){}//登录失败(必传)
          data:object类型，
          reqtype:undefined,//默认为undefined，表示请求类型是POST
          contentType: undefined,//默认为undefined，表示发送内容类型是application/json

        }

      `)
      return
    }

    let param = obj || {};
    //获取用户信息
    let promise = new Promise((resolve, reject) => {
      this.userLogin(resolve, reject)
    })
    promise.then(res => {
      let ajaxData = {}
      for (let key in param) {
        if (key == "path" || key == 'reqtype' || key == 'contentType') {
          ajaxData[key] = param[key]
        }
      }

      //res = Object.assign(ajaxData, param.data||{})
      console.log(res)
      res = Object.assign(res, param.data || {})
     // let { iv, code, encryptedData } = res;
      // let mobile = getApp().globalData.mobile;//手机号
      // let detail = getApp().globalData.bindUserDetail;//微信加密信息

      // if (mobile) {
      //   ajaxData.data = { iv, code, encryptedData, mobile }
      // }
      // else if (detail)//微信绑定手机号
      // {
      //   // let encryptedMobile = detail.encryptedData
      //   ajaxData.data = { iv, code, encryptedData, detail }
      //   // ajaxData.data = Object.assign(ajaxData.data, detail)
      // }
      // else {
      //   ajaxData.data = { iv, code, encryptedData }
      // }
      ajaxData.data = res



      console.log(ajaxData)
      let ajaxPromise = new Ajax(ajaxData);
      if (typeof param.loginSucc == 'function' && typeof param.loginFail == 'function') {
        ajaxPromise.then(param.loginSucc).catch(param.loginFail)
      }
      else {

        console.log('请传入loginSucc和loginFail方法')
      }


    }).catch(err => {
      console.log(err)
    })
    return this;
  }

}

module.exports = Login
