let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import Upload from "../../libs/Upload.js";
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";
var WxParse = require('../../wxParse/wxParse.js');
//获取店铺详情
export function getShopDetail(sid,that) {
  wx.showLoading({
    title: '加载中...',
    mask:true
  })
  var data = {
    id:sid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.getShopDetail  // _interface.get_shop_banner //
  })
  ajax.then(res => {
   
    if (res.errcode == 200) {
      console.log(getApp().globalData.imgUrl )
      console.log(getApp().globalData.imgUrl + res.data.logo)
      res.data.logo = getApp().globalData.imgUrl + res.data.logo;
      res.data.refresh_time = parseInt(res.data.refresh_time)*1000;
      that.setData({
      
        detail:res.data,
        serverList: res.data.reserve_setting
      },()=>{
        getActive(that)
      })
      WxParse.wxParse('article', 'html', res.data.details, that, 5);
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
    wx.showToast({
      title:  '网络繁忙，请稍后再试',
      icon: 'none'
    })
    console.log(err)
  })
}
//获取预约详情 doAppointment
export function getAppointment(sid, that) {

  var data = {
    id: sid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.getAppointment  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {



    }
    else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {

    console.log(err)
  })
}
//获取预约设置
export function getShopAppointmentSet(sid, date, that) {
  wx.showLoading({
    title: '加载中...',
  })
  var data = {
    id: sid,
    date: date
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.getShopAppointmentSet  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      that.setData({
        serverList:[]
      },()=>{
        that.setData({
          serverList: res.data
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
//预约
//获取预约详情 doAppointment
export function doAppointment(tid, num,that) {

  var data = {
    time_id: tid,
    user_count: num
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.doAppointment  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      let { serverList } = that.data;
      serverList.forEach(item=>{
        if(item.id==tid)
        {
          item.status = 'reserved'
        
        }
      })
      that.setData({
        serverList
      })
      User.reload=true;
      wx.navigateTo({
        url: '../appointSuccess/appointSuccess',
      })
      that._reserInfo = res.data;
      
    }
    else {
      wx.showToast({
        title: res.msg || '网络繁忙，请稍后再试',
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {

    console.log(err)
  })
}
//获取活动日期
export function getActive(that){
  var data = {
   
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.getActive  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      if (res.data && typeof res.data =='object')
      {
        Object.keys(res.data).forEach(item=>{
          res.data[item] = res.data[item].join();
        })
        console.log(res.data)
        that.setData({
          jjr: { jjr: res.data, available_dates: that.data.detail.available_dates}
        })
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
    wx.showToast({
      title:  '网络繁忙，请稍后再试',
      icon: 'none'
    })
    console.log(err)
  })
}
//获取活动日期 
export function reserverTip(that) {
  var data = {

  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.reserverTip  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      that.tip=res.data;
    }
    else {
      wx.showToast({
        title: res.msg || '网络繁忙，请稍后再试',
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {
    wx.showToast({
      title: '网络繁忙，请稍后再试',
      icon: 'none'
    })
    console.log(err)
  })
}