let _interface = require('../../utils/interface.js')
import Ajax from "../../libs/Ajax.js";
import Tool from "../../libs/Tool.js";
import Upload from "../../libs/Upload.js";
import { User } from "../../model/user.js";
import { Location } from "../../model/map.js";
var WxParse = require('../../wxParse/wxParse.js');
//获取店铺详情
export function getbannerDetail(bid, that) {
  wx.showLoading({
    title: '加载中...',
    mask:true
  })
  var data = {
    id: bid
  }
  var ajax = new Ajax({
    data,
    header: {
      Authorization: User.userId
    },
    path: _interface.getbannerDetail  // _interface.get_shop_banner //
  })
  ajax.then(res => {
    wx.hideLoading()
    if (res.errcode == 200) {
      that.setData({
        detail:res.data
      })
      WxParse.wxParse('article', 'html', res.data.details, that, 5);
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