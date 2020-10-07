// components/loginPage/loginPage.js
import { User } from "../../model/user.js";
import Tool from "../../libs/Tool.js";
import Check from "../../libs/check.js";
import Ajax from "../../libs/Ajax.js";
let _interface=require("../../utils/interface.js")
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
    clear:false,
    mobile:'',
    count:0,
    check_code:'',
    selected:false
  },
  created(){
    this.code_id=''
    this.myEventOption = {
      bubbles: false,
      composed: false,
      capturePhase: false
    } // 触发事件的选项
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(){
      this.setData({
        selected: !this.data.selected
      })
    },

    //登录
    onGotUserInfo({detail}){
    
      console.log(detail)
      if (detail.errMsg=="getUserInfo:fail auth deny"||detail.errMsg.indexOf('fail')>-1)
      {
        wx.navigateBack({
          
        })
       
        return
      }
      // if (this.data.mobile == '') {
      //   wx.showToast({
      //     title: '请输入手机号',
      //     icon: 'none'
      //   })
       
      //   return
      // }
      // if (!Check.checkPhoneNum(this.data.mobile)) {
       
      //   return
      // }
      // if (this.data.check_code == '') {
      //   wx.showToast({
      //     title: '请输入验证码',
      //     icon: 'none'
      //   })
      
      //   return
      // }
      // if ( parseInt(this.data.check_code) != this.code_id)
      // {
      //   wx.showToast({
      //     title: '验证码不正确',
      //     icon: 'none'
      //   })
      
      //   return

      // }
      // if (this.data.selected==false)
      // { 
      //   wx.showToast({
      //     title: '请阅读使用协议',
      //     icon: 'none'
      //   })
      
      //   return
      // }
      wx.showLoading({
        title: '登录中...',
        mask: true
      })
      wx.login({
        success:res=>{
          let data = {
            // check_code: this.data.check_code,
            // mobile: this.data.mobile,
            // verify_code_id:this.code_id,
            ...detail,
            ...res
          }
          console.log(data)
       
          userSign.call(this, data)
        }
      })
     
    },

    //登录
    onFormSubmit({detail}){
 
      console.log(detail);
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } 
    },
    //绑定验证码事件
    onInputCode({detail}){
      let { value } = detail;
      if (value !== '') {
        this.setData({
          check_code: value
        })
      }
    },
    //绑定输入手机号事件
    onInput({detail}){
      let {value}=detail;
      if(value!=='')
      {
        this.setData({
          mobile:value,
          clear:true
        })
      }

    },
    //绑定清除手机号
    onClear(){
      this.setData({
        mobile: '',
        clear: false
      })
    },
    onBack() {
      wx.navigateBack({

      })
    },
    //绑定获取验证码事件
    onGetCode(){
      if (this.data.mobile=='')
      {
        wx.showToast({
          title: '请输入手机号',
          icon:'none'
        })
        return
      }
      if (!Check.checkPhoneNum(this.data.mobile))
      {

        return
      }
      wx.showLoading({
        title: '发送中...',
        mask:true
      })
      getCode.call(this,this.data.mobile, ()=>{
        Tool.countDown(res => {
          this.setData({
            count: res
          })
        })()
      })
      
    }
  }
})
//获取验证吗
function getCode(mobile,callBack){
  var data = {
    mobile: mobile
  }
  var ajax = new Ajax({
    header: {
      Token: User.userId
    },
    data,
    path: _interface.getCode
  })
  ajax.then(res => {
    wx.hideLoading()
    if(res.errcode==0)
    {
      this.code_id=res.data.code
      wx.showToast({
        title: '发送成功',
      })
      callBack && callBack()
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
  })
  ajax.catch(err => {
    wx.hideLoading()
   wx.showToast({
     title: '获取验证码接口报错',
     icon:'none'
   })
  })
}
//确认登录
function userSign(data){
 
  var ajax = new Ajax({
    header: {
      // Token: User.userId
    },
    data,
    path: _interface.register
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      wx.showToast({
        title: '登录成功',
      })
      User.isSign = true;
      
      setTimeout(()=>{
      
        User.UserToLogin(() => {
          User.reload = true;
          // 触发事件的选项
          this.triggerEvent('isLogin', {}, this.myEventOption)
          wx.navigateBack({
            
          })
        })

      },500)
     
    
    }
    else if(res.errcode==1)
    {
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
  })
  ajax.catch(err => {
    wx.hideLoading()
    wx.showToast({
      title: '登录注册接口报错',
      icon: 'none'
    })
  })
}