// components/swiper-base/swiper-base.js
/*
  组件： <swiper-base/>或者<swiper-base><swiper-base/>
  属性：
    imgsData：图片地址信息（建议使用格式：[{img:'',id:''}]）必传
    width:组件宽度，
    height:组件高度
    baseSet:面板基本功能设置
      {
         indicatorDots: true,//是否显示面板指示点
          indicatorColor: 'rgba(0, 0, 0, .3)',//指示点颜色
          indicatorActiveColor: '#000000',//当前选中的指示点颜色
          autoplay: true,//是否自动切换
          interval: 5000,//自动切换时间间隔
          duration: 1000,//滑动动画时长
          circular: true,//是否采用衔接滑动
          vertical: false//滑动方向是否为纵向
      }
    
    mode:见mode使用说明
  事件：
    change：改变触发事件
    navToDetail：触摸事件，（跳转详细页面）
*/
/*******************************mode使用说明********************************************* */
/**
 * 
  原生image 组件 mode 选择 默认为 scaleToFill

  缩放	scaleToFill	不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
  缩放	aspectFit	保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
  缩放	aspectFill	保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
  缩放	widthFix	宽度不变，高度自动变化，保持原图宽高比不变
  裁剪	top	不缩放图片，只显示图片的顶部区域
  裁剪	bottom	不缩放图片，只显示图片的底部区域
  裁剪	center	不缩放图片，只显示图片的中间区域
  裁剪	left	不缩放图片，只显示图片的左边区域
  裁剪	right	不缩放图片，只显示图片的右边区域
  裁剪	top left	不缩放图片，只显示图片的左上边区域
  裁剪	top right	不缩放图片，只显示图片的右上边区域
  裁剪	bottom left	不缩放图片，只显示图片的左下边区域
  裁剪	bottom right	不缩放图片，只显示图片的右下边区域
 */
import { User } from "../../model/user.js"
Component({
  // 外部样式
  externalClasses: [],
  /**
   * 组件的属性列表
   */
  properties: {
    boxWidth:{
      type:Number,
      value:750
    },
    customIndicatorDots:{
      type:Boolean,
      value:true
    },
    width: {//组件宽度
      type: Number,
      value:750,//默认值
      observer: function (newVal, oldVal) {//属性值发生变化
        this.setData({
          width: newVal
        })
      }
    },
    height: {//组件高度
      type: Number,
      value: 500,
      observer: function (newVal, oldVal) {
        this.setData({
          height: newVal
        })
      }
    },
    imgsData: {//组件宽度
      type: Array,
      value: [],//默认值
      observer: function (newVal, oldVal) {//属性值发生变化
        if(Array.isArray(newVal)&&newVal.length==0)
        {
          return
        }
        this.setData({
          imgsData: newVal,
          show:true
        })

      }
    },
    mode:{
      type:String,
      value:'aspectFill',
      observer: function (newVal, oldVal){
        this.setData({
          mode: newVal
          })
      }
    },
    baseSet:{//swiper组件设置
      type: Object,
      value: {
        indicatorDots: true,//是否显示面板指示点
        indicatorColor: 'rgba(0, 0, 0, .3)',//指示点颜色
        indicatorActiveColor: '#000000',//当前选中的指示点颜色
        autoplay: true,//是否自动切换
        interval: 5000,//自动切换时间间隔
        duration: 1000,//滑动动画时长
        circular: true,//是否采用衔接滑动
        vertical: false,//滑动方向是否为纵向
        hiddDefinedDots:false
      },
      observer: function (newVal, oldVal) {
        let baseSet={};
        for(let key in newVal){
          baseSet[key]=newVal[key]
        }

        baseSet = Object.assign(oldVal, baseSet )

        this.setData(baseSet)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    imgsData: [],
    indicatorDots: true,//是否显示面板指示点
    indicatorColor: 'rgba(0, 0, 0, .3)',//指示点颜色
    indicatorActiveColor: '#000000',//当前选中的指示点颜色
    autoplay: true,//是否自动切换
    interval: 5000,//自动切换时间间隔
    duration: 1000,//滑动动画时长
    circular: true,//是否采用衔接滑动
    vertical: false,//滑动方向是否为纵向
    mode:"aspectFit",
    imgUrl: getApp().globalData.imgUrl,
    current:0
  },
  created:function(){
   
    console.log(this)
  },
  ready:function(){
    //显示轮播图
    if (Array.isArray(this.data.imgsData) && this.data.imgsData.length) {
      this.setData({show: true })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**切换swiper组件
     *  bubbles	Boolean	否	false	事件是否冒泡
          composed	Boolean	否	false	事件是否可以穿越组件边界，为false时，事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
          capturePhase	Boolean	否	false	事件是否拥有捕获阶段
     * 
     */
    swiperChange: function (e) {
      var myEventDetail = e // detail对象，提供给事件监听函数
      this.setData({
        current: e.detail.current
      })
      var myEventOption = {
        bubbles:false,
        composed:false,
        capturePhase:false
      } // 触发事件的选项
      this.triggerEvent('changeEvent', myEventDetail, myEventOption)
    },
    // 跳转
    navToDetail: function ({ currentTarget: { dataset: { sid, target,bid}}}){

      if (target == 'shop' && sid)
      {
        if (User.isSign == false) {
          wx.showModal({
            title: '提示',
            content: '您尚未注册，是否前往注册？',
            success: res => {
              if (res.confirm) {
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
      else if(target=='details')
      {
        wx.navigateTo({
          url: '../bannerDetail/bannerDetail?bid='+bid,
        })
      }

      return
      var myEventDetail = currentTarget // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      this.triggerEvent('toDetail', myEventDetail, myEventOption)
    },
    //登录
    login: function ({ currentTarget }){
      var myEventDetail = currentTarget // detail对象，提供给事件监听函数
      var myEventOption = {
        bubbles: false,
        composed: false,
        capturePhase: false
      } // 触发事件的选项
      this.triggerEvent('toDlogin', myEventDetail, myEventOption)
    },
    // 动画结束
    animationfinish({ detail}){
      this.setData({
        current: detail.current
      })
      // console.log(detail.current)
    }
  }
})
