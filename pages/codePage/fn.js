
let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import Upload from "../../libs/Upload.js";
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";

//获取店铺详情 codeResult
export function appointmentDetail(oid, that) {
  wx.showLoading({
    title: '加载中...',
    mask:true
  })
  var data = {
    id: oid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.appointmentDetail  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    
    if (res.errcode == 200) {
      getCode(oid, (codeStr)=>{
        console.log(codeStr)
        codeResult(codeStr,that)
        that.createCode(codeStr, (img) => {
          wx.hideLoading()
          res.data.qrimg = img
          that.setData({
            detail: res.data
          })
        })
      })
     
    
      
      
      
    }
    else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {
    wx.hideLoading()
    console.log(err)
  })
}
export function getCode(oid, cb) {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  var data = {
    id: oid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.getCode  // _interface.get_shop_banner //
  })
  ajax.then(res => {

    if (res.errcode == 200) {

      cb && cb(res.data)
    
    }
    else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {
    wx.hideLoading()
    console.log(err)
  })
}
//获取店铺详情 
export function codeResult(oid, that) {
 
  var data = {
    code: oid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.codeResult  // _interface.get_shop_banner //
  })
  ajax.then(res => {

    if (res.errcode == 200) {
      if (res.data =='consumed')
      {
        if (that.timmer)
        { 
          clearTimeout(that.timmer)
          that.timmer = null
        }
       
        let objPage = getApp().getPage("pages/appointment/appointment")
        if(objPage)
        {
          let { list } = objPage.data;
          list.forEach(item=>{
            if(item.id==oid)
            {
              item.status = 'consumed'
            }
          })
          objPage.setData({
            list
          })
        }
        wx.showModal({
          title: '提示',
          content: '核销成功',
          showCancel:false,
          success:res=>{
            if(res.confirm)
            {
              wx.navigateBack({
                
              })
            }
          }
        })
      }
      else if (res.data == 'normal')
      {
        that.timmer = setTimeout(()=>{
            codeResult(oid, that) 
          },3000)
      }
      //过期
      else if (res.data =='code_expired')
      {
        if (that.timmer) {
          clearTimeout(that.timmer)
          that.timmer=null
        }
        appointmentDetail(oid, that)
      }
      else if(res.data=='canceled')
      {
        wx.showToast({
          title: '已取消',
          icon:'none'
        })
        setTimeout(()=>{
          wx.navigateBack({
            
          })
        },2000)
      }
     
     
      


    }
    else {
      wx.showToast({
        title: res.msg||'网络繁忙，请稍后再试',
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {
    wx.hideLoading()
    console.log(err)
  })
}