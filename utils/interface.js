/*
  请求接口地址，以字面量来填写 /user/get-verify-code
*/
let online = {
  //登录
  login:'/user/login',
  //注册
  register: '/user/register',//ok login/register
  //获取手机验证码
  getCode: '/login/code',//ok
  //获取首页信息
  getIndex:'/site/home-data',
  //店铺列表
  getShopList:'/shop/list',
  //获取店铺预约设置
  getShopAppointmentSet: '/shop/reserve-setting',
  //获取店铺详情
  getShopDetail:"/shop/detail",
  //获取预约详情
  getAppointment:'/user/reserve-detail',
  //预约
  doAppointment:'/user/reserve',
  //我的预约列表
  myAppointment:'/user/reserves',
  //预约详情
  appointmentDetail:'/user/reserve-detail',
  //banner详情
  getbannerDetail:'/banner/detail',
  //取消预约
  cancelAppoints:'/user/cancel-reserve',
  //获取二维码
  getCode:'/user/reserve-code',
  //获取活动日期
  getActive:'/shop/activities',
  //扫码结果
  codeResult:'/user/reserve-code-status',//'/user/reserve-status'
  //预约规则
  reserverRule:"/shop/reserve-rule",
  //预约提示
  reserverTip:'/shop/reserve-notice'















  


  



}
// 测试
let test = {
  //分类
  getCategory: "/getCategory",//ok
  //banner
  getBanner:'/getBanner',
  

}

module.exports = online
//  module.exports = test