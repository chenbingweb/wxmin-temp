import { UIEvent } from "./UIEvent.js"


let PageEvents = {
  //顶层窗体发生改变时
  OnTopWndChanged: new UIEvent()
}

let CurrVisiblePage = null

//页包装
export default class PageWrap {
  //1常规 2主页 3覆盖
  constructor(url, jumpMode = 1) {
    this.url = url
    this.jumpMode = jumpMode
    this.timmer = null;
  }
  set SetCurrPage(cp) {
    this.cp = cp
  }
  get GetCurrPage() {
    return this.cp
  }
  set TemporaryJumpMode(v) {
    this._TemporaryJumpMode = v
  }

  Show(param = null, jump = null) {
    if (CurrVisiblePage === this && this.url === '/pages/fightOver/fightOverPage') {
      return;
    }
    CurrVisiblePage = this
    PageEvents.OnTopWndChanged.Emit(this)

    var url = this.url


    if (param) {
      var pstr = ""
      for (var n in param) {
        var v = (param[n] + "").replace('=', '%3D');
        console.log(v)


        var kv = n + "=" + v
        if (pstr == "")
          pstr = kv
        else
          pstr += "&" + kv
      }

      url += "?" + pstr
      if (jump) {
        url += '&' + jump
      }

      console.log("PageShow#1 ", url)
    } else {
      if (jump) {
        url += '?' + jump
      }
      console.log("PageShow#2 ", url)
    }

    console.log("PageShow ", url)
    var mode = this._TemporaryJumpMode ? this._TemporaryJumpMode : this.jumpMode
    this._TemporaryJumpMode = null

    //将窗体显示出来
    switch (mode) {
      case 2:
        {
          wx.reLaunch({ url: url })
        }
        break
      case 1:
        {
          wx.navigateTo({ url: url })
        }
        break
      case 3:
        {
          wx.redirectTo({ url: url })
        }
        break
    }
  }
  back(delta = 1) {
    wx.navigateBack({
      delta: delta
    })
  }

  //倒计时
  CountDown(time = 10) {
    let second = time * 60;
    this.timmer = setInterval(() => {
      if (second <= 0) {
        clearInterval(this.timmer)
        if (this.cp) {
          this.back()
        }
      }
      if (this.cp) {
        this.cp.setData({
          ['data.countdown']: this.toTime(second)
        })
      }
      second--

    }, 1000)
  }
  //停止倒计时
  stopCountDown() {
    clearInterval(this.timmer)
  }
  //秒转分
  toTime(s) {
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;
    //将变量转换为字符串
    h += '';
    s += '';
    //如果只有一位数，前面增加一个0
    h = (h.length == 1) ? '0' + h : h;
    s = (s.length == 1) ? '0' + s : s;
    return h + ':' + s;
  }
  /*
      static Back(delta=1)
      {
        wx.navigateBack({ delta: delta  })
      }
  */
  IsVisible() { return CurrVisiblePage == this }
}


export { PageEvents };