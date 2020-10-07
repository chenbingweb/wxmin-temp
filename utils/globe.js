//获取手机信息
function getPhoneInfor() {
  var sysInfo = null;
  wx.getSystemInfo({
    success: function (res) {
      sysInfo = res;
    }
  })
  return sysInfo
}
//请求Ajax地址
let url={

}
//导出
module.exports = {
  sysInfo: getPhoneInfor(),
  url: url
}