// components/img-check/img-check.js
import Ajax from "../../libs/Ajax"
import { User } from "../../model/user"
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    tid:'',
    num:1,
    imgPath:"",
    val:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPanel(tid,num){
        this.setData({
          show:true,tid,num
        })
        this.getImg()
      
    },
    getImg(){
      console.log(User.userId)
      this.setData({
        imgPath:'',
        val:""
      })
      var ajax = new Ajax({
        responseType:'arraybuffer',
        reqtype:"GET",
        header: {
          Authorization: User.userId
        },
        path: '/user/captcha'  // _interface.get_shop_banner //
      })
      ajax.then(base64=>{
        console.log(base64)
        console.log( new Uint8Array(base64))
        var imgPath = wx.env.USER_DATA_PATH+'/code'+ '.png?time='+(new Date().getTime());
        let b = new Uint8Array(base64)
      //   let c = new Uint8Array([123])
      //  console.log(c.toString()) 
      //   b.set(c,b.length-1)
        // console.log(b.slice(b.length-1))
        // console.log(b.slice(0,b.length-1).buffer)
        // console.log(b.slice(0,b.length).buffer)
        var fs = wx.getFileSystemManager();
       
         fs.writeFileSync(imgPath,  b.slice(0,b.length-1).buffer, "binary");
        this.setData({
          imgPath
        })
        
      })
    },
    hidePanel(){
      this.setData({
        show:false
      })
    },
    onRefresh(){
      this.getImg()
    },
    onConfirm({detail:{value}}){
      value.number = value.number.trim()
      console.log( value.number,' value.number')
      if(value.number==''){
        wx.showToast({
          title: '请输入验证码',
          icon:"none"
        })
        return 
      }
      let {tid,num} = this.data
      this.triggerEvent('comfirm',{...value,tid,num})
    }
  }
})
