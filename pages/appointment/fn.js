let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import Upload from "../../libs/Upload.js";
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";
var WxParse = require('../../wxParse/wxParse.js');
//获取店铺详情
export function cancelAppoints(bid, that) {
  wx.showLoading({
    title: '取消中...',
    mask: true
  })
  var data = {
    id: bid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.cancelAppoints  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      let { list } = that.data;
      list.forEach(item=>{
        if (item.id == bid)
        {
          item.status ='canceled'
        }
      })
      that.setData({
        list
      })
      wx.showToast({
        title: '取消成功',
        mask:true
      })
    }
    else {
      wx.showToast({
        title: res.msg||'网络繁忙,请稍后再试',
        icon: 'none'
      })
    }


  })
  ajax.catch(err => {
    wx.showToast({
      title:'网络繁忙,请稍后再试',
      icon: 'none'
    })
    console.log(err)
  })
}