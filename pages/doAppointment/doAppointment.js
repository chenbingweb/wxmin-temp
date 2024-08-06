// pages/doAppointment/doAppointment.js
import { getShopAppointmentSet, getShopDetail, doAppointment, getActive, reserverTip } from "./fn.js"
import { User } from "../../model/user.js";
import Tool from "../../libs/Tool.js"
import { debug } from "../../config.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    serverList: [],
    selectFn: () => { },
    jjr: {},
    numCallBack: () => { },
  },

  /**
   * 生命周期函数--监听页面加载
   *    displayrefreshtime refreshtime
   */
  onLoad: function (options) {
    let { sid } = options;
    reserverTip(this);
    this.sid = sid;
    this.receive_notifications = 0
    let currentDate = new Date();
    this.setData({
      selectFn: this.selectFn,
      numCallBack: this.numCallBack
    })
    this.reload = false;
    this.year = Tool.formatTime(new Date(), '-');
    console.log(this.year)
    getShopDetail(sid, this)
    // getActive(this)
    // getShopAppointmentSet(sid, Tool.formatTime(currentDate,'-'), this)
  },
  selectFn(item) {
    this.year = item.year;
    getShopAppointmentSet(this.sid, item.year, this)
  },
  numCallBack({ n: num, id }) {
    let { serverList } = this.data;
    serverList.forEach((item, index) => {
      if (item.id == id) {
        // item.num = num;
        // this.setData({
        //   [`serverList[${index}]`]: item
        // })
        this.data.serverList[index].num = num
      }
    })


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.reload) {
      this.reload = false;
      if (this.year) {
        getShopAppointmentSet(this.sid, this.year, this)
      }
    }
    //getShopDetail(this.sid, this)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.reload = true
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.reload = true
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  showApply() {
    let applymember = this.selectComponent('#applymember')
    applymember.showDialogFn()
  },
  hideDiglog() {
    let applymember = this.selectComponent('#applymember')
    applymember.onClose()
  },
  onDoAppoint({ currentTarget: { dataset: { tid } } }) {
    let { is_enable_member_valid, is_enable_captcha } = this.data.detail

    if (is_enable_member_valid && User.userInfo.isOutletsMember === false) {
      this.showApply()
      return
    }
    let tempId = 'cBYL7P1IhB7JWvDEM0nmmAaj9KWp97wkipy3zbOq5Z4'
    
    debugger
    wx.getSetting({
      withSubscriptions: true,
      success: res => {
        if (res.subscriptionsSetting.mainSwitch) {
          wx.requestSubscribeMessage({
            tmplIds: [tempId],
            success: (res) => {
              console.log(res)
              if (res[tempId]=='accept') {
                console.log(1,'订阅成功')
                // wx.showToast({
                //   title: '订阅成功',
                //   icon:"success"
                // })
                this.receive_notifications=1
              }
              else{
                this.receive_notifications=0
              }

            },
            fail: (err) => {
              console.log(err)
            },
            complete:()=>{
              inner.bind(this)()
            }
          })
        }
        else {
          wx.showModal({
            title: '温馨提示',
            content: '你尚未授权获取消息通知，是否前往设置？',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting({
                  withSubscriptions: true,
                  success: res => {
                    console.log(res)
                    if(res.subscriptionsSetting[tempId]=='accept'){
                      console.log(2,'订阅成功')
                      this.receive_notifications=1
                    }
                    else{
                      this.receive_notifications=0
                    }
                  }
                })
              }
              inner.bind(this)()
            },
           
          })

        }
        console.log(res)
      }
    })
    function inner() {
      console.log("预约ok")
    
      // let imgCheck = this.selectComponent("#imgCheck")
      let puzzleCheck = this.selectComponent('#puzzle')
      wx.showModal({
        title: '提示',
        content: this.tip || '确认预约？',
        // content: `1. 疫情防控期间，对进店人数进行限制，特此启动店铺预约小程序。\n2. 请您配合现场测量体温并正确佩戴口罩，排队时请前后保持1米距离。\t\t\t\n 3. 预约过时失效，如有需要请重新预约。\t\t\t\t\t\t\n同意请继续，否则请取消操作！\t`,
        // content: `1. 预约名额有限，发放完即止。\n 2 现场测量体温不超过37℃，购物全程请佩戴口罩 。\t\t\t\n 3. 预约过时失效，如有需要请重新预约。\t\t\t\t\t\t\n同意请继续，否则请取消操作！\t`,
        success: res => {
          if (res.confirm) {
            // wx.showLoading({
            //   title: '预约中...',
            //   mask:true
            // })
            let num = 1;
            let { serverList } = this.data;
            serverList.forEach((item, index) => {
              if (item.id == tid) {
                num = item.num || 1;
              }
            })
            if (is_enable_captcha) {
              // imgCheck.showPanel(tid,num)
              puzzleCheck.open(tid, num)
            } else {
              doAppointment(tid, num, this, () => { }, '')
            }


          }
        }
      })
    }

  },
  onConfirm({ detail }) {
    wx.showLoading({
      title: '预约中...',
      mask: true
    })
    let imgCheck = this.selectComponent("#imgCheck")
    console.log(detail)
    let { number, tid, num } = detail
    doAppointment(tid, num, this, () => {
      imgCheck.hidePanel()
    }, number)

  },
  onCheck({ detail }) {
    wx.showLoading({
      title: '预约中...',
      mask: true
    })
    let puzzleCheck = this.selectComponent('#puzzle')
    let { code, tid, num } = detail
    doAppointment(tid, num, this, () => {
      puzzleCheck.successFn()
    }, code)
  }
})