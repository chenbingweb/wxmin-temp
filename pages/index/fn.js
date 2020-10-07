let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import Upload from "../../libs/Upload.js";
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";

//获取banner 
export function getNearList(that) {

  var data = {}
  var ajax = new Ajax({
    data,
    path: _interface.getNearList  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 0) {
      let pos = [];
      let includePoints=[]
      wx.getImageInfo({
        src: '../../images/cc_icon.png',
        success({ width, height }) {
          res.data.forEach((item, index) => {
            let { latitude, longitude } = item;
            pos.push(Location.createMarker(latitude, longitude, index, width * 0.7, height * 0.7, '../../images/cc_icon.png'));
            includePoints.push({
              latitude,
              longitude
            })
          })
          that.setData({
            markers: pos,
            includePoints: res.data
          })
        }
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

    console.log(err)
  })
}
//解析地址
export function parsePos(pos,cb){
  var data = {
    latitude: pos.latitude,
    longitude: pos.longitude
  }
  var ajax = new Ajax({
    data,
    path: _interface.parsePos  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 0) {

      cb(res.data)

    }
    else {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    //  getIndex(110100, that)
    }


  })
  ajax.catch(err => {

    console.log(err)
  })
}
//获取首页信息
export function getIndex(that){
  wx.showLoading({
    title: '加载中..',
  })
  var data = {
    
  }
  var ajax = new Ajax({
    data,
    header:{
      Token:User.userId
    },
    path: _interface.getIndex  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      res.data.categories.forEach(item=>{
        item.img_url = getApp().globalData.imgUrl + item.img_url
      })
      res.data.banners.forEach(item => {
        item.img_url = getApp().globalData.imgUrl + item.img_url
      })
      that.setData({
        banner: res.data.banners,
        areas: res.data.areas,
        categories: res.data.categories
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

    console.log(err)
  })
}

export function getAll(that){
 
  wx.showLoading({
    title: '加载中...',
  })
  Promise.all([getBanner(that), getCategory(that), getIndexPoints(that), getCategory2(that) ]).then(res=>{
    wx.hideLoading()

    let [banner, category, points, category2 ] = res;
    if (category.errcode == 0) {
     
      if (category.data.length>=12)
      {
        that.setData({
          categoryList: category.data.slice(0,11)
        })
      }
      else
      {
        that.setData({
          categoryList: category.data
        })
      }
      
    }
    if (category2.errcode==0)
    {
      User.categoryList = category2.data;
     
    }
    if(banner.errcode==0)
    {
      console.log(banner.data)
  
      that.setData({
        banner: banner.data,
      
      })
    }
    if (points.errcode==0)
    {
      that.setData({
        points: points.data.slice(0,2),

      })
    }
    
    console.log(res)
  }).catch(err=>{
    wx.hideLoading()
  })
}

//获取banner 
function getBanner(that) {
  let promise = new Promise((resolve,reject)=>{
    var data = {
     
    }
    var ajax = new Ajax({
      data,
      header: {
        Token: User.userId
      },
      path: _interface.getBanner  // _interface.get_shop_banner //
    })
    ajax.then(res => {
     
     resolve(res)

    })
    ajax.catch(err => {
      reject(err)
      console.log(err)
    })
  })

  return promise;

}
//获取课程分类 
function getCategory(that) {
  let promise = new Promise((resolve, reject) => {
    var data = {
      
    }
    var ajax = new Ajax({
      data,
      header: {
        Token: User.userId
      },
      path: _interface.getCatecory // _interface.getCategory  // _interface.get_shop_banner //
    })
    ajax.then(res => {
     
      resolve(res)

    })
    ajax.catch(err => {
      reject(err)
      console.log(err)
    })
  })

  return promise;

}
function getCategory2(that) {
  let promise = new Promise((resolve, reject) => {
    var data = {

    }
    var ajax = new Ajax({
      data,
      header: {
        Token: User.userId
      },
      path: _interface.getCatecory2 // _interface.getCategory  // _interface.get_shop_banner //
    })
    ajax.then(res => {

      resolve(res)

    })
    ajax.catch(err => {
      reject(err)
      console.log(err)
    })
  })

  return promise;

}
//获取积分商城
function getIndexPoints(that) {
  let promise = new Promise((resolve, reject) => {
    var data = {
      page:1,
      page_size:10
    }
    var ajax = new Ajax({
      data,
      header: {
        Token: User.userId
      },
      path: _interface.getIndexPoints  // _interface.get_shop_banner //
    })
    ajax.then(res => {

      resolve(res)

    })
    ajax.catch(err => {
      reject(err)
      console.log(err)
    })
  })

  return promise;

}
//获取附近教师 
export function getNearTeach(pos, area,that) {
  var data = {
    area: area=='全城'?'':area,
    latitude: pos.latitude,// '39.907257080078125',//pos.latitude,
    longitude: pos.longitude, //'116.47579193115234'//pos.longitude
  }
  var ajax = new Ajax({
    data,
    header: {
      Token: User.userId
    },
    path: _interface.getNearTeacher  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    if(res.errcode==0)
    {
      res.data.forEach(item=>{
        item.distance = parseFloat(item.distance).toFixed(2)
        if(item.label)
        {
          item.label=item.label.replace(','," | ")
        }
        
      })
      that.setData({
        teacherList:res.data
      })
    }
   console.log(res)

  })
  ajax.catch(err => {
    
    console.log(err)
  })

}