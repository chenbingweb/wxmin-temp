// components/user-info/user-info.js

import Ajax from "../../libs/Ajax.js";

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    nickname:"",
    show:false,
    focus:false,
    mobile:"",
    mobile_code:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onFocuse(){
      this.setData({
        focus:true
      })
    },
    onGetPhone({detail}){
      console.log(detail)
      if (detail.errMsg=="getUserInfo:fail auth deny"||detail.errMsg.indexOf('fail')>-1){
        wx.showToast({
          title: '获取失败',
          icon:'none'
        })
        return
      }
      wx.showLoading({
        title: '获取中...',
        mask:true
      })
      getMobile.bind(this)(detail)
      try{
        wx.reportEvent("register_mobile", {
          "code": detail.code||'',
          "err_msg": detail.errMsg||''
        })
      }catch(e){}
    },
    onBlur(e){
      console.log(e)
      this.setData({
        nickname:e.detail.value
      })
     
    },
    open(){
      this.setData({
        show:true
      })
    },
    hide(){
      this.setData({
        show:false
      })
    },
    onSubmit(e){
      /*
      
      nickname:"",
    show:true,
    focus:false,
    mobile:"",
    mobile_code:""*/
      if(this.data.nickname==''||this.data.mobile==''){
        return
      }
      this.triggerEvent("confirm",{...e.detail.value})
    }
  }
})
function getMobile(data){
  // /client/user/get-mobile

  var ajax = new Ajax({
    header: {
      // Token: User.userId
    },
    data,
    path:'/user/get-mobile'
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      console.log(res)
      this.setData({
        mobile:res.data,
        mobile_code:data.code
      })
      try{
        wx.reportEvent("register_mobile_success", {
          "mobile": res.data||''
        })
      }catch(e){
  
      }
    }
    else if(res.errcode==-1)
    {
      wx.showToast({
        title: res.msg||'网络异常，请稍后再试',
        icon: 'none'
      })
    }
    else {
      wx.showToast({
        title: '网络异常，请稍后再试',
        icon: 'none'
      })
    }
  })
  ajax.catch(err => {
    wx.hideLoading()
    wx.showToast({
      title: '网络异常，请稍后再试',
      icon: 'none'
    })
  })
}