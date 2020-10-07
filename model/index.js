let _interface = require("../utils/interface.js")
import Ajax from "../libs/Ajax.js";
import Tool from "../libs/Tool.js";
import Upload from "../libs/Upload.js";
import { UIEvent } from "../libs/UIEvent.js";
import {User} from "./user.js"
export default class Index{
  constructor(){
    this.petInfo={};
    this.petImgs=[];
    this.routImgs=[];
    this._initEvent();
    this.oid=''
  }
  _initEvent() {
    //开始配送
    this.sendEvent = new UIEvent();
  }
  //添加宠物信息
  setPetInfo(value){
    this.petInfo=value
  }
  //清除宠物信息  
  clearPetInfo(){
    this.petInfo ={}
  }
  //确认订单 getPosterPet
  getPetInfo(id,callBack) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    var data = {
      token: User.token,
      id
    }
    var ajax = new Ajax({
      data,
      path: _interface.getPosterPet
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
  //开始配送
  startSendFn(oid){
    let that=this;
    this.oid=oid;
    let obj={
      callBack: that.petImg.bind(that),
      tempFilePaths: that.petInfo.pet_img
    }
    getApp().uploadImgs(obj)();
    let obj2 = {
      callBack: that.routeImg.bind(that),
      tempFilePaths: that.petInfo.route_image
    }
    getApp().uploadImgs(obj2)()
  }
  petImg(res){
    this.petImgs = res;
    this.petInfo.pet_img = res;
    if (this.petImgs.length && this.routImgs.length) {
      this.startSend(this.petInfo)
    }
    
  }
  routeImg(res){
    this.routImgs = res;
    this.petInfo.route_image = res;
    if (this.petImgs.length && this.routImgs.length) {
      this.startSend(this.petInfo)
    }
  }

  //开始配送
  startSend(sendData){
    // wx.showLoading({
    //   title: '配送中...',
    //   mask: true
    // })

    var data = {
      token: User.token,
      id:this.oid,
      ...sendData
    }
    var ajax = new Ajax({
      data,
      path: _interface.startSend
    })
    let that=this;
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {

        that.petInfo = {};
        that.petImgs = [];
        that.routImgs = [];
        that.oid='';
        that.sendEvent.Emit(true)
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
  //送达目的地
  isArrive(img,oid,callBack){

    var data = {
      token: User.token,
      imgs:img,
      id: oid
    }
    var ajax = new Ajax({
      data,
      path: _interface.isArrive
    })
    let that = this;
    ajax.then(res => {
      wx.hideLoading()
      if (res.errcode == 0) {

        callBack(true)
      }
      else if (res.errcode == 1) {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
        callBack(false)
      }
      else {
        wx.showToast({
          title: '系统繁忙',
          icon: "none"
        })
        callBack(false)
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
  //获取配送到店照片
  getArriveImg(id, callBack) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    var data = {
      token: User.token,
      id
    }
    var ajax = new Ajax({
      data,
      path: _interface.getArriveImg
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
}
let index = new Index();
export { index as Index }