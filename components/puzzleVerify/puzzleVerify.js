// components/puzzleVerify/puzzleVerify.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 检测阀值,值越大越容易检测
    threshold:{
      type:Number,
      value:1.5
    },
    imgUrl:{
      type:String,
      value:'',
      observer:function(n){
        if(n){
          this.setData({
            _imgUrl:n
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    left:0,
    top:0,
    stayX:20,
    currentX:0,
    width:0,
    lastX:0,
    addAni:false,
    per:0,
    _imgUrl:"",
    show:false
  },
  lifetimes:{
    created(){
      this.moveStart = 0
      this.success=false
    },
    ready(){
      var pixelRatio1 = 750 / wx.getSystemInfoSync().windowWidth;
      var width = 700 / pixelRatio1;
      this.setData({
        left:200,
        top:30,
        width
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    rpx2px(width){
      var pixelRatio1 = 750 / wx.getSystemInfoSync().windowWidth;
      return width / pixelRatio1;
    },
    onStart(e){
      // console.log(e.changedTouches[0].clientX)
      this.moveStart  = e.changedTouches[0].clientX
      this.setData({
        addAni:false
      })
    },
    onMove(e){
      let detail =   e.changedTouches[0].clientX-this.moveStart
      // console.log(this.rpx2px(680))
     if(detail+this.data.lastX>0 && detail+this.data.lastX< this.rpx2px(620-90)){
       let val = detail+this.data.lastX
      
      this.setData({
        currentX:val,
        per:val/this.rpx2px(620-90)
      },()=>{
        // 
        let point = val+this.data.stayX
        let start = this.data.left-this.properties.threshold 
        let end = this.data.left+this.properties.threshold
        // console.log(start,end,point)
        if( point>start && point<end ){
          
          this.success=true
        }
        else{
          this.success=false
        }
        
      })
      
      
     }
       
      
     
    },
    onEnd(){
      if(this.success){
        wx.showToast({
          title: '验证成功',
          mask:true
        })
        this.triggerEvent('status',{status:true})
          setTimeout(()=>{
            this.close()
          },2000)
      }
      else{
        this.moveStart = 0
        this.setData({
          addAni:true,
          currentX:0,
          per:0

        })
        this.triggerEvent('status',{status:false})
      }
      
    },
    open(){
      this.setData({
        show:true
      })
    },
    // 关闭
    close(){
      this.setData({
        show:false
      })
    },
    // 刷新图片
    onRefresh(){
      this.triggerEvent("freshImg")
    }
  }
})
