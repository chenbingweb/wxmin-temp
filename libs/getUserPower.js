export default class UserPower{
  constructor(){
    return this;
  }
  //判断用户当前设置
  getSetting() {
    let promise = new Promise((resolve, reject) => {
      wx.getSetting({
        success: resolve,
        fail: reject
      })
    })
    return promise
  }
  authorize(auth) {
    /**
      *  scope.userInfo	wx.getUserInfo	用户信息
          scope.userLocation	wx.getLocation, wx.chooseLocation	地理位置
        scope.address	wx.chooseAddress	通讯地址
        scope.invoiceTitle	wx.chooseInvoiceTitle	发票抬头
        scope.werun	wx.getWeRunData	微信运动步数
        scope.record	wx.startRecord	录音功能
        scope.writePhotosAlbum	wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum	保存到相册
        scope.camera		摄像头
      * 
     */
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: auth,
        success: (r) => {//用户勾选了直接执行回调
          r=Object.assign(r,{auth})
          resolve(r)
        },
        fail: () => {
          //调起客户端小程序设置界面，返回用户设置的操作结果。
          reject(false)
          // if (one) {
          //   reject()
          // }
        }
      })
    })
  }
  //再次发去用户请求button按钮
  /**参数结构
   * option {
      auth: 'scope.userLocation',
      succ(res) {//成功
        console.log(res)
      },
      fail(err) {//失败
        console.log(err)
      }
    }
   * 
   */
  resolveEvent(option={}) {
    
    if (typeof option.succ !== 'function' && typeof option.fail !== 'function')
    {
      console.log('请传入正确的参数，succ和fail必须是function')
      return 
    }
    //默认设置获取用户信息
    let param = { auth:'scope.userInfo'};
    param=Object.assign(param,option);
    this.getSetting().then(res => {
      if (!res.authSetting[param.auth]) {
        this.authorize(param.auth).then(param.succ).catch(param.fail)
      }
      else
      {
        param.succ(true)
      }
    }).catch(err => {
      param.fail(err)
      console.log(err)
    })
    
  }
  //打开个人授权列表
  /**
   *option:{
      auth: 'scope.userLocation',
      succ(res) {//成功
        console.log(res)
      },
      fail(err) {//失败
        console.log(err)
      }
    }
   * 
   */
  openSetting(option={}){
    if (typeof option.succ !== 'function' && typeof option.fail !== 'function') {
      console.log('请传入正确的参数，succ和fail必须是function')
      return
    }
    let param = { };
    //参数合并
    param = Object.assign(param, option);
    let promise = new Promise((resolve, reject)=>{
      //获取用户授权列表
      wx.openSetting({
        success: (res) => {

          if (res.authSetting[param.auth])
          {
            //打开选项
            this.authorize(param.auth).then(param.succ).catch(param.fail)
          }
          else
          {
            //关闭选项
            param.fail(false)
          }
        }
      })
    })
  }
  //多个授权同时执行
  /**
   * {
      succ(res){//
      succ:[{"errMsg":"authorize:ok","auth":"scope.userLocation"},{"errMsg":"authorize:ok","auth":"scope.userInfo"}]//用户有勾选的，
      fali:[]//如果全部没有勾选，则为空数组
        console.log(res)
      },
      fail(err){

      }
    }
   */
  openSettingLists(option){
    if (typeof option.succ !== 'function' && typeof option.fail !== 'function') {
      console.log('请传入正确的参数，succ和fail必须是function')
      return
    }
    this.openSettingItem().then(option.succ).catch(option.fail)
  }
  // this.authorize(auth)
  openSettingItem(){
    let promise = new Promise((resolve, reject) => {
      //获取用户授权列表
      wx.openSetting({
        success: (res) => {
          //res.authSetting[auth]
          let authList = res.authSetting;
          console.log(res)
          let openSetList=[];
          for (let key in authList)
          {
            if (authList[key])
            {
              openSetList.push(this.authorize(key))
            }
          }
          resolve(Promise.all(openSetList))
        },
        fail:err=>{
          console.log('openSettingFail')
          reject('openSettingFail')
        }
      })
    })
    return promise
  }
}