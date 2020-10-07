// components/shop-item/shop-item.js
import { User } from "../../model/user.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:{
      type:Object,
      value:{},
      observer:function(n){
        if(Object.keys(n).length)
        {
          this.setData({
            item:n
          },()=>{
            setTimeout(()=>{
              this.setData({
                an: n.ani
              })
            },0)
           
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    an:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDoAppoint({ currentTarget: { dataset: { sid, status}}}){
      if(status)
      {
        return
      }
      if(User.isSign==false)
      {
        wx.showModal({
          title: '提示',
          content: '您尚未注册，是否前往注册？',
          success:res=>{
            if(res.confirm)
            {
              wx.navigateTo({
                url: '../login/login',
              })
            }
          }
        })
        return
      }
      wx.navigateTo({
        url: "../doAppointment/doAppointment?sid=" + sid,
      })
    }
  }
})
