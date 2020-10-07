import config from "../config.js";//相关配置文件
import datas from "../utils/data.js";//假数据

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
      header:{}
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
  ajax(options, resolve, reject){
    console.log(config.url + options.path)
    const requestTask = wx.request({
      url: options._path ? options._path : (config.url + options.path),//请求地址+接口 application/x-www-form-urlencoded
      data: options.data,
      method: options.reqtype || 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
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
}