import config from "../config.js";//相关配置文件
import datas from "../utils/data.js";//假数据
import md5 from  "./md5"
import Tool from "./Tool"

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }
  return result;
}
let time = Tool.formatTime(new Date,'-',true)


export default class Ajax
{
  /**
   * options中的参数
   * {
   *  data:object类型，
   *  reqtype:undefined,//默认为undefined，表示请求类型是POST
   *  contentType: undefined,//默认为undefined，表示发送内容类型是application/json
   *  path:'',//接口地址，默认为空
   * }
   * 
   */
  constructor(param){

    if (typeof param!='object') 
    {
      console.log('请传入Object类型的参数')
      return
    }
    let options = {
      data:{},//默认为空，表示不传任何参数
      reqtype:undefined,//默认为undefined，表示请求类型是POST
      contentType: undefined,//默认为undefined，表示发送内容类型是application/json
      path:'',//接口地址，默认为空,
      header:{},
      responseType:"text"
    }
    if (typeof param == 'object')
    {
      options = Object.assign(options, param)
    } 
    //加密算法
     //options.data.signature = escape('EB6EB8B669BA4846')
     let promise = new Promise((resolve, reject)=>{
       this.requestTask=this.ajax(options, resolve, reject)
     })
    promise.requestTask = this.requestTask;
     return promise
  }
  ajax(options, resolve, reject,usecloud=true){
    console.log(config.url + options.path)
    
    let nonce=generateRandomString(32)
    console.log(nonce)
    let time = Tool.formatTime(new Date,'-',true)
    let sign = md5(nonce+time+'db763a18-1a14-4fad-aa8c-73a2cf3d10e1')
    if(usecloud){
      return this.call({
        path:options._path ? options._path : config.url + options.path,
        method:options.reqtype || 'POST',
        responseType:options.responseType||'text'
        // ...options
      },{
        sign,
        time,
        nonce,
        // "Content-Type": options.contentType == undefined ? "application/json" : "application/x-www-form-urlencoded",
        "Content-Type": options.contentType == undefined ? "application/x-www-form-urlencoded" : " application/json",
       ...options.header
      },options.data).then(res=>{
        resolve(res||{})
        return Promise.resolve(res||{})
      }).catch(err=>{
        reject(err)
        return Promise.reject(err)
      })
    }
    const requestTask = wx.request({
      responseType:options.responseType,
      url: options._path ? options._path : (config.url + options.path),//请求地址+接口 application/x-www-form-urlencoded
      data: options.data,
      method: options.reqtype || 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        sign,
        time,
        nonce,
        // "Content-Type": options.contentType == undefined ? "application/json" : "application/x-www-form-urlencoded",
        "Content-Type": options.contentType == undefined ? "application/x-www-form-urlencoded" : " application/json",
       ...options.header
      },
      dataType: 'JSON',
      success: function (res) {
        if (res.statusCode == 200) {
          var res = res.data;
          if (typeof res == "string" && res != '') {
            try{
              res = JSON.parse(res.trim())
            }catch(e){
              wx.showToast({
                title: '网络不畅，请稍后再试',
                icon:'none'
              })
            }
         
          }
          resolve(res)
        }
        else {
          //测试
          if (config.debug) {
            resolve(datas);
          }
          //执行获取数据失败
          reject('fail')
        }
        // 取消请求任务
        // if (requestTask) {
        //   requestTask.abort()
        // }
      },
      fail:function (err) {
        //直接请求服务器失败
        wx.hideLoading()
        reject(err);
        //测试
        if (config.debug) {
          resolve(datas);
        }
      },
      //无论是否请求成功，都会执行此回调
      complete: function (res) {
  
      }
    });
    return requestTask
  }
  ajax1(options, resolve, reject){
    console.log(config.url + options.path)
    
    let nonce=generateRandomString(32)
    console.log(nonce)
    let time = Tool.formatTime(new Date,'-',true)
    let sign = md5(nonce+time+'db763a18-1a14-4fad-aa8c-73a2cf3d10e1')
  
    const requestTask = wx.request({
      responseType:options.responseType,
      url: options._path ? options._path : (config.url + options.path),//请求地址+接口 application/x-www-form-urlencoded
      data: options.data,
      method: options.reqtype || 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        sign,
        time,
        nonce,
        // "Content-Type": options.contentType == undefined ? "application/json" : "application/x-www-form-urlencoded",
        "Content-Type": options.contentType == undefined ? "application/x-www-form-urlencoded" : " application/json",
       ...options.header
      },
      dataType: 'JSON',
      success: function (res) {
        if (res.statusCode == 200) {
          var res = res.data;
          if (typeof res == "string" && res != '') {
            try{
              res = JSON.parse(res.trim())
            }catch(e){
              wx.showToast({
                title: '网络不畅，请稍后再试',
                icon:'none'
              })
            }
         
          }
          resolve(res)
        }
        else {
          //测试
          if (config.debug) {
            resolve(datas);
          }
          //执行获取数据失败
          reject('fail')
        }
        // 取消请求任务
        // if (requestTask) {
        //   requestTask.abort()
        // }
      },
      fail:function (err) {
        //直接请求服务器失败
        wx.hideLoading()
        reject(err);
        //测试
        if (config.debug) {
          resolve(datas);
        }
      },
      //无论是否请求成功，都会执行此回调
      complete: function (res) {
  
      }
    });
    return requestTask
  }
  //Promise.then()
  reqSucc(res){
     
  }
  //Promise.catch()
  reqErr(err){
     wx.hideLoading()
    fail(res);
    //测试
    if (config.debug) {
     succ(datas);
    }
  }
  async call(obj,header,data, number=0){
    const that = this
    if(that.cloud == null){
      that.cloud = new wx.cloud.Cloud({
        resourceAppid: config.resourceAppid, // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv: config.resourceEnv, // 微信云托管的环境ID
      })
      await that.cloud.init() // init过程是异步的，需要等待init完成才可以发起调用
    }
    try{
      
      const result = await that.cloud.callContainer({
        path: obj.path, // 填入业务自定义路径和参数，根目录，就是 / 
        method: obj.method||'GET', // 按照自己的业务开发，选择对应的方法
        // dataType:'text', // 如果返回的不是json格式，需要添加此项
        header: {
          'X-WX-SERVICE': config.wxserver, // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他header参数
          ...header
        },
        data: data,
        dataType: 'JSON',
        responseType:obj.responseType,
        // 其余参数同 wx.request
      })
      console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
 
      var res = result.data;
      if (typeof res == "string" && res != '') {
        try{
          res = JSON.parse(res.trim())
        }catch(e){
          wx.showToast({
            title: '网络不畅，请稍后再试',
            icon:'none'
          })
        }
     
      }
      
      return res// 业务数据在data中
    } catch(e){
      const error = e.toString()
       // 如果错误信息为未初始化，则等待300ms再次尝试，因为init过程是异步的
      if(error.indexOf("Cloud API isn't enabled")!=-1 && number<3){
        return new Promise((resolve)=>{
          setTimeout(function(){
            resolve(that.call(obj,number+1))
          },300)
        })
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
  }
}