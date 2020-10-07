import config from "../config.js";//相关配置文件
import { User } from "../model/user.js"
export default class Upload{
  /**
   * 
   * {
   *  path:'',
   *  tempFilePath:''
   * }
   * 
   */
  constructor(options){
    if (typeof options != 'object') {
     
      console.log(new Error('请传入Object类型的参数'))
      return
    }
    let param={}
    param = Object.assign(param, options)
    let promise=new Promise((resolve,reject)=>{
      this._upLoadFile(param, resolve, reject)
    })
    return promise
  }
  //上传文件
  _upLoadFile(param,resolve, reject){

    wx.uploadFile({
      url: config.url + param.path,
      filePath: param.filePath,
      name: 'file',
      header: { 'content-Type': 'multipart/form-data', Token: User.userId },
      formData: param.formData||{},//传给服务器额外信息
      success(res){
        if (res.statusCode == 200) 
        {
          
          resolve(JSON.parse(res.data))
        }
        else
        {
          reject('服务器错误')
        }
      },
      fail(){
        reject('服务器连接失败')
      }
    })
  }
}