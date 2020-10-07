let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import Upload from "../../libs/Upload.js";
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";
var WxParse = require('../../wxParse/wxParse.js');
//获取店铺详情
export function reserverRule(that) {
  wx.showLoading({
    title: '加载中...',
    mask:true
  })
  var data = {
    
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.reserverRule  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
  
      WxParse.wxParse('article', 'html', res.data, that, 5);
    }
    else {
      wx.showToast({
        title: res.msg||'网络异常，请稍后再试',
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {
    wx.showToast({
      title: '网络异常，请稍后再试',
      icon: 'none'
    })
    console.log(err)
  })
}