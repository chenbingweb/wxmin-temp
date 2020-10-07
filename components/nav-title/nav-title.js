// components/nav-title/nav-title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:'首页'
    },
    color:{
      type:String,
      value:"#fff"
    },
    fontColor:{
      type:String,
      value:'#000'
    },
    arrowColor:{
      type:Boolean,
      value:false
    },
    addressFn:{
      type:Function,
      value:e=>{}
    },
    address:{
      type:Boolean,
      value:false
    },
    area:{
      type:String,
      value: '全城'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBack:false,
    
  },
  ready(){
    if (!getApp().globalData.t) {
      let { height, top } = wx.getMenuButtonBoundingClientRect();
      this.h = height;
      this.t = top;
    }
    else {
      this.h = getApp().globalData.h;
      this.t = getApp().globalData.t;
    }
    this.setData({
      paddingTop: this.t + this.h + 10,
      height: this.t + this.h,
      lineHeight: this.h,
      showBack:getCurrentPages().length>1?true:false
    })

  
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onBack(){
      wx.navigateBack({
      
      })
    },
    onChange(){
      this.properties.addressFn()
    }
  }
})
