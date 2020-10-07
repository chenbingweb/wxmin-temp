export default class Check{
  //手机号码原则
  static checkPhoneNum(num){
    let reg =/^1\d{10}$/g;
    if(!reg.test(num))
    {
      wx.showToast({
        title: '手机号码不正确',
        icon:'none'
      })
      return false
    }
    return true
  }
  static checkEmail(email){
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
          wx.showToast({
        title: '邮箱地址不正确',
        icon: 'none'
      })
      return false;
    } else {
      return true;
    }

    // let reg =/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/g
    // if (!reg.test(email)) {
    //   wx.showToast({
    //     title: '邮箱地址不正确',
    //     icon: 'none'
    //   })
    //   return false
    // }
    // return true
  }
}