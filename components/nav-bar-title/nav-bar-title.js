// components/nav-bar-title/nav-bar-title.js
import { User } from "../../model/user.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    city:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height:0,
    top:0,
    city:'',
    show:false,
    cityList: [{
      name: "北京",
      code: '2',
      city: [{
        name: '北京市',
        code: 3
      }]
    },
    {
      name: "四川",
      code: '5',
      city: [{
        name: '成都',
        code: 1
      }, {
        name: '德阳',
        code: 7
      },
      {
        name: '绵阳',
        code: 9
      }]
    }
    ]
  },
  created(){
    User.getList(res=>{
      this.setData({
        cityList:res
      })
    })
    
   
  },
  ready(){
    let { height, top } = wx.getMenuButtonBoundingClientRect();
    getApp().globalData.t=top;
    getApp().globalData.h = height;
    console.log(height, top)
    this.setData({
      height:top+height+10,
      height_1:height,
      top
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    
    oncitySelect({ detail: { selectCity: { name, code}} }) {
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      this.setData({
        city:name
      })
      this.triggerEvent('selectok', {code}, myEventOption)
    },
    onSHow(){
      let { show } = this.data;
      this.setData({
        show:!show
      })
    }
  }
})
