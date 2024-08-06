// components/puzzleVerify/puzzleVerify.js
import Ajax from "../../libs/Ajax"
import { User } from "../../model/user"

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
          // this.setData({
          //   _imgUrl:n
          // })
          
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
    stayX:0,
    currentX:0,
    width:0,
    lastX:0,
    addAni:false,
    per:0,
    _imgUrl:"",
    _imgUrl_:"",
    show:false,
    controlWidth:660,
    tid:'',
    num:1,
    list:[]
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
        addAni:false,
        list:[this.moveStart]
      })
    },
    onMove(e){
      let {list} =this.data
      let detail =   e.changedTouches[0].clientX-this.moveStart
      // console.log(this.rpx2px(680))
     if(detail+this.data.lastX>0 && detail+this.data.lastX< this.rpx2px(this.data.controlWidth-100)){
       let val = detail+this.data.lastX
       list.push(e.changedTouches[0].clientX)
      this.setData({
        list,
        currentX:val,
        per:val/this.rpx2px(this.data.controlWidth-90)
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
      wx.getImageInfo({
        src:this.data._imgUrl_,
        success:res=>{
          console.log(res)
          let {list} =this.data;
          console.log(list[list.length-1]-list[0])
          let w = this.rpx2px(700)
          let width=res.width;
         let rew =(this.data.currentX+this.data.stayX)/(w/width)  
        //  console.log(list )
         console.log(rew,'rew')
         console.log((list[list.length-1]-list[0]+this.data.stayX)/(w/width) ,'323' )
         let {tid,num} = this.data
        //  this.triggerEvent('status',{code:parseInt(rew),tid,num})
        this.triggerEvent('status',{code:[...list,w/width],tid,num})
        //  if(this.success){
        //   wx.showToast({
        //     title: '验证成功',
        //     mask:true
        //   })
        //   this.triggerEvent('status',{status:true})
        //     setTimeout(()=>{
        //       this.close()
        //     },2000)
        // }
        // else{
        //   this.moveStart = 0
        //   this.setData({
        //     addAni:true,
        //     currentX:0,
        //     per:0
  
        //   })
        //   this.triggerEvent('status',{status:false})
        // }
        }
      })
      return
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
    successFn(){
      this.close()
    },
    fail(){
      this.moveStart = 0
      this.setData({
        addAni:true,
        currentX:0,
        per:0

      })
    },
    open(tid,num){
      this.setData({
        tid,num
      })
      this.getImg()
    
    },
    // 关闭
    close(){
      this.setData({
        show:false,
        currentX:0,
        per:0
      })
    },
    // 刷新图片
    onRefresh(){
      // this.triggerEvent("freshImg")
      this.getImg()
    },
    getImg(){
      // console.log(User.userId)
      this.setData({
        imgPath:'',
        val:"",
        list:[]
      })
      // var imgPath = wx.env.USER_DATA_PATH+'/image.jpeg';
//   responseType:'arraybuffer',
      var ajax = new Ajax({
        responseType:'arraybuffer',
        reqtype:"GET",
        header: {
          Authorization: User.userId,
          'COOKIE': ''
        },
        path: '/user/slider'  // _interface.get_shop_banner //
      })
      ajax.then(buffer=>{
        // console.log(buffer)
        // var imgPath = wx.env.USER_DATA_PATH+'/image'+ '.png?time='+(new Date().getTime());
      
        // this.setData({
        //   _imgUrl:'data:image/png;base64,'+ wx.arrayBufferToBase64(buffer),
        //   show:true
        // })
        // this.toPng(res.data)
        // // this.toPng('data:image/png;base64,'+ wx.arrayBufferToBase64(res))
        
        // var imgPath = wx.env.USER_DATA_PATH+'/image.jpeg';
        var imgPath = wx.env.USER_DATA_PATH+'/image'+ '.jpeg?time='+(new Date().getTime());
        var fs = wx.getFileSystemManager();
        fs.writeFile({
          filePath:imgPath,
          data:buffer,
          encoding:"binary",
          success:res=>{
            console.log(res)
            // wx.arrayBufferToBase64(res)
            this.setData({
              _imgUrl_:imgPath,
              show:true
            })
            let base64 =  wx.getFileSystemManager().readFileSync(imgPath, "base64")
            this.setData({
              _imgUrl:"data:image/png;base64,"+base64,
              show:true
            })
           
            // this.toPng(imgPath)
          },
          fail:err=>{
            console.log(err)
          }
        })
        // this.codeId()
        // fs.writeFileSync(imgPath,  buffer, "binary");
       
  
     
      })
    },
    codeId(){
      var ajax = new Ajax({
      
        reqtype:"GET",
        header: {
          
          Authorization: User.userId
        },
        path: '/user/captchas'  // _interface.get_shop_banner //
      })
      ajax.then(res=>{
        console.log(res)
      })
    }
  }
})
