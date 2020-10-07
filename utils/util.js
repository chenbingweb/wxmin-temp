//引入配置文件
let config = require('../config.js')
//测试假数据引入
let datas = require('./data.js');
//引入省市区列表
let addresslist = require('./addressList.js');
//引入按照字母排序的城市列表
let cityList=require('./cityList.js');
/*
  说明：把时间戳转换成可读的时间
  date:[obj]//日期对象，比如new Date('时间戳')
  str：连接符号，‘-’
  showTime:是否显示时间，如果真，则显示为 ‘XXXX-XX-XX XX:XX’ 否则为‘XXXX-XX-XX’
*/
function formatTime(date, str, showTime) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  //转换成yyyy-m-d
  var format = [year, month, day].map(formatNumber).join(str);
  if (showTime) {
    //转换成yyyy-m-d h:m
    format = [year, month, day].map(formatNumber).join(str) + ' ' + [hour, minute].map(formatNumber).join(':');
  }
  return format
}
//时间补位
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//随机生产字符串
function RandomString() {
  var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var n = 5, s = "";
  for (var i = 0; i < n; i++) {
    var rand = Math.floor(Math.random() * str.length);
    s += str.charAt(rand);
  }
  return s
}
//AJAX请求
/*
  data:请求参数
  succ:返回成功函数
  fail:返回失败函数
  reqtype:请求方式
  contentType：请求内容的类型
*/
function Ajax(data, succ, fail, path, reqtype, contentType) {
  //传输加密（如果不需要，就可以删除掉）
  data.signature = escape('EB6EB8B669BA4846')
  console.log(data)
  console.log(config.url + path+'mm')
  const requestTask = wx.request({
    url: config.url + path,//请求地址+接口
    data: data,
    method: reqtype || 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      "Content-Type": contentType == undefined ? "application/x-www-form-urlencoded" :"application/json"
        },
    dataType:'JSON',
    success: function (res) {
      console.log(res)
      if (res.statusCode == 200) {
        
        var res = res.data;
        if (typeof res == "string" && res!='')
        {
          res=JSON.parse(res.trim())
        }
        succ(res);
      }
      else
      {
        //测试
        if (config.debug) {
          succ(datas);
        }
        fail()
      }
      // 取消请求任务
      if (requestTask) {
        requestTask.abort()
      }
    },
    fail: function (res) {
      console.log(res)
      //wx.hideLoading()
      fail(res);
      //测试
      if (config.debug)
      {
        succ(datas);
      }
    },
    //无论是否请求成功，都会执行此回调
    complete: function (res) {
      console.log(res)
    }
  });

}
//上传图片
function uploadFileImage(tempFilePaths,path,cb,fail) {
  wx.uploadFile({
   url: config.url + path, 
    filePath: tempFilePaths,
    name: 'file',
    header: { 'content-Type': 'multipart/form-data' },
    success:cb,
    fail: fail
  })
}


//个人信息授权函数
function power(app, cb) {
  wx.openSetting({
    success: (res) => {
      console.log(res.authSetting)
      var authSetting = res.authSetting['scope.userInfo']
      if (authSetting) {
        app.getUserInfo(null, cb, '')
      }
      /*
       * res.authSetting = {
       *   "scope.userInfo": true,
       *   "scope.userLocation": true
       * }
       */
    }
  })
}

//判断组件是否兼容（1.2.1开始）
function checkComponent(str) {//'picker.mode.region'
  return wx.canIUse(str)
}
//获取省份列表
function getProvince() {
  var prolist = [];
  for (var i = 0; i < addresslist.length; i++) {
    prolist.push(addresslist[i].name)
  }
  return prolist
}
//获取市列表
function getCity(proStr) {
  var citylist = [];
  for (var i = 0; i < addresslist.length; i++) {
    if (addresslist[i].name === proStr) {
      for (var k = 0; k < addresslist[i].city.length; k++) {
        citylist.push(addresslist[i].city[k].name);
      }
      break;
    }

  }
  return citylist
}
//获取区县
function getCountry(proStr, cityStr) {
  var countrylist = [];
  for (var i = 0; i < addresslist.length; i++) {
    if (addresslist[i].name === proStr) {
      for (var k = 0; k < addresslist[i].city.length; k++) {
        if (addresslist[i].city[k].name == cityStr) {
          countrylist = countrylist.concat(addresslist[i].city[k].area)
          return countrylist
        }
      }
    }
  }
}
//处理富文本相关样式
/*
  reg：正则
  string:替换的标签名
  replaceString:标签名
*/
function richTextImg(reg, strings, replaceString) {
  var arr = null;
  while (arr = reg.exec(strings) != null) {
    strings = strings.replace(reg, replaceString);
  }
  return strings
}
//限制上传图片大小
function imageSize(imageArray){
  var isOK=false;
  if (imageArray instanceof Array&& imageArray.length)
  {
    isOK= imageArray.every(function(item){
      return item.size <= config.imageSize
    })
  }
  return isOK
}
//修改当前页的自定义导航条状态
/*
  nid:导航id
  nlist:[array],导航列表,
  app:通过getApp()方法获取，getApp就是获取app.js文件中的属性和方法
*/
function upDateNav(nid,nlist,app){
  for (let i = 0; i < nlist.length;i++){
    if(nid==nlist[i].nid){
      nlist[i].selected=true;
    }
    else
    {
      nlist[i].selected = false;
    }
  }
  app.globalData.navBar=nlist;
}
//获取全国市级城市（以字符a-z排列）
function getCityList(){
  if (!cityList.length && Array.isArray(cityList))
  {
    return
  }
  let cityArr=[];
  for (let i = 0; i < cityList.length;i++){
    for (let k = 0; k < cityList[i].cities.length;k++){
      cityArr.push(cityList[i].cities[k].name)
    }
  }
  return cityArr
}
//获取地理坐标
/*
  cb成功获取经纬度信息回调
  fail获取失败后回调
*/
function getLocal(cb,fail) {
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      cb({
        latitude,
        longitude
      })
    },
    fail:fail
  })
}
/*
  说明：新版授权
  scope.userInfo --- wx.getUserInfo ---	用户信息
  scope.userLocation --- wx.getLocation, wx.chooseLocation --- 地理位置
  scope.address --- wx.chooseAddress --- 通讯地址
  scope.invoiceTitle --- wx.chooseInvoiceTitle --- 发票抬头
  scope.werun --- wx.getWeRunData --- 微信运动步数
  scope.record --- wx.startRecord --- 录音功能
  scope.writePhotosAlbum --- wx.saveImageToPhotosAlbum, wx.saveVideoToPhotosAlbum --- 保存到相册
  scope.camera --- 摄像头

*/
function getUserPowerNew(auth, one, cb, fail) {
  //获取用户的当前设置。
  wx.getSetting({
    success(res) {
      //判断当前用户设置是否为真
      if (!res.authSetting[auth]) {//不为真
        //提前向用户发起授权请求
        wx.authorize({
          scope: auth,
          success: (r) => {//用户勾选了直接执行回调
            cb()
          },
          fail: () => {
            //调起客户端小程序设置界面，返回用户设置的操作结果。
            if (one) {
              fail()
            }
          }
        })
      }
      else//如果为真，则执行
      {
        cb()
      }
    }
  })
}
//
module.exports = {
  RandomString: RandomString,
  Ajax: Ajax,
  getUserPowerNew: getUserPowerNew,
  formatTime: formatTime,
  checkComponent: checkComponent,
  getProvince: getProvince,
  getCity: getCity,
  getCountry: getCountry,
  richTextImg: richTextImg,
  uploadFileImage: uploadFileImage,
  imageSize: imageSize,
  upDateNav: upDateNav,
  getCityList: getCityList,
  getLocal: getLocal
}
